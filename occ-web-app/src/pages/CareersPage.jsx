import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

export default function CareersPage() {
  const { AppState, ApiClient, session, currentUser, refreshSession } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('All');
  const [typeSearch, setTypeSearch] = useState('All');

  // Side Filters state
  const [filterDomain, setFilterDomain] = useState('All');
  const [filterMode, setFilterMode] = useState('All');
  const [filterExperience, setFilterExperience] = useState('All');
  const [filterType, setFilterType] = useState('All'); // top-right pills

  // Modals state
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    company: '',
    role: '',
    type: 'Job',
    domain: 'Web Dev',
    location: '',
    stipend: '',
    skills: '',
    description: ''
  });

  // Apply Form State (for Guests)
  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    resume: '',
    cover: ''
  });

  const { search: urlSearch } = useLocation();

  const loadJobs = async () => {
    try {
      const list = await ApiClient.getJobsList();
      if (list && Array.isArray(list)) {
        setJobs(list);
      } else {
        // Fallback
        setJobs(AppState.getJobs());
      }
    } catch (e) {
      console.warn("Backend jobs list fetch failed, falling back to Local AppState data.");
      setJobs(AppState.getJobs());
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Listen to ?post=true in URL to open post job modal
  useEffect(() => {
    const params = new URLSearchParams(urlSearch);
    if (params.get('post') === 'true') {
      setShowPostModal(true);
    }
  }, [urlSearch]);

  // Handle post job submission
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.company || !newJob.role || !newJob.location || !newJob.stipend || !newJob.skills || !newJob.description) {
      if (window.OC2 && window.OC2.Toast) {
        window.OC2.Toast.error('Please fill in all required fields.');
      }
      return;
    }

    try {
      const res = await ApiClient.postJob({
        company: newJob.company,
        role: newJob.role,
        type: newJob.type,
        domain: newJob.domain,
        location: newJob.location,
        stipend: newJob.stipend,
        skills: newJob.skills,
        description: newJob.description
      });

      if (res && res.success) {
        if (window.OC2 && window.OC2.Toast) {
          window.OC2.Toast.success(`Job Opening "${newJob.role}" at ${newJob.company} posted successfully!`);
        }
        if (window.OC2 && window.OC2.Confetti) {
          window.OC2.Confetti.burst();
        }
        
        // Reset form and refresh
        setNewJob({
          company: '',
          role: '',
          type: 'Job',
          domain: 'Web Dev',
          location: '',
          stipend: '',
          skills: '',
          description: ''
        });
        setShowPostModal(false);
        loadJobs();
      }
    } catch (err) {
      console.warn("Backend job post failed, falling back to Local AppState simulation.");
      
      const skillsArr = newJob.skills.split(',').map(s => s.trim()).filter(Boolean);
      AppState.addJob({
        company: newJob.company,
        companyLogo: newJob.company[0].toUpperCase(),
        role: newJob.role,
        type: newJob.type,
        domain: newJob.domain,
        location: newJob.location,
        mode: 'Remote',
        stipend: newJob.stipend,
        skills: skillsArr,
        experience: 'Fresher',
        description: newJob.description,
        aboutCompany: `${newJob.company} is hiring.`,
        perks: ['Certificate', 'Mentorship'],
        process: ['Interview'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Active'
      });
      
      if (window.OC2 && window.OC2.Toast) {
        window.OC2.Toast.success(`Job Opening posted locally (offline fallback mode).`);
      }
      setShowPostModal(false);
      loadJobs();
    }
  };

  // Handle Application Submit
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    let resumeFile = '';

    if (session && currentUser && session.type === 'student') {
      resumeFile = 'https://tip.offcampuscareer.com/resumes/' + currentUser.id;
    } else {
      if (!applyForm.name || !applyForm.email || !applyForm.college || !applyForm.resume) {
        if (window.OC2 && window.OC2.Toast) {
          window.OC2.Toast.error('Please fill in all required fields.');
        }
        return;
      }
      resumeFile = applyForm.resume;
    }

    try {
      const res = await ApiClient.applyToJob(selectedJob.id, resumeFile);
      if (res && res.success) {
        if (window.OC2 && window.OC2.Toast) {
          window.OC2.Toast.success(`Successfully applied! Match score: ${res.screening?.matchScore || 75}%`);
        }
        if (window.OC2 && window.OC2.Confetti) {
          window.OC2.Confetti.burst();
        }
        setShowApplyModal(false);
        setSelectedJob(null);
        loadJobs();
      }
    } catch (err) {
      console.warn("Backend apply failed, falling back to Local AppState simulation.");
      
      let application = {
        studentId: session && currentUser ? currentUser.id : 'GUEST_' + Date.now().toString(36).toUpperCase(),
        name: session && currentUser ? currentUser.name : applyForm.name,
        email: session && currentUser ? currentUser.email : applyForm.email,
        phone: session && currentUser ? currentUser.phone : applyForm.phone,
        college: session && currentUser ? currentUser.college : applyForm.college,
        resume: resumeFile,
        cover: applyForm.cover || ''
      };
      
      AppState.applyToJob(selectedJob.id, application);
      if (window.OC2 && window.OC2.Toast) {
        window.OC2.Toast.success(`Successfully applied locally (offline fallback mode).`);
      }
      setShowApplyModal(false);
      setSelectedJob(null);
      loadJobs();
    }

    // Reset guest forms
    setApplyForm({
      name: '',
      email: '',
      phone: '',
      college: '',
      resume: '',
      cover: ''
    });
  };

  const openApplyFlow = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const openDetailsFlow = (job) => {
    setSelectedJob(job);
  };

  // Filter Logic
  const filteredJobs = jobs.filter(j => {
    const matchesSearch =
      search === '' ||
      j.role.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      (j.skills && j.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));

    const matchesLocation =
      locationSearch === 'All' ||
      j.location.toLowerCase().includes(locationSearch.toLowerCase());

    const matchesTypeSearch =
      typeSearch === 'All' ||
      j.type === typeSearch;

    const matchesTypePill =
      filterType === 'All' ||
      j.type === filterType;

    const matchesDomain =
      filterDomain === 'All' ||
      j.domain === filterDomain;

    const matchesMode =
      filterMode === 'All' ||
      (j.mode && j.mode === filterMode) ||
      (j.location && j.location.toLowerCase().includes(filterMode.toLowerCase()));

    const matchesExperience =
      filterExperience === 'All' ||
      (j.experience && j.experience.toLowerCase().includes(filterExperience.toLowerCase())) ||
      (filterExperience === 'Fresher' && j.experience && j.experience.toLowerCase().includes('fresher'));

    return matchesSearch && matchesLocation && matchesTypeSearch && matchesTypePill && matchesDomain && matchesMode && matchesExperience;
  });

  // Extract unique locations from jobs list for location dropdown
  const uniqueLocations = Array.from(new Set(jobs.map(j => j.location).filter(Boolean)));

  const handleClearFilters = () => {
    setSearch('');
    setLocationSearch('All');
    setTypeSearch('All');
    setFilterDomain('All');
    setFilterMode('All');
    setFilterExperience('All');
    setFilterType('All');
  };

  return (
    <div className="public-page occ-jobs-page" style={{ background: '#F8F9FD', minHeight: '100vh', color: '#1E1B4B' }}>
      
      {/* Dynamic Styled Components to override main stylesheet and match layout pixel perfect */}
      <style dangerouslySetInnerHTML={{__html: `
        .occ-jobs-page input, .occ-jobs-page select, .occ-jobs-page textarea {
          border: 1px solid #E2E8F0 !important;
          background: #FFFFFF !important;
          color: #1E1B4B !important;
          font-weight: 500;
        }
        .occ-jobs-page input:focus, .occ-jobs-page select:focus {
          border-color: #9B5FD0 !important;
          box-shadow: 0 0 0 2px rgba(155, 95, 208, 0.15) !important;
        }
        .search-container {
          background: #FFFFFF;
          border-radius: 9999px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border: 1px solid #F1F5F9;
          max-width: 900px;
          margin: 32px auto 0 auto;
        }
        .search-divider {
          width: 1px;
          height: 28px;
          background-color: #E2E8F0;
        }
        .search-field {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        .search-field input, .search-field select {
          border: none !important;
          padding: 8px 4px !important;
          font-size: 0.95rem;
          width: 100%;
        }
        .search-btn {
          background: #D97706;
          background: linear-gradient(135deg, #D97706 0%, #EA580C 100%);
          color: #FFFFFF;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .search-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }
        .metrics-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 48px auto 0 auto;
          padding: 0 16px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .metrics-left {
          display: flex;
          gap: 32px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #64748B;
        }
        .metrics-left span {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-pills {
          display: flex;
          gap: 12px;
        }
        .filter-pill {
          background: #F1F5F9;
          color: #475569;
          font-weight: 600;
          padding: 6px 20px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 0.88rem;
          transition: all 0.2s;
        }
        .filter-pill.active {
          background: #6366F1;
          color: #FFFFFF;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
        }
        .main-grid {
          display: flex;
          max-width: 1200px;
          margin: 32px auto 64px auto;
          padding: 0 16px;
          gap: 32px;
        }
        .filter-sidebar {
          width: 280px;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #E2E8F0;
          height: fit-content;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-weight: 700;
          font-size: 1.15rem;
        }
        .clear-link {
          font-size: 0.85rem;
          color: #6366F1;
          font-weight: 600;
          cursor: pointer;
        }
        .filter-group {
          margin-bottom: 20px;
        }
        .filter-group label {
          display: block;
          font-size: 0.88rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 8px;
        }
        .filter-group select {
          width: 100%;
          padding: 10px 12px !important;
          border-radius: 8px !important;
          font-size: 0.9rem;
        }
        .jobs-container {
          flex: 1;
        }
        .results-count {
          font-size: 0.9rem;
          color: #64748B;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .job-card-occ {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          padding: 24px;
          margin-bottom: 20px;
          transition: all 0.25s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }
        .job-card-occ:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .job-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }
        .company-logo-square {
          width: 48px;
          height: 48px;
          background: #F1F5F9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.3rem;
          color: #1E1B4B;
          border: 1px solid #E2E8F0;
        }
        .badge-internship {
          background: #E6FBF3;
          color: #059669;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 4px 12px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .status-dot {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #64748B;
          font-weight: 600;
        }
        .status-circle {
          width: 8px;
          height: 8px;
          background-color: #10B981;
          border-radius: 50%;
        }
        .job-card-meta {
          display: flex;
          gap: 20px;
          color: #64748B;
          font-size: 0.88rem;
          font-weight: 500;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .job-card-meta span {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .job-card-desc {
          color: #475569;
          font-size: 0.92rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .skill-tag-occ {
          background: transparent;
          border: 1px solid #E2E8F0;
          color: #475569;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 4px 12px;
          border-radius: 9999px;
          text-transform: uppercase;
        }
        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #F1F5F9;
          margin-top: 16px;
        }
        .stipend-amount {
          font-size: 1.15rem;
          font-weight: 800;
          color: #059669;
        }
        .deadline-text {
          font-size: 0.78rem;
          color: #64748B;
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .details-link {
          font-size: 0.9rem;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          transition: color 0.2s;
        }
        .details-link:hover {
          color: #1E1B4B;
        }
        .apply-btn-occ {
          background: #EA580C;
          background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%);
          color: #FFFFFF;
          font-weight: 700;
          padding: 8px 20px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }
        .apply-btn-occ:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }
        .modal-overlay {
          background: rgba(8, 8, 26, 0.6) !important;
          backdrop-filter: blur(4px) !important;
        }
        .modal {
          background: #FFFFFF !important;
          color: #1E1B4B !important;
          border: 1px solid #E2E8F0 !important;
          border-radius: 20px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        .modal-header h3, .modal-header h2 {
          color: #1E1B4B !important;
          font-weight: 800;
        }
        .modal-close {
          color: #64748B !important;
          background: #F1F5F9 !important;
          border-radius: 50% !important;
        }
        .hero-badge-jobs {
          background: #FEF3C7;
          border: 1px solid #FCD34D;
          color: #D97706;
          font-weight: 700;
          font-size: 0.78rem;
          padding: 6px 16px;
          border-radius: 9999px;
          display: inline-block;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}} />

      {/* Hero Section */}
      <section className="page-hero" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 70%)', padding: '64px 0 32px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="hero-badge-jobs">// OCC JOBS</div>
          <h1 className="hero-title" style={{ marginTop: '0', fontSize: '3rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Find Your <span style={{ color: '#F59E0B' }}>Dream Job</span> or Internship
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: '680px', margin: '16px auto 0 auto', color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
            From TCS to Google, from internships to senior roles — browse 500+ active opportunities from 120+ companies, tailored for Indian freshers and professionals.
          </p>

          {/* Screenshot Search Bar Layout */}
          <div className="search-container">
            <div className="search-field">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search by role, company, or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="search-divider"></div>
            <div className="search-field" style={{ flex: '0.8' }}>
              <span>📍</span>
              <select
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              >
                <option value="All">Any Location</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="search-divider"></div>
            <div className="search-field" style={{ flex: '0.8' }}>
              <span>💼</span>
              <select
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Job">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <button className="search-btn" onClick={loadJobs}>Search Jobs</button>
          </div>
        </div>
      </section>

      {/* Metrics & Main Listing Section */}
      <div className="metrics-banner">
        <div className="metrics-left">
          <span>💼 <strong>{jobs.length}</strong> Active Jobs</span>
          <span>🏢 <strong>120+</strong> Companies</span>
          <span>✅ <strong>2,800+</strong> Placed</span>
        </div>
        
        <div className="filter-pills">
          {['All', 'Full Time', 'Internship', 'Freelance'].map(pill => (
            <button
              key={pill}
              onClick={() => setFilterType(pill === 'Full Time' ? 'Job' : pill)}
              className={`filter-pill ${((filterType === 'Job' && pill === 'Full Time') || filterType === pill) ? 'active' : ''}`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      <div className="main-grid">
        
        {/* Left Column - Sidebar Filters */}
        <aside className="filter-sidebar">
          <div className="sidebar-header">
            <span>🔧 Filters</span>
            <span className="clear-link" onClick={handleClearFilters}>Clear All</span>
          </div>

          <div className="filter-group">
            <label>Domain</label>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
            >
              <option value="All">All Domains</option>
              <option value="Web Dev">Web Dev</option>
              <option value="AI/ML">AI / ML</option>
              <option value="Data Science">Data Science</option>
              <option value="Cloud">Cloud</option>
              <option value="Product Management">Product Management</option>
              <option value="Design">Design</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Work Mode</label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
            >
              <option value="All">Any Mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Experience</label>
            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
            >
              <option value="All">Any Level</option>
              <option value="Fresher">Fresher</option>
              <option value="0-2 years">0-2 years</option>
              <option value="2-5 years">2-5 years</option>
            </select>
          </div>
        </aside>

        {/* Right Column - Job Cards Listing */}
        <section className="jobs-container">
          <div className="results-count">
            Showing {filteredJobs.length} jobs
          </div>

          <div className="jobs-list-occ">
            {filteredJobs.length === 0 ? (
              <div className="job-card-occ text-center" style={{ padding: '64px', textAlign: 'center' }}>
                <p style={{ color: '#64748B', fontSize: '1.05rem', fontWeight: 600 }}>No active jobs match your search or filter preferences.</p>
                <button
                  className="filter-pill"
                  style={{ marginTop: '16px', background: '#6366F1', color: '#FFFFFF' }}
                  onClick={handleClearFilters}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div className="job-card-occ" key={job.id}>
                  
                  {/* First Row */}
                  <div className="job-card-header">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div className="company-logo-square">
                        {job.companyLogo || (job.company && job.company[0].toUpperCase()) || 'C'}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>{job.role}</h3>
                        <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 500, margin: '2px 0 0 0' }}>
                          {job.company}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span className="badge-internship">
                        🎓 {job.type === 'Job' ? 'Full Time' : job.type}
                      </span>
                      <span className="status-dot">
                        <span className="status-circle"></span> Active
                      </span>
                    </div>
                  </div>

                  {/* Second Row - Meta Icons */}
                  <div className="job-card-meta">
                    <span>📍 {job.location || 'Remote'}</span>
                    <span>🔄 {job.mode || 'Remote'}</span>
                    <span>👤 {job.experience || 'Fresher'}</span>
                    <span>🏛️ {job.domain}</span>
                  </div>

                  {/* Third Row - Description */}
                  <p className="job-card-desc">
                    {job.description && job.description.length > 220 ? job.description.substring(0, 220) + '...' : job.description}
                  </p>

                  {/* Fourth Row - Skills Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {job.skills && (Array.isArray(job.skills) ? job.skills : JSON.parse(job.skills || '[]')).map((skill, index) => (
                      <span key={index} className="skill-tag-occ">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Fifth Row - Footer Divider */}
                  <div className="job-card-footer">
                    <div>
                      <div className="stipend-amount">{job.stipend}</div>
                      <div className="deadline-text">
                        📅 Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '31 Jul 2026'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span className="details-link" onClick={() => openDetailsFlow(job)}>Details</span>
                      <button className="apply-btn-occ" onClick={() => openApplyFlow(job)}>
                        Apply Now &rarr;
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </section>

      </div>

      {/* --- PUBLIC POST JOB MODAL --- */}
      {showPostModal && (
        <div className="modal-overlay active visible" onClick={() => setShowPostModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <button className="modal-close" onClick={() => setShowPostModal(false)}>✕</button>
            <div className="modal-header" style={{ marginBottom: '24px' }}>
              <h3>Post a New Job Opening</h3>
              <p style={{ color: '#64748B', marginTop: '4px', fontSize: '0.9rem' }}>Fill out the details below. Opportunities will instantly list live in the database.</p>
            </div>

            <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid grid-2 gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCS"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Developer Intern"
                    value={newJob.role}
                    onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div className="grid grid-3 gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Job Type *</label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  >
                    <option value="Job">Full Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Domain *</label>
                  <select
                    value={newJob.domain}
                    onChange={(e) => setNewJob({ ...newJob, domain: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  >
                    <option value="Web Dev">Web Dev</option>
                    <option value="AI/ML">AI / ML</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Location (City) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai / Hybrid"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Salary / Stipend Info *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹15,000/month or 8 LPA"
                    value={newJob.stipend}
                    onChange={(e) => setNewJob({ ...newJob, stipend: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Required Skills * (Comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="React, Node.js, JavaScript"
                    value={newJob.skills}
                    onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Job Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain requirements, responsibilities, and eligibility..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="search-btn" style={{ marginTop: '12px', width: '100%', padding: '14px' }}>
                🚀 Publish Job Opening Live
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- JOB DETAIL VIEW MODAL --- */}
      {selectedJob && !showApplyModal && (
        <div className="modal-overlay active visible" onClick={() => setSelectedJob(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <button className="modal-close" onClick={() => setSelectedJob(null)}>✕</button>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="company-logo-square">
                  {selectedJob.companyLogo || (selectedJob.company && selectedJob.company[0].toUpperCase())}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{selectedJob.role}</h2>
                  <p style={{ color: '#64748B', fontWeight: 500, margin: '2px 0 0 0' }}>{selectedJob.company} · 📍 {selectedJob.location}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <span className="badge-internship">
                  🎓 {selectedJob.type}
                </span>
                <span className="skill-tag-occ">{selectedJob.mode || 'Remote'}</span>
                <span className="skill-tag-occ">{selectedJob.domain}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#F8F9FA', padding: '16px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', border: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Stipend/Salary</span>
                  <div style={{ fontWeight: '800', color: '#059669', fontSize: '1.05rem', marginTop: '2px' }}>{selectedJob.stipend}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Experience Required</span>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', marginTop: '2px' }}>{selectedJob.experience || 'Fresher'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Closing Date</span>
                  <div style={{ fontWeight: '800', color: '#EF4444', fontSize: '1.05rem', marginTop: '2px' }}>{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : '31 Jul 2026'}</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>Job Description</h4>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>Required Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(Array.isArray(selectedJob.skills) ? selectedJob.skills : JSON.parse(selectedJob.skills || '[]')).map((skill, index) => (
                    <span key={index} className="skill-tag-occ">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <button className="filter-pill" style={{ background: '#F1F5F9' }} onClick={() => setSelectedJob(null)}>Close</button>
                <button className="apply-btn-occ" onClick={() => openApplyFlow(selectedJob)}>Apply Now &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- JOB APPLY FORM MODAL --- */}
      {showApplyModal && selectedJob && (
        <div className="modal-overlay active visible" onClick={() => { setShowApplyModal(false); setSelectedJob(null); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => { setShowApplyModal(false); setSelectedJob(null); }}>✕</button>
            <div className="modal-header" style={{ marginBottom: '24px' }}>
              <h3>Apply for {selectedJob.role}</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '2px' }}>Hiring Company: {selectedJob.company}</p>
            </div>

            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {session && currentUser && session.type === 'student' ? (
                <div style={{ background: '#EEF2FF', padding: '20px', borderRadius: '12px', border: '1px solid #C7D2FE' }}>
                  <p style={{ fontSize: '0.9rem', color: '#4338CA', fontWeight: 600 }}>Active Student Session Detected:</p>
                  <div style={{ fontWeight: '800', fontSize: '1.15rem', marginTop: '8px', color: '#1E1B4B' }}>{currentUser.name}</div>
                  <div style={{ color: '#475569', fontSize: '0.88rem', marginTop: '2px' }}>{currentUser.email}</div>
                  <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '6px' }}>
                    🎓 {currentUser.college}
                  </div>
                  <div style={{ marginTop: '16px', padding: '8px 12px', background: '#DEF7EC', borderRadius: '8px', color: '#03543F', fontSize: '0.82rem', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
                    ✅ Profile credentials and resume will be submitted automatically.
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ padding: '10px 16px', background: '#F5F3FF', borderRadius: '8px', fontSize: '0.85rem', color: '#6D28D9', fontWeight: 600 }}>
                    💡 Applying as Guest. Log in to fill details automatically.
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>College Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NIT Trichy"
                      value={applyForm.college}
                      onChange={(e) => setApplyForm({ ...applyForm, college: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', color: '#475569' }}>Resume Drive / Portfolio Link *</label>
                    <input
                      type="url"
                      required
                      placeholder="e.g. https://drive.google.com/..."
                      value={applyForm.resume}
                      onChange={(e) => setApplyForm({ ...applyForm, resume: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                    />
                  </div>
                </>
              )}

              <button type="submit" className="search-btn" style={{ marginTop: '12px', width: '100%', padding: '14px' }}>
                🚀 Submit Job Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}