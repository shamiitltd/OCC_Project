import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CorporatePortal from './pages/CorporatePortal';
import MentorPortal from './pages/MentorPortal';
import AdminPortal from './pages/AdminPortal';
import './App.css';

function MainAppContent() {
  const { session, currentUser, logout, theme, toggleTheme } = useAppContext();
  
  if (!session || !currentUser) {
    return <Login />;
  }

  // Sidebar Links rendering based on session type
  const renderSidebarLinks = () => {
    if (session.type === 'student') {
      return (
        <>
          <div className="sidebar-link active">🎓 Student Dashboard</div>
          <a href="../index.html" className="sidebar-link">🏠 Public Home</a>
          <a href="../careers.html" className="sidebar-link">💼 Careers Board</a>
          <a href="../mentor.html" className="sidebar-link">👨‍🏫 Mentorship Hub</a>
          <a href="../exams.html" className="sidebar-link">📝 Exams Portal</a>
        </>
      );
    }
    if (session.type === 'corporate') {
      return (
        <>
          <div className="sidebar-link active">🏢 Employer Portal</div>
          <a href="../index.html" className="sidebar-link">🏠 Public Home</a>
          <a href="../careers.html" className="sidebar-link">💼 Careers Board</a>
        </>
      );
    }
    if (session.type === 'mentor') {
      return (
        <>
          <div className="sidebar-link active">👨‍🏫 Mentor Workspace</div>
          <a href="../index.html" className="sidebar-link">🏠 Public Home</a>
          <a href="../mentor.html" className="sidebar-link">👨‍🏫 Mentorship Hub</a>
        </>
      );
    }
    if (session.type === 'admin') {
      return (
        <>
          <div className="sidebar-link active">🛡️ System Admin</div>
          <a href="../index.html" className="sidebar-link">🏠 Public Home</a>
        </>
      );
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Layout */}
      <aside className="portal-sidebar">
        <div className="sidebar-logo">
          <div style={{ fontSize: '1.8rem' }}>🚀</div>
          <div className="sidebar-brand-text">OCC<span>Portal</span></div>
        </div>

        <div style={{ padding: '0 var(--space-sm) var(--space-lg)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-lg)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {currentUser.company || currentUser.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'capitalize' }}>
            Active {session.type} Account
          </div>
        </div>

        <nav className="sidebar-links">
          {renderSidebarLinks()}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'auto' }}>
          <button onClick={toggleTheme} className="sidebar-link" style={{ justifyContent: 'flex-start' }}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={logout} className="sidebar-link" style={{ color: 'var(--accent-rose)' }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="portal-main">
        <header className="portal-header">
          <div>
            <div className="portal-title">
              {session.type === 'student' && 'Student Learning Dashboard'}
              {session.type === 'corporate' && 'Employer Recruiter Portal'}
              {session.type === 'mentor' && 'Mentor Workspace'}
              {session.type === 'admin' && 'Platform Admin Workspace'}
            </div>
            <div className="portal-subtitle">
              Manage credentials, track items, and update settings
            </div>
          </div>
          <div className="flex items-center gap-md">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Session Status: <strong style={{ color: 'var(--accent-green)' }}>Online</strong>
            </span>
          </div>
        </header>

        {/* Content Renderers */}
        {session.type === 'student' && <StudentDashboard />}
        {session.type === 'corporate' && <CorporatePortal />}
        {session.type === 'mentor' && <MentorPortal />}
        {session.type === 'admin' && <AdminPortal />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
