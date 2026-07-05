import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ExamsPage() {
    const { AppState } = useAppContext();
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);

    useEffect(() => {
        setExams(AppState.getExamCategories());
    }, [AppState]);

    const getBgColor = (color) => {
        const bgMap = {
            cyan: 'rgba(6,182,212,0.12)',
            rose: 'rgba(244,63,94,0.12)',
            amber: 'rgba(245,158,11,0.12)',
            indigo: 'rgba(79,70,229,0.12)',
            orange: 'rgba(234,88,12,0.12)',
            green: 'rgba(52,211,153,0.12)'
        };
        return bgMap[color] || 'rgba(107,47,160,0.12)';
    };

    const getTextColor = (color) => {
        const colorMapText = {
            cyan: 'var(--accent-cyan)',
            rose: 'var(--accent-rose)',
            amber: 'var(--accent-amber)',
            indigo: 'var(--accent-indigo)',
            orange: 'var(--accent-orange)',
            green: 'var(--accent-green)'
        };
        return colorMapText[color] || 'var(--brand-primary)';
    };

    const getBadgeClass = (color) => {
        const badgeMap = {
            cyan: 'badge-mentor',
            rose: 'badge-rose',
            amber: 'badge-amber',
            indigo: 'badge-indigo',
            orange: 'badge-orange',
            green: 'badge-exams'
        };
        return badgeMap[color] || 'badge-primary';
    };

    const handleComingSoon = (resourceName) => {
        alert(`${resourceName} resource will be available for download soon. Stay tuned!`);
    };

    return (
        <div className="examspage-wrapper">
            {/* HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label exams">// OCC Exams</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}>Crack Competitive Exams with<br /><span className="text-gradient-exams">Top Mentors & Resources</span></h1>
                    <p>Free notes, structured study plans, mock tests, and 1:1 guidance from previous rankers and experts.</p>
                    <div className="page-hero-actions">
                        <a href="#exam-section" className="btn btn-exams btn-lg">Explore Exams <span className="arrow">→</span></a>
                        <Link to="/mentors" className="btn btn-secondary btn-lg">Find Exam Mentors</Link>
                    </div>
                </div>
            </section>

            {/* EXAMS LIST SECTION */}
            <section className="section" id="exam-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label exams">// Exam Tracks</span>
                        <h2>Choose Your <span className="text-gradient-exams">Target Exam</span></h2>
                        <p>Detailed resources, eligibility metrics, syllabi, and recommended toppers for all major exams.</p>
                    </div>

                    <div className="grid grid-2 gap-xl" id="exam-list">
                        {exams.map(e => (
                            <div
                                className="exam-card reveal"
                                key={e.id}
                                onClick={() => setSelectedExam(e)}
                                style={{ cursor: 'pointer', display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-lg)' }}
                            >
                                <div className="exam-icon" style={{ background: getBgColor(e.color), color: getTextColor(e.color), width: '64px', height: '64px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                                    {e.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="flex items-center gap-sm flex-wrap" style={{ marginBottom: 'var(--space-sm)' }}>
                                        <h3 style={{ margin: 0 }}>{e.name}</h3>
                                        <span className={`badge ${getBadgeClass(e.color)}`}>{e.difficulty}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>{e.description}</p>
                                    <div className="exam-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <div>👥 {e.aspirants} Aspirants</div>
                                        <div>🏢 {e.conductedBy}</div>
                                        <div>📅 {e.frequency}</div>
                                        <div>🏆 Seats: {e.seats || 'N/A'}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'var(--space-md)' }}>
                                        {e.subjects.map((sub, idx) => (
                                            <span className="badge badge-outline" style={{ fontSize: '0.72rem' }} key={idx}>{sub}</span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'var(--space-md)' }}>
                                        {e.resources.map((res, idx) => (
                                            <span className="badge badge-exams" style={{ fontSize: '0.72rem' }} key={idx}>✓ {res}</span>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-sm)' }}>
                                        <button className="btn btn-exams btn-sm" onClick={(evt) => { evt.stopPropagation(); setSelectedExam(e); }}>Explore Resources</button>
                                        {e.mentors && e.mentors.length > 0 && (
                                            <Link to="/mentors" className="btn btn-secondary btn-sm" onClick={(evt) => evt.stopPropagation()}>Find Mentor</Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FREE STUDY RESOURCES */}
            <section className="section" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label exams">// Free Material</span>
                        <h2>Top Downloads <span className="text-gradient-exams">For Aspirants</span></h2>
                    </div>
                    <div className="grid grid-4 gap-xl">
                        <div className="card text-center">
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📚</div>
                            <h4>Free Formula Sheets</h4>
                            <p style={{ fontSize: '0.88rem', marginTop: 'var(--space-sm)' }}>Quick revisions sheets for Physics, Chemistry, and Math core equations.</p>
                            <button className="btn btn-exams btn-sm" style={{ marginTop: 'var(--space-md)' }} onClick={() => handleComingSoon('Formula Sheets')}>Get Sheet</button>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎥</div>
                            <h4>Topper Video Lectures</h4>
                            <p style={{ fontSize: '0.88rem', marginTop: 'var(--space-sm)' }}>Recorded guidance and problem solving classes from top rankers.</p>
                            <button className="btn btn-exams btn-sm" style={{ marginTop: 'var(--space-md)' }} onClick={() => handleComingSoon('Video Lectures')}>Watch Free</button>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📝</div>
                            <h4>Practice Mock Tests</h4>
                            <p style={{ fontSize: '0.88rem', marginTop: 'var(--space-sm)' }}>Full length test practice sheets with solutions and tips.</p>
                            <button className="btn btn-exams btn-sm" style={{ marginTop: 'var(--space-md)' }} onClick={() => handleComingSoon('Practice Tests')}>Take Test</button>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📅</div>
                            <h4>Daily Study Plans</h4>
                            <p style={{ fontSize: '0.88rem', marginTop: 'var(--space-sm)' }}>Structured month schedules and daily checklists for preparation.</p>
                            <button className="btn btn-exams btn-sm" style={{ marginTop: 'var(--space-md)' }} onClick={() => handleComingSoon('Study Plans')}>Get Plan</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="section" style={{ background: 'linear-gradient(135deg, #065F46, #059669)', position: 'relative', overflow: 'hidden' }}>
                <div className="grid-bg" style={{ opacity: 0.08 }}></div>
                <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ color: '#fff' }}>Your Dream College is Just an Exam Away</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '560px', margin: 'var(--space-md) auto var(--space-xl)' }}>Start your preparation today with expert guidance, free resources, and a community of thousands of fellow aspirants.</p>
                    <div className="flex gap-md justify-center flex-wrap">
                        <Link to="/mentors" className="btn btn-xl" style={{ background: '#fff', color: '#065F46', fontWeight: 700 }}>Find an Exam Mentor <span className="arrow">→</span></Link>
                        <Link to="/checkout" className="btn btn-xl btn-outline-white">Join a Course</Link>
                    </div>
                </div>
            </section>

            {/* EXAM DETAILS MODAL */}
            {selectedExam && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, visibility: 'visible' }}>
                    <div className="modal" style={{ maxWidth: '650px', position: 'relative' }}>
                        <button className="modal-close" onClick={() => setSelectedExam(null)}>✕</button>
                        <div>
                            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                <div style={{ fontSize: '3rem', background: getBgColor(selectedExam.color), color: getTextColor(selectedExam.color), width: '60px', height: '60px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{selectedExam.icon}</div>
                                <div>
                                    <div className="flex items-center gap-sm">
                                        <h2 style={{ margin: 0 }}>{selectedExam.name}</h2>
                                        <span className={`badge ${getBadgeClass(selectedExam.color)}`}>{selectedExam.difficulty}</span>
                                    </div>
                                    <p className="text-muted" style={{ margin: 0 }}>Conducted by {selectedExam.conductedBy}</p>
                                </div>
                            </div>

                            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 'var(--space-lg)' }}>{selectedExam.description}</p>

                            <div className="grid grid-2 gap-md" style={{ marginBottom: 'var(--space-lg)' }}>
                                <div className="card-glass" style={{ padding: 'var(--space-md)' }}>
                                    <span className="text-sm text-muted">Aspirants Yearly</span><br />
                                    <strong>👥 {selectedExam.aspirants}</strong>
                                </div>
                                <div className="card-glass" style={{ padding: 'var(--space-md)' }}>
                                    <span className="text-sm text-muted">Frequency</span><br />
                                    <strong>📅 {selectedExam.frequency}</strong>
                                </div>
                            </div>

                            <div style={{ marginBottom: 'var(--space-lg)' }}>
                                <h4>Subjects Covered</h4>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
                                    {selectedExam.subjects.map((s, idx) => (
                                        <span key={idx} className="badge badge-outline">{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: 'var(--space-lg)' }}>
                                <h4>Available Resources</h4>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
                                    {selectedExam.resources.map((r, idx) => (
                                        <span key={idx} className="badge badge-exams">✓ {r}</span>
                                    ))}
                                </div>
                            </div>

                            {selectedExam.mentors && selectedExam.mentors.length > 0 && (
                                <div style={{ marginBottom: 'var(--space-lg)' }}>
                                    <h4>Recommended Topper Mentors</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-sm)' }}>
                                        {selectedExam.mentors.map((mId, idx) => {
                                            const m = AppState.getMentor(mId);
                                            return m ? (
                                                <div key={idx} className="flex items-center justify-between" style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                                                    <div className="flex items-center gap-sm">
                                                        <div className="avatar avatar-sm">{m.initials}</div>
                                                        <div>
                                                            <div className="font-semibold">{m.name}</div>
                                                            <div className="text-xs text-muted">{m.title}</div>
                                                        </div>
                                                    </div>
                                                    <Link to="/mentors" className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>Book 1:1</Link>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}

                            <button className="btn btn-exams w-full btn-lg" style={{ marginTop: 'var(--space-md)' }} onClick={() => { handleComingSoon(selectedExam.name + ' Resources Bundle'); setSelectedExam(null); }}>
                                Download Resources Bundle →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}