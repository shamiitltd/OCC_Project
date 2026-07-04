import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function MentorPortal() {
  const { currentUser, AppState } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data State
  const [mentorCourses, setMentorCourses] = useState([]);
  const [mentorPayments, setMentorPayments] = useState([]);
  const [earningsKPIs, setEarningsKPIs] = useState({ total: 0, month: 0, sessions: 0, coursesShare: 0 });
  const [reviews, setReviews] = useState([]);

  // Create Course Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Career');
  const [newDuration, setNewDuration] = useState('8 Weeks');
  const [newLevel, setNewLevel] = useState('Beginner');
  const [newPrice, setNewPrice] = useState(4999);
  const [newDesc, setNewDesc] = useState('');
  const [newModules, setNewModules] = useState('');

  // Profile Settings
  const [profName, setProfName] = useState('');
  const [profTitle, setProfTitle] = useState('');
  const [profBio, setProfBio] = useState('');
  const [profPrice, setProfPrice] = useState(2000);

  const loadData = () => {
    if (!currentUser) return;
    
    // Filter courses owned by this mentor
    const allCourses = AppState.getCourses().filter(c => c.instructorId === currentUser.id);
    setMentorCourses(allCourses);

    // Query actual student payments for courses owned by this mentor
    const allPayments = AppState.getPayments();
    const payments = allPayments.filter(p => {
      const course = AppState.getCourse(p.courseId);
      return course && course.instructorId === currentUser.id;
    });
    setMentorPayments(payments);

    // Earnings calculation
    const courseRevenueShare = payments.reduce((sum, p) => sum + p.amount * 0.8, 0);
    const sessionRevenueShare = currentUser.sessions * currentUser.price * 0.8;
    const finalTotal = courseRevenueShare + sessionRevenueShare;
    const finalMonth = Math.floor(finalTotal * 0.08);

    setEarningsKPIs({
      total: finalTotal,
      month: finalMonth,
      sessions: sessionRevenueShare,
      coursesShare: courseRevenueShare
    });

    // Dummy reviews list to match mentor's profile
    setReviews([
      { author: 'Rahul Sharma', rating: 5, date: '2026-06-12', text: 'Amazing mentor! The session on mock coding interviews was extremely helpful. I cleared my round!' },
      { author: 'Priya Patel', rating: 5, date: '2026-06-18', text: 'Highly detailed feedback on my resume. Great domain expertise.' },
      { author: 'Amit Singh', rating: 4, date: '2026-06-25', text: 'Clear explanations and very patient during the doubt clearing session.' }
    ]);

    setProfName(currentUser.name);
    setProfTitle(currentUser.title);
    setProfBio(currentUser.bio || '');
    setProfPrice(currentUser.price || 2000);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const modulesList = newModules.split(',').map(m => m.trim()).filter(Boolean);
    const courseId = 'CRS_' + Date.now();

    const newCourseObj = {
      id: courseId,
      title: newTitle,
      category: newCategory,
      duration: newDuration,
      level: newLevel,
      price: Number(newPrice),
      rating: 5.0,
      enrolled: 0,
      published: true,
      featured: false,
      icon: '📚',
      color: 'purple',
      module: 'tip',
      instructor: currentUser.name,
      instructorId: currentUser.id,
      tags: [newCategory],
      description: newDesc,
      modules: modulesList.length ? modulesList : ['Introduction', 'Core Learning', 'Capstone Project', 'Final Assessment'],
      image: '',
      language: 'English',
      certificate: true
    };

    AppState.addCourse(newCourseObj);
    alert(`Course "${newTitle}" created successfully!`);
    
    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewModules('');
    setActiveTab('courses');
    loadData();
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    currentUser.name = profName;
    currentUser.title = profTitle;
    currentUser.bio = profBio;
    currentUser.price = Number(profPrice);

    const mentors = AppState.getMentors();
    const idx = mentors.findIndex(m => m.id === currentUser.id);
    if (idx !== -1) {
      mentors[idx] = currentUser;
      AppState.set('mentors', mentors);
    }
    alert('✅ Profile updated successfully!');
    loadData();
  };

  if (!currentUser) return null;

  return (
    <div className="flex-1 flex flex-col">
      {/* KPIs */}
      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>👨‍🎓</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{(currentUser.students + mentorPayments.length).toLocaleString()}</h3>
            <span className="text-xs text-muted">Total Students</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>📚</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{mentorCourses.length}</h3>
            <span className="text-xs text-muted">Courses Created</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>💰</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{earningsKPIs.total.toLocaleString('en-IN')}</h3>
            <span className="text-xs text-muted">Total Share Earnings</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>⭐</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{currentUser.rating}</h3>
            <span className="text-xs text-muted">Average Rating</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm flex-wrap" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
        <button className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`btn btn-sm ${activeTab === 'courses' ? 'btn-jobs' : 'btn-ghost'}`} onClick={() => setActiveTab('courses')}>Courses Manager</button>
        <button className={`btn btn-sm ${activeTab === 'earnings' ? 'btn-corporate' : 'btn-ghost'}`} onClick={() => setActiveTab('earnings')}>Earnings Ledger</button>
        <button className={`btn btn-sm ${activeTab === 'reviews' ? 'btn-mentor' : 'btn-ghost'}`} onClick={() => setActiveTab('reviews')}>Student Reviews</button>
        <button className={`btn btn-sm ${activeTab === 'profile' ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setActiveTab('profile')}>Mentor Profile</button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <div className="grid grid-2 gap-xl">
            <div>
              <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)' }}>👨‍🏫 Instructor Profile Summary</h4>
                <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="avatar avatar-md" style={{ width: '64px', height: '64px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentUser.initials}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{currentUser.name}</h3>
                    <p style={{ fontSize: '0.85rem' }}>{currentUser.title}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{currentUser.bio || 'Professional industry mentor.'}</p>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 'var(--space-lg)' }}>💳 Earning Accounts Overview</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div className="flex justify-between"><span>Course Sales (80% share)</span><span style={{ fontWeight: 600 }}>₹{earningsKPIs.coursesShare.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>1:1 Sessions (80% share)</span><span style={{ fontWeight: 600 }}>₹{earningsKPIs.sessions.toLocaleString('en-IN')}</span></div>
                  <div className="divider"></div>
                  <div className="flex justify-between" style={{ color: 'var(--accent-green)', fontWeight: 700 }}><span>Total Earnings</span><span>₹{earningsKPIs.total.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            </div>

            <div>
              <div className="card">
                <h4 style={{ marginBottom: 'var(--space-lg)' }}>🎓 Student Reviews Feedback</h4>
                <div className="flex flex-col gap-md">
                  {reviews.map((r, idx) => (
                    <div key={idx} style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex justify-between" style={{ marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.author}</span>
                        <span style={{ color: 'var(--accent-amber)' }}>{'★'.repeat(r.rating)}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
              <h4>📚 My Authored Courses</h4>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('create-course')}>Add Course Program</button>
            </div>
            <div className="grid grid-3 gap-lg">
              {mentorCourses.map(c => (
                <div className="card" key={c.id}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--space-sm)' }}>{c.icon}</div>
                  <h4>{c.title}</h4>
                  <p className="text-xs text-muted" style={{ margin: '4px 0 var(--space-md)' }}>Category: {c.category} · Duration: {c.duration}</p>
                  <div className="divider"></div>
                  <div className="flex justify-between" style={{ marginTop: 'var(--space-md)' }}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{c.enrolled || 0}</div>
                      <span className="text-xs text-muted">Students</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>₹{c.price.toLocaleString('en-IN')}</div>
                      <span className="text-xs text-muted">Price</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'create-course' && (
          <div className="card" style={{ maxWidth: '600px' }}>
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>📚 Add a Course Program</h4>
            <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master React & Node Application Design"
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
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
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
                  <label className="form-label">Price (INR)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
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
                <label className="form-label">Syllabus Modules (comma-separated)</label>
                <input
                  type="text"
                  value={newModules}
                  onChange={(e) => setNewModules(e.target.value)}
                  placeholder="Syllabus Unit 1, Syllabus Unit 2, Assessment"
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
                <label className="form-label">Course Description</label>
                <textarea
                  rows="4"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--space-md)',
                    background: 'var(--bg-surface-alt)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit'
                  }}
                ></textarea>
              </div>
              <div className="flex gap-sm">
                <button type="submit" className="btn btn-primary">Create Course</button>
                <button type="button" className="btn btn-ghost" onClick={() => setActiveTab('courses')}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>💳 Dynamic Share Ledger</h4>
            {mentorPayments.length === 0 ? (
              <p className="text-muted">No student course purchase ledger entries found.</p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Receipt No</th>
                      <th>Student Name</th>
                      <th>Purchased Program</th>
                      <th>Amount Paid</th>
                      <th>My Share (80%)</th>
                      <th>Issue Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentorPayments.map((p, idx) => {
                      const student = AppState.getStudent(p.studentId);
                      const course = AppState.getCourse(p.courseId);
                      return (
                        <tr key={idx}>
                          <td style={{ fontFamily: 'monospace' }}>{p.receiptNo}</td>
                          <td>{student ? student.name : 'Registered Student'}</td>
                          <td style={{ fontWeight: 600 }}>{course ? course.title : 'Active Course'}</td>
                          <td>₹{p.amount.toLocaleString('en-IN')}</td>
                          <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>₹{(p.amount * 0.8).toLocaleString('en-IN')}</td>
                          <td>{new Date(p.date).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>⭐ Student Reviews Feedback</h4>
            <div className="flex flex-col gap-lg">
              {reviews.map((r, idx) => (
                <div className="card" key={idx} style={{ background: 'var(--bg-surface-alt)' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-sm)' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{r.author}</span>
                      <div className="text-xs text-muted">Feedback on: {new Date(r.date).toLocaleDateString()}</div>
                    </div>
                    <span style={{ color: 'var(--accent-amber)', fontSize: '1.1rem' }}>{'★'.repeat(r.rating)}</span>
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.6 }}>"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card" style={{ maxWidth: '600px' }}>
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>⚙️ Edit Mentor Profile Settings</h4>
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
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
                <label className="form-label">Professional Title</label>
                <input
                  type="text"
                  value={profTitle}
                  onChange={(e) => setProfTitle(e.target.value)}
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
                <label className="form-label">1:1 Session Price (per hour, INR)</label>
                <input
                  type="number"
                  value={profPrice}
                  onChange={(e) => setProfPrice(e.target.value)}
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
                <label className="form-label">Biography</label>
                <textarea
                  rows="4"
                  value={profBio}
                  onChange={(e) => setProfBio(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-md)',
                    background: 'var(--bg-surface-alt)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit'
                  }}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Profile Details</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
