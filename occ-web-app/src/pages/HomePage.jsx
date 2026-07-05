import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
    const { AppState } = useAppContext();
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [featuredMentors, setFeaturedMentors] = useState([]);
    const [exams, setExams] = useState([]);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        setFeaturedCourses(AppState.getFeaturedCourses().slice(0, 3));
        setFeaturedMentors(AppState.getMentors(true).slice(0, 4));
        setExams(AppState.getExamCategories().slice(0, 3));
        setSettings(AppState.getSettings());
    }, [AppState]);

    return (
        <div className="homepage-wrapper">
            {/* HERO */}
            <section className="hero" id="hero" aria-label="Hero Section">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="particles" aria-hidden="true">
                    <div className="particle"></div><div className="particle"></div><div className="particle"></div>
                    <div className="particle"></div><div className="particle"></div><div className="particle"></div>
                    <div className="particle"></div><div className="particle"></div><div className="particle"></div>
                    <div className="particle"></div>
                </div>
                <div className="container">
                    <div className="hero-content" style={{ maxWidth: '760px' }}>
                        <span className="section-label">// An Initiative of SHAMIIT LLP</span>
                        <h1 style={{ marginTop: 'var(--space-md)', lineHeight: 1.15 }}>
                            <span className="text-gradient">One Platform</span>,<br />Infinite Possibilities for<br />India's Youth
                        </h1>
                        <p style={{ fontSize: '1.15rem', marginTop: 'var(--space-lg)', maxWidth: '600px' }}>
                            Learn from industry experts, get mentored by toppers & professionals, crack competitive exams, find your dream job — all in one place.
                        </p>
                        {/* Tagline */}
                        <div className="flex gap-md flex-wrap" style={{ marginTop: 'var(--space-lg)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <span style={{ color: 'var(--module-tip)' }}>📚 Learn Together</span>
                            <span style={{ color: 'var(--text-muted)' }}>·</span>
                            <span style={{ color: 'var(--module-jobs)' }}>💼 Work Together</span>
                            <span style={{ color: 'var(--text-muted)' }}>·</span>
                            <span style={{ color: 'var(--module-mentor)' }}>🚀 Grow Together</span>
                        </div>
                        <div className="hero-actions" style={{ marginTop: 'var(--space-2xl)' }}>
                            <Link to="/checkout" className="btn btn-primary btn-xl">
                                Start for Free <span className="arrow">→</span>
                            </Link>
                            <Link to="/mentors" className="btn btn-secondary btn-xl">
                                Find a Mentor
                            </Link>
                        </div>
                        {/* Quick Stats */}
                        <div className="flex gap-xl flex-wrap" style={{ marginTop: 'var(--space-2xl)' }}>
                            <div>
                                <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>12,500+</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Learners</div>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border-subtle)' }}></div>
                            <div>
                                <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>85+</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expert Mentors</div>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border-subtle)' }}></div>
                            <div>
                                <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>120+</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hiring Partners</div>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border-subtle)' }}></div>
                            <div>
                                <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green)' }}>95%</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placement Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODULES SHOWCASE */}
            <section className="section" id="modules" aria-label="Platform Modules">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">// Our Ecosystem</span>
                        <h2>Everything You Need to<br /><span className="text-gradient">Build Your Career</span></h2>
                        <p>Six powerful modules, one unified platform — designed specifically for India's youth and aspirants.</p>
                    </div>
                    <div className="grid grid-3 gap-xl" id="modules-grid">
                        <Link to="/training" className="module-card module-tip-card" aria-label="OCC TIP Training Module">
                            <div className="module-card-icon">📚</div>
                            <h3>OCC TIP</h3>
                            <p>Training & Industry Programs — Job Bootcamp, AI Training, Web Dev, Guaranteed Job Program</p>
                            <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-md)' }}>
                                <div className="module-stat">45+ Courses · 12K+ Learners</div>
                                <span className="module-arrow" style={{ fontSize: '1.25rem' }}>→</span>
                            </div>
                        </Link>
                        <Link to="/mentors" className="module-card module-mentor-card" aria-label="OCC Mentor Module">
                            <div className="module-card-icon">🎓</div>
                            <h3>OCC Mentor</h3>
                            <p>Connect with IITians, IAS Officers, Industry experts & professionals for 1:1 mentorship sessions</p>
                            <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-md)' }}>
                                <div className="module-stat">85+ Mentors · 5K+ Sessions</div>
                                <span className="module-arrow" style={{ fontSize: '1.25rem' }}>→</span>
                            </div>
                        </Link>
                        <Link to="/careers" className="module-card module-jobs-card" aria-label="OCC Jobs Module">
                            <div className="module-card-icon">💼</div>
                            <h3>OCC Jobs</h3>
                            <p>Freshers to experienced — internships, full-time jobs, freelance from 120+ top companies with ATS</p>
                            <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-md)' }}>
                                <div className="module-stat">500+ Active Jobs · 120+ Companies</div>
                                <span className="module-arrow" style={{ fontSize: '1.25rem' }}>→</span>
                            </div>
                        </Link>
                        <Link to="/exams" className="module-card module-exams-card" aria-label="OCC Exams Module">
                            <div className="module-card-icon">📝</div>
                            <h3>OCC Exams</h3>
                            <p>JEE, NEET, UPSC, GATE, CAT, SSC — complete prep resources, mentors, and mock tests for all competitive exams</p>
                            <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-md)' }}>
                                <div className="module-stat">6+ Exam Tracks · Free Resources</div>
                                <span className="module-arrow" style={{ fontSize: '1.25rem' }}>→</span>
                            </div>
                        </Link>
                        <Link to="/corporate" className="module-card module-corporate-card" aria-label="OCC Corporate Module">
                            <div className="module-card-icon">🏢</div>
                            <h3>OCC Corporate</h3>
                            <p>Companies, colleges, and universities can partner with us for hiring, campus drives, and co-created courses</p>
                            <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-md)' }}>
                                <div className="module-stat">50+ College Partners · Campus Drives</div>
                                <span className="module-arrow" style={{ fontSize: '1.25rem' }}>→</span>
                            </div>
                        </Link>
                        <Link to="/community" className="module-card module-community-card" aria-label="OCC Community Module">
                            <div className="module-card-icon">👥</div>
                            <h3>OCC Community</h3>
                            <p>Study groups, discussion forums, peer learning, success stories, events and hackathons — learn socially</p>
                            <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-md)' }}>
                                <div className="module-stat">8K+ Members · Active Daily</div>
                                <span className="module-arrow" style={{ fontSize: '1.25rem' }}>→</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <section className="section-sm" style={{ background: 'var(--bg-surface)' }} aria-label="Platform Statistics">
                <div className="container">
                    <div className="stats-bar">
                        <div className="stat-item">
                            <div className="stat-number">12,500+</div>
                            <div className="stat-label">Learners Trained</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">85+</div>
                            <div className="stat-label">Expert Mentors</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">120+</div>
                            <div className="stat-label">Hiring Partners</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Placement Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED COURSES */}
            <section className="section" id="programs" aria-label="Featured Programs">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label tip">// OCC TIP</span>
                        <h2>Industry-Ready Training<br /><span className="text-gradient-tip">Programs for Every Goal</span></h2>
                        <p>From Job Bootcamp to AI Training to Competitive Exams — our programs are built by experts who've been there.</p>
                    </div>
                    <div className="grid grid-3 gap-xl" id="featured-courses">
                        {featuredCourses.map(course => (
                            <div className="card card-tip" key={course.id} style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>{course.icon}</div>
                                <div className="flex items-center gap-sm flex-wrap" style={{ marginBottom: 'var(--space-md)' }}>
                                    <span className="badge badge-primary">{course.category}</span>
                                    <span className="badge badge-outline">{course.level}</span>
                                    <span className="badge badge-cyan">{course.duration}</span>
                                </div>
                                <h3 style={{ marginBottom: 'var(--space-sm)' }}>{course.title}</h3>
                                <p style={{ fontSize: '0.9rem', flex: 1, marginBottom: 'var(--space-lg)' }}>{course.description}</p>
                                <div style={{ paddingVisual: 'var(--space-md) 0', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-md)' }}>
                                    <span style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800 }}>₹{course.price.toLocaleString('en-IN')}</span>
                                    <Link to={`/checkout?courseId=${course.id}`} className="btn btn-primary btn-sm">Enroll Now <span className="arrow">→</span></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
                        <Link to="/training" className="btn btn-secondary btn-lg">View All Programs <span class="arrow">→</span></Link>
                    </div>
                </div>
            </section>

            {/* FEATURED MENTORS */}
            <section className="section" style={{ background: 'var(--bg-surface)' }} aria-label="Featured Mentors">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label mentor">// OCC Mentor</span>
                        <h2>Learn from the <span className="text-gradient-mentor">Best Mentors</span></h2>
                        <p>IITians, IAS Officers, Senior Engineers, Industry Leaders — anyone can be a mentor on our platform.</p>
                    </div>
                    <div className="grid grid-4 gap-xl" id="featured-mentors">
                        {featuredMentors.map(mentor => (
                            <div className="card card-mentor" key={mentor.id}>
                                <div className="avatar avatar-lg" style={{ margin: '0 auto var(--space-md)' }}>{mentor.initials}</div>
                                <h4>{mentor.name}</h4>
                                <p className="mentor-title" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minHeight: '38px', margin: '4px 0' }}>{mentor.title}</p>
                                <p className="mentor-company" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{mentor.company}</p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <span>⭐ {mentor.rating}</span>
                                    <span>({mentor.totalRatings} ratings)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
                        <Link to="/mentors" className="btn btn-mentor btn-lg">Explore All Mentors <span className="arrow">→</span></Link>
                        <Link to="/portal" className="btn btn-ghost btn-lg" style={{ marginLeft: 'var(--space-md)' }}>Become a Mentor</Link>
                    </div>
                </div>
            </section>

            {/* EXAM PREP SECTION */}
            <section className="section" aria-label="Competitive Exams">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label exams">// OCC Exams</span>
                        <h2>Crack <span className="text-gradient-exams">Any Competitive Exam</span></h2>
                        <p>JEE, NEET, UPSC, GATE, CAT, SSC — comprehensive preparation with expert mentors and free resources.</p>
                    </div>
                    <div className="grid grid-3 gap-xl" id="exam-grid">
                        {exams.map(exam => (
                            <div className="card card-exams" key={exam.id} style={{ borderTop: `4px solid var(--module-${exam.color || 'exams'})` }}>
                                <div className="card-icon" style={{ background: `var(--module-${exam.color || 'exams'})`, color: '#fff', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>{exam.icon}</div>
                                <h4>{exam.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 'var(--space-xs) 0 var(--space-md)' }}>Conducted by: {exam.conductedBy}</p>
                                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)' }}>
                                    <div>🎯 Difficulty: {exam.difficulty}</div>
                                    <div>📝 Eligibility: {exam.eligibility}</div>
                                    <div>👥 Aspirants: {exam.aspirants}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
                        <Link to="/exams" className="btn btn-exams btn-lg">Explore Exam Prep <span className="arrow">→</span></Link>
                    </div>
                </div>
            </section>

            {/* WHY OCC */}
            <section className="section" style={{ background: 'var(--bg-surface)' }} aria-label="Why Offcampuscareer">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">// Why Offcampuscareer</span>
                        <h2>Why 12,500+ Students <span className="text-gradient">Choose Us</span></h2>
                        <p>We are not just a platform — we are India's most comprehensive career ecosystem for youth.</p>
                    </div>
                    <div className="grid grid-4 gap-xl">
                        <div className="card card-tip text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)' }}>🤖</div>
                            <h4>AI-Powered Learning</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Adaptive curriculum that evolves with industry trends, your learning pace, and career goals.</p>
                        </div>
                        <div className="card card-mentor text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)', background: 'rgba(6,182,212,0.1)', color: 'var(--module-mentor)' }}>🎓</div>
                            <h4>Open Mentorship</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Anyone can be a mentor. IITians, IAS officers, engineers — learn from people who've walked the path.</p>
                        </div>
                        <div className="card card-jobs text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)', background: 'rgba(245,158,11,0.1)', color: 'var(--module-jobs)' }}>💼</div>
                            <h4>Real Job Opportunities</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Direct hiring partnerships with 120+ companies. Apply and track your application status in real time.</p>
                        </div>
                        <div className="card card-exams text-center">
                            <div className="card-icon" style={{ margin: '0 auto var(--space-md)', background: 'rgba(52,211,153,0.1)', color: 'var(--module-exams)' }}>📝</div>
                            <h4>Exam Specialization</h4>
                            <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.9rem' }}>Dedicated resources for JEE, NEET, UPSC, GATE, and more — free study material, mock tests, and expert guidance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="section" aria-label="How It Works">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">// Simple as 1-2-3</span>
                        <h2>Your Journey Starts <span className="text-gradient">Here</span></h2>
                    </div>
                    <div className="grid grid-3 gap-xl">
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--brand-gradient-solid)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit'", fontWeight: 900, fontSize: '1.5rem', margin: '0 auto var(--space-lg)', boxShadow: '0 4px 20px rgba(107,47,160,0.35)' }}>1</div>
                            <h4 style={{ marginBottom: 'var(--space-sm)' }}>Create Your Free Account</h4>
                            <p style={{ fontSize: '0.9rem' }}>Sign up in 30 seconds. Tell us your goal — learn, mentor, hire, or crack an exam. We'll personalize your experience.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #06B6D4, #818CF8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit'", fontWeight: 900, fontSize: '1.5rem', margin: '0 auto var(--space-lg)', boxShadow: '0 4px 20px rgba(6,182,212,0.35)' }}>2</div>
                            <h4 style={{ marginBottom: 'var(--space-sm)' }}>Pick Your Path</h4>
                            <p style={{ fontSize: '0.9rem' }}>Enroll in courses, book mentor sessions, explore job listings, or access free exam resources — all tailored to your domain.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #34D399, #06B6D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit'", fontWeight: 900, fontSize: '1.5rem', margin: '0 auto var(--space-lg)', boxShadow: '0 4px 20px rgba(52,211,153,0.35)' }}>3</div>
                            <h4 style={{ marginBottom: 'var(--space-sm)' }}>Learn, Earn & Grow</h4>
                            <p style={{ fontSize: '0.9rem' }}>Complete courses, get certified, get placed at top companies, or become a mentor yourself — the platform grows with you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BECOME A MENTOR CTA */}
            <section className="section" aria-label="Become a Mentor">
                <div className="container">
                    <div className="card-gradient-border">
                        <div className="card-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', alignItems: 'center' }}>
                            <div>
                                <span className="section-label mentor">// Open to All</span>
                                <h2 style={{ marginTop: 'var(--space-md)' }}>Share Your Knowledge,<br /><span className="text-gradient-mentor">Become a Mentor</span></h2>
                                <p style={{ marginTop: 'var(--space-md)' }}>Are you an IITian? IAS officer? Senior Engineer? Domain expert? You can publish courses and mentor thousands of students on our platform — and earn while doing it.</p>
                                <div className="flex gap-md flex-wrap" style={{ marginTop: 'var(--space-xl)' }}>
                                    <Link to="/portal" className="btn btn-mentor btn-lg">Start Mentoring <span className="arrow">→</span></Link>
                                    <Link to="/mentors" className="btn btn-ghost btn-lg">See Our Mentors</Link>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>💰</div>
                                    <div style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Earn Income</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>From your courses & sessions</div>
                                </div>
                                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🌟</div>
                                    <div style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Build Brand</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Grow your personal brand</div>
                                </div>
                                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🚀</div>
                                    <div style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Reach Thousands</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Impact lakhs of students</div>
                                </div>
                                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📜</div>
                                    <div style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Full Support</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>We handle marketing & tech</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="section" style={{ background: 'var(--brand-gradient-solid)', position: 'relative', overflow: 'hidden' }} aria-label="Call to Action">
                <div className="grid-bg" style={{ opacity: 0.08 }} aria-hidden="true"></div>
                <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '6px 20px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-md)' }}>Join 12,500+ Learners</span>
                    <h2 style={{ color: '#fff', marginBottom: 'var(--space-md)' }}>Start Your Journey Today — It's Free</h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '560px', margin: '0 auto var(--space-xl)', fontSize: '1.05rem' }}>
                        Whether you want to learn, teach, hire, or crack an exam — Offcampuscareer is your one-stop destination.
                    </p>
                    <div className="flex gap-md justify-center flex-wrap">
                        <Link to="/checkout" className="btn btn-xl" style={{ background: '#fff', color: 'var(--brand-dark)', fontWeight: 700 }}>
                            Enroll Now — Free Demo Class <span className="arrow">→</span>
                        </Link>
                        <Link to="/contact" className="btn btn-xl btn-outline-white">Talk to Us</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}