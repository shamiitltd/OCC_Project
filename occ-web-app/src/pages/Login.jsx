import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { login, signup, session } = useAppContext();
  const navigate = useNavigate();

  // Mode state
  const [isSignup, setIsSignup] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('3rd Year');

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
      if (isSignup) {
        // Validation
        if (!name || !email || !password || !phone || !college) {
          throw new Error('All fields are required for signup.');
        }
        const result = await signup({ name, email, password, phone, college, year });
        if (result.success) {
          navigate('/portal', { replace: true });
        }
      } else {
        const result = await login({ email, password });
        if (result.success) {
          navigate('/portal', { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your inputs.');
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
        maxWidth: isSignup ? '640px' : '480px',
        width: '100%',
        padding: 'var(--space-2xl)',
        background: 'var(--bg-surface)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 className="text-gradient" style={{ marginBottom: 'var(--space-sm)' }}>Offcampuscareer</h2>
          <p>{isSignup ? 'Create a new student account' : 'Sign in to access your personalized portal'}</p>
          {!isSignup && (
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
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {isSignup && (
            <>
              <div className="form-group">
                <label className="form-label required">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="grid grid-2 gap-md">
                <div className="form-group">
                  <label className="form-label required">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    required
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="form-select"
                    style={{ width: '100%' }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">College / Institution</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="IIT Delhi"
                  required
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label required">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
              style={{ width: '100%' }}
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
            className="btn btn-primary w-full btn-lg"
            style={{ justifyContent: 'center', marginTop: 'var(--space-sm)' }}
            disabled={loading}
          >
            {loading ? (isSignup ? 'Creating Account...' : 'Signing in...') : (isSignup ? 'Create Account →' : 'Sign In →')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {!isSignup && (
          <>
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
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Home</a>
        </div>
      </div>
    </div>
  );
}