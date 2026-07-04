import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="public-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Offcampuscareer</h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                            India's #1 Open Career Platform. Learn, Mentor, Get Jobs, Crack Competitive Exams.
                            An initiative of <strong>SHAMIIT LLP</strong>.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <Link to="/training">OCC TIP</Link>
                        <Link to="/mentors">OCC Mentor</Link>
                        <Link to="/careers">OCC Jobs</Link>
                        <Link to="/exams">OCC Exams</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <Link to="/corporate">Corporate Partners</Link>
                        <Link to="/community">Community</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Get in Touch</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            📧 contact@offcampuscareer.com<br />
                            📍 Dayanatpur, Near Noida International Airport, Noida, U.P.
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="LinkedIn">in</a>
                            <a href="#" aria-label="Instagram">ig</a>
                            <a href="#" aria-label="Twitter">X</a>
                            <a href="#" aria-label="YouTube">YT</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Offcampuscareer — SHAMIIT LLP. All rights reserved.</p>
                    <p className="text-muted">Turning Learners into Earners</p>
                </div>
            </div>
        </footer>
    );
}