-- Setup Database Roles for Supabase integration
CREATE ROLE anon;
CREATE ROLE authenticated;

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'corporate', 'mentor')),
    college VARCHAR(255),
    company VARCHAR(255),
    professional_title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id VARCHAR(50) PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    company_logo VARCHAR(10) DEFAULT '',
    role VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Job', 'Internship', 'Freelance'
    domain VARCHAR(100) NOT NULL, -- 'Web Dev', 'AI/ML', 'Cloud', 'Data Science', etc.
    location VARCHAR(255) NOT NULL,
    mode VARCHAR(50) NOT NULL, -- 'On-site', 'Remote', 'Hybrid'
    stipend VARCHAR(100) NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    experience VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    posted_at DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'Active',
    about_company TEXT,
    perks TEXT[] NOT NULL DEFAULT '{}',
    process TEXT[] NOT NULL DEFAULT '{}',
    apply_link VARCHAR(500)
);

-- Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id VARCHAR(50) PRIMARY KEY,
    job_id VARCHAR(50) NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    student_id VARCHAR(255) NOT NULL, -- Can be student profile UUID or GUEST_ID
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    college VARCHAR(255),
    resume VARCHAR(500) NOT NULL,
    cover TEXT,
    status VARCHAR(50) DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired')),
    applied_at DATE DEFAULT CURRENT_DATE
);

-- Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    icon VARCHAR(10) DEFAULT '🎓',
    description TEXT NOT NULL,
    modules TEXT[] NOT NULL DEFAULT '{}'
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id VARCHAR(50) PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    certificate_issued BOOLEAN DEFAULT FALSE,
    completed_modules TEXT[] NOT NULL DEFAULT '{}',
    enrolled_at DATE DEFAULT CURRENT_DATE
);

-- Enable RLS (Row Level Security) if needed, but for local self-hosting simplicity we can grant permissions directly:
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;

-- Seed Default Database Data

-- Seed Courses
INSERT INTO public.courses (id, title, category, duration, icon, description, modules) VALUES
('CRS001', 'Full Stack Web Development with React & Node', 'Web Dev', '12 Weeks', '💻', 'Master frontend and backend engineering. Build production ready projects, APIs, and databases.', ARRAY['HTML & CSS Foundations', 'Modern JavaScript (ES6+)', 'React.js Component Architecture', 'State Management & Router', 'Node.js & Express APIs', 'Databases (MongoDB/PostgreSQL)']),
('CRS002', 'Practical Machine Learning & AI Engineering', 'AI/ML', '16 Weeks', '🤖', 'Deep dive into machine learning models, neural networks, computer vision, and NLP using Python and PyTorch.', ARRAY['Python for Data Science', 'Supervised Learning Algorithms', 'Unsupervised Learning & Clustering', 'Neural Networks with PyTorch', 'Convolutional Neural Networks (CNNs)', 'Natural Language Processing (NLP)']),
('CRS003', 'Cloud Computing & DevOps Masterclass', 'Cloud', '8 Weeks', '☁️', 'Learn cloud architecture, virtualization, Docker, Kubernetes, CI/CD, and infrastructure as code.', ARRAY['Cloud Concepts & Virtualization', 'Amazon Web Services (AWS)', 'Containerization with Docker', 'Orchestration with Kubernetes', 'CI/CD Pipelines (GitHub Actions)', 'Infrastructure as Code (Terraform)'])
ON CONFLICT (id) DO NOTHING;

