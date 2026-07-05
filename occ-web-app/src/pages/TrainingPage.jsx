import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function TrainingPage() {
    const { AppState } = useAppContext();
    const [courses, setCourses] = useState([]);
    const [filter, setFilter] = useState('all');
    const [activeCourse, setActiveCourse] = useState(null);
    const location = useLocation();

    useEffect(() => {
        setCourses(AppState.getCourses(true));
        
        // Handle hash navigation (e.g. #career, #ai, #webdev)
        if (location.hash) {
            const hash = location.hash.replace('#', '');
            if (hash === 'career') setFilter('Career');
            else if (hash === 'ai') setFilter('AI/ML');
            else if (hash === 'webdev') setFilter('Web Dev');
        }
    }, [AppState, location]);

    const filtered = filter === 'all' ? courses : courses.filter(c => c.category === filter);

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        let stars = '';
        for (let i = 0; i < full; i++) stars += '★';
        if (rating % 1 !== 0) stars += '½';
        while (stars.length < 5) stars += '☆';
        return stars;
    };

    return (
        <div className="trainingpage-wrapper">
            {/* PAGE HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label">// Training Programs</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}>Transform Your Career with<br /><span className="text-gradient">Industry-Ready Training</span></h1>
                    <p style={{ marginTop: 'var(--space-md)' }}>From AI to Career Prep — programs designed by industry experts to make you job-ready.</p>
                </div>
            </section>

            {/* FILTERS + GRID */}
            <section className="section">
                <div className="container">
                    {/* Filter Pills */}
                    <div className="filter-pills">
                        <button className={`filter-pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Programs</button>
                        <button className={`filter-pill ${filter === 'Career' ? 'active' : ''}`} onClick={() => setFilter('Career')}>Career</button>
                        <button className={`filter-pill ${filter === 'AI/ML' ? 'active' : ''}`} onClick={() => setFilter('AI/ML')}>AI/ML</button>
                        <button className={`filter-pill ${filter === 'Web Dev' ? 'active' : ''}`} onClick={() => setFilter('Web Dev')}>Web Dev</button>
                    </div>

                    {/* Course Grid */}
                    {filtered.length === 0 ? (
                        <div id="empty-state" className="text-center" style={{ padding: 'var(--space-3xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔍</div>
                            <h3>No programs found</h3>
                            <p>Try selecting a different category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-3 gap-xl" id="course-grid">
                            {filtered.map(c => (
                                <div className="card reveal" style={{ display: 'flex', flexDirection: 'column' }} key={c.id}>
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>{c.icon}</div>
                                    <div className="flex items-center gap-sm flex-wrap" style={{ marginBottom: 'var(--space-md)' }}>
                                        <span className="badge badge-primary">{c.category}</span>
                                        <span className="badge badge-outline">{c.level}</span>
                                        <span className="badge badge-cyan">{c.duration}</span>
                                    </div>
                                    <h3 style={{ marginBottom: 'var(--space-sm)' }}>{c.title}</h3>
                                    <p style={{ fontSize: '0.9rem', flex: 1, marginBottom: 'var(--space-lg)' }}>{c.description}</p>
                                    <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-sm)' }}>
                                        <span style={{ color: 'var(--accent-amber)' }}>{renderStars(c.rating)}</span>
                                        <span className="text-sm text-muted">{c.enrolled}+ enrolled</span>
                                    </div>
                                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-lg)' }}>
                                        <span className="text-sm text-muted">👤 {c.instructor}</span>
                                    </div>
                                    <div style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignTab: 'center', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.5rem', fontWeight: 800 }}>₹{c.price.toLocaleString('en-IN')}</span>
                                        <div className="flex gap-sm">
                                            <button className="btn btn-ghost btn-sm" onClick={() => setActiveCourse(c)}>Details</button>
                                            <Link to={`/checkout?courseId=${c.id}`} className="btn btn-primary btn-sm">Enroll <span className="arrow">→</span></Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* COMPARISON TABLE */}
            <section className="section" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">// Compare</span>
                        <h2>Find Your <span className="text-gradient">Perfect Program</span></h2>
                    </div>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Job Bootcamp</th>
                                    <th>Software AI Training</th>
                                    <th>Full Stack Web Dev</th>
                                    <th>Guaranteed Job</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><strong>Duration</strong></td><td>8 Weeks</td><td>12 Weeks</td><td>16 Weeks</td><td>24 Weeks</td></tr>
                                <tr><td><strong>Price</strong></td><td>₹9,999</td><td>₹14,999</td><td>₹12,999</td><td>₹29,999</td></tr>
                                <tr><td><strong>Level</strong></td><td>Beginner</td><td>Intermediate</td><td>Beginner</td><td>All Levels</td></tr>
                                <tr><td><strong>Live Classes</strong></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
                                <tr><td><strong>Projects</strong></td><td>2</td><td>4</td><td>6</td><td>8+</td></tr>
                                <tr><td><strong>Certificate</strong></td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
                                <tr><td><strong>Placement Assist</strong></td><td>✅</td><td>✅</td><td>✅</td><td>✅ Guaranteed</td></tr>
                                <tr><td><strong>Refund Policy</strong></td><td>7 Days</td><td>7 Days</td><td>7 Days</td><td>100% if not placed</td></tr>
                                <tr>
                                    <td></td>
                                    <td><Link to="/checkout?courseId=CRS001" className="btn btn-primary btn-sm">Enroll</Link></td>
                                    <td><Link to="/checkout?courseId=CRS002" className="btn btn-primary btn-sm">Enroll</Link></td>
                                    <td><Link to="/checkout?courseId=CRS003" className="btn btn-primary btn-sm">Enroll</Link></td>
                                    <td><Link to="/checkout?courseId=CRS004" className="btn btn-primary btn-sm">Enroll</Link></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* NOT SURE CTA */}
            <section className="section">
                <div className="container text-center">
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🤔</div>
                    <h2>Not Sure Which Program?</h2>
                    <p style={{ maxWidth: '500px', margin: 'var(--space-md) auto var(--space-xl)' }}>Book a free consultation call with our career counselor to find the perfect program for your goals.</p>
                    <Link to="/contact" className="btn btn-primary btn-lg">Talk to a Counselor <span className="arrow">→</span></Link>
                </div>
            </section>

            {/* COURSE DETAIL MODAL */}
            {activeCourse && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, visibility: 'visible' }}>
                    <div className="modal" style={{ maxWidth: '700px', position: 'relative' }}>
                        <button className="modal-close" onClick={() => setActiveCourse(null)}>✕</button>
                        <div id="modal-content">
                            <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-md)' }}>{activeCourse.icon}</div>
                            <div className="flex items-center gap-sm flex-wrap" style={{ marginBottom: 'var(--space-md)' }}>
                                <span className="badge badge-primary">{activeCourse.category}</span>
                                <span className="badge badge-outline">{activeCourse.level}</span>
                                <span className="badge badge-cyan">{activeCourse.duration}</span>
                            </div>
                            <h2 style={{ marginBottom: 'var(--space-sm)' }}>{activeCourse.title}</h2>
                            <p style={{ marginBottom: 'var(--space-lg)' }}>{activeCourse.description}</p>
                            
                            <div className="flex gap-xl flex-wrap" style={{ marginBottom: 'var(--space-xl)' }}>
                                <div><span className="text-sm text-muted">Instructor</span><br /><strong>👤 {activeCourse.instructor}</strong></div>
                                <div><span className="text-sm text-muted">Rating</span><br /><strong style={{ color: 'var(--accent-amber)' }}>{renderStars(activeCourse.rating)} {activeCourse.rating}</strong></div>
                                <div><span className="text-sm text-muted">Enrolled</span><br /><strong>{activeCourse.enrolled}+ students</strong></div>
                                <div><span className="text-sm text-muted">Price</span><br /><strong style={{ fontSize: '1.25rem', color: 'var(--brand-primary)' }}>₹{activeCourse.price.toLocaleString('en-IN')}</strong></div>
                            </div>

                            <h4 style={{ marginBottom: 'var(--space-md)' }}>📚 Curriculum</h4>
                            <div style={{ marginBottom: 'var(--space-xl)', maxHeight: '200px', overflowY: 'auto' }}>
                                {activeCourse.modules.map((m, i) => (
                                    <div className="flex items-center gap-md" style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-subtle)' }} key={i}>
                                        <span className="badge badge-outline" style={{ minWidth: '28px', justifyContent: 'center' }}>{i + 1}</span>
                                        <span>{m}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to={`/checkout?courseId=${activeCourse.id}`} className="btn btn-primary btn-lg w-full" style={{ display: 'block', textAlignment: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                Enroll Now — ₹{activeCourse.price.toLocaleString('en-IN')} <span className="arrow">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}