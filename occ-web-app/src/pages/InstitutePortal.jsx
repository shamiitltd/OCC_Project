import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function InstitutePortal() {
    const { currentUser, AppState } = useAppContext();

    const college = currentUser || {};
    const students = AppState.getStudents().filter(s =>
        s.college && college.name && s.college.toLowerCase().includes(college.name.split(' ')[0].toLowerCase())
    );
    const jobs = AppState.getJobs().filter(j => j.status === 'Active');
    const corporates = AppState.getCorporates();
    const enrollments = AppState.getEnrollments();

    // Stats calculations
    const totalStudents = college.students || 0;
    const placedStudents = college.placedStudents || 0;
    const activeDrives = college.activeDrives || 0;
    const oocStudents = students.length;
    const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    return (
        <div className="portal-content" style={{ padding: 'var(--space-lg)' }}>
            {/* Welcome Banner */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-indigo))',
                padding: 'var(--space-xl) var(--space-2xl)',
                marginBottom: 'var(--space-xl)',
                borderRadius: 'var(--radius-lg)',
                color: '#fff'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '3rem' }}>🏫</div>
                    <div>
                        <h2 style={{ margin: '0 0 var(--space-xs)', fontSize: '1.5rem' }}>{college.name || 'Institute Portal'}</h2>
                        <p style={{ margin: 0, opacity: 0.9 }}>
                            {college.type || 'Partner'} · {college.location || ''} · Partner since {college.partnerSince || '2024'}
                        </p>
                        <p style={{ margin: 'var(--space-xs) 0 0', opacity: 0.85, fontSize: '0.85rem' }}>
                            Collaboration: {college.collaborationType || 'Placement + Training'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
                <div className="card stat-card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🎓</div>
                    <div className="stat-value">{totalStudents.toLocaleString()}</div>
                    <div className="stat-label">Total Students</div>
                </div>
                <div className="card stat-card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>✅</div>
                    <div className="stat-value">{placedStudents}</div>
                    <div className="stat-label">Placed Students</div>
                </div>
                <div className="card stat-card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📋</div>
                    <div className="stat-value">{activeDrives}</div>
                    <div className="stat-label">Active Drives</div>
                </div>
                <div className="card stat-card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📊</div>
                    <div className="stat-value">{placementRate}%</div>
                    <div className="stat-label">Placement Rate</div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
                {/* Active Jobs */}
                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>💼 Active Job Openings</h3>
                    {jobs.length === 0 ? (
                        <p className="text-muted">No active job openings right now.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {jobs.slice(0, 5).map(job => (
                                <div key={job.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 'var(--space-sm) var(--space-md)',
                                    background: 'var(--bg-surface-alt)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{job.role}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            {job.company} · {job.location} · {job.stipend}
                                        </div>
                                    </div>
                                    <span className={`badge badge-${job.type === 'Internship' ? 'cyan' : 'amber'}`}>
                                        {job.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Corporate Partners */}
                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>🏢 Hiring Partners</h3>
                    {corporates.length === 0 ? (
                        <p className="text-muted">No corporate partners yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            {corporates.slice(0, 5).map(corp => (
                                <div key={corp.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 'var(--space-sm) var(--space-md)',
                                    background: 'var(--bg-surface-alt)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{corp.company}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            {corp.industry} · {corp.placedStudents} placed
                                        </div>
                                    </div>
                                    <span className={`badge badge-${corp.partnerType === 'Hiring Partner' ? 'green' : 'indigo'}`}>
                                        {corp.partnerType}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Enrolled Students Section */}
            <div className="card" style={{ padding: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>📚 Students on OCC Platform</h3>
                {oocStudents === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--space-2xl)',
                        color: 'var(--text-muted)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📢</div>
                        <p>No students from your institution have enrolled yet on Offcampuscareer.</p>
                        <p style={{ fontSize: '0.85rem' }}>Share the platform with your students to track their progress here!</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                    <th style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Name</th>
                                    <th style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Email</th>
                                    <th style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Year</th>
                                    <th style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Stream</th>
                                    <th style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Courses</th>
                                    <th style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Profile</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => {
                                    const studentEnrollments = enrollments.filter(e => e.studentId === s.id);
                                    return (
                                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontWeight: 600 }}>{s.name}</td>
                                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{s.email}</td>
                                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.82rem' }}>{s.year || '-'}</td>
                                            <td style={{ padding: 'var(--space-sm) var(--space-md)', fontSize: '0.82rem' }}>{s.stream || '-'}</td>
                                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                                                <span className="badge badge-purple">{studentEnrollments.length}</span>
                                            </td>
                                            <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '6px',
                                                    background: 'var(--bg-surface-alt)',
                                                    borderRadius: '3px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${s.profileComplete || 0}%`,
                                                        height: '100%',
                                                        background: 'var(--accent-green)',
                                                        borderRadius: '3px'
                                                    }} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: 'var(--space-xl)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>⚡ Quick Actions</h3>
                <div className="flex flex-wrap gap-md">
                    <button className="btn btn-primary" onClick={() => window.open('/careers', '_self')}>
                        💼 View Careers Board
                    </button>
                    <button className="btn btn-secondary" onClick={() => window.open('/corporate', '_self')}>
                        🏢 Explore Corporate Partners
                    </button>
                    <button className="btn btn-ghost" onClick={() => window.open('/training', '_self')}>
                        📚 Browse Courses
                    </button>
                </div>
            </div>
        </div>
    );
}