-- Seed Jobs
INSERT INTO public.jobs (id, company, company_logo, role, type, domain, location, mode, stipend, skills, experience, description, posted_at, deadline, status, about_company, perks, process, apply_link) VALUES
('JOB001', 'TCS', 'T', 'Software Developer Intern', 'Internship', 'Web Dev', 'Mumbai', 'Hybrid', '₹15,000/month', ARRAY['JavaScript', 'React', 'Node.js'], 'Fresher', '6-month internship with TCS Digital team. Work on enterprise web applications using modern JS frameworks. Chance of PPO based on performance.', '2026-06-20', '2026-07-31', 'Active', 'Tata Consultancy Services (TCS) is Indias largest IT services company.', ARRAY['Stipend', 'PPO Opportunity', 'Certificate', 'Mentorship'], ARRAY['Online Test', 'Technical Interview', 'HR Interview'], NULL),
('JOB002', 'Infosys', 'I', 'AI/ML Engineer', 'Job', 'AI/ML', 'Bangalore', 'On-site', '₹8,00,000/year', ARRAY['Python', 'TensorFlow', 'NLP', 'AWS'], '0-2 years', 'Full-time role in Infosys AI lab. Develop ML models for enterprise solutions. Work with cutting-edge AI research teams.', '2026-06-22', '2026-08-15', 'Active', 'Infosys is a global leader in next-generation digital services and consulting.', ARRAY['Health Insurance', 'WFH Option', 'Learning Budget', 'Stock Options'], ARRAY['Resume Shortlist', 'Online Assessment', 'Technical Interview x2', 'HR Interview'], NULL),
('JOB_SCRAPE_001', 'Infor', 'I', 'Software Engineer', 'Job', 'Web Dev', 'Hyderabad, Telangana', 'On-site', 'Best in Industry', ARRAY['Python', 'Java', 'SQL', 'Cloud', 'Software Development'], 'Fresher (2024-2028 batch)', 'Infor invites enthusiastic freshers to join its dynamic team as Software Engineers in Hyderabad. This off-campus opportunity is specifically designed for recent graduates from the 2024, 2025, 2026, 2027, and 2028 batches who are eager to kickstart their careers in enterprise software development.', '2026-07-13', '2026-08-31', 'Active', 'Infor is a global leader in business cloud software specialized by industry.', ARRAY['Professional Training', 'Hybrid Options', 'Health Benefits', 'Mentorship'], ARRAY['Online Test', 'Technical Round', 'HR Interview'], 'https://www.offcampusjobsindia.com/jobs/infor-software-engineer-off-campus-jobs-hyderabad'),
('JOB_SCRAPE_002', 'Amadeus', 'A', 'Junior Software Development Engineer', 'Job', 'Web Dev', 'Bangalore, Karnataka', 'On-site', 'Best in Industry', ARRAY['Java', 'C++', 'Python', 'Algorithms', 'Data Structures'], 'Fresher (2024-2028 batch)', 'Amadeus is actively seeking talented and enthusiastic Junior Software Development Engineers to join their innovative team in Bangalore. This entry-level role is specifically designed for fresh graduates and recent alumni from the 2024, 2025, 2026, 2027, and 2028 batches.', '2026-07-13', '2026-08-30', 'Active', 'Amadeus is a leading transaction processor for the global travel and tourism industry.', ARRAY['Global Exposure', 'Learning Allowances', 'Health Insurance', 'Annual Bonus'], ARRAY['Coding Test', 'Technical Interview x2', 'Managerial Interview', 'HR'], 'https://www.offcampusjobsindia.com/jobs/amadeus-junior-software-development-engineer-jobs-bangalore-freshers'),
('JOB_SCRAPE_009', 'Amazon', 'A', 'Software Development Engineer I', 'Job', 'Web Dev', 'Bengaluru, Karnataka', 'On-site', 'Highly Competitive', ARRAY['Java', 'Linux', 'AWS', 'Data Structures', 'Distributed Systems'], 'Fresher (2024-2028 batch)', 'Amazon is seeking a talented Software Development Engineer I (SDE I) for the FinOps FP&A team in Bengaluru. This role is open for recent graduates from the 2024, 2025, 2026, 2027, and 2028 batches.', '2026-07-13', '2026-09-15', 'Active', 'Amazon is guided by four principles: customer obsession, passion for invention, and long-term thinking.', ARRAY['Vibrant Swag', 'Free Meals & Snacks', 'Stock Units (RSUs)', 'Healthcare coverage'], ARRAY['Online Coding Rounds x2', 'Technical Loop Interviews x3', 'Bar Raiser Round'], 'https://www.offcampusjobsindia.com/jobs/amazon-software-development-engineer-i-finops-fpanda-2024-2028-bengaluru')
ON CONFLICT (id) DO NOTHING;
