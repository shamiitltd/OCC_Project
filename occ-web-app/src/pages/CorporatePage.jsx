import React, { useState } from 'react';

export default function CorporatePage() {
    const [orgName, setOrgName] = useState('');
    const [orgType, setOrgType] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [message, setMessage] = useState('');

    const colleges = [
        { name: 'Noida Institute of Engineering & Technology (NIET)', location: 'Greater Noida' },
        { name: 'Galgotias University', location: 'Greater Noida' },
        { name: 'GL Bajaj Institute of Technology and Management', location: 'Greater Noida' },
        { name: 'Sharda University', location: 'Greater Noida' },
        { name: 'Amity University', location: 'Noida' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        alert(`Thank you! Your partnership request for "${orgName}" has been submitted. Our team will contact you within 2 business days.`);
        
        // Reset fields
        setOrgName('');
        setOrgType('');
        setContactPerson('');
        setContactEmail('');
        setContactPhone('');
        setMessage('');
    };

    return (
        <div className="corporatepage-wrapper">
            {/* HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label corporate">// OCC Corporate</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}>Connect Campus to<br /><span className="text-gradient-corporate">Corporate Excellence</span></h1>
                    <p>We connect companies with industry-ready talent and empower colleges with expert curricula and recruitment drives.</p>
                    <div className="page-hero-actions">
                        <a href="#for-companies" className="btn btn-corporate btn-lg">For Companies <span className="arrow">→</span></a>
                        <a href="#for-colleges" className="btn btn-secondary btn-lg">For Colleges</a>
                    </div>
                </div>
            </section>

            {/* FOR COMPANIES */}
            <section className="section" id="for-companies">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label corporate">// For Companies & Startups</span>
                        <h2>Hire <span className="text-gradient-corporate">Industry-Ready Talent</span></h2>
                        <p>Streamline your hiring process, run campus drives, and access pre-screened, trained candidates.</p>
                    </div>

                    <div className="grid grid-3 gap-xl">
                        <div className="card card-corporate">
                            <div className="card-icon" style={{ background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)' }}>👥</div>
                            <h4>Pre-Screened Candidates</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Access a curated pool of candidates pre-evaluated through our project-based curriculum and AI ATS screening.</p>
                            <a href="#partner-form" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-lg)' }}>Hire Now</a>
                        </div>
                        <div className="card card-corporate">
                            <div className="card-icon" style={{ background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)' }}>🏫</div>
                            <h4>Campus Drives</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Conduct virtual or on-campus placement drives across 50+ partner colleges. We coordinate everything end-to-end.</p>
                            <a href="#partner-form" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-lg)' }}>Request Campus Drive</a>
                        </div>
                        <div className="card card-corporate">
                            <div className="card-icon" style={{ background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)' }}>🤖</div>
                            <h4>AI Screening (ATS)</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Our AI-powered ATS screens resumes, shortlists candidates based on your JD, and ranks them by fit score.</p>
                            <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-lg)' }} onClick={() => alert('ATS available for registered partner companies!')}>Learn More</button>
                        </div>
                        <div className="card card-corporate">
                            <div className="card-icon" style={{ background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)' }}>📊</div>
                            <h4>Hiring Analytics</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Real-time dashboards showing application pipeline, funnel metrics, time-to-hire, and hiring success rates.</p>
                            <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-lg)' }} onClick={() => alert('Analytics available for registered partner companies!')}>View Demo</button>
                        </div>
                        <div className="card card-corporate">
                            <div className="card-icon" style={{ background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)' }}>🤝</div>
                            <h4>Custom Training</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Co-create training programs with us. Train our students on your specific tech stack or domain requirements before hiring.</p>
                            <a href="#partner-form" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-lg)' }}>Co-create Program</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOR COLLEGES */}
            <section className="section" style={{ background: 'var(--bg-surface)' }} id="for-colleges">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label corporate">// For Colleges & Universities</span>
                        <h2>Empower Your Students with<br /><span className="text-gradient-corporate">Industry Connections</span></h2>
                        <p>Partner with us to bring industry training, placement drives, and mentorship directly to your campus.</p>
                    </div>

                    <div className="grid grid-2 gap-xl">
                        <div>
                            <div className="card" style={{ height: '100%' }}>
                                <h3 style={{ marginBottom: 'var(--space-lg)' }}>🎓 College Partnership Benefits</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                    <div className="flex gap-md">
                                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>📚</div>
                                        <div>
                                            <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>OCC Training Programs on Campus</div>
                                            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Bring our Job Bootcamp, AI Training, and other programs to your campus at subsidized rates</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-md">
                                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>💼</div>
                                        <div>
                                            <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>Exclusive Job Fairs</div>
                                            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Host virtual or physical job fairs with 20+ companies participating for your students</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-md">
                                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>🏆</div>
                                        <div>
                                            <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>Placement Coordination</div>
                                            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Our dedicated placement cell works alongside your TPO to maximize placement rates</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-md">
                                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(251,113,133,0.1)', color: 'var(--module-corporate)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem' }}>👨‍🎓</div>
                                        <div>
                                            <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>Mentorship Programs</div>
                                            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Connect your students with 85+ industry mentors for career guidance and internship opportunities</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="card">
                                <h3 style={{ marginBottom: 'var(--space-lg)' }}>🏢 Our College Partners</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                    {colleges.map((c, idx) => (
                                        <div key={idx} className="flex justify-between items-center" style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{c.name}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.location}</div>
                                            </div>
                                            <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>Partner College</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.88rem', marginBottom: 'var(--space-md)' }}>Not on our list yet? Become a partner today!</p>
                                    <a href="#partner-form" className="btn btn-corporate">Request Partnership →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PARTNERSHIP FORM */}
            <section className="section" id="partner-form">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label corporate">// Get Started</span>
                        <h2>Request a <span className="text-gradient-corporate">Partnership</span></h2>
                        <p>Fill out the form below and our team will reach out within 2 business days to discuss how we can work together.</p>
                    </div>

                    <div className="card mx-auto" style={{ maxWidth: '640px' }}>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-2 gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                                <div className="form-group">
                                    <label className="form-label required">Organization Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="TCS, IIT Delhi, etc."
                                        value={orgName}
                                        onChange={(e) => setOrgName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required">Organization Type</label>
                                    <select
                                        className="form-select"
                                        value={orgType}
                                        onChange={(e) => setOrgType(e.target.value)}
                                        style={{ width: '100%' }}
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Company">Company / Startup</option>
                                        <option value="College">College / University</option>
                                        <option value="NGO">NGO / Social Organization</option>
                                        <option value="Government">Government Body</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Contact Person</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Full name"
                                    value={contactPerson}
                                    onChange={(e) => setContactPerson(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-2 gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                                <div className="form-group">
                                    <label className="form-label required">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="partner@org.com"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label required">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="9876543210"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                                <label className="form-label">Message / Details</label>
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Describe your requirements, timeline, or scope of partnership..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    style={{ width: '100%', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-corporate w-full btn-lg" style={{ justifyContent: 'center' }}>Submit Request →</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}