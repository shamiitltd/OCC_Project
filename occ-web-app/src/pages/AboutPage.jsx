import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="public-page">
            <section className="page-hero">
                <div className="container">
                    <h1>About <span className="text-gradient">Offcampuscareer</span></h1>
                    <p>India's #1 Open Career Platform — Turning Learners into Earners</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="about-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                            <h2>Our Mission</h2>
                            <p style={{ lineHeight: 1.8, marginTop: 'var(--space-md)' }}>
                                Offcampuscareer is an initiative by <strong>SHAMIIT LLP</strong> dedicated to bridging the gap between
                                academic learning and industry requirements. We provide a comprehensive platform where students
                                can learn in-demand skills, get mentored by industry experts, find job opportunities, and prepare
                                for competitive exams — all under one roof.
                            </p>
                        </div>

                        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                            <h2>What We Offer</h2>
                            <div className="about-features" style={{ marginTop: 'var(--space-md)' }}>
                                <div className="about-feature">
                                    <span style={{ fontSize: '2rem' }}>📚</span>
                                    <div>
                                        <h3>OCC TIP</h3>
                                        <p>Industry-certified training programs with job placement assistance.</p>
                                    </div>
                                </div>
                                <div className="about-feature">
                                    <span style={{ fontSize: '2rem' }}>👨‍🏫</span>
                                    <div>
                                        <h3>OCC Mentor</h3>
                                        <p>1:1 mentorship from industry experts across domains.</p>
                                    </div>
                                </div>
                                <div className="about-feature">
                                    <span style={{ fontSize: '2rem' }}>💼</span>
                                    <div>
                                        <h3>OCC Jobs</h3>
                                        <p>Curated job openings from 120+ partner companies.</p>
                                    </div>
                                </div>
                                <div className="about-feature">
                                    <span style={{ fontSize: '2rem' }}>📝</span>
                                    <div>
                                        <h3>OCC Exams</h3>
                                        <p>Comprehensive competitive exam preparation resources.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h2>Our Founder</h2>
                            <div className="founder-info" style={{ marginTop: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                                <div className="mentor-avatar" style={{ width: '80px', height: '80px', fontSize: '1.8rem' }}>VP</div>
                                <div>
                                    <h3>Vinay Prem Upadhyay</h3>
                                    <p className="text-muted">Founder, SHAMIIT LLP</p>
                                    <p style={{ lineHeight: 1.6, marginTop: 'var(--space-sm)' }}>
                                        With 8+ years of experience in career coaching and mentorship, Vinay has helped 1000+
                                        students get placed in top MNCs. His vision is to make quality career guidance accessible
                                        to every Indian student.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready to Transform Your Career?</h2>
                        <p>Join 12,500+ learners on their journey to success.</p>
                        <Link to="/checkout" className="btn btn-primary btn-lg">Get Started Free →</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}