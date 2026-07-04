/* ============================================================
   OFFCAMPUSCAREER — AppState v2.0 (Multi-Module Data Layer)
   Complete platform data — TIP, Mentor, Jobs, Exams, Corporate, Community
   ============================================================ */

const AppState = {
  STORAGE_KEY: 'oc2_appstate_v2',
  VERSION: '2.0.0',

  /* ══════════════════════════════════════════════
     DEFAULT SEED DATA
  ══════════════════════════════════════════════ */
  _defaults: {

    /* ── TIP Courses ── */
    courses: [
      {
        id: 'CRS001', title: 'Job Bootcamp', category: 'Career',
        duration: '8 Weeks', level: 'Beginner', price: 9999,
        rating: 4.8, enrolled: 2450, published: true, featured: true,
        icon: '🚀', color: 'purple', module: 'tip',
        instructor: 'Vinay Prem Upadhyay', instructorId: 'MENT001',
        tags: ['Interview Prep', 'Aptitude', 'Communication'],
        description: 'Intensive bootcamp covering aptitude, interview prep, group discussions, and personality development to make you job-ready in 8 weeks.',
        modules: ['Aptitude & Reasoning', 'Communication Skills', 'Resume Building', 'Mock Interviews', 'Group Discussions', 'HR Round Prep', 'Company-Specific Prep', 'Final Assessment'],
        image: '', language: 'Hindi/English', certificate: true
      },
      {
        id: 'CRS002', title: 'Software AI Training', category: 'AI/ML',
        duration: '12 Weeks', level: 'Intermediate', price: 14999,
        rating: 4.9, enrolled: 1890, published: true, featured: true,
        icon: '🤖', color: 'cyan', module: 'tip',
        instructor: 'King Upadhyay', instructorId: 'MENT002',
        tags: ['Python', 'Machine Learning', 'Deep Learning', 'NLP'],
        description: 'Master AI & Machine Learning from fundamentals to deployment. Covers Python, TensorFlow, NLP, Computer Vision, and real-world AI projects.',
        modules: ['Python for AI', 'Data Science Fundamentals', 'Machine Learning Algorithms', 'Deep Learning & Neural Nets', 'Natural Language Processing', 'Computer Vision', 'Model Deployment', 'Capstone AI Project'],
        image: '', language: 'English', certificate: true
      },
      {
        id: 'CRS003', title: 'Full Stack Web Development', category: 'Web Dev',
        duration: '16 Weeks', level: 'Beginner', price: 12999,
        rating: 4.7, enrolled: 3120, published: true, featured: true,
        icon: '💻', color: 'indigo', module: 'tip',
        instructor: 'Akash Dash', instructorId: 'MENT003',
        tags: ['React', 'Node.js', 'MongoDB', 'HTML/CSS'],
        description: 'Build production-grade web applications from scratch. HTML, CSS, JavaScript, React, Node.js, MongoDB, and deployment to cloud.',
        modules: ['HTML5 & CSS3 Mastery', 'JavaScript Deep Dive', 'React.js Frontend', 'Node.js & Express Backend', 'MongoDB & Databases', 'REST API Design', 'Authentication & Security', 'Deployment & DevOps'],
        image: '', language: 'Hindi/English', certificate: true
      },
      {
        id: 'CRS004', title: 'Guaranteed Job Program', category: 'Career',
        duration: '24 Weeks', level: 'All Levels', price: 29999,
        rating: 4.9, enrolled: 1560, published: true, featured: true,
        icon: '🎯', color: 'amber', module: 'tip',
        instructor: 'Monika Upadhyay', instructorId: 'MENT004',
        tags: ['Full Stack', 'DSA', 'System Design', 'Placement'],
        description: "Our flagship program — complete tech training + placement assistance with a job guarantee. If you don't get placed, get 100% refund.",
        modules: ['Foundation Tech Skills', 'DSA & Problem Solving', 'Full Stack Development', 'AI/ML Essentials', 'System Design', 'Interview Mastery', 'Company Placement Drives', 'Career Mentorship'],
        image: '', language: 'Hindi/English', certificate: true
      },
      {
        id: 'CRS005', title: 'Resume Writing Mastery', category: 'Career',
        duration: '2 Weeks', level: 'Beginner', price: 1999,
        rating: 4.6, enrolled: 5200, published: true, featured: false,
        icon: '📝', color: 'green', module: 'tip',
        instructor: 'Monika Upadhyay', instructorId: 'MENT004',
        tags: ['Resume', 'ATS', 'Cover Letter', 'Portfolio'],
        description: 'Craft ATS-friendly resumes that get noticed. Learn formatting, keyword optimization, achievement quantification, and cover letter writing.',
        modules: ['Resume Fundamentals', 'ATS Optimization', 'Achievement Statements', 'Portfolio & Cover Letter', 'Review & Feedback'],
        image: '', language: 'Hindi/English', certificate: true
      },
      {
        id: 'CRS006', title: 'LinkedIn Optimization', category: 'Career',
        duration: '1 Week', level: 'Beginner', price: 1499,
        rating: 4.5, enrolled: 4300, published: true, featured: false,
        icon: '🔗', color: 'blue', module: 'tip',
        instructor: 'Vinay Prem Upadhyay', instructorId: 'MENT001',
        tags: ['LinkedIn', 'Personal Branding', 'Networking'],
        description: 'Transform your LinkedIn profile into a recruiter magnet. Profile optimization, content strategy, networking techniques, and personal branding.',
        modules: ['Profile Overhaul', 'Headline & Summary', 'Content Strategy', 'Networking & Outreach', 'Analytics & Growth'],
        image: '', language: 'Hindi/English', certificate: true
      },
      {
        id: 'CRS007', title: 'JEE Foundation Course', category: 'Engineering Entrance',
        duration: '20 Weeks', level: 'Intermediate', price: 7999,
        rating: 4.7, enrolled: 890, published: true, featured: true,
        icon: '⚗️', color: 'exams', module: 'exams',
        instructor: 'Dr. Ramesh Sharma', instructorId: 'MENT005',
        tags: ['JEE', 'Physics', 'Chemistry', 'Maths'],
        description: 'Comprehensive JEE preparation covering Physics, Chemistry, and Mathematics with 500+ practice problems and mock tests.',
        modules: ['Physics Mechanics', 'Thermodynamics & Optics', 'Organic Chemistry', 'Inorganic Chemistry', 'Algebra & Calculus', 'Coordinate Geometry', 'Mock Tests Series', 'Revision & Strategy'],
        image: '', language: 'Hindi/English', certificate: false
      },
      {
        id: 'CRS008', title: 'UPSC CSE Complete Prep', category: 'Government Exam',
        duration: '52 Weeks', level: 'All Levels', price: 19999,
        rating: 4.8, enrolled: 2100, published: true, featured: true,
        icon: '🏛️', color: 'exams', module: 'exams',
        instructor: 'IAS Priya Verma', instructorId: 'MENT006',
        tags: ['UPSC', 'GS', 'Essay', 'Interview'],
        description: 'Complete UPSC Civil Services Exam preparation from Prelims to Mains to Interview. With current affairs, answer writing practice, and mock interviews.',
        modules: ['History & Culture', 'Geography', 'Indian Polity', 'Economy', 'Science & Technology', 'Current Affairs', 'Essay Writing', 'CSAT & Mains Strategy'],
        image: '', language: 'Hindi/English', certificate: false
      }
    ],

    /* ── Mentors ── */
    mentors: [
      {
        id: 'MENT001', name: 'Vinay Prem Upadhyay', initials: 'VP',
        title: 'Founder & Career Coach', company: 'SHAMIIT LLP',
        specialties: ['Career Coaching', 'Interview Prep', 'LinkedIn', 'Soft Skills'],
        domains: ['Career', 'HR'],
        rating: 4.9, totalRatings: 312, students: 1240, sessions: 890,
        experience: '8 years', price: 499, priceType: '/session',
        bio: 'Founder of Offcampuscareer & SHAMIIT LLP. Helped 1000+ students get placed in top MNCs. Expert in career strategy and interview preparation.',
        image: '', verified: true, active: true,
        languages: ['Hindi', 'English'],
        courses: ['CRS001', 'CRS006'],
        linkedin: 'https://www.linkedin.com/in/vinaypremupadhyay/',
        responseTime: 'Usually within 2 hours'
      },
      {
        id: 'MENT002', name: 'King Upadhyay', initials: 'KU',
        title: 'AI/ML Lead Engineer', company: 'Tech Startup',
        specialties: ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'],
        domains: ['AI/ML', 'Data Science'],
        rating: 4.8, totalRatings: 198, students: 850, sessions: 520,
        experience: '6 years', price: 799, priceType: '/session',
        bio: 'Senior AI/ML engineer with experience at top product companies. Specializes in making complex AI concepts accessible to beginners.',
        image: '', verified: true, active: true,
        languages: ['English'],
        courses: ['CRS002'],
        linkedin: '#',
        responseTime: 'Usually within 4 hours'
      },
      {
        id: 'MENT003', name: 'Akash Dash', initials: 'AD',
        title: 'Full Stack Developer', company: 'Infosys',
        specialties: ['React', 'Node.js', 'MongoDB', 'System Design', 'DevOps'],
        domains: ['Web Dev', 'Backend', 'Cloud'],
        rating: 4.7, totalRatings: 165, students: 720, sessions: 430,
        experience: '5 years', price: 599, priceType: '/session',
        bio: 'Working at Infosys as a Senior Full Stack Developer. Passionate about teaching and mentoring fresh graduates to build production-ready applications.',
        image: '', verified: true, active: true,
        languages: ['Hindi', 'English'],
        courses: ['CRS003'],
        linkedin: '#',
        responseTime: 'Usually within 6 hours'
      },
      {
        id: 'MENT004', name: 'Monika Upadhyay', initials: 'MU',
        title: 'HR Specialist & Career Counselor', company: 'SHAMIIT LLP',
        specialties: ['HR', 'Resume Writing', 'Job Guarantee', 'Placement', 'Soft Skills'],
        domains: ['Career', 'HR', 'Placement'],
        rating: 4.9, totalRatings: 280, students: 1100, sessions: 750,
        experience: '7 years', price: 399, priceType: '/session',
        bio: 'HR specialist who has helped place 300+ students in companies like TCS, Infosys, Wipro, and more. Expert in resume writing and interview preparation.',
        image: '', verified: true, active: true,
        languages: ['Hindi', 'English'],
        courses: ['CRS004', 'CRS005'],
        linkedin: '#',
        responseTime: 'Usually within 3 hours'
      },
      {
        id: 'MENT005', name: 'Dr. Ramesh Sharma', initials: 'RS',
        title: 'IIT Graduate & JEE Mentor', company: 'EduTech Pro',
        specialties: ['JEE Physics', 'JEE Chemistry', 'JEE Maths', 'Problem Solving'],
        domains: ['Engineering Entrance', 'Science'],
        rating: 4.8, totalRatings: 422, students: 2100, sessions: 1850,
        experience: '10 years', price: 699, priceType: '/session',
        bio: 'IIT Bombay graduate with 10 years of JEE coaching experience. Has helped 200+ students crack JEE Advanced with AIR under 500.',
        image: '', verified: true, active: true,
        languages: ['Hindi', 'English'],
        courses: ['CRS007'],
        linkedin: '#',
        responseTime: 'Usually within 8 hours'
      },
      {
        id: 'MENT006', name: 'IAS Priya Verma', initials: 'PV',
        title: 'IAS Officer (2019 Batch)', company: 'Government of India',
        specialties: ['UPSC GS', 'Essay Writing', 'Interview Preparation', 'Current Affairs'],
        domains: ['Government Exam', 'UPSC'],
        rating: 4.9, totalRatings: 534, students: 3200, sessions: 2100,
        experience: '4 years (IAS)', price: 1499, priceType: '/session',
        bio: 'IAS Officer from 2019 batch with AIR 45. Has guided 50+ students who successfully cleared UPSC. Expertise in GS strategy and answer writing.',
        image: '', verified: true, active: true,
        languages: ['Hindi', 'English'],
        courses: ['CRS008'],
        linkedin: '#',
        responseTime: 'Usually within 12 hours'
      },
      {
        id: 'MENT007', name: 'Rohit Kapoor', initials: 'RK',
        title: 'Senior SDE at Amazon', company: 'Amazon',
        specialties: ['DSA', 'System Design', 'FAANG Interviews', 'LeetCode'],
        domains: ['Tech', 'Competitive Programming'],
        rating: 4.8, totalRatings: 289, students: 980, sessions: 720,
        experience: '6 years', price: 1299, priceType: '/session',
        bio: 'Senior Software Development Engineer at Amazon. Cleared FAANG interviews at Google, Amazon, and Meta. Expert in DSA and system design.',
        image: '', verified: true, active: true,
        languages: ['English'],
        courses: [],
        linkedin: '#',
        responseTime: 'Usually within 6 hours'
      }
    ],

    /* ── Exam Categories ── */
    examCategories: [
      {
        id: 'EXM001', name: 'JEE (Main & Advanced)', shortName: 'JEE',
        icon: '⚗️', color: 'cyan',
        description: 'Joint Entrance Examination for IITs, NITs, and other premier engineering institutes.',
        eligibility: '10+2 with PCM', conductedBy: 'NTA',
        frequency: '2 times/year', difficulty: 'Very High',
        aspirants: '1.2M+', seats: '~17,000 (IITs)',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        syllabus: ['Mechanics', 'Electrostatics', 'Organic Chemistry', 'Algebra', 'Calculus'],
        resources: ['Free Notes', 'Video Lectures', 'Practice Tests', 'Previous Year Papers'],
        mentors: ['MENT005']
      },
      {
        id: 'EXM002', name: 'NEET-UG', shortName: 'NEET',
        icon: '🩺', color: 'rose',
        description: 'National Eligibility cum Entrance Test for MBBS, BDS, and other medical courses.',
        eligibility: '10+2 with PCB', conductedBy: 'NTA',
        frequency: '1 time/year', difficulty: 'Very High',
        aspirants: '2M+', seats: '~90,000 (MBBS)',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        syllabus: ['NCERT Class 11-12 PCB'],
        resources: ['Free Notes', 'Video Lectures', 'Practice Tests', 'Previous Year Papers'],
        mentors: []
      },
      {
        id: 'EXM003', name: 'UPSC Civil Services', shortName: 'UPSC CSE',
        icon: '🏛️', color: 'amber',
        description: 'Civil Services Examination for IAS, IPS, IFS, and other central government services.',
        eligibility: 'Any Graduate', conductedBy: 'UPSC',
        frequency: '1 time/year', difficulty: 'Extremely High',
        aspirants: '1M+', seats: '~1000',
        subjects: ['General Studies', 'CSAT', 'Optional Subject', 'Essay'],
        syllabus: ['History', 'Geography', 'Polity', 'Economy', 'Science', 'Current Affairs'],
        resources: ['Free Notes', 'Video Lectures', 'Mains Answer Writing', 'Mock Interviews'],
        mentors: ['MENT006']
      },
      {
        id: 'EXM004', name: 'GATE', shortName: 'GATE',
        icon: '⚙️', color: 'indigo',
        description: 'Graduate Aptitude Test in Engineering for PG admissions and PSU recruitment.',
        eligibility: 'BE/B.Tech/BSc', conductedBy: 'IITs / IISc',
        frequency: '1 time/year', difficulty: 'High',
        aspirants: '800K+', seats: 'PSU + IIT/NIT PG',
        subjects: ['Engineering Mathematics', 'Core Engineering', 'General Aptitude'],
        syllabus: ['Engineering Maths', 'Subject-specific Topics'],
        resources: ['Free Notes', 'Video Lectures', 'Mock Tests'],
        mentors: []
      },
      {
        id: 'EXM005', name: 'CAT', shortName: 'CAT',
        icon: '📊', color: 'orange',
        description: 'Common Admission Test for IIMs and other top management institutes.',
        eligibility: 'Any Graduate', conductedBy: 'IIM',
        frequency: '1 time/year', difficulty: 'High',
        aspirants: '300K+', seats: 'IIM + Top B-schools',
        subjects: ['VARC', 'DILR', 'Quantitative Aptitude'],
        syllabus: ['Reading Comprehension', 'Data Interpretation', 'Quant'],
        resources: ['Free Notes', 'Video Lectures', 'Mock Tests', 'OA Sessions'],
        mentors: []
      },
      {
        id: 'EXM006', name: 'SSC CGL / CHSL', shortName: 'SSC',
        icon: '🏢', color: 'green',
        description: 'Staff Selection Commission exams for central government jobs across ministries.',
        eligibility: '10+2 / Graduation', conductedBy: 'SSC',
        frequency: '1 time/year', difficulty: 'Moderate',
        aspirants: '5M+', seats: 'Thousands (Government)',
        subjects: ['General Intelligence', 'General Awareness', 'English', 'Quantitative Aptitude'],
        syllabus: ['Reasoning', 'Current Affairs', 'English Grammar', 'Basic Maths'],
        resources: ['Free Notes', 'Video Lectures', 'Practice Tests'],
        mentors: []
      }
    ],

    /* ── Students ── */
    students: [
      { id:'STU001', name:'Rahul Sharma', email:'rahul@demo.com', password:'demo123', phone:'9876543210', college:'IIT Delhi', year:'3rd Year', stream:'Computer Science', avatar:'RS', enrolledCourses:['CRS001','CRS003'], appliedJobs:[], mentorSessions:[], communityPosts:[], joinedAt:'2025-01-15', profileComplete: 80 },
      { id:'STU002', name:'Priya Patel', email:'priya@demo.com', password:'demo123', phone:'9876543211', college:'NIT Trichy', year:'4th Year', stream:'Electronics', avatar:'PP', enrolledCourses:['CRS002','CRS004'], appliedJobs:[], mentorSessions:[], communityPosts:[], joinedAt:'2025-02-10', profileComplete: 90 },
      { id:'STU003', name:'Amit Kumar', email:'amit@demo.com', password:'demo123', phone:'9876543212', college:'BITS Pilani', year:'2nd Year', stream:'Mechanical', avatar:'AK', enrolledCourses:['CRS003'], appliedJobs:[], mentorSessions:[], communityPosts:[], joinedAt:'2025-03-05', profileComplete: 60 },
      { id:'STU004', name:'Sneha Gupta', email:'sneha@demo.com', password:'demo123', phone:'9876543213', college:'VIT Vellore', year:'4th Year', stream:'Computer Science', avatar:'SG', enrolledCourses:['CRS001','CRS005','CRS006'], appliedJobs:[], mentorSessions:[], communityPosts:[], joinedAt:'2025-03-20', profileComplete: 95 }
    ],

    /* ── Enrollments ── */
    enrollments: [
      { id:'ENR001', studentId:'STU001', courseId:'CRS001', progress:75, startDate:'2025-01-20', completedModules:['Aptitude & Reasoning','Communication Skills','Resume Building','Mock Interviews','Group Discussions','HR Round Prep'], certificateIssued:false },
      { id:'ENR002', studentId:'STU001', courseId:'CRS003', progress:40, startDate:'2025-02-01', completedModules:['HTML5 & CSS3 Mastery','JavaScript Deep Dive','React.js Frontend'], certificateIssued:false },
      { id:'ENR003', studentId:'STU002', courseId:'CRS002', progress:100, startDate:'2025-02-15', completedModules:['Python for AI','Data Science Fundamentals','Machine Learning Algorithms','Deep Learning & Neural Nets','Natural Language Processing','Computer Vision','Model Deployment','Capstone AI Project'], certificateIssued:true },
      { id:'ENR004', studentId:'STU002', courseId:'CRS004', progress:60, startDate:'2025-03-01', completedModules:['Foundation Tech Skills','DSA & Problem Solving','Full Stack Development','AI/ML Essentials'], certificateIssued:false },
      { id:'ENR005', studentId:'STU003', courseId:'CRS003', progress:25, startDate:'2025-03-10', completedModules:['HTML5 & CSS3 Mastery','JavaScript Deep Dive'], certificateIssued:false },
      { id:'ENR006', studentId:'STU004', courseId:'CRS001', progress:100, startDate:'2025-03-25', completedModules:['Aptitude & Reasoning','Communication Skills','Resume Building','Mock Interviews','Group Discussions','HR Round Prep','Company-Specific Prep','Final Assessment'], certificateIssued:true },
      { id:'ENR007', studentId:'STU004', courseId:'CRS005', progress:80, startDate:'2025-04-01', completedModules:['Resume Fundamentals','ATS Optimization','Achievement Statements','Portfolio & Cover Letter'], certificateIssued:false },
      { id:'ENR008', studentId:'STU004', courseId:'CRS006', progress:100, startDate:'2025-04-10', completedModules:['Profile Overhaul','Headline & Summary','Content Strategy','Networking & Outreach','Analytics & Growth'], certificateIssued:true }
    ],

    /* ── Live Classes ── */
    classes: [
      { id:'CLS001', courseId:'CRS001', title:'Aptitude Masterclass — Advanced', date:'2026-07-10', time:'10:00 AM', instructor:'Vinay Prem Upadhyay', meetingLink:'https://meet.google.com/abc-defg-hij', platform:'Google Meet', attendees:['STU001','STU004'] },
      { id:'CLS002', courseId:'CRS002', title:'Deep Learning: CNNs Deep Dive', date:'2026-07-11', time:'2:00 PM', instructor:'King Upadhyay', meetingLink:'https://meet.google.com/klm-nopq-rst', platform:'Google Meet', attendees:['STU002'] },
      { id:'CLS003', courseId:'CRS003', title:'React.js Hooks Workshop', date:'2026-07-12', time:'11:00 AM', instructor:'Akash Dash', meetingLink:'https://meet.google.com/uvw-xyza-bcd', platform:'Google Meet', attendees:['STU001','STU003'] },
      { id:'CLS004', courseId:'CRS004', title:'System Design: URL Shortener', date:'2026-07-13', time:'4:00 PM', instructor:'Monika Upadhyay', meetingLink:'https://meet.google.com/efg-hijk-lmn', platform:'Google Meet', attendees:['STU002'] },
      { id:'CLS005', courseId:'CRS008', title:'UPSC GS1 — History Deep Dive', date:'2026-07-15', time:'9:00 AM', instructor:'IAS Priya Verma', meetingLink:'https://meet.google.com/opq-rstu-vwx', platform:'Google Meet', attendees:[] }
    ],

    /* ── Assignments ── */
    assignments: [
      { id:'ASG001', courseId:'CRS001', title:'Mock Interview Recording', dueDate:'2026-07-25', description:'Record a 10-minute mock interview and upload the video link.', submissions:[
        { studentId:'STU001', submittedAt:'2026-07-10', fileName:'mock_interview_rahul.mp4', grade:85 },
        { studentId:'STU004', submittedAt:'2026-07-12', fileName:'mock_interview_sneha.mp4', grade:92 }
      ]},
      { id:'ASG002', courseId:'CRS002', title:'Build a CNN Classifier', dueDate:'2026-07-28', description:'Build a CNN model to classify CIFAR-10 images with >85% accuracy.', submissions:[
        { studentId:'STU002', submittedAt:'2026-07-18', fileName:'cnn_classifier_priya.ipynb', grade:95 }
      ]},
      { id:'ASG003', courseId:'CRS003', title:'Full Stack Todo App', dueDate:'2026-08-02', description:'Build a complete Todo app with React frontend and Node.js backend with MongoDB.', submissions:[] }
    ],

    /* ── Jobs ── */
    jobs: [
      {
        id:'JOB001', company:'TCS', companyLogo:'T', role:'Software Developer Intern',
        type:'Internship', domain:'Web Dev', location:'Mumbai', mode:'Hybrid',
        stipend:'₹15,000/month', salaryRange:[10000, 20000],
        skills:['JavaScript','React','Node.js'], experience:'Fresher',
        description:'6-month internship with TCS Digital team. Work on enterprise web applications using modern JS frameworks. Chance of PPO based on performance.',
        applications:[], postedAt:'2026-06-20', deadline:'2026-07-31', status:'Active',
        aboutCompany: 'Tata Consultancy Services (TCS) is India\'s largest IT services company.',
        perks: ['Stipend', 'PPO Opportunity', 'Certificate', 'Mentorship'],
        process: ['Online Test', 'Technical Interview', 'HR Interview']
      },
      {
        id:'JOB002', company:'Infosys', companyLogo:'I', role:'AI/ML Engineer',
        type:'Job', domain:'AI/ML', location:'Bangalore', mode:'On-site',
        stipend:'₹8,00,000/year', salaryRange:[700000, 900000],
        skills:['Python','TensorFlow','NLP','AWS'], experience:'0-2 years',
        description:'Full-time role in Infosys AI lab. Develop ML models for enterprise solutions. Work with cutting-edge AI research teams.',
        applications:[], postedAt:'2026-06-22', deadline:'2026-08-15', status:'Active',
        aboutCompany: 'Infosys is a global leader in next-generation digital services and consulting.',
        perks: ['Health Insurance', 'WFH Option', 'Learning Budget', 'Stock Options'],
        process: ['Resume Shortlist', 'Online Assessment', 'Technical Interview x2', 'HR Interview']
      },
      {
        id:'JOB003', company:'Wipro', companyLogo:'W', role:'Full Stack Developer',
        type:'Job', domain:'Web Dev', location:'Hyderabad', mode:'Hybrid',
        stipend:'₹6,50,000/year', salaryRange:[600000, 700000],
        skills:['React','Node.js','MongoDB','Docker'], experience:'0-1 year',
        description:'Build and maintain full-stack web applications for global clients. Agile team, great mentorship for freshers.',
        applications:[], postedAt:'2026-06-25', deadline:'2026-07-30', status:'Active',
        aboutCompany: 'Wipro is a leading global IT, consulting, and business process services company.',
        perks: ['Health Insurance', 'Flexible Hours', 'Learning Platform', 'Annual Bonus'],
        process: ['Online Test', 'Technical Interview', 'Manager Round', 'HR']
      },
      {
        id:'JOB004', company:'Cognizant', companyLogo:'C', role:'Data Analyst Intern',
        type:'Internship', domain:'Data Science', location:'Chennai', mode:'On-site',
        stipend:'₹12,000/month', salaryRange:[10000, 15000],
        skills:['Python','SQL','Excel','Power BI'], experience:'Fresher',
        description:'3-month internship analyzing business data and creating dashboards. Great exposure to enterprise data analytics.',
        applications:[], postedAt:'2026-06-28', deadline:'2026-07-25', status:'Active',
        aboutCompany: 'Cognizant is one of the world\'s leading professional services companies.',
        perks: ['Stipend', 'Certificate', 'PPO Opportunity', 'Training'],
        process: ['Resume Review', 'Technical Interview', 'HR Round']
      },
      {
        id:'JOB005', company:'HCL Tech', companyLogo:'H', role:'Cloud Engineer',
        type:'Job', domain:'Cloud', location:'Noida', mode:'On-site',
        stipend:'₹7,50,000/year', salaryRange:[700000, 800000],
        skills:['AWS','Docker','Kubernetes','Linux','Terraform'], experience:'0-2 years',
        description:'Manage cloud infrastructure and deploy scalable applications. Work on AWS/Azure cloud solutions for enterprise clients.',
        applications:[], postedAt:'2026-06-30', deadline:'2026-08-01', status:'Active',
        aboutCompany: 'HCL Technologies is a global technology company with presence in 60+ countries.',
        perks: ['Health Insurance', 'Work from Home', 'Annual Bonus', 'Cloud Certifications'],
        process: ['Online Assessment', 'Technical Interview x2', 'HR Interview']
      },
      {
        id:'JOB006', company:'Offcampuscareer', companyLogo:'O', role:'Frontend Developer',
        type:'Freelance', domain:'Web Dev', location:'Remote', mode:'Remote',
        stipend:'₹500/hour', salaryRange:[400, 700],
        skills:['HTML','CSS','JavaScript','React','Figma'], experience:'Fresher',
        description:'Freelance opportunity to build landing pages, dashboards, and UI components. Flexible hours, remote work, great portfolio building.',
        applications:[], postedAt:'2026-07-01', deadline:'2026-07-20', status:'Active',
        aboutCompany: 'Offcampuscareer is a leading ed-tech and career platform for Indian youth.',
        perks: ['Flexible Hours', 'Portfolio Building', 'Mentorship', 'Certificate'],
        process: ['Portfolio Review', 'Quick Task', 'Video Call']
      },
      {
        id:'JOB007', company:'Google', companyLogo:'G', role:'Software Engineer (STEP Intern)',
        type:'Internship', domain:'Tech', location:'Hyderabad/Bangalore', mode:'Hybrid',
        stipend:'₹1,50,000/month', salaryRange:[120000, 200000],
        skills:['Python','Java','Data Structures','Algorithms','System Design'], experience:'Fresher (3rd/4th year)',
        description:'Google\'s STEP Internship program for undergraduate students. Work on real Google products under senior engineers.',
        applications:[], postedAt:'2026-07-01', deadline:'2026-08-31', status:'Active',
        aboutCompany: 'Google is a multinational technology company specializing in internet-related services.',
        perks: ['Stipend', 'PPO Opportunity', 'Google swag', 'Free food & transport', 'Mentorship'],
        process: ['Online Coding Test', 'Technical Interview x2', 'Team Match']
      },
      {
        id:'JOB008', company:'Startups', companyLogo:'S', role:'Product Manager (Associate)',
        type:'Job', domain:'Product Management', location:'Gurugram', mode:'Hybrid',
        stipend:'₹8-12 LPA', salaryRange:[800000, 1200000],
        skills:['Product Thinking', 'SQL', 'Figma', 'Agile', 'Analytics'], experience:'0-2 years',
        description:'Join a high-growth Series B startup as Associate PM. Work directly with the founding team on product roadmap and user research.',
        applications:[], postedAt:'2026-07-02', deadline:'2026-07-31', status:'Active',
        aboutCompany: 'High-growth fintech startup revolutionizing payments for Bharat.',
        perks: ['ESOPs', 'Flexible Hours', 'Fast Growth', 'Health Insurance'],
        process: ['Resume Review', 'Case Study', 'Interview Rounds x3']
      }
    ],

    /* ── Corporate Partners ── */
    corporates: [
      { id:'CORP001', company:'TCS', logo:'T', industry:'IT Services', size:'500K+', location:'Pan-India', contact:'tcs@oc2.in', partnerType:'Hiring Partner', requirements:'Full Stack, AI/ML, Cloud', activeJobs: 3, placedStudents: 45 },
      { id:'CORP002', company:'Infosys', logo:'I', industry:'IT Services', size:'300K+', location:'Pan-India', contact:'infosys@oc2.in', partnerType:'Campus Partner', requirements:'Python, Java, Cloud', activeJobs: 2, placedStudents: 38 },
      { id:'CORP003', company:'Wipro', logo:'W', industry:'IT Services', size:'200K+', location:'Pan-India', contact:'wipro@oc2.in', partnerType:'Hiring Partner', requirements:'Web Dev, Testing, Cloud', activeJobs: 2, placedStudents: 29 },
      { id:'CORP004', company:'Google', logo:'G', industry:'Technology', size:'100K+', location:'Hyderabad/Bangalore', contact:'google@oc2.in', partnerType:'Internship Partner', requirements:'DSA, ML, System Design', activeJobs: 1, placedStudents: 5 },
      { id:'CORP005', company:'Startups Network', logo:'S', industry:'Startups', size:'Varies', location:'Pan-India/Remote', contact:'startups@oc2.in', partnerType:'Ecosystem Partner', requirements:'All domains', activeJobs: 5, placedStudents: 22 }
    ],

    /* ── College Partners ── */
    colleges: [
      { id:'COL001', name:'IIT Delhi', type:'IIT', location:'New Delhi', students: 12000, partnerSince:'2024', collaborationType:'Placement + Training' },
      { id:'COL002', name:'NIT Trichy', type:'NIT', location:'Trichy, TN', students: 8000, partnerSince:'2024', collaborationType:'Training' },
      { id:'COL003', name:'VIT Vellore', type:'Deemed', location:'Vellore, TN', students: 35000, partnerSince:'2025', collaborationType:'Campus Drives' },
      { id:'COL004', name:'BITS Pilani', type:'Deemed', location:'Pilani, RJ', students: 9000, partnerSince:'2025', collaborationType:'Placement + Training' },
      { id:'COL005', name:'DTU Delhi', type:'State', location:'New Delhi', students: 12000, partnerSince:'2025', collaborationType:'Training' },
      { id:'COL006', name:'IIIT Hyderabad', type:'IIIT', location:'Hyderabad', students: 3000, partnerSince:'2024', collaborationType:'Research + Placement' }
    ],

    /* ── Community Posts ── */
    communityPosts: [
      {
        id:'POST001', authorId:'STU001', authorName:'Rahul Sharma', authorAvatar:'RS',
        category:'Success Story', title:'Got placed at TCS Digital after Job Bootcamp!',
        content:'I completed the Job Bootcamp 2 months ago and just received my offer letter from TCS Digital! The mock interview sessions were incredibly helpful. Thank you OCC team!',
        tags:['Success', 'TCS', 'Job Bootcamp', 'Placement'],
        likes:145, comments:28, views:892,
        postedAt:'2026-06-28', pinned:true
      },
      {
        id:'POST002', authorId:'STU002', authorName:'Priya Patel', authorAvatar:'PP',
        category:'Study Help', title:'Best resources for JEE Physics - Mechanics chapter',
        content:'Sharing my notes and resource list for JEE Physics Mechanics. These helped me score 95+ in mock tests. Comment if you need the PDF links!',
        tags:['JEE', 'Physics', 'Resources', 'Study Tips'],
        likes:89, comments:34, views:1240,
        postedAt:'2026-06-30', pinned:false
      },
      {
        id:'POST003', authorId:'STU003', authorName:'Amit Kumar', authorAvatar:'AK',
        category:'Question', title:'How to approach UPSC GS1 History preparation from scratch?',
        content:'I am a working professional starting UPSC prep. What is the best approach for GS1 History? Should I follow NCERT first or directly go to standard books?',
        tags:['UPSC', 'GS1', 'History', 'Beginner'],
        likes:52, comments:41, views:780,
        postedAt:'2026-07-01', pinned:false
      },
      {
        id:'POST004', authorId:'STU004', authorName:'Sneha Gupta', authorAvatar:'SG',
        category:'Resource', title:'Free AI/ML learning roadmap for 2026',
        content:'Compiled a complete roadmap for learning AI/ML from scratch to job-ready. Includes free resources, paid courses, projects to build, and companies to target.',
        tags:['AI/ML', 'Roadmap', 'Resources', 'Career'],
        likes:234, comments:67, views:3450,
        postedAt:'2026-07-02', pinned:true
      }
    ],

    /* ── Payments ── */
    payments: [
      { id:'PAY001', studentId:'STU001', courseId:'CRS001', amount:9999, method:'UPI', date:'2025-01-20', status:'Completed', receiptNo:'OCC-R-001' },
      { id:'PAY002', studentId:'STU001', courseId:'CRS003', amount:12999, method:'Card', date:'2025-02-01', status:'Completed', receiptNo:'OCC-R-002' },
      { id:'PAY003', studentId:'STU002', courseId:'CRS002', amount:14999, method:'UPI', date:'2025-02-15', status:'Completed', receiptNo:'OCC-R-003' },
      { id:'PAY004', studentId:'STU002', courseId:'CRS004', amount:29999, method:'Net Banking', date:'2025-03-01', status:'Completed', receiptNo:'OCC-R-004' },
      { id:'PAY005', studentId:'STU004', courseId:'CRS001', amount:9999, method:'Card', date:'2025-03-25', status:'Completed', receiptNo:'OCC-R-005' },
      { id:'PAY006', studentId:'STU004', courseId:'CRS005', amount:1999, method:'UPI', date:'2025-04-01', status:'Completed', receiptNo:'OCC-R-006' },
      { id:'PAY007', studentId:'STU004', courseId:'CRS006', amount:1499, method:'UPI', date:'2025-04-10', status:'Completed', receiptNo:'OCC-R-007' }
    ],

    /* ── Contact Messages ── */
    contacts: [
      { id:'CON001', name:'Rajesh Kumar', email:'rajesh@example.com', phone:'9988776655', subject:'Course Inquiry', message:'I want to know more about the Guaranteed Job Program. What is the refund policy?', date:'2026-06-20', read:false },
      { id:'CON002', name:'Priti Singh', email:'priti@example.com', phone:'9988776656', subject:'Partnership', message:'We are a college in UP and want to collaborate for campus placements.', date:'2026-06-22', read:true },
      { id:'CON003', name:'Rajiv Kumar', email:'rajiv@xyz.com', phone:'9876543200', subject:'Corporate Hiring', message:'We are looking to hire 50 freshers in the AI/ML domain. Can you help us connect with your students?', date:'2026-06-28', read:false }
    ],

    /* ── Notifications ── */
    notifications: [
      { id:'NOT001', userId:'STU001', type:'class', title:'Live Class Tomorrow', message:'Aptitude Masterclass starts at 10 AM tomorrow. Join on time!', read:false, createdAt:'2026-07-09T18:00:00' },
      { id:'NOT002', userId:'STU001', type:'assignment', title:'Assignment Due Soon', message:'Mock Interview Recording is due in 3 days. Please submit on time.', read:false, createdAt:'2026-07-08T10:00:00' },
      { id:'NOT003', userId:'STU001', type:'job', title:'New Job Match', message:'TCS Software Developer Intern matches your profile! Apply now.', read:true, createdAt:'2026-07-07T12:00:00' }
    ],

    /* ── Settings ── */
    settings: {
      siteName: 'Offcampuscareer',
      tagline: 'Turning Learners into Earners',
      tagline2: 'Learn Together · Work Together · Grow Together',
      contactEmail: 'contact@offcampuscareer.com',
      phone: '+91-XXXXXXXXXX',
      address: 'Dayanatpur, Near Noida International Airport, Noida, U.P.',
      linkedin: 'https://www.linkedin.com/company/offcampuscareer/',
      linkedinVP: 'https://www.linkedin.com/in/vinaypremupadhyay/',
      instagram: '#',
      twitter: '#',
      youtube: '#',
      whatsapp: '#',
      totalStudents: 12500,
      totalMentors: 85,
      totalCompanies: 120,
      totalCourses: 45,
      placementRate: 95
    },

    /* ── Auth ── */
    adminCredentials: { email: 'admin@oc2.in', password: 'admin123' },
    session: null
  },

  /* ══════════════════════════════════════════════
     CORE METHODS
  ══════════════════════════════════════════════ */
  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      this.save(this._defaults);
    } else {
      // Version migration if needed
      try {
        const data = JSON.parse(stored);
        // Ensure new fields exist
        if (!data.mentors) { data.mentors = this._defaults.mentors; }
        if (!data.examCategories) { data.examCategories = this._defaults.examCategories; }
        if (!data.communityPosts) { data.communityPosts = this._defaults.communityPosts; }
        if (!data.corporates) { data.corporates = this._defaults.corporates; }
        if (!data.colleges) { data.colleges = this._defaults.colleges; }
        if (!data.notifications) { data.notifications = this._defaults.notifications; }
        this.save(data);
      } catch(e) {
        this.save(this._defaults);
      }
    }
    return this.getAll();
  },

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || this._defaults;
    } catch {
      return this._defaults;
    }
  },

  save(data) { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); },
  get(key) { return this.getAll()[key]; },
  set(key, value) { const data = this.getAll(); data[key] = value; this.save(data); },
  reset() { localStorage.removeItem(this.STORAGE_KEY); this.init(); },

  generateId(prefix) {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${Date.now().toString(36).toUpperCase()}${rand}`;
  },

  /* ── Course Methods ── */
  getCourses(publishedOnly = false, module = null) {
    let courses = this.get('courses') || [];
    if (publishedOnly) courses = courses.filter(c => c.published);
    if (module) courses = courses.filter(c => c.module === module);
    return courses;
  },
  getCourse(id) { return this.getCourses().find(c => c.id === id); },
  getFeaturedCourses() { return this.getCourses(true).filter(c => c.featured); },
  addCourse(course) { const courses = this.getCourses(); course.id = this.generateId('CRS'); courses.push(course); this.set('courses', courses); return course; },
  updateCourse(id, updates) { const courses = this.getCourses(); const idx = courses.findIndex(c => c.id === id); if (idx !== -1) { courses[idx] = { ...courses[idx], ...updates }; this.set('courses', courses); } return courses[idx]; },
  deleteCourse(id) { this.set('courses', this.getCourses().filter(c => c.id !== id)); },

  /* ── Mentor Methods ── */
  getMentors(active = false) { let m = this.get('mentors') || []; return active ? m.filter(x => x.active) : m; },
  getMentor(id) { return this.getMentors().find(m => m.id === id); },
  addMentor(mentor) { const mentors = this.getMentors(); mentor.id = this.generateId('MENT'); mentors.push(mentor); this.set('mentors', mentors); return mentor; },

  /* ── Exam Methods ── */
  getExamCategories() { return this.get('examCategories') || []; },
  getExamCategory(id) { return this.getExamCategories().find(e => e.id === id); },

  /* ── Student Methods ── */
  getStudents() { return this.get('students') || []; },
  getStudent(id) { return this.getStudents().find(s => s.id === id); },
  getStudentByEmail(email) { return this.getStudents().find(s => s.email === email); },
  addStudent(student) {
    const students = this.getStudents();
    student.id = this.generateId('STU');
    student.avatar = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    student.enrolledCourses = [];
    student.appliedJobs = [];
    student.communityPosts = [];
    student.mentorSessions = [];
    student.joinedAt = new Date().toISOString().split('T')[0];
    student.profileComplete = 50;
    students.push(student);
    this.set('students', students);
    return student;
  },
  updateStudent(id, updates) {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === id);
    if (idx !== -1) { students[idx] = { ...students[idx], ...updates }; this.set('students', students); }
    return students[idx];
  },
  deleteStudent(id) { this.set('students', this.getStudents().filter(s => s.id !== id)); },

  /* ── Enrollment Methods ── */
  getEnrollments() { return this.get('enrollments') || []; },
  getStudentEnrollments(studentId) { return this.getEnrollments().filter(e => e.studentId === studentId); },
  enrollStudent(studentId, courseId) {
    const enrollments = this.getEnrollments();
    const existing = enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
    if (existing) return existing;
    const enrollment = { id: this.generateId('ENR'), studentId, courseId, progress: 0, startDate: new Date().toISOString().split('T')[0], completedModules: [], certificateIssued: false };
    enrollments.push(enrollment);
    this.set('enrollments', enrollments);
    const student = this.getStudent(studentId);
    if (student && !student.enrolledCourses.includes(courseId)) {
      student.enrolledCourses.push(courseId);
      this.updateStudent(studentId, { enrolledCourses: student.enrolledCourses });
    }
    return enrollment;
  },

  /* ── Payment Methods ── */
  getPayments() { return this.get('payments') || []; },
  getStudentPayments(studentId) { return this.getPayments().filter(p => p.studentId === studentId); },
  addPayment(payment) {
    const payments = this.getPayments();
    payment.id = this.generateId('PAY');
    payment.receiptNo = 'OCC-R-' + (payments.length + 1).toString().padStart(3, '0');
    payment.date = new Date().toISOString().split('T')[0];
    payment.status = 'Completed';
    payments.push(payment);
    this.set('payments', payments);
    return payment;
  },

  /* ── Class Methods ── */
  getClasses() { return this.get('classes') || []; },
  getCourseClasses(courseId) { return this.getClasses().filter(c => c.courseId === courseId); },
  addClass(cls) { const classes = this.getClasses(); cls.id = this.generateId('CLS'); cls.attendees = []; classes.push(cls); this.set('classes', classes); return cls; },

  /* ── Assignment Methods ── */
  getAssignments() { return this.get('assignments') || []; },
  getCourseAssignments(courseId) { return this.getAssignments().filter(a => a.courseId === courseId); },
  addAssignment(assignment) { const assignments = this.getAssignments(); assignment.id = this.generateId('ASG'); assignment.submissions = []; assignments.push(assignment); this.set('assignments', assignments); return assignment; },
  submitAssignment(assignmentId, studentId, fileName) {
    const assignments = this.getAssignments();
    const asg = assignments.find(a => a.id === assignmentId);
    if (asg) { asg.submissions.push({ studentId, submittedAt: new Date().toISOString().split('T')[0], fileName, grade: null }); this.set('assignments', assignments); }
    return asg;
  },

  /* ── Job Methods ── */
  getJobs() { return this.get('jobs') || []; },
  getJob(id) { return this.getJobs().find(j => j.id === id); },
  addJob(job) { const jobs = this.getJobs(); job.id = this.generateId('JOB'); job.applications = []; job.postedAt = new Date().toISOString().split('T')[0]; jobs.push(job); this.set('jobs', jobs); return job; },
  updateJob(id, updates) { const jobs = this.getJobs(); const idx = jobs.findIndex(j => j.id === id); if (idx !== -1) { jobs[idx] = { ...jobs[idx], ...updates }; this.set('jobs', jobs); } },
  deleteJob(id) { this.set('jobs', this.getJobs().filter(j => j.id !== id)); },
  applyToJob(jobId, application) {
    const jobs = this.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      application.id = this.generateId('APP');
      application.appliedAt = new Date().toISOString().split('T')[0];
      application.status = 'Under Review';
      job.applications.push(application);
      this.set('jobs', jobs);
      // Track on student
      const student = this.getStudent(application.studentId);
      if (student && !student.appliedJobs) student.appliedJobs = [];
      if (student) {
        student.appliedJobs.push({ jobId, applicationId: application.id, status:'Under Review', appliedAt: application.appliedAt });
        this.updateStudent(application.studentId, { appliedJobs: student.appliedJobs });
      }
    }
    return job;
  },
  getStudentApplications(studentId) {
    const student = this.getStudent(studentId);
    return student ? (student.appliedJobs || []) : [];
  },

  /* ── Community Methods ── */
  getCommunityPosts() { return this.get('communityPosts') || []; },
  addCommunityPost(post) {
    const posts = this.getCommunityPosts();
    post.id = this.generateId('POST');
    post.likes = 0; post.comments = 0; post.views = 0;
    post.postedAt = new Date().toISOString();
    post.pinned = false;
    posts.unshift(post);
    this.set('communityPosts', posts);
    return post;
  },
  likePost(postId, userId) {
    const posts = this.getCommunityPosts();
    const post = posts.find(p => p.id === postId);
    if (post) { post.likes = (post.likes || 0) + 1; this.set('communityPosts', posts); }
    return post;
  },

  /* ── Corporate Methods ── */
  getCorporates() { return this.get('corporates') || []; },
  addCorporate(corp) { const corps = this.getCorporates(); corp.id = this.generateId('CORP'); corps.push(corp); this.set('corporates', corps); return corp; },

  /* ── College Methods ── */
  getColleges() { return this.get('colleges') || []; },

  /* ── Contact Methods ── */
  getContacts() { return this.get('contacts') || []; },
  addContact(contact) {
    const contacts = this.getContacts();
    contact.id = this.generateId('CON');
    contact.date = new Date().toISOString().split('T')[0];
    contact.read = false;
    contacts.push(contact);
    this.set('contacts', contacts);
    return contact;
  },

  /* ── Notification Methods ── */
  getNotifications(userId) {
    const notifs = this.get('notifications') || [];
    return userId ? notifs.filter(n => n.userId === userId) : notifs;
  },
  getUnreadCount(userId) {
    return this.getNotifications(userId).filter(n => !n.read).length;
  },
  markNotifRead(notifId) {
    const notifs = this.get('notifications') || [];
    const n = notifs.find(x => x.id === notifId);
    if (n) { n.read = true; this.set('notifications', notifs); }
  },

  /* ── Session Methods ── */
  setSession(type, userId) { this.set('session', { type, userId, loginAt: new Date().toISOString() }); },
  getSession() { return this.get('session'); },
  clearSession() { this.set('session', null); },
  isLoggedIn(type) { const session = this.getSession(); return session && session.type === type; },

  /* ── Checkout & Integration ── */
  checkout(data) {
    const { name, email, phone, college, year, courseId, amount, method } = data;
    
    // Find or create student
    let student = this.getStudentByEmail(email);
    if (!student) {
      student = this.addStudent({
        name,
        email,
        password: 'demo123',
        phone: phone || '',
        college: college || '',
        year: year || '1st Year'
      });
    }
    const studentId = student.id;
    
    // Enroll in course
    this.enrollStudent(studentId, courseId);
    
    // Add payment record
    const payment = this.addPayment({
      studentId,
      courseId,
      amount: parseFloat(amount) || 0,
      method: method || 'UPI'
    });
    
    // Log the student in
    this.setSession('student', studentId);
    
    return {
      success: true,
      student: {
        id: studentId,
        name: student.name,
        email: student.email
      },
      payment: {
        receiptNo: payment.receiptNo,
        amount: payment.amount,
        method: payment.method,
        date: payment.date
      }
    };
  },

  updateApplicationStatus(jobId, studentId, status) {
    // 1. Update on Job Applications
    const jobs = this.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (job && job.applications) {
      const app = job.applications.find(a => a.studentId === studentId);
      if (app) {
        app.status = status;
        this.set('jobs', jobs);
      }
    }
    
    // 2. Update on Student Profile (if not guest)
    if (studentId && !studentId.startsWith('GUEST_')) {
      const students = this.getStudents();
      const student = students.find(s => s.id === studentId);
      if (student && student.appliedJobs) {
        const aj = student.appliedJobs.find(x => x.jobId === jobId);
        if (aj) {
          aj.status = status;
          this.set('students', students);
        }
      }
    }
  },

  bookMentorSession(mentorId, bookingData) {
    const mentor = this.getMentor(mentorId);
    if (!mentor) return null;
    
    const session = {
      id: this.generateId('CLS'),
      courseId: mentor.courses && mentor.courses.length ? mentor.courses[0] : 'CRS001',
      title: `1:1 Session: ${bookingData.topic}`,
      date: new Date().toISOString().split('T')[0],
      time: bookingData.time,
      instructor: mentor.name,
      instructorId: mentor.id,
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      platform: 'Google Meet',
      attendees: [bookingData.studentId || 'STU001']
    };
    
    // Save to classes
    const classes = this.getClasses();
    classes.push(session);
    this.set('classes', classes);
    
    // Save to student mentorSessions
    const studentId = bookingData.studentId;
    if (studentId && !studentId.startsWith('GUEST_')) {
      const student = this.getStudent(studentId);
      if (student) {
        if (!student.mentorSessions) student.mentorSessions = [];
        student.mentorSessions.push({
          id: session.id,
          mentorName: mentor.name,
          mentorTitle: mentor.title,
          topic: bookingData.topic,
          time: bookingData.time,
          date: session.date,
          status: 'Scheduled',
          meetingLink: session.meetingLink
        });
        this.updateStudent(studentId, { mentorSessions: student.mentorSessions });
      }
    }
    return session;
  },

  /* ── Analytics ── */
  getTotalRevenue() { return this.getPayments().filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0); },
  getActiveStudentsCount() { return this.getStudents().length; },
  getPublishedCoursesCount() { return this.getCourses(true).length; },
  getSettings() { return this.get('settings') || this._defaults.settings; },
  getPlacementRate() { return 95; }
};

// Initialize on load
AppState.init();
