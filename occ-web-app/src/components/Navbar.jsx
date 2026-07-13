import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
    const { session, theme, toggleTheme } = useAppContext();
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="public-navbar" role="navigation" aria-label="Main Navigation">
            <div className="container nav-container">
                <Link to="/" className="nav-brand" aria-label="Offcampuscareer Home">
                    <span className="nav-brand-text">Offcampus<span>career</span></span>
                </Link>

                <div className={`nav-links ${mobileOpen ? 'open' : ''}`} id="nav-links" role="menubar">
                    <Link to="/" className={isActive('/')} role="menuitem">Home</Link>
                    <Link to="/training" className={isActive('/training')} role="menuitem">OCC TIP</Link>
                    <Link to="/mentors" className={isActive('/mentors')} role="menuitem">OCC Mentor</Link>
                    <Link to="/careers" className={isActive('/careers')} role="menuitem">OCC Jobs</Link>
                    <Link to="/exams" className={isActive('/exams')} role="menuitem">OCC Exams</Link>
                    <Link to="/corporate" className={isActive('/corporate')} role="menuitem">Corporate</Link>
                    <Link to="/community" className={isActive('/community')} role="menuitem">Community</Link>
                    <Link to="/about" className={isActive('/about')} role="menuitem">About</Link>
                </div>

                <div className="nav-actions">
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" style={{ marginRight: 'var(--space-xs)', background: 'transparent', fontSize: '1.2rem' }}>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    {session ? (
                        <Link to="/portal" className="btn btn-sm btn-secondary hide-on-mobile" style={{ borderRadius: 'var(--radius-full)', border: '2px solid var(--brand-primary)', background: 'transparent', color: 'var(--text-primary)', padding: 'var(--space-xs) var(--space-md)' }}>Dashboard</Link>
                    ) : (
                        <Link to="/portal" className="btn btn-sm btn-secondary hide-on-mobile" id="nav-login-btn" style={{ borderRadius: 'var(--radius-full)', border: '2px solid var(--brand-primary)', background: 'transparent', color: 'var(--brand-primary)', padding: 'var(--space-xs) var(--space-md)', fontWeight: '600' }}>Login</Link>
                    )}
                    {location.pathname === '/careers' ? (
                        <Link to="/careers?post=true" className="btn btn-sm btn-primary hide-on-mobile" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)', border: 'none', color: '#fff', borderRadius: 'var(--radius-full)', padding: 'var(--space-xs) var(--space-lg)', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                            Post a Job
                        </Link>
                    ) : (
                        <Link to="/checkout" className="btn btn-sm btn-primary hide-on-mobile">Enroll Free</Link>
                    )}
                    <button
                        className={`burger ${mobileOpen ? 'open' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
                    >
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="mobile-nav" id="mobile-nav">
                    <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                    <Link to="/training" onClick={() => setMobileOpen(false)}>OCC TIP</Link>
                    <Link to="/mentors" onClick={() => setMobileOpen(false)}>OCC Mentor</Link>
                    <Link to="/careers" onClick={() => setMobileOpen(false)}>OCC Jobs</Link>
                    <Link to="/exams" onClick={() => setMobileOpen(false)}>OCC Exams</Link>
                    <Link to="/corporate" onClick={() => setMobileOpen(false)}>Corporate</Link>
                    <Link to="/community" onClick={() => setMobileOpen(false)}>Community</Link>
                    <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
                    <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
                    <div className="mobile-nav-actions">
                        {session ? (
                            <Link to="/portal" className="btn btn-sm btn-secondary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                        ) : (
                            <Link to="/portal" className="btn btn-sm btn-secondary" onClick={() => setMobileOpen(false)}>Login</Link>
                        )}
                        <Link to="/checkout" className="btn btn-sm btn-primary" onClick={() => setMobileOpen(false)}>Enroll Free</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}