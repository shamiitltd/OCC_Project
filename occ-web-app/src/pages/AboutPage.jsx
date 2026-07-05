import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="aboutpage-wrapper">
            {/* PAGE HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label">// About Us</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}><span className="text-gradient">Building India's</span><br />Career Ecosystem</h1>
                    <p style={{ marginTop: 'var(--space-md)' }}>We are bridging the gap between education and employment — one student at a time.</p>
                </div>
            </section>

            {/* MISSION */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-2 gap-2xl items-center">
                        <div className="reveal">
                            <span className="section-label">// Our Mission</span>
                            <h2 style={{ marginTop: 'var(--space-md)' }}>Turning <span className="text-gradient">Learners into Earners</span></h2>
                            <p style={{ marginTop: 'var(--space-lg)', fontSize: '1.05rem' }}>
                                <strong>Offcampuscareer</strong> is an initiative of <strong>SHAMIIT (SHAMI INNOVATION AND TECHNOLOGIES LLP)</strong> — a technology company focused on bridging the skills gap between academic education and industry requirements.
                            </p>
                            <p style={{ marginTop: 'var(--space-md)' }}>
                                We believe every student deserves access to quality training, mentorship, and career opportunities regardless of their college tier or location. Our Training, Internship & Placement (TIP) model ensures students don't just learn — they earn.
                            </p>
                            <div className="flex gap-md flex-wrap" style={{ marginTop: 'var(--space-xl)' }}>
                                <div className="flex items-center gap-sm">
                                    <span style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>✓</span>
                                    <span className="font-semibold">Industry-Ready Skills</span>
                                </div>
                                <div className="flex items-center gap-sm">
                                    <span style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>✓</span>
                                    <span className="font-semibold">Live Projects</span>
                                </div>
                                <div className="flex items-center gap-sm">
                                    <span style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>✓</span>
                                    <span className="font-semibold">Placement Guarantee</span>
                                </div>
                            </div>
                        </div>
                        <div className="reveal reveal-delay-2">
                            <div className="card-glass" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🎯</div>
                                <h3 className="text-gradient" style={{ marginBottom: 'var(--space-md)' }}>Our Vision</h3>
                                <p style={{ fontSize: '1.05rem' }}>
                                    To become India's most trusted career transformation platform — where no student is left behind because of their background, college, or location.
                                </p>
                                <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--border-subtle)' }}>
                                    <p className="font-mono text-sm text-brand" style={{ letterSpacing: '1px' }}>LEARN TOGETHER · WORK TOGETHER · GROW TOGETHER</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="section" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="section-header reveal">
                        <span className="section-label">// Our Values</span>
                        <h2>What <span class="text-gradient">Drives Us</span></h2>
                    </div>
                    <div className="grid grid-3 gap-xl">
                        <div className="card text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)' }}>💡</div>
                            <h4>Innovation</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Constantly evolving our curriculum and methods with the latest industry trends and AI-powered tools.</p>
                        </div>
                        <div className="card text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)' }}>🤝</div>
                            <h4>Trust</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Transparent processes, honest communication, and a money-back guarantee that backs our promise.</p>
                        </div>
                        <div className="card text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)' }}>⭐</div>
                            <h4>Excellence</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>We don't settle for "good enough." Every program, every class, every interaction is designed to be exceptional.</p>
                        </div>
                        <div className="card text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)' }}>📈</div>
                            <h4>Growth</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Continuous learning for our students and ourselves. We grow when you grow.</p>
                        </div>
                        <div className="card text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)' }}>🌐</div>
                            <h4>Collaboration</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Building bridges between colleges, companies, and students to create a thriving ecosystem.</p>
                        </div>
                        <div className="card text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)' }}>🎯</div>
                            <h4>Impact</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Measuring success not in revenue, but in careers transformed and lives changed.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* LEADERSHIP */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">// Leadership</span>
                        <h2>Meet the <span className="text-gradient">Team</span></h2>
                        <p>The passionate minds behind Offcampuscareer's mission.</p>
                    </div>
                    <div className="grid grid-3 gap-xl">
                        {/* MD */}
                        <div className="card text-center">
                            <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-lg)' }}>MU</div>
                            <h4>Monika Upadhyay</h4>
                            <span className="badge badge-primary" style={{ marginTop: 'var(--space-sm)' }}>Managing Director</span>
                            <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>
                                Visionary leader driving SHAMIIT's mission to democratize quality education and career opportunities across India.
                            </p>
                        </div>
                        {/* VP */}
                        <div className="card text-center">
                            <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-lg)' }}>VU</div>
                            <h4>Vinay Prem Upadhyay</h4>
                            <span className="badge badge-cyan" style={{ marginTop: 'var(--space-sm)' }}>Vice President</span>
                            <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>
                                Strategy and partnerships expert connecting students with top companies. Building the OC2 placement ecosystem.
                            </p>
                            <a href="https://www.linkedin.com/in/vinaypremupadhyay/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-md)' }}>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px', verticalAlign: 'middle' }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                LinkedIn
                            </a>
                        </div>
                        {/* CEO */}
                        <div className="card text-center">
                            <div className="avatar avatar-xl" style={{ margin: '0 auto var(--space-lg)' }}>KU</div>
                            <h4>King Upadhyay</h4>
                            <span className="badge badge-green" style={{ marginTop: 'var(--space-sm)' }}>CEO & Director</span>
                            <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>
                                Tech visionary leading product development and AI training programs. Architect of the OC2 platform.
                            </p>
                        </div>
                    </div>

                    {/* Extended Team */}
                    <div className="grid grid-4 gap-lg" style={{ marginTop: 'var(--space-2xl)' }}>
                        <div className="card-glass text-center">
                            <div className="avatar avatar-md" style={{ margin: '0 auto var(--space-md)' }}>AD</div>
                            <h5>Akash Dash</h5>
                            <span className="text-sm text-muted">Project Manager</span>
                        </div>
                        <div className="card-glass text-center">
                            <div className="avatar avatar-md" style={{ margin: '0 auto var(--space-md)' }}>PU</div>
                            <h5>Premchand Upadhyay</h5>
                            <span className="text-sm text-muted">Co-Founder & Partner</span>
                        </div>
                        <div className="card-glass text-center">
                            <div className="avatar avatar-md" style={{ margin: '0 auto var(--space-md)' }}>VU</div>
                            <h5>Vinay Upadhyay</h5>
                            <span className="text-sm text-muted">Co-Founder & Partner</span>
                        </div>
                        <div className="card-glass text-center">
                            <div className="avatar avatar-md" style={{ margin: '0 auto var(--space-md)' }}>TM</div>
                            <h5>Team Members</h5>
                            <span className="text-sm text-muted">And Growing...</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="section" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">// Our Journey</span>
                        <h2>Milestones <span className="text-gradient">So Far</span></h2>
                    </div>
                    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                        <div className="flex gap-xl" style={{ marginBottom: 'var(--space-xl)' }}>
                            <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                <span className="font-bold text-gradient">2023</span>
                            </div>
                            <div style={{ width: '2px', background: 'var(--brand-gradient)', position: 'relative', flexShrink: 0 }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--brand-primary)', position: 'absolute', top: '4px', left: '-5px' }}></div>
                            </div>
                            <div>
                                <h4>Founded</h4>
                                <p className="text-sm">SHAMIIT LLP established. Offcampuscareer vision conceived to bridge the education-employment gap.</p>
                            </div>
                        </div>
                        <div className="flex gap-xl" style={{ marginBottom: 'var(--space-xl)' }}>
                            <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                <span className="font-bold text-gradient">2024</span>
                            </div>
                            <div style={{ width: '2px', background: 'var(--brand-gradient)', position: 'relative', flexShrink: 0 }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--brand-primary)', position: 'absolute', top: '4px', left: '-5px' }}></div>
                            </div>
                            <div>
                                <h4>First Batch & Partnerships</h4>
                                <p className="text-sm">Launched Job Bootcamp. First 100 students trained. Partnered with 20+ companies for placements.</p>
                            </div>
                        </div>
                        <div className="flex gap-xl" style={{ marginBottom: 'var(--space-xl)' }}>
                            <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                <span className="font-bold text-gradient">2025</span>
                            </div>
                            <div style={{ width: '2px', background: 'var(--brand-gradient)', position: 'relative', flexShrink: 0 }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-green)', position: 'absolute', top: '4px', left: '-5px' }}></div>
                            </div>
                            <div>
                                <h4>Scale & Innovation</h4>
                                <p className="text-sm">500+ students trained. AI Training program launched. 100+ college partners. 95% placement rate achieved.</p>
                            </div>
                        </div>
                        <div className="flex gap-xl">
                            <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                <span className="font-bold text-gradient">2026</span>
                            </div>
                            <div style={{ width: '2px', background: 'var(--brand-gradient)', position: 'relative', flexShrink: 0 }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-cyan)', position: 'absolute', top: '4px', left: '-5px', animation: 'pulse 2s infinite' }}></div>
                            </div>
                            <div>
                                <h4>The Future</h4>
                                <p className="text-sm">Expanding nationwide. Launching Guaranteed Job Program. Building India's largest career transformation platform.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ background: 'var(--brand-gradient-solid)', position: 'relative', overflow: 'hidden' }}>
                <div className="grid-bg" style={{ opacity: 0.1 }}></div>
                <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ color: '#fff', marginBottom: 'var(--space-md)' }}>Ready to Transform Your Career?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
                        Join the Offcampuscareer community and take the first step towards your dream career.
                    </p>
                    <Link to="/training" className="btn btn-lg" style={{ background: '#fff', color: 'var(--brand-dark)', fontWeight: 700 }}>
                        Explore Programs <span className="arrow">→</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}