import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CareersPage() {
    const { AppState } = useAppContext();
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setJobs(AppState.getJobs().filter(j => j.status === 'Active'));
    }, [AppState]);

    const filtered = jobs.filter(j =>
        j.role.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="public-page">
            <section className="page-hero">
                <div className="container">
                    <h1>OCC <span className="text-gradient">Jobs</span></h1>
                    <p>Curated job openings from top companies. Internships, fresher jobs, and freelance opportunities.</p>
                    <div className="search-bar" style={{ marginTop: 'var(--space-xl)' }}>
                        <input
                            type="text"
                            placeholder="Search jobs by role, company, or skill..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-primary">🔍 Search</button>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="jobs-list">
                        {filtered.length === 0 ? (
                            <div className="card text-center" style={{ padding: 'var(--space-3xl)' }}>
                                <p className="text-muted">No jobs found matching your search.</p>
                            </div>
                        ) : (
                            filtered.map(job => (
                                <div className="job-card" key={job.id}>
                                    <div className="job-card-header">
                                        <div className="job-logo">{job.companyLogo}</div>
                                        <div>
                                            <h3>{job.role}</h3>
                                            <p className="text-muted">{job.company} · {job.location} ({job.mode})</p>
                                        </div>
                                        <span className={`badge ${job.type === 'Internship' ? 'badge-cyan' : job.type === 'Job' ? 'badge-green' : 'badge-amber'}`}>{job.type}</span>
                                    </div>
                                    <p className="job-desc">{job.description.substring(0, 150)}...</p>
                                    <div className="job-skills">
                                        {job.skills.map((s, i) => (
                                            <span key={i} className="badge badge-outline">{s}</span>
                                        ))}
                                    </div>
                                    <div className="job-card-footer">
                                        <span className="job-stipend">{job.stipend}</span>
                                        <div className="flex gap-sm">
                                            <span className="text-xs text-muted">📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                            <Link to="/portal" className="btn btn-primary btn-sm">Apply Now</Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}