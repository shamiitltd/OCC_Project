import React, { useState } from 'react';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        alert(`Message sent successfully! We'll get back to you at ${email} shortly.`);
        
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
    };

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqs = [
        {
            q: 'How do I enroll in a training program?',
            a: 'Simply visit our Training page, select the program you are interested in, and click "Enroll Now." You will be taken to the checkout page where you can complete enrollment.'
        },
        {
            q: 'What is the Guaranteed Job Program?',
            a: 'Our flagship 24-week program includes comprehensive tech training + dedicated placement assistance. If you complete the program and do not receive a job offer within 3 months, we provide a 100% refund.'
        },
        {
            q: 'Are the mentorship sessions really 1:1?',
            a: 'Yes, all mentorship bookings connect you directly with the selected mentor on a private Google Meet or Zoom session for personalized guidance.'
        },
        {
            q: 'How do I apply for jobs on the portal?',
            a: 'Browse active job openings on our Careers page, click "Apply Now," upload your resume link and details, and our partner company will review your application directly.'
        }
    ];

    return (
        <div className="contactpage-wrapper">
            {/* HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label">// Contact Us</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}><span className="text-gradient">Get in Touch</span> with Us</h1>
                    <p>Have questions about courses, partnerships, or mentorship? We are here to help.</p>
                </div>
            </section>

            {/* CONTACT FORM + INFO */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-2 gap-2xl">
                        {/* Form */}
                        <div className="card">
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Send a <span className="text-gradient">Message</span></h3>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-2 gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                                    <div className="form-group">
                                        <label className="form-label required">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label required">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-2 gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            placeholder="+91 XXXXX XXXXX"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label required">Subject</label>
                                        <select
                                            className="form-select"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            style={{ width: '100%' }}
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
                                <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                                    <label className="form-label required">Message</label>
                                    <textarea
                                        className="form-textarea"
                                        rows="4"
                                        placeholder="Tell us how we can help..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        style={{ width: '100%', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }}>
                                    Send Message <span className="arrow">→</span>
                                </button>
                            </form>
                        </div>

                        {/* Info */}
                        <div>
                            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Contact <span className="text-gradient">Information</span></h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                                    <div style={{ fontSize: '2rem' }}>📧</div>
                                    <div>
                                        <h5 style={{ margin: 0 }}>Email Us</h5>
                                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>contact@offcampuscareer.com</p>
                                    </div>
                                </div>
                                <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                                    <div style={{ fontSize: '2rem' }}>📞</div>
                                    <div>
                                        <h5 style={{ margin: 0 }}>Call Us</h5>
                                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>+91-XXXXXXXXXX</p>
                                    </div>
                                </div>
                                <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                                    <div style={{ fontSize: '2rem' }}>📍</div>
                                    <div>
                                        <h5 style={{ margin: 0 }}>Visit Us</h5>
                                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Dayanatpur, Near Noida International Airport, Noida, U.P.</p>
                                    </div>
                                </div>
                                <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                                    <div style={{ fontSize: '2rem' }}>⏳</div>
                                    <div>
                                        <h5 style={{ margin: 0 }}>Working Hours</h5>
                                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Mon – Sat: 9:00 AM – 7:00 PM IST</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'var(--space-xl)' }}>
                                <h5 style={{ marginBottom: 'var(--space-md)' }}>Follow Us</h5>
                                <div className="flex gap-md">
                                    <a href="https://www.linkedin.com/company/offcampuscareer/" target="_blank" rel="noopener noreferrer" className="btn btn-icon btn-secondary" aria-label="LinkedIn">
                                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
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

            {/* FAQ */}
            <section className="section" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">// FAQ</span>
                        <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
                    </div>

                    <div style={{ maxWidth: '768px', margin: '0 auto' }}>
                        {faqs.map((faq, idx) => (
                            <div className="accordion-item" key={idx} style={{ marginBottom: 'var(--space-md)', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    style={{ width: '100%', padding: 'var(--space-md)', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}
                                >
                                    {faq.q}
                                    <span style={{ transition: 'transform 0.2s', transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                </button>
                                {activeFaq === idx && (
                                    <div style={{ padding: 'var(--space-md)', paddingTop: 0, borderTop: '1px solid var(--border-subtle)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}