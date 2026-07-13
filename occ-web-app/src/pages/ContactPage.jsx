import React, { useState } from 'react';
import ApiClient from '../services/api-client';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            if (window.OC2 && window.OC2.Toast) {
                window.OC2.Toast.error('Please fill in all required fields.');
            } else {
                alert('Please fill in all required fields.');
            }
            return;
        }

        setSubmitting(true);
        try {
            await ApiClient.sendContactMessage(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            if (window.OC2 && window.OC2.Toast) {
                window.OC2.Toast.success('Thank you! Your message has been sent successfully.');
            }
        } catch (err) {
            if (window.OC2 && window.OC2.Toast) {
                window.OC2.Toast.error(err.message || 'Failed to send message. Please try again.');
            } else {
                alert(err.message || 'Failed to send message.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="public-page">
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label">// Contact</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}><span className="text-gradient">Get In</span> Touch</h1>
                    <p style={{ marginTop: 'var(--space-md)' }}>Have a question, partnership inquiry, or just want to say hello? We'd love to hear from you.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="grid grid-2 gap-2xl">
                        {/* Contact Form */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Send us a <span className="text-gradient">Message</span></h3>
                            {submitted ? (
                                <div className="card text-center" style={{ padding: 'var(--space-3xl)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✉️</div>
                                    <h3>Thank You!</h3>
                                    <p className="text-muted" style={{ marginTop: 'var(--space-md)' }}>We have received your message and will get back to you shortly.</p>
                                    <button className="btn btn-secondary" style={{ marginTop: 'var(--space-xl)' }} onClick={() => setSubmitted(false)}>Send Another Message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-2 gap-lg" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-input"
                                                placeholder="Your name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-2 gap-lg" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-input"
                                                placeholder="+91 XXXXX XXXXX"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Subject *</label>
                                            <select
                                                name="subject"
                                                className="form-select"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a topic...</option>
                                                <option value="Course Inquiry">Course Inquiry</option>
                                                <option value="Partnership">College/Company Partnership</option>
                                                <option value="Placement">Placement Query</option>
                                                <option value="Feedback">Feedback</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                                        <label className="form-label">Message *</label>
                                        <textarea
                                            name="message"
                                            className="form-textarea"
                                            placeholder="Tell us how we can help..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting}>
                                        {submitting ? 'Sending...' : 'Send Message'} <span className="arrow">→</span>
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Contact <span className="text-gradient">Information</span></h3>
                            <div className="flex flex-col gap-lg">
                                <div className="card-glass flex items-center gap-lg" style={{ display: 'flex', gap: 'var(--space-lg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-glass)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-md)' }}>
                                    <div className="card-icon" style={{ fontSize: '2rem', flexShrink: 0 }}>📧</div>
                                    <div>
                                        <h5 style={{ fontWeight: 600 }}>Email Us</h5>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>contact@offcampuscareer.com</p>
                                    </div>
                                </div>
                                <div className="card-glass flex items-center gap-lg" style={{ display: 'flex', gap: 'var(--space-lg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-glass)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-md)' }}>
                                    <div className="card-icon" style={{ fontSize: '2rem', flexShrink: 0 }}>📞</div>
                                    <div>
                                        <h5 style={{ fontWeight: 600 }}>Call Us</h5>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>+91-XXXXXXXXXX</p>
                                    </div>
                                </div>
                                <div className="card-glass flex items-center gap-lg" style={{ display: 'flex', gap: 'var(--space-lg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-glass)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-md)' }}>
                                    <div className="card-icon" style={{ fontSize: '2rem', flexShrink: 0 }}>📍</div>
                                    <div>
                                        <h5 style={{ fontWeight: 600 }}>Visit Us</h5>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Dayanatpur, Near Noida International Airport, Noida, U.P.</p>
                                    </div>
                                </div>
                                <div className="card-glass flex items-center gap-lg" style={{ display: 'flex', gap: 'var(--space-lg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface-glass)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-md)' }}>
                                    <div className="card-icon" style={{ fontSize: '2rem', flexShrink: 0 }}>🕐</div>
                                    <div>
                                        <h5 style={{ fontWeight: 600 }}>Working Hours</h5>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Mon – Sat: 9:00 AM – 7:00 PM IST</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div style={{ marginTop: 'var(--space-xl)' }}>
                                <h5 style={{ marginBottom: 'var(--space-md)' }}>Follow Us</h5>
                                <div className="flex gap-md" style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    <a href="https://www.linkedin.com/company/offcampuscareer/" target="_blank" rel="noopener noreferrer" className="btn btn-icon btn-secondary" aria-label="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-subtle)' }}>
                                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAP */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28044.67766!2d77.39!3d28.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5a43173357b%3A0x37ffce30c87cc03f!2sNoida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1625000000000!5m2!1sen!2sin"
                            width="100%"
                            height="400"
                            style={{ border: 0, display: 'block', filter: 'saturate(0.8) contrast(1.1)' }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Offcampuscareer Location"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
}