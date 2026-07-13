import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { login, register, session, AppState } = useAppContext();
  const navigate = useNavigate();

  // Tab State: 'signin' or 'signup'
  const [tab, setTab] = useState('signin');

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup Form State
  const [signupType, setSignupType] = useState('student'); // 'student', 'mentor', 'corporate'
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupDetail, setSignupDetail] = useState(''); // College for student, Company for corporate, Title for mentor

  // General States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Simulation States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [googleStep, setGoogleStep] = useState('select'); // 'select' or 'register_role'
  const [googleSelectedEmail, setGoogleSelectedEmail] = useState('');
  const [googleSelectedName, setGoogleSelectedName] = useState('');

  // If already logged in, redirect to dashboard
  if (session) {
    navigate('/portal', { replace: true });
    return null;
  }

  const fillDemo = (e, p) => {
    setTab('signin');
    setEmail(e);
    setPassword(p);
    setError('');
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = login({ email, password });
      if (result.success) {
        if (window.OC2 && window.OC2.Toast) {
          window.OC2.Toast.success(`Welcome back, ${result.user.name || 'User'}!`);
        }
        navigate('/portal', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        type: signupType,
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone
      };

      if (signupType === 'student') {
        payload.college = signupDetail;
      } else if (signupType === 'corporate') {
        payload.company = signupDetail;
      } else if (signupType === 'mentor') {
        payload.title = signupDetail;
      }

      const result = register(payload);
      if (result.success) {
        if (window.OC2 && window.OC2.Toast) {
          window.OC2.Toast.success(`Account created successfully! Welcome to OCC, ${signupName}.`);
        }
        if (window.OC2 && window.OC2.Confetti) {
          window.OC2.Confetti.burst();
        }
        navigate('/portal', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Login Select Profile
  const handleGoogleSelect = (gEmail, gName) => {
    setError('');
    // 1. Check if user already exists
    const student = AppState.getStudentByEmail(gEmail);
    if (student) {
      AppState.setSession('student', student.id);
      completeGoogleLogin(student.name);
      return;
    }

    const mentor = AppState.getMentors().find(m => m.email === gEmail);
    if (mentor) {
      AppState.setSession('mentor', mentor.id);
      completeGoogleLogin(mentor.name);
      return;
    }

    const corporate = AppState.getCorporates().find(c => c.contact === gEmail);
    if (corporate) {
      AppState.setSession('corporate', corporate.id);
      completeGoogleLogin(corporate.company);
      return;
    }

    // 2. User does not exist, go to role selection step in popup
    setGoogleSelectedEmail(gEmail);
    setGoogleSelectedName(gName || gEmail.split('@')[0]);
    setGoogleStep('register_role');
  };

  // Google Custom input submit
  const handleGoogleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail) return;
    const name = customGoogleName || customGoogleEmail.split('@')[0];
    handleGoogleSelect(customGoogleEmail, name);
  };

  // Google finish registration choice
  const handleGoogleRegisterRole = (roleType) => {
    try {
      let newUser;
      if (roleType === 'student') {
        newUser = AppState.addStudent({
          name: googleSelectedName,
          email: googleSelectedEmail,
          password: 'google_oauth_auth_secured_dummy',
          phone: '',
          college: 'University Partner'
        });
      } else if (roleType === 'corporate') {
        newUser = AppState.addCorporate({
          company: googleSelectedName + ' Corp',
          contact: googleSelectedEmail,
          password: 'google_oauth_auth_secured_dummy',
          logo: googleSelectedName[0].toUpperCase(),
          industry: 'Technology',
          size: '10-50',
          location: 'Remote',
          partnerType: 'Hiring Partner',
          requirements: '',
          activeJobs: 0,
          placedStudents: 0
        });
      }

      AppState.setSession(roleType, newUser.id);
      completeGoogleLogin(googleSelectedName);
    } catch (err) {
      setError('Google Sign-In registration failed.');
      setShowGoogleModal(false);
    }
  };

  const completeGoogleLogin = (displayName) => {
    setShowGoogleModal(false);
    setGoogleStep('select');
    setCustomGoogleEmail('');
    setCustomGoogleName('');
    if (window.OC2 && window.OC2.Toast) {
      window.OC2.Toast.success(`Successfully authenticated via Google as ${displayName}!`);
    }
    if (window.OC2 && window.OC2.Confetti) {
      window.OC2.Confetti.burst();
    }
    navigate('/portal', { replace: true });
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
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <h2 className="text-gradient" style={{ marginBottom: 'var(--space-xs)' }}>Offcampuscareer</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Turning Learners into Earners</p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-alt)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: 'var(--space-lg)'
        }}>
          <button
            type="button"
            onClick={() => { setTab('signin'); setError(''); }}
            style={{
              flex: 1,
              padding: 'var(--space-sm) 0',
              borderRadius: 'var(--radius-sm)',
              background: tab === 'signin' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'signin' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: tab === 'signin' ? '700' : '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setError(''); }}
            style={{
              flex: 1,
              padding: 'var(--space-sm) 0',
              borderRadius: 'var(--radius-sm)',
              background: tab === 'signup' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: tab === 'signup' ? '700' : '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--accent-rose-soft)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-rose)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: 'var(--space-md)'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* --- SIGN IN FORM --- */}
        {tab === 'signin' && (
          <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
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
                placeholder="Enter password"
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ justifyContent: 'center', marginTop: 'var(--space-xs)', width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        )}

        {/* --- SIGN UP FORM --- */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">I want to register as:</label>
              <select
                value={signupType}
                onChange={(e) => { setSignupType(e.target.value); setSignupDetail(''); }}
                className="form-select"
                style={{
                  width: '100%',
                  padding: 'var(--space-md)',
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="student">🎓 Student / Job Seeker</option>
                <option value="corporate">🏢 Employer / Recruiter</option>
                <option value="mentor">👨‍🏫 Expert Mentor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="e.g. Vinay Upadhyay"
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

            <div className="grid grid-2 gap-md">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@example.com"
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
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="98765xxxxx"
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
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Choose password"
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

            {signupType === 'student' && (
              <div className="form-group">
                <label className="form-label">College / University Name</label>
                <input
                  type="text"
                  value={signupDetail}
                  onChange={(e) => setSignupDetail(e.target.value)}
                  placeholder="e.g. IIT Delhi"
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
            )}

            {signupType === 'corporate' && (
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  value={signupDetail}
                  onChange={(e) => setSignupDetail(e.target.value)}
                  placeholder="e.g. TCS / Shamiit LLP"
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
            )}

            {signupType === 'mentor' && (
              <div className="form-group">
                <label className="form-label">Professional Title</label>
                <input
                  type="text"
                  value={signupDetail}
                  onChange={(e) => setSignupDetail(e.target.value)}
                  placeholder="e.g. SDE-2 at Amazon / IAS Officer"
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
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ justifyContent: 'center', marginTop: 'var(--space-xs)', width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>
        )}

        <div className="divider" style={{ margin: 'var(--space-lg) 0' }}></div>

        {/* --- GOOGLE LOGIN ACTION BUTTON --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => { setShowGoogleModal(true); setGoogleStep('select'); }}
            style={{
              justifyContent: 'center',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-alt)',
              gap: 'var(--space-sm)'
            }}
          >
            {/* Embedded Inline SVG Google G Logo Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Demo Login Quick Fill */}
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <h4 style={{ fontSize: '0.85rem', marginBottom: 'var(--space-sm)', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Or Auto-fill Demo Account credentials:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
            <button
              type="button"
              onClick={() => fillDemo('rahul@demo.com', 'demo123')}
              className="badge badge-outline"
              style={{ padding: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo('hr@tcs.com', 'corp123')}
              className="badge badge-outline"
              style={{ padding: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              🏢 Corporate
            </button>
            <button
              type="button"
              onClick={() => fillDemo('mentor@oc2.in', 'mentor123')}
              className="badge badge-outline"
              style={{ padding: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              👨‍🏫 Mentor
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@oc2.in', 'admin123')}
              className="badge badge-outline"
              style={{ padding: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <a href="/" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>← Back to Home</a>
        </div>
      </div>

      {/* --- GOOGLE SIMULATED SELECTOR POPUP MODAL --- */}
      {showGoogleModal && (
        <div className="modal-overlay active visible" onClick={() => setShowGoogleModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()} style={{ background: '#FFFFFF', color: '#1F1F1F', border: '1px solid #DADCE0', borderRadius: '8px', padding: 'var(--space-lg)' }}>
            <button className="modal-close" onClick={() => setShowGoogleModal(false)} style={{ color: '#5F6368', background: '#F1F3F4' }}>✕</button>

            {/* Google Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ margin: '0 auto var(--space-xs)' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <h3 style={{ fontSize: '1.2rem', color: '#202124', fontFamily: 'sans-serif', fontWeight: '500' }}>Sign in with Google</h3>
              <p style={{ fontSize: '0.85rem', color: '#5F6368' }}>to continue to tip.offcampuscareer.com</p>
            </div>

            {googleStep === 'select' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Profile 1 */}
                <button
                  type="button"
                  onClick={() => handleGoogleSelect('rahul@gmail.com', 'Rahul Sharma')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #DADCE0',
                    borderRadius: '4px',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#F8F9FA'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E8F0FE', color: '#1967D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    RS
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#3C4043' }}>Rahul Sharma</div>
                    <div style={{ fontSize: '0.78rem', color: '#5F6368' }}>rahul@gmail.com</div>
                  </div>
                </button>

                {/* Profile 2 */}
                <button
                  type="button"
                  onClick={() => handleGoogleSelect('vinay@gmail.com', 'Vinay Prem Upadhyay')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #DADCE0',
                    borderRadius: '4px',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#F8F9FA'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E8F0FE', color: '#1967D2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    VU
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#3C4043' }}>Vinay Prem Upadhyay</div>
                    <div style={{ fontSize: '0.78rem', color: '#5F6368' }}>vinay@gmail.com</div>
                  </div>
                </button>

                {/* Custom Google account inputs */}
                <div style={{ borderTop: '1px solid #DADCE0', marginTop: 'var(--space-sm)', paddingTop: 'var(--space-sm)' }}>
                  <form onSubmit={handleGoogleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#5F6368', fontWeight: '600' }}>Use another account:</div>
                    <input
                      type="email"
                      required
                      placeholder="Google Email address"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #DADCE0', borderRadius: '4px', fontSize: '0.85rem', color: '#202124', background: '#FFFFFF' }}
                    />
                    <input
                      type="text"
                      placeholder="Display Name (Optional)"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid #DADCE0', borderRadius: '4px', fontSize: '0.85rem', color: '#202124', background: '#FFFFFF' }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '8px 16px',
                        background: '#1A73E8',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.85rem'
                      }}
                    >
                      Next
                    </button>
                  </form>
                </div>
              </div>
            )}

            {googleStep === 'register_role' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: '#3C4043' }}>
                  This is the first time you are logging in with <strong>{googleSelectedEmail}</strong>.
                </p>
                <p style={{ fontSize: '0.85rem', color: '#5F6368' }}>Please select your profile role to complete setup:</p>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--space-xs)' }}>
                  <button
                    type="button"
                    onClick={() => handleGoogleRegisterRole('student')}
                    style={{
                      flex: 1,
                      padding: '12px var(--space-xs)',
                      background: '#1A73E8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    🎓 Student Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGoogleRegisterRole('corporate')}
                    style={{
                      flex: 1,
                      padding: '12px var(--space-xs)',
                      background: '#F1F3F4',
                      color: '#3C4043',
                      border: '1px solid #DADCE0',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  >
                    🏢 Employer Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}