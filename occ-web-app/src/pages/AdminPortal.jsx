import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function AdminPortal() {
  const { AppState, ApiClient } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Admin Data State
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  // Platform KPIs
  const [kpis, setKpis] = useState({ revenue: 0, students: 0, mentors: 0, courses: 0 });

  const loadData = async () => {
    // Sourcing from local AppState fallbacks mapped through ApiClient mock endpoints to ensure clean formatting
    const stds = AppState.getStudents();
    const ments = AppState.getMentors();
    const crss = AppState.getCourses();
    const jbs = AppState.getJobs();
    
    setStudents(stds);
    setMentors(ments);
    setCourses(crss);
    setJobs(jbs);

    // Call ApiClient fallback enrichment methods we verified
    try {
      const cls = await ApiClient.getAdminClasses();
      const asg = await ApiClient.getAdminAssignments();
      const pay = await ApiClient.getAdminPayments();
      
      setClasses(cls || []);
      setAssignments(asg || []);
      setPayments(pay || []);
    } catch (e) {
      console.error('Failed to load enriched admin data', e);
    }

    const totalRev = AppState.getTotalRevenue();
    setKpis({
      revenue: totalRev,
      students: stds.length,
      mentors: ments.length,
      courses: crss.length
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* KPIs */}
      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>👨‍🎓</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{kpis.students}</h3>
            <span className="text-xs text-muted">Total Students</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>👨‍🏫</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{kpis.mentors}</h3>
            <span className="text-xs text-muted">Total Mentors</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>📚</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{kpis.courses}</h3>
            <span className="text-xs text-muted">Total Courses</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>💰</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)' }}>₹{kpis.revenue.toLocaleString('en-IN')}</h3>
            <span className="text-xs text-muted">Total Platform Revenue</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm flex-wrap" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
        <button className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`btn btn-sm ${activeTab === 'students' ? 'btn-ghost' : 'btn-ghost'}`} onClick={() => setActiveTab('students')}>Students</button>
        <button className={`btn btn-sm ${activeTab === 'mentors' ? 'btn-ghost' : 'btn-ghost'}`} onClick={() => setActiveTab('mentors')}>Mentors</button>
        <button className={`btn btn-sm ${activeTab === 'classes' ? 'btn-ghost' : 'btn-ghost'}`} onClick={() => setActiveTab('classes')}>Classes</button>
        <button className={`btn btn-sm ${activeTab === 'assignments' ? 'btn-ghost' : 'btn-ghost'}`} onClick={() => setActiveTab('assignments')}>Assignments</button>
        <button className={`btn btn-sm ${activeTab === 'payments' ? 'btn-ghost' : 'btn-ghost'}`} onClick={() => setActiveTab('payments')}>Payments</button>
        <button className={`btn btn-sm ${activeTab === 'jobs' ? 'btn-ghost' : 'btn-ghost'}`} onClick={() => setActiveTab('jobs')}>Jobs</button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <div className="grid grid-2 gap-xl">
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-lg)' }}>🛡️ Admin Panel Status</h4>
              <p style={{ lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
                Welcome to the platform administrator dashboard. Here you can inspect overall student enrollments, mentor availability, structured classes schedules, course assignment submissions, payments billing receipts, and published job postings.
              </p>
              <div className="divider"></div>
              <p className="text-xs text-muted" style={{ marginTop: 'var(--space-md)' }}>
                System Version: 2.0.0 (Vite React Web App Build)
              </p>
            </div>
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-lg)' }}>⚡ Quick Stat Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div className="flex justify-between"><span>Scheduled Classes</span><span style={{ fontWeight: 600 }}>{classes.length}</span></div>
                <div className="flex justify-between"><span>Active Assignments</span><span style={{ fontWeight: 600 }}>{assignments.length}</span></div>
                <div className="flex justify-between"><span>Total Posted Jobs</span><span style={{ fontWeight: 600 }}>{jobs.length}</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>🎓 Student Database</h4>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>College</th>
                    <th>Stream</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontFamily: 'monospace' }}>{s.id}</td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.college}</td>
                      <td>{s.stream}</td>
                      <td>{new Date(s.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>👨‍🏫 Mentors Database</h4>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Price / Hr</th>
                    <th>Rating</th>
                    <th>Total Sessions</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontFamily: 'monospace' }}>{m.id}</td>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td>{m.title}</td>
                      <td>₹{m.price}</td>
                      <td>⭐ {m.rating} ({m.totalRatings})</td>
                      <td>{m.sessions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>📅 Scheduled Classes & Live Sessions</h4>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Class ID</th>
                    <th>Course Title</th>
                    <th>Instructor</th>
                    <th>Date / Time</th>
                    <th>Attendees</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'monospace' }}>{c.id}</td>
                      <td style={{ fontWeight: 600 }}>{c.course_title || 'General Session'}</td>
                      <td>{c.instructor}</td>
                      <td>{new Date(c.date).toLocaleDateString()} · {c.time}</td>
                      <td>{c.attendees ? c.attendees.length : 0} enrolled</td>
                      <td>
                        <a href={c.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Join Session</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>📝 Course Assignments Checklist</h4>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Assignment ID</th>
                    <th>Course Program</th>
                    <th>Task Title</th>
                    <th>Due Date</th>
                    <th>Submissions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontFamily: 'monospace' }}>{a.id}</td>
                      <td style={{ fontWeight: 600 }}>{a.course_title || 'General Course'}</td>
                      <td>{a.title}</td>
                      <td>{new Date(a.due_date).toLocaleDateString()}</td>
                      <td>{a.submissions ? a.submissions.length : 0} submitted</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>💳 Platform Payments ledger</h4>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>Student Name</th>
                    <th>Program Title</th>
                    <th>Paid Amount</th>
                    <th>Payment Method</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'monospace' }}>{p.receipt_no}</td>
                      <td style={{ fontWeight: 600 }}>{p.student_name}</td>
                      <td>{p.course_title}</td>
                      <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                      <td>{p.method}</td>
                      <td>{new Date(p.date).toLocaleDateString()}</td>
                      <td><span className="badge badge-green">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>💼 Published Jobs Manager</h4>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Stipend</th>
                    <th>Status</th>
                    <th>Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j.id}>
                      <td style={{ fontFamily: 'monospace' }}>{j.id}</td>
                      <td style={{ fontWeight: 600 }}>{j.role}</td>
                      <td>{j.company}</td>
                      <td>{j.location} ({j.mode})</td>
                      <td style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{j.stipend}</td>
                      <td><span className={`badge ${j.status === 'Active' ? 'badge-green' : 'badge-outline'}`}>{j.status}</span></td>
                      <td>{j.applications ? j.applications.length : 0} candidates</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
