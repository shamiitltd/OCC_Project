import re, html as htmlmod, json

with open(r'e:\Offcampuscareer\scripts\iitjobs_listing.html', encoding='utf-8') as f:
    page = f.read()

# Parse each job card completely
# Split page into job sections
job_sections = re.split(r'(?=<section class="job-section)', page)
print(f'Job sections: {len(job_sections)}')

all_jobs = []
for section in job_sections[1:]:  # Skip first empty split
    job = {}
    
    # Title and link
    m = re.search(r'job-headings[^"]*"\s+href="(/job/[^"]+)"[^>]*>([^<]+)<', section)
    if m:
        job['link'] = 'https://www.iitjobs.com' + m.group(1)
        job['title'] = m.group(2).strip()
    
    # Company
    m = re.search(r'text-cmp[^"]*"\s+href="[^"]*">([^<]+)<', section)
    if m:
        job['company'] = m.group(1).strip()
    
    # Experience
    m = re.search(r'(\d+\+?\s*(?:to\s*\d+)?\s*(?:Years?|Yrs?))', section, re.I)
    if m:
        job['experience'] = m.group(1).strip()
    
    # Skills (chips)
    chips = re.findall(r'MuiChip-labelSmall[^>]*>([^<]+)<', section)
    job['skills'] = [c.strip() for c in chips if c.strip()]
    
    # Location
    m = re.search(r'LocationOnOutlined[^<]+</span>([^<]+)<', section, re.I)
    if not m:
        # Try from job URL
        link = job.get('link', '')
        parts = link.split('/')[-1].split('-')
        # Location is often in URL like: role-city-state-india-id
        job['location'] = 'Remote, India'
    else:
        job['location'] = m.group(1).strip()
    
    # Salary
    m = re.search(r'(?:salary|ctc|stipend|lpa|lacs)[^<]*([^<]{5,50})', section, re.I)
    if m:
        job['salary'] = m.group(1).strip()
    else:
        job['salary'] = 'Competitive'
    
    # Type
    job['type'] = 'Job'
    if 'intern' in section.lower():
        job['type'] = 'Internship'
    
    # Posted date
    m = re.search(r'(\d+\s+(?:hour|day|week|month)s?\s+ago)', section, re.I)
    if m:
        job['posted'] = m.group(1)
    
    # Short description from card
    m = re.search(r'job-desc-short[^>]*>([^<]+)', section, re.I)
    if m:
        job['short_desc'] = htmlmod.unescape(m.group(1).strip())
    
    if job.get('title'):
        all_jobs.append(job)
        print(f"  {job['title']} @ {job.get('company','?')} | Skills: {job.get('skills',[])} | Exp: {job.get('experience','N/A')}")

print(f'\nTotal parsed: {len(all_jobs)}')

# Save job list for next step
with open(r'e:\Offcampuscareer\scripts\jobs_list.json', 'w', encoding='utf-8') as f:
    json.dump(all_jobs, f, ensure_ascii=False, indent=2)
print('Saved to jobs_list.json')
