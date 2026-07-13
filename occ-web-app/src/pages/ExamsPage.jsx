import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function ExamsPage() {
    const { AppState } = useAppContext();
    const [exams, setExams] = useState([]);

    useEffect(() => {
        setExams(AppState.getExamCategories());
    }, [AppState]);

    return (
        <div className="public-page">
            <section className="page-hero">
                <div className="container">
                    <h1>OCC <span className="text-gradient">Exams</span></h1>
                    <p>Comprehensive preparation for JEE, NEET, UPSC, GATE, CAT, SSC & more competitive exams.</p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="exams-grid">
                        {exams.map(exam => (
                            <div className="exam-card" key={exam.id} style={{ borderTop: `4px solid var(--module-${exam.color || 'exams'})` }}>
                                <div className="exam-icon" style={{ background: `var(--module-${exam.color || 'exams'})` }}>{exam.icon}</div>
                                <h3>{exam.name}</h3>
                                <span className="badge badge-outline">{exam.conductedBy}</span>
                                <div className="exam-details">
                                    <div className="exam-detail"><span>🎯</span> Difficulty: {exam.difficulty}</div>
                                    <div className="exam-detail"><span>📝</span> Eligibility: {exam.eligibility}</div>
                                    <div className="exam-detail"><span>👥</span> Aspirants: {exam.aspirants}</div>
                                    <div className="exam-detail"><span>🎓</span> Seats: {exam.seats}</div>
                                </div>
                                <div className="exam-subjects">
                                    {exam.subjects.map((s, i) => (
                                        <span key={i} className="badge badge-outline">{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}