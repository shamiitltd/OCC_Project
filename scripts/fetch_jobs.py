import urllib.request, re, html as htmlmod, json, time, os

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'identity',
    'Connection': 'keep-alive',
    'Referer': 'https://www.iitjobs.com/remote-jobs-in-india',
}

os.makedirs(r'e:\Offcampuscareer\scripts\job_pages', exist_ok=True)

with open(r'e:\Offcampuscareer\scripts\jobs_list.json', encoding='utf-8') as f:
    jobs = json.load(f)

def fetch(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f'  Error: {e}')
        return None

for i, job in enumerate(jobs):
    link = job.get('link', '')
    if not link:
        continue
    # Use job ID from URL as filename
    job_id = link.split('-')[-1]
    fname = fr'e:\Offcampuscareer\scripts\job_pages\{job_id}.html'
    
    if os.path.exists(fname):
        print(f'[{i+1}/{len(jobs)}] Already cached: {job["title"]}')
        continue
    
    print(f'[{i+1}/{len(jobs)}] Fetching: {job["title"]}...')
    content = fetch(link)
    if content:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  Saved ({len(content)} bytes)')
    else:
        print(f'  FAILED')
    time.sleep(1.5)

print('All job pages fetched!')
