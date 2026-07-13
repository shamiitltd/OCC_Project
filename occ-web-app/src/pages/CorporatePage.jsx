import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function CorporatePage() {
    const { AppState } = useAppContext();
    const [corporates, setCorporates] = useState([]);
    const [colleges, setColleges] = useState([]);

    useEffect(() => {
        setCorporates(AppState.getCorporates());
        setColleges(AppState.getColleges());
    }, [AppState]);

    return (
        <div className="public-page">
            <section className="page-hero">
                <div className="container">
                    <h1><span className="text-gradient">Corporate</span> Partnerships</h1>
                    <p>Hire top talent, conduct campus drives, and partner with us for your hiring needs.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title">Our Hiring Partners</h2>
                    <div className="partners-grid">
                        {corporates.map(corp => (
                            <div className="partner-card" key={corp.id}>
                                <div className="partner-logo">{corp.logo}</div>
                                <h3>{corp.company}</h3>
                                <p className="text-muted">{corp.industry} · {corp.size}</p>
                                <div className="partner-stats">
                                    <span>📍 {corp.location}</span>
                                    <span>💼 {corp.activeJobs} active jobs</span>
                                    <span>🎓 {corp.placedStudents} placed</span>
                                </div>
                                <span className="badge badge-outline">{corp.partnerType}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <h2 className="section-title">Partner Colleges</h2>
                    <div className="colleges-grid">
                        {colleges.map(col => (
                            <div className="college-card" key={col.id}>
                                <h3>{col.name}</h3>
                                <p className="text-muted">{col.type} · {col.location}</p>
                                <div className="college-stats">
                                    <span>👨‍🎓 {col.students.toLocaleString()} students</span>
                                    <span>🤝 Since {col.partnerSince}</span>
                                </div>
                                <span className="badge badge-outline">{col.collaborationType}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Want to Partner with Us?</h2>
                        <p>Join 120+ companies and 50+ colleges already partnered with Offcampuscareer.</p>
                        <Link to="/contact" className="btn btn-primary btn-lg">Get in Touch →</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}