import React, { useState } from 'react';
import { useAppContext } from './context/AppContext';
import { Link } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CorporatePortal from './pages/CorporatePortal';
import MentorPortal from './pages/MentorPortal';
import AdminPortal from './pages/AdminPortal';
import InstitutePortal from './pages/InstitutePortal';

export default function PortalLayout() {
    const { session, currentUser, logout, theme, toggleTheme } = useAppContext();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!session || !currentUser) {
        return <Login />;
    }

    const renderSidebarLinks = () => {
        if (session.type === 'student') {
            return (
                <>
                    <div className="sidebar-link active">🎓 Student Dashboard</div>
                    <Link to="/" className="sidebar-link">🏠 Public Home</Link>
                    <Link to="/careers" className="sidebar-link">💼 Careers Board</Link>
                    <Link to="/mentors" className="sidebar-link">👨‍🏫 Mentorship Hub</Link>
                    <Link to="/exams" className="sidebar-link">📝 Exams Portal</Link>
                </>
            );
        }
        if (session.type === 'corporate') {
            return (
                <>
                    <div className="sidebar-link active">🏢 Employer Portal</div>
                    <Link to="/" className="sidebar-link">🏠 Public Home</Link>
                    <Link to="/careers" className="sidebar-link">💼 Careers Board</Link>
                </>
            );
        }
        if (session.type === 'mentor') {
            return (
                <>
                    <div className="sidebar-link active">👨‍🏫 Mentor Workspace</div>
                    <Link to="/" className="sidebar-link">🏠 Public Home</Link>
                    <Link to="/mentors" className="sidebar-link">👨‍🏫 Mentorship Hub</Link>
                </>
            );
        }
        if (session.type === 'admin') {
            return (
                <>
                    <div className="sidebar-link active">🛡️ System Admin</div>
                    <Link to="/" className="sidebar-link">🏠 Public Home</Link>
                </>
            );
        }
        if (session.type === 'institute') {
            return (
                <>
                    <div className="sidebar-link active">🏫 Institute Portal</div>
                    <Link to="/" className="sidebar-link">🏠 Public Home</Link>
                    <Link to="/corporate" className="sidebar-link">🏢 Corporate Partners</Link>
                    <Link to="/careers" className="sidebar-link">💼 Careers Board</Link>
                </>
            );
        }
    };

    const getDashboardTitle = () => {
        switch (session.type) {
            case 'student': return 'Student Learning Dashboard';
            case 'corporate': return 'Employer Recruiter Portal';
            case 'mentor': return 'Mentor Workspace';
            case 'admin': return 'Platform Admin Workspace';
            case 'institute': return 'Institute Partner Portal';
            default: return 'Dashboard';
        }
    };

    const getDisplayName = () => {
        if (currentUser) {
            return currentUser.company || currentUser.name || currentUser.college || currentUser.label;
        }
        return 'User';
    };

    return (
        <div className="app-container">
            {sidebarOpen && <div className="portal-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
            <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <img src="/favicon.png" alt="Logo" />
                    <div className="sidebar-brand-text">OCC<span>Portal</span></div>
                </div>

                <div style={{ padding: '0 var(--space-sm) var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-lg)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {getDisplayName()}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'capitalize' }}>
                        Active {session.type} Account
                    </div>
                </div>

                <nav className="sidebar-links" onClick={() => setSidebarOpen(false)}>
                    {renderSidebarLinks()}
                </nav>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'auto' }} onClick={() => setSidebarOpen(false)}>
                    <button onClick={toggleTheme} className="sidebar-link" style={{ justifyContent: 'flex-start' }}>
                        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <button onClick={logout} className="sidebar-link" style={{ color: 'var(--accent-rose)' }}>
                        🚪 Sign Out
                    </button>
                </div>
            </aside>

            <main className="portal-main">
                <header className="portal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle Sidebar">
                            ☰
                        </button>
                        <div>
                            <div className="portal-title">{getDashboardTitle()}</div>
                            <div className="portal-subtitle">
                                Manage credentials, track items, and update settings
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-md">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Session Status: <strong style={{ color: 'var(--accent-green)' }}>Online</strong>
                        </span>
                    </div>
                </header>

                {session.type === 'student' && <StudentDashboard />}
                {session.type === 'corporate' && <CorporatePortal />}
                {session.type === 'mentor' && <MentorPortal />}
                {session.type === 'admin' && <AdminPortal />}
                {session.type === 'institute' && <InstitutePortal />}
            </main>
        </div>
    );
}