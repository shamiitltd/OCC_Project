import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function MentorsPage() {
    const { AppState } = useAppContext();
    const [mentors, setMentors] = useState([]);
    const [search, setSearch] = useState('');
    const [domain, setDomain] = useState('');
    const [price, setPrice] = useState('');
    const [bookingMentor, setBookingMentor] = useState(null);
    const [selectedMentorProfile, setSelectedMentorProfile] = useState(null);

    // Form fields
    const [bookName, setBookName] = useState('');
    const [bookEmail, setBookEmail] = useState('');
    const [bookTopic, setBookTopic] = useState('');
    const [bookTime, setBookTime] = useState('Morning (9 AM - 12 PM)');

    useEffect(() => {
        setMentors(AppState.getMentors(true));
    }, [AppState]);

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        let stars = '';
        for (let i = 0; i < full; i++) stars += '★';
        if (rating % 1 !== 0) stars += '½';
        while (stars.length < 5) stars += '☆';
        return stars;
    };

    const handleBookSubmit = (e) => {
        e.preventDefault();
        if (!bookingMentor) return;

        // Perform the book session save
        const result = AppState.bookMentorSession(bookingMentor.id, {
            name: bookName,
            email: bookEmail,
            topic: bookTopic,
            time: bookTime,
            studentId: 'STU001' // demo student ID
        });

        if (result) {
            alert(`Successfully booked a session with ${bookingMentor.name}!`);
        } else {
            alert('Failed to book session. Please try again.');
        }

        // Reset and close
        setBookName('');
        setBookEmail('');
        setBookTopic('');
        setBookingMentor(null);
    };

    // Filter logic
    const filtered = mentors.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            m.company.toLowerCase().includes(search.toLowerCase());

        const matchesDomain = domain === '' || m.specialties.some(s => s.toLowerCase().includes(domain.toLowerCase()));

        const mPrice = parseFloat(m.price) || 0;
        const matchesPrice = price === '' ||
            (price === '500' && mPrice <= 500) ||
            (price === '1000' && mPrice <= 1000) ||
            (price === '1500' && mPrice <= 1500);

        return matchesSearch && matchesDomain && matchesPrice;
    });

    return (
        <div className="mentorspage-wrapper">
            {/* HERO */}
            <section className="page-hero">
                <div className="hero-bg"></div>
                <div className="grid-bg"></div>
                <div className="container">
                    <span className="section-label mentor">// OCC Mentor</span>
                    <h1 style={{ marginTop: 'var(--space-md)' }}>Learn from the <span className="text-gradient-mentor">Best Minds</span><br />in India</h1>
                    <p>IITians, IAS Officers, Senior Engineers, Entrepreneurs — anyone with knowledge can mentor on our platform. Connect for 1:1 sessions or take their courses.</p>
                    <div className="page-hero-actions">
                        <a href="#mentors" className="btn btn-mentor btn-lg">Find Your Mentor <span className="arrow">→</span></a>
                        <Link to="/portal" className="btn btn-secondary btn-lg">Become a Mentor</Link>
                    </div>
                    {/* Stats */}
                    <div className="flex gap-xl justify-center flex-wrap" style={{ marginTop: 'var(--space-2xl)' }}>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-mentor)' }}>85+</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Expert Mentors</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-mentor)' }}>5K+</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sessions Completed</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-mentor)' }}>4.8★</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Average Rating</div></div>
                        <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 900, color: 'var(--module-mentor)' }}>20+</div><div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Domains</div></div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="section-sm" style={{ background: 'var(--bg-surface)' }}>
                <div className="container">
                    <h3 className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>How <span className="text-gradient-mentor">Mentorship</span> Works</h3>
                    <div className="grid grid-3 gap-xl">
                        <div className="card text-center">
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>🔍</div>
                            <h4>1. Find Your Mentor</h4>
                            <p style={{ fontSize: '0.9rem', marginTop: 'var(--space-sm)' }}>Browse mentors by domain, rating, experience, or price. Read reviews from real students.</p>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>📅</div>
                            <h4>2. Book a Session</h4>
                            <p style={{ fontSize: '0.9rem', marginTop: 'var(--space-sm)' }}>Schedule a 1:1 session at your preferred time. Our platform handles booking and payment.</p>
                        </div>
                        <div className="card text-center">
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>🚀</div>
                            <h4>3. Learn & Grow</h4>
                            <p style={{ fontSize: '0.9rem', marginTop: 'var(--space-sm)' }}>Connect on Google Meet or Zoom. Get personalized guidance and actionable advice from experts.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FILTER + MENTORS */}
            <section className="section" id="mentors">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label mentor">// Our Mentors</span>
                        <h2>Connect with <span className="text-gradient-mentor">Expert Mentors</span></h2>
                        <p>Filter by domain, expertise, or price range to find the perfect mentor for your goals.</p>
                    </div>

                    {/* Search + Filter */}
                    <div className="flex gap-md flex-wrap items-center" style={{ marginBottom: 'var(--space-xl)' }}>
                        <div className="search-bar" style={{ maxWidth: '320px', flex: 1 }}>
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search mentors..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Search mentors"
                            />
                        </div>
                        <select
                            className="form-select"
                            style={{ maxWidth: '200px' }}
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            aria-label="Filter by domain"
                        >
                            <option value="">All Domains</option>
                            <option value="Career">Career</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="Web Dev">Web Dev</option>
                            <option value="Data Science">Data Science</option>
                            <option value="JEE">JEE/NEET</option>
                            <option value="UPSC">Govt Exams</option>
                            <option value="Tech">Tech</option>
                        </select>
                        <select
                            className="form-select"
                            style={{ maxWidth: '200px' }}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            aria-label="Filter by price"
                        >
                            <option value="">Any Price</option>
                            <option value="500">Under ₹500</option>
                            <option value="1000">Under ₹1000</option>
                            <option value="1500">Under ₹1500</option>
                        </select>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center" style={{ padding: 'var(--space-3xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎓</div>
                            <h3>No mentors found</h3>
                            <p>Try a different search or domain filter</p>
                        </div>
                    ) : (
                        <div className="grid grid-4 gap-xl" id="mentors-grid">
                            {filtered.map(m => (
                                <div className="card card-mentor" key={m.id}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div className="avatar avatar-lg" style={{ margin: '0 auto var(--space-md)' }}>{m.initials}</div>
                                        {m.verified && <div className="badge badge-outline" style={{ fontSize: '0.72rem', borderColor: 'var(--accent-green)', color: 'var(--accent-green)', padding: '2px 8px', marginBottom: 'var(--space-sm)' }}>✓ Verified</div>}
                                    </div>
                                    <h4 style={{ textAlign: 'center' }}>{m.name}</h4>
                                    <p className="mentor-title" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minHeight: '38px', margin: '4px 0', textAlign: 'center' }}>{m.title}</p>
                                    <p className="mentor-company" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', textAlign: 'center' }}>{m.company}</p>
                                    <div className="mentor-specialties" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '12px' }}>
                                        {m.specialties.slice(0, 3).map((spec, idx) => (
                                            <span key={idx} className="badge badge-outline" style={{ fontSize: '0.65rem' }}>{spec}</span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                        <span>⭐ {m.rating}</span>
                                        <span>({m.totalRatings} ratings)</span>
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)', textAlign: 'center' }}>⏳ Reply: {m.responseTime || 'Within a day'}</div>
                                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.25rem', fontWeight: 800 }}>₹{m.price.toLocaleString('en-IN')}</span>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.priceType || '/ session'}</span>
                                        </div>
                                        <button onClick={() => setBookingMentor(m)} className="btn btn-mentor btn-sm w-full" style={{ justifyContent: 'center' }}>Book Session</button>
                                        <button onClick={() => setSelectedMentorProfile(m)} className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'center' }}>View Profile</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* BECOME A MENTOR */}
            <section className="section" style={{ background: 'var(--bg-surface)' }} id="become-mentor">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label mentor">// Open to Everyone</span>
                        <h2>You Know Something? <span className="text-gradient-mentor">Teach It!</span></h2>
                    </div>
                    <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
                        <Link to="/portal" className="btn btn-mentor btn-xl">Start Your Mentor Journey <span className="arrow">→</span></Link>
                    </div>
                </div>
            </section>

            {/* SESSION BOOKING MODAL */}
            {bookingMentor && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, visibility: 'visible' }}>
                    <div className="modal modal-sm" style={{ position: 'relative' }}>
                        <button className="modal-close" onClick={() => setBookingMentor(null)}>✕</button>
                        <div className="modal-header" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3>Book a Session</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>with {bookingMentor.name}</p>
                        </div>
                        <form onSubmit={handleBookSubmit}>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Your Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={bookName}
                                    onChange={(e) => setBookName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="your@email.com"
                                    value={bookEmail}
                                    onChange={(e) => setBookEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                                <label className="form-label required">Topic / Goal</label>
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="What do you want to discuss in this session?"
                                    value={bookTopic}
                                    onChange={(e) => setBookTopic(e.target.value)}
                                    required
                                    style={{ minHeight: '80px', width: '100%', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                                ></textarea>
                            </div>
                            <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                                <label className="form-label">Preferred Time</label>
                                <select
                                    className="form-select"
                                    value={bookTime}
                                    onChange={(e) => setBookTime(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <option>Morning (9 AM - 12 PM)</option>
                                    <option>Afternoon (12 PM - 4 PM)</option>
                                    <option>Evening (4 PM - 8 PM)</option>
                                    <option>Night (8 PM - 10 PM)</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-mentor w-full" style={{ justifyContent: 'center' }}>Confirm Booking →</button>
                        </form>
                    </div>
                </div>
            )}

            {/* PROFILE VIEW MODAL */}
            {selectedMentorProfile && (
                <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, visibility: 'visible' }}>
                    <div className="modal" style={{ maxWidth: '600px', position: 'relative' }}>
                        <button className="modal-close" onClick={() => setSelectedMentorProfile(null)}>✕</button>
                        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <div className="avatar avatar-xl">{selectedMentorProfile.initials}</div>
                            <div>
                                <h2>{selectedMentorProfile.name}</h2>
                                <p className="text-muted">{selectedMentorProfile.title} at {selectedMentorProfile.company}</p>
                                <div style={{ color: 'var(--accent-amber)', marginTop: '4px' }}>{renderStars(selectedMentorProfile.rating)} {selectedMentorProfile.rating}</div>
                            </div>
                        </div>
                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                            <h4>About Mentor</h4>
                            <p style={{ marginTop: 'var(--space-sm)', lineHeight: 1.6 }}>{selectedMentorProfile.bio || 'No biography details provided.'}</p>
                        </div>
                        <div style={{ marginBottom: 'var(--space-lg)' }}>
                            <h4>Specialties</h4>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
                                {selectedMentorProfile.specialties.map((s, i) => (
                                    <span key={i} className="badge badge-primary">{s}</span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setBookingMentor(selectedMentorProfile);
                                setSelectedMentorProfile(null);
                            }}
                            className="btn btn-mentor w-full"
                            style={{ justifyContent: 'center' }}
                        >
                            Book a 1:1 Session Now — ₹{selectedMentorProfile.price}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}