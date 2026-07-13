import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function StudentDashboard() {
  const { currentUser, AppState, refreshSession } = useAppContext();
  const [activeTab, setActiveTab] = useState('courses');
  const [enrollments, setEnrollments] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [mentorSessions, setMentorSessions] = useState([]);
  const [certs, setCerts] = useState([]);
  
  // Modals state
  const [playerCourse, setPlayerCourse] = useState(null);
  const [playerEnrollment, setPlayerEnrollment] = useState(null);
  const [certCourse, setCertCourse] = useState(null);
  const [certEnrollment, setCertEnrollment] = useState(null);
  
  // Profile state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCollege, setProfileCollege] = useState('');
  const [profileStream, setProfileStream] = useState('');
  
  // Load data
  const loadData = () => {
    if (!currentUser) return;
    const enrolls = AppState.getStudentEnrollments(currentUser.id);
    setEnrollments(enrolls);
    setAppliedJobs(currentUser.appliedJobs || []);
    setMentorSessions(currentUser.mentorSessions || []);
    setCerts(enrolls.filter(e => e.certificateIssued));
    
    setProfileName(currentUser.name);
    setProfilePhone(currentUser.phone || '');
    setProfileCollege(currentUser.college || '');
    setProfileStream(currentUser.stream || '');
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    AppState.updateStudent(currentUser.id, {
      name: profileName,
      phone: profilePhone,
      college: profileCollege,
      stream: profileStream,
      profileComplete: 100
    });
    if (window.OC2 && window.OC2.Toast) {
      window.OC2.Toast.success('Profile updated successfully!');
    }
    refreshSession();
  };

  const openPlayer = (courseId) => {
    const course = AppState.getCourse(courseId);
    const enroll = enrollments.find(e => e.courseId === courseId);
    if (course && enroll) {
      setPlayerCourse(course);
      setPlayerEnrollment(enroll);
    }
  };

  const toggleModuleCompletion = (moduleName, isChecked) => {
    if (!playerEnrollment || !playerCourse) return;
    const allEnrolls = AppState.getEnrollments();
    const target = allEnrolls.find(e => e.id === playerEnrollment.id);
    if (!target) return;

    if (!target.completedModules) target.completedModules = [];

    if (isChecked) {
      if (!target.completedModules.includes(moduleName)) {
        target.completedModules.push(moduleName);
      }
    } else {
      target.completedModules = target.completedModules.filter(m => m !== moduleName);
    }

    target.progress = Math.round((target.completedModules.length / playerCourse.modules.length) * 100);
    if (target.progress === 100) {
      target.certificateIssued = true;
      if (window.OC2 && window.OC2.Toast) {
        window.OC2.Toast.success(`🏆 Congratulations! You have completed "${playerCourse.title}" and earned your certificate!`);
      }
      if (window.OC2 && window.OC2.Confetti) {
        window.OC2.Confetti.burst();
      }
    } else {
      target.certificateIssued = false;
    }

    AppState.set('enrollments', allEnrolls);
    loadData();
    
    // Refresh modal states
    setPlayerEnrollment({ ...target });
  };

  const openCert = (courseId) => {
    const course = AppState.getCourse(courseId);
    const enroll = enrollments.find(e => e.courseId === courseId);
    if (course && enroll && enroll.certificateIssued) {
      setCertCourse(course);
      setCertEnrollment(enroll);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Overview stats header */}
      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>📦</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{enrollments.length}</h3>
            <span className="text-xs text-muted">Enrolled Courses</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>🏆</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{certs.length}</h3>
            <span className="text-xs text-muted">Certificates</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>💼</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{appliedJobs.length}</h3>
            <span className="text-xs text-muted">Applied Jobs</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>📅</div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Joined</h3>
            <span className="text-xs text-muted">{new Date(currentUser.joinedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm flex-wrap" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
        <button className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('courses')}>My Courses</button>
        <button className={`btn btn-sm ${activeTab === 'jobs' ? 'btn-jobs' : 'btn-ghost'}`} onClick={() => setActiveTab('jobs')}>Applied Jobs</button>
        <button className={`btn btn-sm ${activeTab === 'sessions' ? 'btn-mentor' : 'btn-ghost'}`} onClick={() => setActiveTab('sessions')}>Mentorship Sessions</button>
        <button className={`btn btn-sm ${activeTab === 'certs' ? 'btn-exams' : 'btn-ghost'}`} onClick={() => setActiveTab('certs')}>Certificates</button>
        <button className={`btn btn-sm ${activeTab === 'profile' ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setActiveTab('profile')}>Edit Profile</button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'courses' && (
          <div className="flex flex-col gap-lg">
            {enrollments.length === 0 ? (
              <div className="card text-center" style={{ padding: 'var(--space-3xl)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎓</div>
                <h3>No active courses</h3>
                <p>Visit the main homepage to explore and enroll in programs!</p>
              </div>
            ) : (
              enrollments.map(e => {
                const course = AppState.getCourse(e.courseId);
                if (!course) return null;
                return (
                  <div className="card" key={e.id}>
                    <div className="flex items-start gap-lg flex-wrap">
                      <div style={{ fontSize: '3rem' }}>{course.icon}</div>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div className="flex items-center gap-md flex-wrap" style={{ marginBottom: 'var(--space-sm)' }}>
                          <h4 style={{ margin: 0 }}>{course.title}</h4>
                          <span className={`badge ${e.certificateIssued ? 'badge-exams' : 'badge-outline'}`}>
                            {e.certificateIssued ? '🏆 Certified' : course.category}
                          </span>
                        </div>
                        <div className="flex gap-xl flex-wrap" style={{ marginBottom: 'var(--space-md)' }}>
                          <span className="text-sm text-muted">⏱ {course.duration}</span>
                          <span className="text-sm text-muted">📦 {(e.completedModules || []).length}/{course.modules.length} modules</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                          <div style={{ flex: 1, height: '8px', background: 'var(--bg-surface-alt)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{ width: `${e.progress}%`, height: '100%', background: 'var(--brand-gradient-solid)' }}></div>
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{e.progress}%</span>
                        </div>
                        <div className="flex gap-sm flex-wrap">
                          <button className="btn btn-primary btn-sm" onClick={() => openPlayer(course.id)}>Continue Learning</button>
                          {e.certificateIssued && (
                            <button className="btn btn-exams btn-sm" onClick={() => openCert(course.id)}>View Certificate</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>💼 Applied Job Openings</h4>
            {appliedJobs.length === 0 ? (
              <p className="text-muted">You have not applied to any jobs yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Job Role</th>
                      <th>Company</th>
                      <th>Stipend</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliedJobs.map((aj, idx) => {
                      const job = AppState.getJob(aj.jobId) || {};
                      return (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{job.role || 'Job Opening'}</td>
                          <td>{job.company || 'Unknown Company'}</td>
                          <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{job.stipend || 'N/A'}</td>
                          <td>
                            <span className={`badge ${
                              aj.status === 'Shortlisted' ? 'badge-green' : 
                              aj.status === 'Interview' ? 'badge-cyan' : 
                              aj.status === 'Rejected' ? 'badge-rose' : 'badge-outline'
                            }`}>{aj.status}</span>
                          </td>
                          <td>{aj.appliedAt ? new Date(aj.appliedAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>📅 Booked Sessions</h4>
            {mentorSessions.length === 0 ? (
              <p className="text-muted">No mentorship sessions scheduled.</p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mentor</th>
                      <th>Topic</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Meeting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentorSessions.map((ms, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>
                          {ms.mentorName}
                          <br />
                          <span className="text-xs text-muted">{ms.mentorTitle}</span>
                        </td>
                        <td>{ms.topic}</td>
                        <td>{new Date(ms.date).toLocaleDateString()}</td>
                        <td>{ms.time}</td>
                        <td><span className="badge badge-outline">{ms.status}</span></td>
                        <td>
                          <a href={ms.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Join</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certs' && (
          <div className="grid grid-3 gap-lg">
            {certs.length === 0 ? (
              <div className="card text-center w-full" style={{ gridColumn: 'span 3', padding: 'var(--space-2xl)' }}>
                <p className="text-muted">No certificates earned yet. Complete all course modules to earn certificates!</p>
              </div>
            ) : (
              certs.map(c => {
                const course = AppState.getCourse(c.courseId);
                if (!course) return null;
                return (
                  <div className="card" key={c.id} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🏆</div>
                    <div className="section-label exams" style={{ marginBottom: 'var(--space-sm)' }}>Completion Certificate</div>
                    <h4 style={{ marginBottom: 'var(--space-sm)' }}>{course.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issued by Offcampuscareer</p>
                    <button className="btn btn-exams btn-sm" style={{ marginTop: 'var(--space-lg)', width: '100%', justifyContent: 'center' }} onClick={() => openCert(course.id)}>
                      View Certificate
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card" style={{ maxWidth: '600px' }}>
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>⚙️ Edit Profile Details</h4>
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
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
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
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
                <label className="form-label">College Name</label>
                <input
                  type="text"
                  value={profileCollege}
                  onChange={(e) => setProfileCollege(e.target.value)}
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
                <label className="form-label">Engineering Stream</label>
                <input
                  type="text"
                  value={profileStream}
                  onChange={(e) => setProfileStream(e.target.value)}
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
              <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-sm)', alignSelf: 'flex-start' }}>
                Save Profile Changes
              </button>
            </form>
          </div>
        )}
      </div>

      {/* COURSE PLAYER MODAL */}
      {playerCourse && playerEnrollment && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal modal-lg" style={{ maxWidth: '900px', padding: 0, overflow: 'hidden', position: 'relative' }}>
            <button className="modal-close" onClick={() => { setPlayerCourse(null); setPlayerEnrollment(null); }} style={{ top: '15px', right: '15px', zIndex: 10 }}>✕</button>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {/* Left Video Area */}
              <div style={{ flex: '1.4', padding: 'var(--space-xl)', minWidth: '320px' }}>
                <div style={{ background: '#000', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 'var(--space-md)', overflow: 'hidden' }}>
                  <div style={{ fontSize: '4rem', color: 'var(--brand-primary)' }}>🎥</div>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>Syllabus Lecture Video</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Offcampuscareer TIP Learning Player</span>
                  </div>
                </div>
                <h3>{playerCourse.title}</h3>
                <p className="text-sm text-muted" style={{ marginTop: '4px' }}>Instructor: {playerCourse.instructor}</p>
                <div className="divider" style={{ margin: 'var(--space-md) 0' }}></div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{playerCourse.description}</p>
              </div>

              {/* Right Sidebar Syllabus */}
              <div style={{ flex: '1', background: 'var(--bg-surface-alt)', borderLeft: '1px solid var(--border-subtle)', padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', maxHeight: '550px', overflowY: 'auto', minWidth: '260px' }}>
                <h4 style={{ marginBottom: 'var(--space-md)' }}>Syllabus Modules</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
                  {(playerEnrollment.completedModules || []).length} of {playerCourse.modules.length} modules completed
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {playerCourse.modules.map((m, idx) => {
                    const isChecked = (playerEnrollment.completedModules || []).includes(m);
                    return (
                      <label key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-md)',
                        padding: 'var(--space-sm) var(--space-md)',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => toggleModuleCompletion(m, e.target.checked)}
                        />
                        <span style={{
                          color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isChecked ? 'line-through' : 'none'
                        }}>{m}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {certCourse && certEnrollment && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal modal-lg" style={{ maxWidth: '800px', padding: 0, overflow: 'hidden', position: 'relative' }}>
            <button className="modal-close" onClick={() => { setCertCourse(null); setCertEnrollment(null); }} style={{ top: '15px', right: '15px', zIndex: 10 }}>✕</button>
            <div style={{ padding: 'var(--space-2xl)', background: '#0c0c1d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '100%',
                border: '8px double var(--brand-primary)',
                padding: 'var(--space-2xl)',
                background: '#12122c',
                position: 'relative',
                color: '#fff',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}>
                <div style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '1.5rem', color: 'var(--brand-primary)' }}>★</div>
                <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '1.5rem', color: 'var(--brand-primary)' }}>★</div>
                
                <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🏆</div>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, letterSpacing: '2px', color: 'var(--text-primary)', marginBottom: 'var(--space-xs)', fontSize: '1.5rem' }}>CERTIFICATE OF COMPLETION</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Offcampuscareer TIP</span>
                
                <div style={{ margin: 'var(--space-xl) 0' }}>
                  <p className="text-sm text-muted">This is proudly presented to</p>
                  <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#fff', margin: 'var(--space-sm) 0', fontSize: '2rem' }}>{currentUser.name}</h1>
                  <p className="text-sm text-muted">for successfully completing the industry-certified training program in</p>
                  <h3 style={{ color: 'var(--accent-cyan)', margin: 'var(--space-sm) 0' }}>{certCourse.title.toUpperCase()}</h3>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                  flexWrap: 'wrap',
                  gap: 'var(--space-md)',
                  marginTop: 'var(--space-2xl)',
                  paddingTop: 'var(--space-lg)',
                  borderTop: '1px solid var(--border-subtle)',
                  textAlign: 'left'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Verification Code</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--brand-primary)' }}>OCC-{certEnrollment.id.toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Vinay Prem Upadhyay</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Founder, SHAMIIT LLP</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Date of Issue</div>
                    <div style={{ fontSize: '0.8rem', color: '#fff' }}>{new Date(certEnrollment.startDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: 'var(--space-md) var(--space-xl)', background: 'var(--bg-surface-alt)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-ghost" onClick={() => { setCertCourse(null); setCertEnrollment(null); }}>Close</button>
              <button className="btn btn-primary" onClick={() => alert('PDF download started (mock)!')}>Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
