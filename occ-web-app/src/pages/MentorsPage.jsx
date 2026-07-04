import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function MentorsPage() {
    const { AppState } = useAppContext();
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        setMentors(AppState.getMentors(true));
    }, [AppState]);

    return (
        <div className="public-page">
            <section className="page-hero">
                <div className="container">
                    <h1>OCC <span className="text-gradient">Mentor</span></h1>
                    <p>Get 1:1 mentorship from industry experts. Career coaching, interview prep, and skill guidance.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="mentors-grid">
                        {mentors.map(mentor => (
                            <div className="mentor-card" key={mentor.id}>
                                <div className="mentor-avatar">{mentor.initials}</div>
                                <h3>{mentor.name}</h3>
                                <p className="mentor-title">{mentor.title}</p>
                                <p className="mentor-company">{mentor.company}</p>
                                <div className="mentor-rating">⭐ {mentor.rating} ({mentor.totalRatings} reviews)</div>
                                <div className="mentor-stats">
                                    <span>👨‍🎓 {mentor.students} students</span>
                                    <span>📅 {mentor.sessions} sessions</span>
                                </div>
                                <div className="mentor-specialties">
                                    {mentor.specialties.slice(0, 3).map((s, i) => (
                                        <span key={i} className="badge badge-outline">{s}</span>
                                    ))}
                                </div>
                                <p className="mentor-bio">{mentor.bio}</p>
                                <div className="mentor-footer">
                                    <span className="mentor-price">₹{mentor.price}{mentor.priceType}</span>
                                    <Link to="/portal" className="btn btn-primary btn-sm">Book Session</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}