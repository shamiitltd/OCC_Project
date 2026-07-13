import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
    const { AppState } = useAppContext();
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        setFeaturedCourses(AppState.getFeaturedCourses());
        setSettings(AppState.getSettings());
    }, [AppState]);

    return (
        <div className="public-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">🚀 India's #1 Open Career Platform</div>
                        <h1 className="hero-title">
                            Turning <span className="text-gradient">Learners</span> into <span className="text-gradient">Earners</span>
                        </h1>
                        <p className="hero-subtitle">{settings.tagline2}</p>
                        <div className="hero-actions">
                            <Link to="/training" className="btn btn-primary btn-lg">Explore Courses →</Link>
                            <Link to="/careers" className="btn btn-ghost btn-lg">Find Jobs</Link>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">{settings.totalStudents?.toLocaleString()}+</span>
                                <span className="stat-label">Students</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{settings.totalMentors}+</span>
                                <span className="stat-label">Mentors</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{settings.totalCompanies}+</span>
                                <span className="stat-label">Companies</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{settings.placementRate}%</span>
                                <span className="stat-label">Placement Rate</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-bg-glow"></div>
            </section>

            {/* Modules Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>One Platform for Your Entire <span className="text-gradient">Career Journey</span></h2>
                        <p>Learn, mentor, get hired, and crack competitive exams — all in one place.</p>
                    </div>
                    <div className="modules-grid">
                        <Link to="/training" className="module-card" style={{ '--module-color': 'var(--module-tip)' }}>
                            <div className="module-icon">📚</div>
                            <h3>OCC TIP</h3>
                            <p>Industry-certified training programs with job guarantee. Job Bootcamp, AI/ML, Full Stack & more.</p>
                            <span className="module-cta">Explore Programs →</span>
                        </Link>
                        <Link to="/mentors" className="module-card" style={{ '--module-color': 'var(--module-mentor)' }}>
                            <div className="module-icon">👨‍🏫</div>
                            <h3>OCC Mentor</h3>
                            <p>1:1 mentorship from industry experts. Career coaching, interview prep, and skill guidance.</p>
                            <span className="module-cta">Find a Mentor →</span>
                        </Link>
                        <Link to="/careers" className="module-card" style={{ '--module-color': 'var(--module-jobs)' }}>
                            <div className="module-icon">💼</div>
                            <h3>OCC Jobs</h3>
                            <p>Curated job openings from top companies. Internships, fresher jobs, and freelance opportunities.</p>
                            <span className="module-cta">Browse Jobs →</span>
                        </Link>
                        <Link to="/exams" className="module-card" style={{ '--module-color': 'var(--module-exams)' }}>
                            <div className="module-icon">📝</div>
                            <h3>OCC Exams</h3>
                            <p>Comprehensive preparation for JEE, NEET, UPSC, GATE, CAT, SSC & more competitive exams.</p>
                            <span className="module-cta">View Exams →</span>
                        </Link>
                        <Link to="/corporate" className="module-card" style={{ '--module-color': 'var(--module-corporate)' }}>
                            <div className="module-icon">🏢</div>
                            <h3>Corporate</h3>
                            <p>Hire top talent, conduct campus drives, and partner with us for your hiring needs.</p>
                            <span className="module-cta">Partner With Us →</span>
                        </Link>
                        <Link to="/community" className="module-card" style={{ '--module-color': 'var(--module-community)' }}>
                            <div className="module-icon">🌐</div>
                            <h3>Community</h3>
                            <p>Join a thriving community of learners. Share success stories, resources, and grow together.</p>
                            <span className="module-cta">Join Community →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="section" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Popular <span className="text-gradient">Training Programs</span></h2>
                        <p>Industry-certified courses designed to make you job-ready.</p>
                    </div>
                    <div className="courses-grid">
                        {featuredCourses.slice(0, 4).map(course => (
                            <div className="course-card" key={course.id}>
                                <div className="course-card-header" style={{ background: `var(--module-${course.color || 'tip'})` }}>
                                    <span style={{ fontSize: '2.5rem' }}>{course.icon}</span>
                                </div>
                                <div className="course-card-body">
                                    <span className="badge badge-outline">{course.category}</span>
                                    <h3>{course.title}</h3>
                                    <p>{course.description.substring(0, 100)}...</p>
                                    <div className="course-meta">
                                        <span>⏱ {course.duration}</span>
                                        <span>📦 {course.modules.length} modules</span>
                                    </div>
                                    <div className="course-footer">
                                        <span className="course-price">₹{course.price.toLocaleString('en-IN')}</span>
                                        <Link to={`/checkout?course=${course.id}`} className="btn btn-primary btn-sm">Enroll Now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
                        <Link to="/training" className="btn btn-ghost btn-lg">View All Programs →</Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section">
                <div className="container">
                    <div className="stats-banner">
                        <div className="stat-item-large">
                            <span className="stat-number">{settings.totalStudents?.toLocaleString()}+</span>
                            <span className="stat-label">Students Trained</span>
                        </div>
                        <div className="stat-item-large">
                            <span className="stat-number">{settings.totalCourses}+</span>
                            <span className="stat-label">Courses</span>
                        </div>
                        <div className="stat-item-large">
                            <span className="stat-number">{settings.totalMentors}+</span>
                            <span className="stat-label">Expert Mentors</span>
                        </div>
                        <div className="stat-item-large">
                            <span className="stat-number">{settings.totalCompanies}+</span>
                            <span className="stat-label">Partner Companies</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready to Start Your Career Journey?</h2>
                        <p>Join 12,500+ learners who have transformed their careers with Offcampuscareer.</p>
                        <div className="cta-actions">
                            <Link to="/checkout" className="btn btn-primary btn-lg">Get Started Free →</Link>
                            <Link to="/about" className="btn btn-ghost btn-lg">Learn More</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}