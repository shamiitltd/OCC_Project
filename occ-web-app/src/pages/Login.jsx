import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { login, session, logout } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in and user visits login page, redirect to dashboard
  if (session) {
    navigate('/portal', { replace: true });
    return null;
  }

  const fillDemo = (e, p) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = login({ email, password });
      if (result.success) {
        navigate('/portal', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
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
          <p>Sign in to access your personalized portal</p>
          <div style={{
            marginTop: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--accent-purple-soft)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            🔒 Auto-detects your account type — no need to select student, mentor, corporate, or admin
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              placeholder="Enter your password"
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
            <div style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--accent-rose-soft)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-rose)',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', marginTop: 'var(--space-sm)' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="divider" style={{ margin: 'var(--space-xl) 0' }}></div>

        <div>
          <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
            Quick Demo Login Accounts
          </h4>
          <p style={{ fontSize: '0.78rem', textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
            Click any account to auto-fill, then click <strong>Sign In</strong>
          </p>
          <div className="flex flex-col gap-sm">
            <button
              type="button"
              onClick={() => fillDemo('rahul@demo.com', 'demo123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>🎓 Student: Rahul Sharma</span>
              <span className="text-xs text-muted">rahul@demo.com / demo123</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('mentor@oc2.in', 'mentor123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>👨‍🏫 Mentor: Vinay Prem Upadhyay</span>
              <span className="text-xs text-muted">mentor@oc2.in / mentor123</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('hr@tcs.com', 'corp123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>🏢 Corporate: TCS</span>
              <span className="text-xs text-muted">hr@tcs.com / corp123</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@oc2.in', 'admin123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>🛡️ System Administrator</span>
              <span className="text-xs text-muted">admin@oc2.in / admin123</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('iitdelhi@oc2.in', 'institute123')}
              className="btn btn-ghost btn-sm"
              style={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}
            >
              <span>🏫 Institute: IIT Delhi</span>
              <span className="text-xs text-muted">iitdelhi@oc2.in / institute123</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <a href="/" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}