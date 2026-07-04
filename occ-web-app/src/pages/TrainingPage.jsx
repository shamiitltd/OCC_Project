import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function TrainingPage() {
    const { AppState } = useAppContext();
    const [courses, setCourses] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        setCourses(AppState.getCourses(true));
    }, [AppState]);

    const filtered = filter === 'all' ? courses : courses.filter(c => c.module === filter);
    const categories = [...new Set(courses.map(c => c.module))];

    return (
        <div className="public-page">
            <section className="page-hero">
                <div className="container">
                    <h1>OCC <span className="text-gradient">TIP</span></h1>
                    <p>Training & Internship Program — Industry-certified courses with job placement assistance.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="filter-tabs">
                        <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('all')}>All Programs</button>
                        {categories.map(cat => (
                            <button key={cat} className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(cat)}>
                                {cat === 'tip' ? 'Career' : cat === 'exams' ? 'Exams' : cat}
                            </button>
                        ))}
                    </div>

                    <div className="courses-grid" style={{ marginTop: 'var(--space-xl)' }}>
                        {filtered.map(course => (
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
                                        <span>⭐ {course.rating}</span>
                                    </div>
                                    <div className="course-footer">
                                        <span className="course-price">₹{course.price.toLocaleString('en-IN')}</span>
                                        <Link to={`/checkout?course=${course.id}`} className="btn btn-primary btn-sm">Enroll Now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}