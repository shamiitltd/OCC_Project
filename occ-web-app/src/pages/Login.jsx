import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { login } = useAppContext();
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('rahul@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleQuickLogin = (type, e, p) => {
    setUserType(type);
    setEmail(e);
    setPassword(p);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(userType, { email, password });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 'var(--space-md)'
    }}>
      <div className="card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: 'var(--space-2xl)',
        background: 'var(--bg-surface)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 className="text-gradient" style={{ marginBottom: 'var(--space-sm)' }}>Offcampuscareer</h2>
          <p>Login to your portal to continue learning and growing</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label">Select Portal Type</label>
            <select
              value={userType}
              onChange={(e) => {
                const val = e.target.value;
                setUserType(val);
                if (val === 'student') handleQuickLogin('student', 'rahul@demo.com', 'demo123');
                else if (val === 'mentor') handleQuickLogin('mentor', 'mentor@oc2.in', 'mentor123');
                else if (val === 'corporate') handleQuickLogin('corporate', 'hr@tcs.com', 'corp123');
                else if (val === 'admin') handleQuickLogin('admin', 'admin@oc2.in', 'admin123');
              }}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="student">Student Portal</option>
              <option value="mentor">Mentor Portal</option>
              <option value="corporate">Corporate Partner</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {error && (
            <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', fontWeight: '600' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 'var(--space-sm)' }}>
            Sign In →
          </button>
        </form>

        <div className="divider" style={{ margin: 'var(--space-xl) 0' }}></div>

        <div>
          <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>Demo Quick Login Accounts</h4>
          <div className="flex flex-col gap-sm">
            <button
              onClick={() => handleQuickLogin('student', 'rahul@demo.com', 'demo123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>🎓 Student: Rahul Sharma</span>
              <span className="text-xs text-muted">rahul@demo.com / demo123</span>
            </button>
            <button
              onClick={() => handleQuickLogin('mentor', 'mentor@oc2.in', 'mentor123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>👨‍🏫 Mentor: Vinay Prem Upadhyay</span>
              <span className="text-xs text-muted">mentor@oc2.in / mentor123</span>
            </button>
            <button
              onClick={() => handleQuickLogin('corporate', 'hr@tcs.com', 'corp123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>🏢 Corporate: Tata / TCS</span>
              <span className="text-xs text-muted">hr@tcs.com / corp123</span>
            </button>
            <button
              onClick={() => handleQuickLogin('admin', 'admin@oc2.in', 'admin123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>🛡️ Administrator</span>
              <span className="text-xs text-muted">admin@oc2.in / admin123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
