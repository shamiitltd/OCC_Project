import re, html as htmlmod, json, sqlite3, os, binascii
import sys

# Fix encoding for windows console
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1, closefd=False)

DB_PATH = r'e:\Offcampuscareer\db\offcampuscareer.db'
JOBS_DIR = r'e:\Offcampuscareer\scripts\job_pages'
BASE_URL = 'https://www.iitjobs.com'

def clean_html(text):
    if not text:
        return ''
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.I)
    text = re.sub(r'<li[^>]*>', '\n- ', text, flags=re.I)
    text = re.sub(r'</?ul[^>]*>', '', text, flags=re.I)
    text = re.sub(r'<p[^>]*>', '\n', text, flags=re.I)
    text = re.sub(r'<h[1-6][^>]*>', '\n\n### ', text, flags=re.I)
    text = re.sub(r'</h[1-6]>', '\n', text, flags=re.I)
    text = re.sub(r'<strong[^>]*>', '**', text, flags=re.I)
    text = re.sub(r'</strong>', '**', text, flags=re.I)
    text = re.sub(r'<[^>]+>', '', text)
    text = htmlmod.unescape(text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def gen_id():
    return 'JOB' + binascii.hexlify(os.urandom(6)).decode().upper()

def determine_domain(title, skills_list):
    combined = title.lower() + ' ' + ' '.join(skills_list).lower()
    domain_map = {
        'AI/ML': ['machine learning', 'ml ', 'deep learning', 'nlp', 'artificial intelligence', 'data scientist'],
        'Data': ['data engineer', 'data analyst', 'etl', 'pyspark', 'snowflake', 'power bi', 'tableau', 'sql developer', 'ssis', 'sql developer'],
        'DevOps': ['devops', 'kubernetes', 'openshift', 'terraform', 'ci/cd', 'linux engineer', 'platform engineer', 'ansible', 'rhcsa'],
        'Web Dev': ['full stack', 'react', 'angular', 'vue', 'node.js', 'nodejs', 'php', '.net', 'golang', 'backend developer', 'frontend'],
        'Mobile': ['android', 'ios', 'flutter', 'react native', 'mobile'],
        'QA': ['scrum master', 'agile', 'quality assurance'],
        'Cloud': ['aws', 'azure cloud', 'gcp', 'cloud architect'],
        'ERP': ['sap', 'oracle gtm', 'oracle otm', 'salesforce', 'crm'],
    }
    for domain, keywords in domain_map.items():
        if any(kw in combined for kw in keywords):
            return domain
    return 'IT'

def parse_job_page(page, base_job):
    job = dict(base_job)
    job.setdefault('salary', 'Not Disclosed')
    job.setdefault('full_description', '')
    job.setdefault('type', 'Job')
    
    # Try JSON-LD script tag first
    jld_m = re.search(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', page, re.S | re.I)
    if jld_m:
        try:
            jld_str = jld_m.group(1).strip()
            jld = json.loads(jld_str)
            if isinstance(jld, list):
                for item in jld:
                    if isinstance(item, dict) and item.get('@type') == 'JobPosting':
                        jld = item
                        break
            if isinstance(jld, dict) and jld.get('@type') == 'JobPosting':
                job['title'] = jld.get('title', job.get('title', ''))
                desc_html = jld.get('description', '')
                if desc_html:
                    job['full_description'] = clean_html(desc_html)
                
                sal = jld.get('baseSalary', {})
                if isinstance(sal, dict):
                    val = sal.get('value', {})
                    if isinstance(val, dict):
                        mn = val.get('minValue', '')
                        mx = val.get('maxValue', '')
                        unit = val.get('unitText', 'YEAR')
                        curr = sal.get('currency', 'INR')
                        if mn and mx:
                            job['salary'] = f'{curr} {mn:,} - {mx:,} / {unit}'.replace('.0', '')
                        elif mn:
                            job['salary'] = f'{curr} {mn:,} / {unit}'.replace('.0', '')
                
                loc = jld.get('jobLocation', {})
                if isinstance(loc, dict):
                    addr = loc.get('address', {})
                    if isinstance(addr, dict):
                        city = addr.get('addressLocality', '')
                        state = addr.get('addressRegion', '')
                        if city:
                            job['location'] = f'{city}, {state}, India'.replace(', ,', ',').strip(', ')
                
                exp = jld.get('experienceRequirements', {})
                if isinstance(exp, dict):
                    mn_exp = exp.get('monthsOfExperience', '')
                    if mn_exp:
                        job['experience'] = f'{int(mn_exp)//12}+ Years'
                elif isinstance(exp, str) and exp:
                    job['experience'] = exp
                
                emp_type = jld.get('employmentType', '')
                if emp_type:
                    type_map = {'FULL_TIME': 'Job', 'PART_TIME': 'Part Time', 'CONTRACTOR': 'Contract', 'INTERN': 'Internship', 'TEMPORARY': 'Contract'}
                    job['type'] = type_map.get(emp_type.upper(), 'Job')
                
                return job
        except Exception as e:
            pass
    
    # Fallback: Try next_f push blocks - decode and find JobPosting schema
    push_matches = re.findall(r'self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)', page)
    
    for raw in push_matches:
        if 'JobPosting' not in raw and 'job_title' not in raw:
            continue
        try:
            decoded = raw.encode('raw_unicode_escape').decode('unicode_escape')
        except:
            decoded = raw
        
        # Find JobPosting in decoded
        jld2_m = re.search(r'(\{"@context":"https://schema\.org","@type":"JobPosting".*?\}(?=\\n|$|\]|\[))', decoded, re.S)
        if jld2_m:
            try:
                jld2 = json.loads(jld2_m.group(1))
                desc_html = jld2.get('description', '')
                if desc_html:
                    job['full_description'] = clean_html(desc_html)
                    break
            except:
                pass
    
    return job

# Load base jobs
with open(r'e:\Offcampuscareer\scripts\jobs_list.json', encoding='utf-8') as f:
    base_jobs = json.load(f)

all_jobs_enriched = []

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
    else:
        result = job
    
    # Set domain
    result['domain'] = determine_domain(result.get('title',''), result.get('skills',[]))
    
    all_jobs_enriched.append(result)
    print(f'OK: {result["title"]} | {result.get("type")} | {result.get("location")} | {result.get("salary")} | desc:{len(result.get("full_description",""))} chars')

print(f'\nTotal: {len(all_jobs_enriched)} jobs enriched')

with open(r'e:\Offcampuscareer\scripts\final_jobs.json', 'w', encoding='utf-8') as f:
    json.dump(all_jobs_enriched, f, ensure_ascii=False, indent=2)

print('Saved final_jobs.json')
print('\nNow deleting previously inserted jobs and re-inserting with full data...')

# Connect to DB
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Add apply_link column if not exists
try:
    cursor.execute('ALTER TABLE jobs ADD COLUMN apply_link TEXT')
except:
    pass

# Delete jobs we inserted before (they'll have IDs starting with JOB)
# First check what's there
cursor.execute("SELECT COUNT(*) FROM jobs")
total_before = cursor.fetchone()[0]
print(f'Jobs in DB before: {total_before}')

# Delete only jobs that have our iitjobs.com apply_links (from previous run)
cursor.execute("DELETE FROM jobs WHERE apply_link LIKE '%iitjobs.com%'")
deleted = cursor.rowcount
print(f'Deleted {deleted} previously inserted iitjobs jobs')

# Now insert fresh
inserted = 0
for job in all_jobs_enriched:
    title = job.get('title', '').strip()
    company = htmlmod.unescape(job.get('company', 'Unknown').strip())
    
    if not title or not company:
        continue
    
    # Build full description
    desc_parts = []
    if job.get('experience'):
        desc_parts.append(f'Experience Required: {job["experience"]}')
    if job.get('openings'):
        desc_parts.append(f'Openings: {job["openings"]}')
    if job.get('posted'):
        desc_parts.append(f'Posted: {job["posted"]}')
    
    full_desc = job.get('full_description', '')
    if not full_desc:
        full_desc = f'Position: {title}\nCompany: {company}\nLocation: {job.get("location", "Remote")}\n\nPlease visit the apply link for full job description.'
    
    if desc_parts:
        full_desc = '\n'.join(desc_parts) + '\n\n' + full_desc
    
    job_id = gen_id()
    role = title[:100]
    company_clean = company[:100]
    job_type = job.get('type', 'Job')[:50]
    domain = job.get('domain', 'IT')[:100]
    location = job.get('location', 'Remote, India')[:100]
    stipend = job.get('salary', 'Not Disclosed')[:100]
    skills_list = job.get('skills', [])
    # Normalize skills - title case and clean
    skills_clean = [s.strip().title() for s in skills_list if s.strip()]
    skills_json = json.dumps(skills_clean)
    description = full_desc[:5000]
    apply_link = job.get('link', '')[:500]
    
    try:
        cursor.execute(
            'INSERT INTO jobs (id, company, role, type, domain, location, stipend, skills, description, apply_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (job_id, company_clean, role, job_type, domain, location, stipend, skills_json, description, apply_link)
        )
        inserted += 1
        print(f'  Inserted: [{job_type}] {role} @ {company_clean}')
    except Exception as e:
        print(f'  Error: {e}')

conn.commit()

cursor.execute("SELECT COUNT(*) FROM jobs")
total_after = cursor.fetchone()[0]
print(f'\nJobs in DB after: {total_after}')

# Verify - show all jobs now
cursor.execute("SELECT id, company, role, type, domain, location, stipend FROM jobs ORDER BY id DESC LIMIT 20")
jobs_in_db = cursor.fetchall()
print('\n=== JOBS IN DATABASE (latest 20) ===')
for j in jobs_in_db:
    print(f'  {j[0]} | {j[2]} @ {j[1]} | {j[3]} | {j[5]}')

conn.close()
print(f'\nSUCCESS: Inserted {inserted} jobs from iitjobs.com into Offcampuscareer database!')
