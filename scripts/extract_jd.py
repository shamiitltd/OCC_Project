import re, html as htmlmod, json, sqlite3, os, binascii

DB_PATH = r'e:\Offcampuscareer\db\offcampuscareer.db'
JOBS_DIR = r'e:\Offcampuscareer\scripts\job_pages'
BASE_URL = 'https://www.iitjobs.com'

def clean_html(text):
    if not text:
        return ''
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.I)
    text = re.sub(r'<li[^>]*>', '\n- ', text, flags=re.I)
    text = re.sub(r'<p[^>]*>', '\n', text, flags=re.I)
    text = re.sub(r'<h[1-6][^>]*>', '\n### ', text, flags=re.I)
    text = re.sub(r'</h[1-6]>', '\n', text, flags=re.I)
    text = re.sub(r'<[^>]+>', '', text)
    text = htmlmod.unescape(text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def gen_id():
    return 'JOB' + binascii.hexlify(os.urandom(6)).decode().upper()

def parse_job_page(page, base_job):
    job = dict(base_job)
    
    # Extract Schema.org JobPosting JSON from __next_f push blocks
    # This contains the full job description
    schema_m = re.search(
        r'"@type"\s*:\\?"JobPosting\\?"\s*,\s*"title"\s*:\\?"([^"\\]+)\\?".*?"description"\s*:\\?"((?:[^"\\]|\\.)*)\\?"',
        page, re.S
    )
    
    if not schema_m:
        # Try JSON-LD script tag
        jld_m = re.search(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', page, re.S | re.I)
        if jld_m:
            try:
                jld = json.loads(jld_m.group(1))
                if isinstance(jld, dict) and jld.get('@type') == 'JobPosting':
                    title = jld.get('title', job.get('title', ''))
                    desc_html = jld.get('description', '')
                    if title:
                        job['title'] = title
                    if desc_html:
                        job['full_description'] = clean_html(desc_html)
                    
                    # Extract salary from schema
                    sal = jld.get('baseSalary', {})
                    if sal:
                        val = sal.get('value', {})
                        if isinstance(val, dict):
                            mn = val.get('minValue', '')
                            mx = val.get('maxValue', '')
                            unit = val.get('unitText', '')
                            if mn or mx:
                                job['salary'] = f'INR {mn} - {mx} {unit}'.strip()
                    
                    # Location
                    loc = jld.get('jobLocation', {})
                    if isinstance(loc, dict):
                        addr = loc.get('address', {})
                        if isinstance(addr, dict):
                            city = addr.get('addressLocality', '')
                            state = addr.get('addressRegion', '')
                            country = addr.get('addressCountry', '')
                            if city:
                                job['location'] = f'{city}, {state}, {country}'.strip(', ')
                    
                    # Experience
                    exp = jld.get('experienceRequirements', '')
                    if exp:
                        job['experience'] = str(exp)
                    
                    # Employment type
                    emp_type = jld.get('employmentType', '')
                    if emp_type:
                        type_map = {
                            'FULL_TIME': 'Job',
                            'PART_TIME': 'Part Time',
                            'CONTRACTOR': 'Contract',
                            'INTERN': 'Internship',
                            'TEMPORARY': 'Contract',
                        }
                        job['type'] = type_map.get(emp_type, 'Job')
                    
                    return job
            except Exception as e:
                pass
    
    # Try extracting from __next_f push serialized data
    # Find the large JSON blob with job info
    large_blobs = re.findall(r'self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)', page)
    
    combined = ''
    for blob in large_blobs:
        try:
            decoded = blob.encode('utf-8').decode('unicode_escape')
            combined += decoded + '\n'
        except:
            combined += blob + '\n'
    
    # Now try to extract from combined
    # Look for JobPosting schema
    jld2_m = re.search(r'"@type"\s*:\s*"JobPosting"\s*,\s*"title"\s*:\s*"([^"]+)"\s*,.*?"description"\s*:\s*"([^"]{100,})"', combined, re.S)
    if jld2_m:
        title = jld2_m.group(1)
        desc_encoded = jld2_m.group(2)
        # Decode HTML entities and clean
        job['title'] = title
        job['full_description'] = clean_html(htmlmod.unescape(desc_encoded))
    
    # Extract salary from embedded JSON
    sal_m = re.search(r'"min_salary_offered"\s*:\s*(\d+(?:\.\d+)?)', combined)
    sal_max_m = re.search(r'"max_salary_offered"\s*:\s*(\d+(?:\.\d+)?)', combined)
    if sal_m or sal_max_m:
        mn = sal_m.group(1) if sal_m else ''
        mx = sal_max_m.group(1) if sal_max_m else ''
        if mn and mx and mn != 'null' and mx != 'null':
            job['salary'] = f'INR {mn} - {mx}/year'
        elif mn and mn != 'null':
            job['salary'] = f'INR {mn}/year'
    
    # Extract location
    loc_m = re.search(r'"(?:city|location_name)"\s*:\s*"([^"]{2,40})"', combined)
    if loc_m:
        job['location'] = loc_m.group(1)
    
    # Extract experience
    exp_m = re.search(r'"min_experience"\s*:\s*(\d+).*?"max_experience"\s*:\s*(\d+)', combined)
    if exp_m:
        job['experience'] = f'{exp_m.group(1)}-{exp_m.group(2)} Years'
    
    return job

# Load base jobs list
with open(r'e:\Offcampuscareer\scripts\jobs_list.json', encoding='utf-8') as f:
    base_jobs = json.load(f)

enriched = []
for job in base_jobs:
    link = job.get('link', '')
    if not link:
        continue
    
    job_num = link.split('-')[-1]
    fname = os.path.join(JOBS_DIR, f'{job_num}.html')
    
    if os.path.exists(fname):
        with open(fname, encoding='utf-8') as f:
            page = f.read()
        
        result = parse_job_page(page, job)
        enriched.append(result)
        
        print(f'Job: {result["title"]} @ {result.get("company","?")}')
        print(f'  Type: {result.get("type","?")} | Location: {result.get("location","?")} | Salary: {result.get("salary","Not disclosed")}')
        print(f'  Exp: {result.get("experience","N/A")} | Domain: {result.get("domain","IT")}')
        desc = result.get("full_description","")
        print(f'  Desc ({len(desc)} chars): {desc[:200]}...' if len(desc) > 200 else f'  Desc: {desc}')
        print()
    else:
        print(f'No page for: {job["title"]}')
        enriched.append(job)

# Save enriched
with open(r'e:\Offcampuscareer\scripts\enriched_v2.json', 'w', encoding='utf-8') as f:
    json.dump(enriched, f, ensure_ascii=False, indent=2)

print(f'Enriched {len(enriched)} jobs')
