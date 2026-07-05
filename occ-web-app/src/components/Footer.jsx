import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="flex items-center gap-sm">
                            <img src="/offcampuscareer logo.png" alt="OC2" style={{ height: '36px' }} />
                            <span className="nav-brand-text">Offcampus<span style={{ color: 'var(--brand-primary)' }}>career</span></span>
                        </div>
                        <p>Turning Learners into Earners. An initiative of SHAMIIT LLP.</p>
                        <p style={{ marginTop: 'var(--space-sm)' }}>📍 Dayanatpur, Near Noida International Airport, Noida, U.P.</p>
                    </div>
                    <div>
                        <h4>Quick Links</h4>
                        <Link to="/">Home</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/training">Training</Link>
                        <Link to="/careers">Careers</Link>
                        <Link to="/placement">Placement</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div>
                        <h4>Programs</h4>
                        <Link to="/training">Job Bootcamp</Link>
                        <Link to="/training#ai">AI Training</Link>
                        <Link to="/training#webdev">Web Development</Link>
                        <Link to="/training#career">Job Guarantee</Link>
                        <Link to="/training">Resume Writing</Link>
                    </div>
                    <div>
                        <h4>Portals</h4>
                        <Link to="/portal">Student Login</Link>
                        <Link to="/portal">Admin Login</Link>
                        <Link to="/checkout">Enroll Now</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Offcampuscareer — SHAMIIT LLP. All Rights Reserved.</p>
                    <div className="footer-social">
                        <a href="https://www.linkedin.com/company/offcampuscareer/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}