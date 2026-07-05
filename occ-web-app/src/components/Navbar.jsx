import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
    const { session, theme, toggleTheme } = useAppContext();
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            <nav className="navbar" id="main-nav" role="navigation" aria-label="Main Navigation">
                <div className="container flex items-center justify-between" style={{ height: '100%' }}>
                    <Link to="/" className="nav-brand" aria-label="Offcampuscareer Home">
                        <img src="/offcampuscareer logo.png" alt="Offcampuscareer Logo" loading="lazy" />
                        <span className="nav-brand-text">Offcampus<span>career</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="nav-links" id="nav-links" role="menubar">
                        <Link to="/" className={isActive('/')} role="menuitem">Home</Link>
                        <div className="nav-dropdown" role="none">
                            <Link to="/training" className={`nav-dropdown-toggle ${isActive('/training')}`} role="menuitem" aria-haspopup="true">
                                OCC TIP
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '12px', height: '12px', marginLeft: '4px', verticalAlign: 'middle' }}><path d="M6 9l6 6 6-6"/></svg>
                            </Link>
                            <div className="nav-dropdown-menu" role="menu">
                                <Link to="/training" className="nav-dropdown-item" role="menuitem"><span className="icon">📚</span>All Courses</Link>
                                <Link to="/training#career" className="nav-dropdown-item" role="menuitem"><span className="icon">🚀</span>Job Bootcamp</Link>
                                <Link to="/training#ai" className="nav-dropdown-item" role="menuitem"><span className="icon">🤖</span>AI Training</Link>
                                <Link to="/training#webdev" className="nav-dropdown-item" role="menuitem"><span className="icon">💻</span>Web Development</Link>
                            </div>
                        </div>
                        <Link to="/mentors" className={isActive('/mentors')} role="menuitem">OCC Mentor</Link>
                        <Link to="/careers" className={isActive('/careers')} role="menuitem">OCC Jobs</Link>
                        <Link to="/exams" className={isActive('/exams')} role="menuitem">OCC Exams</Link>
                        <Link to="/corporate" className={isActive('/corporate')} role="menuitem">Corporate</Link>
                        <Link to="/community" className={isActive('/community')} role="menuitem">Community</Link>
                    </div>

                    <div className="nav-actions">
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        {session ? (
                            <Link to="/portal" className="btn btn-sm btn-secondary" id="nav-login-btn">Dashboard</Link>
                        ) : (
                            <Link to="/portal" className="btn btn-sm btn-secondary" id="nav-login-btn">Login</Link>
                        )}
                        <Link to="/checkout" className="btn btn-sm btn-primary">Enroll Free</Link>
                        <button
                            className={`burger ${mobileOpen ? 'open' : ''}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Open menu"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav"
                        >
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Nav */}
            <div
                className={`mobile-nav-overlay ${mobileOpen ? 'visible' : ''}`}
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
                style={{ display: mobileOpen ? 'block' : 'none' }}
            ></div>
            <div
                className={`nav-links-mobile ${mobileOpen ? 'open' : ''}`}
                id="mobile-nav"
                role="dialog"
                aria-label="Mobile Navigation"
                style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease' }}
            >
                <div className="mobile-nav-header">
                    <span className="nav-brand-text" style={{ fontSize: '1rem' }}>Offcampus<span style={{ color: 'var(--brand-primary)' }}>career</span></span>
                    <button onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
                </div>
                <div className="mobile-section-title">Platform</div>
                <Link to="/" onClick={() => setMobileOpen(false)}>🏠 Home</Link>
                <Link to="/training" onClick={() => setMobileOpen(false)}>📚 OCC TIP — Training</Link>
                <Link to="/mentors" onClick={() => setMobileOpen(false)}>🎓 OCC Mentor</Link>
                <Link to="/careers" onClick={() => setMobileOpen(false)}>💼 OCC Jobs</Link>
                <Link to="/exams" onClick={() => setMobileOpen(false)}>📝 OCC Exams</Link>
                <div className="mobile-section-title">More</div>
                <Link to="/corporate" onClick={() => setMobileOpen(false)}>🏢 Corporate</Link>
                <Link to="/community" onClick={() => setMobileOpen(false)}>👥 Community</Link>
                <Link to="/about" onClick={() => setMobileOpen(false)}>ℹ️ About Us</Link>
                <Link to="/contact" onClick={() => setMobileOpen(false)}>📞 Contact</Link>
                <div className="mobile-actions">
                    {session ? (
                        <Link to="/portal" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    ) : (
                        <Link to="/portal" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Student Login</Link>
                    )}
                    <Link to="/checkout" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Enroll Now →</Link>
                </div>
            </div>
        </>
    );
}