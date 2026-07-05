import React from 'react';
import { Link } from 'react-router-dom';

export default function PlacementPage() {
    return (
        <div className="placementpage-wrapper">
            {/* PAGE HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label">// Placement</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}><span className="text-gradient">Bridging Talent</span><br />& Industry</h1>
                    <p style={{ marginTop: 'var(--space-md)' }}>Connecting skilled students with leading companies through our trusted placement ecosystem.</p>
                </div>
            </section>

            {/* STATS */}
            <section className="section" style={{ paddingBottom: 0 }}>
                <div className="container">
                    <div className="stats-bar">
                        <div className="stat-item">
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Placement Rate</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">₹6 LPA</div>
                            <div className="stat-label">Avg. Package</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">350+</div>
                            <div className="stat-label">Students Placed</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100+</div>
                            <div className="stat-label">Partner Institutions</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOR COLLEGES */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-2 gap-2xl items-center">
                        <div className="reveal">
                            <span className="section-label">// For Colleges</span>
                            <h2 style={{ marginTop: 'var(--space-md)' }}>Partner with <span className="text-gradient">Offcampuscareer</span></h2>
                            <p style={{ marginTop: 'var(--space-md)' }}>Enhance your placement cell with our industry connections and training programs. We bring the companies to your campus.</p>
                            <div className="flex flex-col gap-md" style={{ marginTop: 'var(--space-xl)' }}>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>✓</span>
                                    <span>Access to 50+ hiring companies</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>✓</span>
                                    <span>Pre-placement training for your students</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>✓</span>
                                    <span>Campus placement drives coordination</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>✓</span>
                                    <span>Industry workshops & seminars</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>✓</span>
                                    <span>Skill gap analysis & reports</span>
                                </div>
                            </div>
                            <Link to="/contact" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-xl)' }}>
                                Partner with OC2 <span className="arrow">→</span>
                            </Link>
                        </div>
                        <div className="reveal reveal-delay-2">
                            <div className="card-glass" style={{ padding: 'var(--space-2xl)' }}>
                                <h3 style={{ marginBottom: 'var(--space-xl)' }}>📋 How It Works</h3>
                                <div className="flex flex-col gap-xl">
                                    <div className="flex gap-lg">
                                        <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.8rem' }}>1</div>
                                        <div>
                                            <h5>MoU Signing</h5>
                                            <p className="text-sm" style={{ margin: 0 }}>We sign a partnership agreement with your institution.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-lg">
                                        <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.8rem' }}>2</div>
                                        <div>
                                            <h5>Student Assessment</h5>
                                            <p className="text-sm" style={{ margin: 0 }}>We assess student skills and create personalized training paths.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-lg">
                                        <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.8rem' }}>3</div>
                                        <div>
                                            <h5>Training Delivery</h5>
                                            <p className="text-sm" style={{ margin: 0 }}>Our experts deliver industry-focused training on your campus or online.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-lg">
                                        <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.8rem' }}>4</div>
                                        <div>
                                            <h5>Placement Drives</h5>
                                            <p className="text-sm" style={{ margin: 0 }}>We organize targeted placement drives with our hiring partners.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOR COMPANIES */}
            <section className="section" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="grid grid-2 gap-2xl items-center">
                        <div className="reveal">
                            <span className="section-label">// For Companies</span>
                            <h2 style={{ marginTop: 'var(--space-md)' }}>Hire Pre-Trained <span className="text-gradient">Talent from OC2</span></h2>
                            <p style={{ marginTop: 'var(--space-md)' }}>Skip the learning curve. Our students are already trained on your tech stack and ready to contribute from Day 1.</p>
                            <div className="flex flex-col gap-md" style={{ marginTop: 'var(--space-xl)' }}>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-cyan)', fontSize: '1.25rem' }}>★</span>
                                    <span>Pre-vetted candidates with verified skills</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-cyan)', fontSize: '1.25rem' }}>★</span>
                                    <span>Custom training programs for your tech stack</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-cyan)', fontSize: '1.25rem' }}>★</span>
                                    <span>Zero recruitment cost for partner companies</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-cyan)', fontSize: '1.25rem' }}>★</span>
                                    <span>Replacement guarantee within 3 months</span>
                                </div>
                                <div className="flex items-center gap-md">
                                    <span style={{ color: 'var(--accent-cyan)', fontSize: '1.25rem' }}>★</span>
                                    <span>Dedicated campus recruitment support</span>
                                </div>
                            </div>
                            <Link to="/contact" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-xl)' }}>
                                Hire from OC2 <span className="arrow">→</span>
                            </Link>
                        </div>
                        <div className="reveal reveal-delay-2">
                            <div className="card-glass" style={{ padding: 'var(--space-2xl)' }}>
                                <h3 style={{ marginBottom: 'var(--space-xl)' }}>💼 Hiring Pipeline</h3>
                                <div className="flex flex-col gap-xl">
                                    <div className="flex gap-lg">
                                        <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--accent-cyan), #4F46E5)' }}>1</div>
                                        <div>
                                            <h5>Share Requirements</h5>
                                            <p className="text-sm" style={{ margin: 0 }}>Tell us your role requirements, tech stack, and hiring timeline.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-lg">
                                        <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--accent-cyan), #4F46E5)' }}>2</div>
                                        <div>
                                            <h5>Candidate Shortlisting</h5>
                                            <p className="text-sm" style={{ margin: 0 }}>We filter and recommend the best candidates matching your JD.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-lg">
                                        <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--accent-cyan), #4F46E5)' }}>3</div>
                                        <div>
                                            <h5>Interviews Coordination</h5>
                                            <p className="text-sm" style={{ margin: 0 }}>We schedule and manage rounds of virtual/physical interviews.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-lg">
                                        <div className="avatar avatar-sm" style={{ flexShrink: 0, fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--accent-cyan), #4F46E5)' }}>4</div>
                                        <div>
                                            <h5>Onboarding & Support</h5>
                                            <p className="text-sm" style={{ margin: 0 }}>We help coordinate candidate onboarding and initial transition.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
