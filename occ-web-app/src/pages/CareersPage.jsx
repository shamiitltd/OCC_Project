import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CareersPage() {
    const { AppState } = useAppContext();
    const [jobs, setJobs] = useState([]);
    
    // Filters state
    const [search, setSearch] = useState('');
    const [domain, setDomain] = useState('');
    const [type, setType] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [experience, setExperience] = useState('');

    // Modal state
    const [activeJobDetails, setActiveJobDetails] = useState(null);
    const [applyingJob, setApplyingJob] = useState(null);

    // Apply Form fields
    const [applyName, setApplyName] = useState('');
    const [applyEmail, setApplyEmail] = useState('');
    const [applyPhone, setApplyPhone] = useState('');
    const [applyCollege, setApplyCollege] = useState('');
    const [applyResume, setApplyResume] = useState('');
    const [applyCover, setApplyCover] = useState('');

    useEffect(() => {
        setJobs(AppState.getJobs());
    }, [AppState]);

    const handleApplySubmit = (e) => {
        e.preventDefault();
        if (!applyingJob) return;

        const application = {
            name: applyName,
            email: applyEmail,
            phone: applyPhone,
            college: applyCollege,
            resume: applyResume,
            coverLetter: applyCover
        };

        const result = AppState.applyForJob(applyingJob.id, application);
        if (result) {
            alert(`Application for ${applyingJob.role} at ${applyingJob.company} submitted successfully!`);
        } else {
            alert('Failed to submit application. Please try again.');
        }

        // Reset fields and close
        setApplyName('');
        setApplyEmail('');
        setApplyPhone('');
        setApplyCollege('');
        setApplyResume('');
        setApplyCover('');
        setApplyingJob(null);
    };

    // Filter jobs
    const filteredJobs = jobs.filter(j => {
        const matchesSearch = j.role.toLowerCase().includes(search.toLowerCase()) ||
            j.company.toLowerCase().includes(search.toLowerCase()) ||
            j.description.toLowerCase().includes(search.toLowerCase());

        const matchesDomain = domain === '' || j.domain === domain;
        const matchesType = type === '' || j.type === type;
        const matchesLoc = locationFilter === '' || j.location.toLowerCase().includes(locationFilter.toLowerCase()) || j.mode.toLowerCase().includes(locationFilter.toLowerCase());
        
        let matchesExp = true;
        if (experience === 'fresher') {
            matchesExp = j.experience.toLowerCase().includes('0') || j.experience.toLowerCase().includes('fresher');
        } else if (experience === '1-3') {
            matchesExp = j.experience.toLowerCase().includes('1') || j.experience.toLowerCase().includes('2') || j.experience.toLowerCase().includes('3');
        } else if (experience === '3+') {
            matchesExp = !j.experience.toLowerCase().includes('0') && !j.experience.toLowerCase().includes('1') && !j.experience.toLowerCase().includes('2');
        }

        return matchesSearch && matchesDomain && matchesType && matchesLoc && matchesExp;
    });

    const activeCount = jobs.filter(j => j.status === 'Active').length;

    const getTypeColor = (jobType) => {
        if (jobType === 'Internship') return 'badge-exams';
        if (jobType === 'Job') return 'badge-primary';
        return 'badge-mentor';
    };

    return (
        <div className="careerspage-wrapper">
            {/* HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label jobs">// OCC Jobs</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}>Find Your Dream <span className="text-gradient-jobs">Career Opportunity</span></h1>
                    <p>Connecting freshers and professionals with top startups and MNCs in India. Real jobs, real interviews.</p>
                    {/* Stats */}
                    <div className="flex gap-xl justify-center flex-wrap" style={{ marginTop: 'var(--space-2xl)' }}>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-jobs)' }}>{activeCount}</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Active Postings</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-jobs)' }}>120+</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Hiring Partners</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-jobs)' }}>₹12 LPA</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Highest Package</div></div>
                    </div>
                </div>
            </section>

            {/* JOBS SECTION */}
            <section className="section" id="jobs-section">
                <div className="container">
                    <div className="grid grid-sidebar gap-2xl">
                        {/* Sidebar Filters */}
                        <div className="sidebar" style={{ position: 'sticky', top: '90px', alignSelf: 'start' }}>
                            <div className="card-glass" style={{ padding: 'var(--space-lg)' }}>
                                <h3 style={{ marginBottom: 'var(--space-md)' }}>Filter Jobs</h3>
                                
                                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                    <label className="form-label">Search</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Job title, company..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                    <label className="form-label">Domain</label>
                                    <select
                                        className="form-select"
                                        style={{ width: '100%' }}
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                    >
                                        <option value="">All Domains</option>
                                        <option value="Software">Software</option>
                                        <option value="AI/ML">AI/ML</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Design">Design</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                    <label className="form-label">Job Type</label>
                                    <select
                                        className="form-select"
                                        style={{ width: '100%' }}
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="Job">Full-time Job</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                    <label className="form-label">Location / Mode</label>
                                    <select
                                        className="form-select"
                                        style={{ width: '100%' }}
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                    >
                                        <option value="">All Locations</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Noida">Noida</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                                    <label className="form-label">Experience</label>
                                    <select
                                        className="form-select"
                                        style={{ width: '100%' }}
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                    >
                                        <option value="">Any Experience</option>
                                        <option value="fresher">Fresher (0 years)</option>
                                        <option value="1-3">1-3 years</option>
                                        <option value="3+">3+ years</option>
                                    </select>
                                </div>

                                <button
                                    className="btn btn-ghost w-full"
                                    onClick={() => {
                                        setSearch('');
                                        setDomain('');
                                        setType('');
                                        setLocationFilter('');
                                        setExperience('');
                                    }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>

                        {/* Jobs List */}
                        <div>
                            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-md)' }}>
                                <div id="jobs-count" style={{ fontWeight: 700 }}>Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}</div>
                                <span className="text-sm text-muted">Updates live</span>
                            </div>

                            {filteredJobs.length === 0 ? (
                                <div id="jobs-empty" className="card-glass text-center" style={{ padding: 'var(--space-3xl)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>💼</div>
                                    <h3>No job openings found</h3>
                                    <p>Try modifying your filters or search keywords.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                    {filteredJobs.map(j => (
                                        <div className="job-card reveal" key={j.id}>
                                            <div className="job-card-header">
                                                <div className="company-logo">{j.companyLogo || j.company[0]}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="job-role">{j.role}</div>
                                                    <div className="job-company">{j.company}</div>
                                                </div>
                                                <div className="flex flex-col items-end gap-xs">
                                                    <span className={`badge ${getTypeColor(j.type)}`}>{j.type}</span>
                                                    <div className="flex items-center gap-xs">
                                                        <span className="status-dot status-active"></span>
                                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="job-meta">
                                                <div className="job-meta-item">📍 {j.location}</div>
                                                <div className="job-meta-item">🌐 {j.mode}</div>
                                                <div className="job-meta-item">👤 {j.experience}</div>
                                                <div className="job-meta-item">⚙️ {j.domain}</div>
                                            </div>
                                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.6 }}>{j.description.substring(0, 160)}...</p>
                                            <div className="job-skills">
                                                {j.skills.slice(0, 5).map((s, idx) => (
                                                    <span className="badge badge-outline" key={idx}>{s}</span>
                                                ))}
                                            </div>
                                            <div className="job-footer">
                                                <div>
                                                    <div className="job-salary">{j.stipend || j.package}</div>
                                                    <div className="job-posted">📅 Deadline: {new Date(j.deadline).toLocaleDateString()}</div>
                                                </div>
                                                <div className="flex gap-sm">
                                                    <button className="btn btn-ghost btn-sm" onClick={() => setActiveJobDetails(j)}>Details</button>
                                                    <button className="btn btn-jobs btn-sm" onClick={() => setApplyingJob(j)}>Apply Now →</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* JOB DETAILS MODAL */}
            {activeJobDetails && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, visibility: 'visible' }}>
                    <div className="modal modal-lg" style={{ position: 'relative' }}>
                        <button className="modal-close" onClick={() => setActiveJobDetails(null)}>✕</button>
                        <div>
                            <div className="job-card-header" style={{ marginBottom: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div className="company-logo" style={{ width: '60px', height: '60px', fontSize: '1.75rem' }}>{activeJobDetails.companyLogo || activeJobDetails.company[0]}</div>
                                <div style={{ flex: 1 }}>
                                    <h2>{activeJobDetails.role}</h2>
                                    <h4 style={{ color: 'var(--text-muted)' }}>{activeJobDetails.company}</h4>
                                </div>
                                <div className="flex flex-col items-end gap-xs">
                                    <span className={`badge ${getTypeColor(activeJobDetails.type)}`} style={{ padding: '6px 12px' }}>{activeJobDetails.type}</span>
                                </div>
                            </div>
                            <div className="job-meta" style={{ marginBottom: 'var(--space-lg)' }}>
                                <div className="job-meta-item">📍 {activeJobDetails.location}</div>
                                <div className="job-meta-item">🌐 {activeJobDetails.mode}</div>
                                <div className="job-meta-item">👤 {activeJobDetails.experience}</div>
                                <div className="job-meta-item">⚙️ {activeJobDetails.domain}</div>
                                <div className="job-meta-item">💰 {activeJobDetails.stipend || activeJobDetails.package}</div>
                            </div>
                            
                            <div style={{ marginBottom: 'var(--space-lg)' }}>
                                <h3>Job Description</h3>
                                <p style={{ marginTop: 'var(--space-sm)', lineHeight: 1.6 }}>{activeJobDetails.description}</p>
                            </div>

                            <div style={{ marginBottom: 'var(--space-lg)' }}>
                                <h3>Skills Required</h3>
                                <div className="job-skills" style={{ marginTop: 'var(--space-sm)' }}>
                                    {activeJobDetails.skills.map((s, idx) => (
                                        <span className="badge badge-outline" key={idx}>{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-md" style={{ marginTop: 'var(--space-xl)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-lg)' }}>
                                <button className="btn btn-ghost w-full" onClick={() => setActiveJobDetails(null)}>Close</button>
                                <button
                                    className="btn btn-jobs w-full"
                                    onClick={() => {
                                        setApplyingJob(activeJobDetails);
                                        setActiveJobDetails(null);
                                    }}
                                >
                                    Apply for this Job →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* APPLY FORM MODAL */}
            {applyingJob && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, visibility: 'visible' }}>
                    <div className="modal modal-md" style={{ position: 'relative' }}>
                        <button className="modal-close" onClick={() => setApplyingJob(null)}>✕</button>
                        <div className="modal-header" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3>Apply for Role</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{applyingJob.role} at {applyingJob.company}</p>
                        </div>
                        <form onSubmit={handleApplySubmit}>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Your Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={applyName}
                                    onChange={(e) => setApplyName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-2 gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                                <div className="form-group">
                                    <label className="form-label required">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="your@email.com"
                                        value={applyEmail}
                                        onChange={(e) => setApplyEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="9876543210"
                                        value={applyPhone}
                                        onChange={(e) => setApplyPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">College / Organization</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Your college or current company"
                                    value={applyCollege}
                                    onChange={(e) => setApplyCollege(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Resume Link</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    placeholder="https://drive.google.com/... or LinkedIn URL"
                                    value={applyResume}
                                    onChange={(e) => setApplyResume(e.target.value)}
                                    required
                                />
                                <div className="form-hint" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Share a Google Drive link or LinkedIn profile URL</div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                                <label className="form-label">Cover Letter / Why should we hire you?</label>
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Tell us why you're the right fit for this role..."
                                    value={applyCover}
                                    onChange={(e) => setApplyCover(e.target.value)}
                                    style={{ width: '100%', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                ></textarea>
                            </div>
                            {/* ATS Preview */}
                            <div className="card" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)', marginBottom: 'var(--space-lg)', padding: 'var(--space-md)' }}>
                                <div className="flex items-center gap-md">
                                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>AI ATS Score</div>
                                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your profile will be AI-scored for job fit after submission</div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-jobs w-full btn-lg" style={{ justifyContent: 'center' }}>Submit Application →</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}