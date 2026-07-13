# This script parses all downloaded job detail pages and inserts into SQLite DB
import re, html as htmlmod, json, sqlite3, os, binascii

DB_PATH = r'e:\Offcampuscareer\db\offcampuscareer.db'
JOBS_DIR = r'e:\Offcampuscareer\scripts\job_pages'

def clean(text):
    if not text:
        return ''
    text = re.sub(r'<[^>]+>', ' ', text)
    text = htmlmod.unescape(text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def gen_id():
    return 'JOB' + binascii.hexlify(os.urandom(6)).decode().upper()

def parse_job_page(html_content, base_job):
    job = dict(base_job)
    
    # Extract salary/CTC
    # Look for common patterns
    sal_patterns = [
        r'(?:Salary|CTC|Stipend|Package)[^<:]*:?\s*</?\w[^>]*>\s*([^<\n]{5,60})',
        r'(?:Rs\.|INR|LPA|Lakhs?)\s*[\d,.]+[^\n<]{0,30}',
        r'[\u20b9$]\s*[\d,]+[^\n<]{0,30}',
    ]
    for pat in sal_patterns:
        m = re.search(pat, html_content, re.I)
        if m:
            sal = clean(m.group(0) if m.lastindex is None else m.group(1))
            if sal and 3 < len(sal) < 80:
                job['salary'] = sal
                break
    
    # Extract location more precisely
    loc_patterns = [
        r'LocationOn[^<]+</[^>]+>\s*<[^>]+>([^<]{3,60})</[^>]+>',
        r'(?:Location|City)[^<:]*:?[^<]*<[^>]+>([^<]{3,60})</[^>]+>',
        r'<svg[^>]*LocationOn[^<]+(?:<[^>]+>)+([^<]{3,60})',
    ]
    for pat in loc_patterns:
        m = re.search(pat, html_content, re.I)
        if m:
            loc = clean(m.group(1))
            if loc and 2 < len(loc) < 80:
                job['location'] = loc
                break
    
    # Extract experience
    exp_patterns = [
        r'(\d+\s*(?:-|to)\s*\d+\+?\s*(?:year|yr)s?)',
        r'(\d+\+?\s*(?:year|yr)s?\s*(?:of\s*)?(?:experience|exp))',
        r'Exp[^:]*:\s*([^<\n]{3,30})',
    ]
    for pat in exp_patterns:
        m = re.search(pat, html_content, re.I)
        if m:
            exp = clean(m.group(1))
            if exp:
                job['experience'] = exp
                break
    
    # Extract full job description
    # Look for job description section
    desc_patterns = [
        r'(?:Job Description|About the Role|Overview|Requirements?|Responsibilities)[^<]*</?\w[^>]*>([\s\S]{200,8000}?)(?=<h[1-6]|class="[^"]*(?:apply|similar|related))',
        r'<div[^>]*(?:job-desc|description|content|detail)[^>]*>([\s\S]{200,8000}?)</div>',
        r'<article[^>]*>([\s\S]{200,8000}?)</article>',
    ]
    
    for pat in desc_patterns:
        m = re.search(pat, html_content, re.I | re.S)
        if m:
            desc = clean(m.group(1))
            if desc and len(desc) > 100:
                job['full_description'] = desc[:5000]
                break
    
    # If no description found, extract main content area
    if not job.get('full_description'):
        # Remove navigation, header, footer, scripts
        cleaned_html = re.sub(r'<(?:script|style|nav|header|footer)[^>]*>[\s\S]*?</(?:script|style|nav|header|footer)>', '', html_content, flags=re.I)
        # Get main content
        main_m = re.search(r'<main[^>]*>([\s\S]*?)</main>', cleaned_html, re.I)
        if main_m:
            job['full_description'] = clean(main_m.group(1))[:5000]
        else:
            job['full_description'] = clean(cleaned_html)[:3000]
    
    # Extract number of openings
    m = re.search(r'(\d+)\s*opening', html_content, re.I)
    if m:
        job['openings'] = m.group(1)
    
    # Determine type more precisely
    text_lower = html_content.lower()
    if 'internship' in text_lower or 'intern ' in text_lower:
        job['type'] = 'Internship'
    elif 'freelanc' in text_lower:
        job['type'] = 'Freelance'
    elif 'contract' in text_lower:
        job['type'] = 'Contract'
    elif 'full.?time' in text_lower:
        job['type'] = 'Job'
    
    # Determine domain based on title and skills
    title_lower = job.get('title', '').lower()
    skills_lower = ' '.join(job.get('skills', [])).lower()
    combined = title_lower + ' ' + skills_lower
    
    domain_map = {
        'AI/ML': ['machine learning', 'ml', 'deep learning', 'nlp', 'ai ', 'artificial intelligence', 'data scientist'],
        'Data': ['data engineer', 'data analyst', 'etl', 'pyspark', 'snowflake', 'power bi', 'tableau', 'sql developer', 'ssis'],
        'DevOps': ['devops', 'kubernetes', 'docker', 'openshift', 'terraform', 'ci/cd', 'linux', 'ansible', 'platform engineer'],
        'Web Dev': ['frontend', 'backend', 'full stack', 'react', 'angular', 'vue', 'node.js', 'nodejs', 'php', '.net', 'golang', 'java '],
        'Mobile': ['android', 'ios', 'flutter', 'react native', 'mobile'],
        'QA': ['testing', 'qa ', 'quality assurance', 'selenium', 'scrum'],
        'Cloud': ['aws', 'azure', 'gcp', 'cloud'],
        'ERP': ['sap', 'oracle gtm', 'oracle otm', 'erp', 'salesforce', 'crm'],
    }
    
    for domain, keywords in domain_map.items():
        if any(kw in combined for kw in keywords):
            job['domain'] = domain
            break
    else:
        job['domain'] = 'IT'
    
    return job

# Load base job list
with open(r'e:\Offcampuscareer\scripts\jobs_list.json', encoding='utf-8') as f:
    base_jobs = json.load(f)

# Process each job
enriched_jobs = []
for job in base_jobs:
    link = job.get('link', '')
    if not link:
        continue
    
    job_id_num = link.split('-')[-1]
    fname = os.path.join(JOBS_DIR, f'{job_id_num}.html')
    
    if os.path.exists(fname):
        with open(fname, encoding='utf-8') as f:
            html_content = f.read()
        enriched = parse_job_page(html_content, job)
        enriched_jobs.append(enriched)
        print(f'Parsed: {enriched["title"]} @ {enriched.get("company","?")}')
        print(f'  Domain: {enriched.get("domain","?")} | Type: {enriched.get("type","?")} | Salary: {enriched.get("salary","?")}')
        print(f'  Skills: {enriched.get("skills",[])}')
        print(f'  Desc length: {len(enriched.get("full_description",""))}')
    else:
        print(f'No cached page for: {job["title"]}')
        enriched_jobs.append(job)

# Save enriched jobs
with open(r'e:\Offcampuscareer\scripts\enriched_jobs.json', 'w', encoding='utf-8') as f:
    json.dump(enriched_jobs, f, ensure_ascii=False, indent=2)
print(f'\nTotal enriched: {len(enriched_jobs)} jobs saved to enriched_jobs.json')

# Now insert into DB
print('\n=== INSERTING INTO DATABASE ===')
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Add apply_link column if it doesn't exist
try:
    cursor.execute('ALTER TABLE jobs ADD COLUMN apply_link TEXT')
    print('Added apply_link column')
except:
    pass

inserted = 0
for job in enriched_jobs:
    title = job.get('title', '').strip()
    company = job.get('company', 'Unknown').strip()
    
    if not title or not company:
        continue
    
    # Build comprehensive description
    desc_parts = []
    if job.get('experience'):
        desc_parts.append(f'Experience Required: {job["experience"]}')
    if job.get('openings'):
        desc_parts.append(f'Openings: {job["openings"]}')
    if job.get('posted'):
        desc_parts.append(f'Posted: {job["posted"]}')
    if desc_parts:
        desc_parts.insert(0, '')  # blank line before details
        
    full_desc = job.get('full_description', '')
    if not full_desc:
        full_desc = f'{title} position at {company}. Location: {job.get("location","Remote")}.'
    
    if desc_parts:
        full_desc = '\n'.join(desc_parts) + '\n\n' + full_desc
    
    job_id = gen_id()
    company_clean = company.replace('&amp;', '&')[:100]
    role = title[:100]
    job_type = job.get('type', 'Job')[:50]
    domain = job.get('domain', 'IT')[:100]
    location = job.get('location', 'Remote, India')[:100]
    stipend = job.get('salary', 'Competitive')[:50]
    skills = json.dumps([s.title() for s in job.get('skills', [])])
    description = full_desc[:5000]
    apply_link = job.get('link', '')[:500]
    
    try:
        cursor.execute(
            'INSERT INTO jobs (id, company, role, type, domain, location, stipend, skills, description, apply_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (job_id, company_clean, role, job_type, domain, location, stipend, skills, description, apply_link)
        )
        inserted += 1
        print(f'  Inserted: [{job_type}] {role} @ {company_clean}')
    except Exception as e:
        print(f'  Error inserting {role}: {e}')

conn.commit()
conn.close()
print(f'\n=== DONE: Inserted {inserted}/{len(enriched_jobs)} jobs into database ===')
