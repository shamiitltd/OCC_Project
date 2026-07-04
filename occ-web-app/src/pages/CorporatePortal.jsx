import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function CorporatePortal() {
  const { currentUser, AppState } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [appliedList, setAppliedList] = useState([]);
  const [colleges, setColleges] = useState([]);
  
  // Post Job State
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('Remote');
  const [newJobType, setNewJobType] = useState('Full Time');
  const [newJobMode, setNewJobMode] = useState('Remote');
  const [newJobSalary, setNewJobSalary] = useState('₹25,000 - ₹35,000 / month');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobSkills, setNewJobSkills] = useState('');

  // Campus Drive State
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveCollege, setDriveCollege] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [driveBranches, setDriveBranches] = useState('CSE, ECE, IT');
  const [scheduledDrives, setScheduledDrives] = useState([
    { college: 'IIT Delhi', date: '2026-08-15', branches: 'CSE, ECE', status: 'Approved' },
    { college: 'BITS Pilani', date: '2026-09-02', branches: 'CSE, EEE, IT', status: 'Pending Approval' }
  ]);

  // Profile Settings
  const [corpName, setCorpName] = useState('');
  const [corpIndustry, setCorpIndustry] = useState('');
  const [corpWebsite, setCorpWebsite] = useState('');
  const [corpDesc, setCorpDesc] = useState('');

  const loadData = () => {
    if (!currentUser) return;
    const allJobs = AppState.getJobs().filter(
      j => j.company.toLowerCase() === currentUser.company.toLowerCase()
    );
    setJobs(allJobs);
    setColleges(AppState.getColleges());

    // Extract all candidate applications directly from company jobs (includes guest/registered applicants)
    const list = [];
    allJobs.forEach(j => {
      if (j.applications) {
        j.applications.forEach(a => {
          let student = AppState.getStudent(a.studentId);
          if (!student) {
            student = {
              id: a.studentId,
              name: a.name || 'Guest Candidate',
              email: a.email || 'guest@example.com',
              phone: a.phone || '',
              college: a.college || 'N/A',
              avatar: (a.name || 'GC').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2),
              stream: 'General Stream',
              joinedAt: a.appliedAt || new Date().toISOString().split('T')[0]
            };
          }
          list.push({
            student,
            applied: a,
            job: j
          });
        });
      }
    });
    setAppliedList(list);

    setCorpName(currentUser.company);
    setCorpIndustry(currentUser.industry || 'Technology');
    setCorpWebsite(currentUser.website || 'https://example.com');
    setCorpDesc(currentUser.description || '');
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const processApplicant = (studentId, jobId, newStatus) => {
    AppState.updateApplicationStatus(jobId, studentId, newStatus);
    alert(`Candidate status updated to: ${newStatus}`);
    loadData();
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    if (!newJobTitle || !newJobDesc) return;
    
    const skillsArr = newJobSkills.split(',').map(s => s.trim()).filter(Boolean);
    AppState.addJob({
      id: 'JOB_' + Date.now(),
      company: currentUser.company,
      companyLogo: currentUser.logo || currentUser.company[0],
      role: newJobTitle,
      location: newJobLocation,
      type: newJobType,
      mode: newJobMode,
      domain: 'Technology',
      stipend: newJobSalary,
      description: newJobDesc,
      skills: skillsArr,
      experience: 'Fresher / Experienced',
      status: 'Active',
      deadline: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      applications: []
    });

    alert(`Job Opening "${newJobTitle}" published!`);
    setShowJobModal(false);
    setNewJobTitle('');
    setNewJobDesc('');
    setNewJobSkills('');
    loadData();
  };

  const handleScheduleDrive = (e) => {
    e.preventDefault();
    if (!driveCollege || !driveDate) return;
    
    const nextDrives = [...scheduledDrives, {
      college: driveCollege,
      date: driveDate,
      branches: driveBranches,
      status: 'Pending Approval'
    }];
    setScheduledDrives(nextDrives);
    alert(`Drive request submitted to ${driveCollege} for ${driveDate}!`);
    setShowDriveModal(false);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    currentUser.company = corpName;
    currentUser.industry = corpIndustry;
    currentUser.website = corpWebsite;
    currentUser.description = corpDesc;

    const corps = AppState.getCorporates();
    const idx = corps.findIndex(c => c.id === currentUser.id);
    if (idx !== -1) {
      corps[idx] = currentUser;
      AppState.set('corporates', corps);
    }
    alert('Profile settings saved.');
    loadData();
  };

  if (!currentUser) return null;

  return (
    <div className="flex-1 flex flex-col">
      {/* KPIs */}
      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>💼</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{jobs.filter(j => j.status === 'Active').length}</h3>
            <span className="text-xs text-muted">Active Jobs</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>👥</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{appliedList.length}</h3>
            <span className="text-xs text-muted">Total Applicants</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>📅</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{scheduledDrives.length}</h3>
            <span className="text-xs text-muted">Campus Drives</span>
          </div>
        </div>
        <div className="card flex items-center gap-md">
          <div style={{ fontSize: '2.5rem' }}>⏱</div>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{appliedList.filter(a => a.applied.status === 'Under Review').length}</h3>
            <span className="text-xs text-muted">New Applicants</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm flex-wrap" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
        <button className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`btn btn-sm ${activeTab === 'jobs' ? 'btn-jobs' : 'btn-ghost'}`} onClick={() => setActiveTab('jobs')}>Job Postings</button>
        <button className={`btn btn-sm ${activeTab === 'applicants' ? 'btn-corporate' : 'btn-ghost'}`} onClick={() => setActiveTab('applicants')}>Applicants Database</button>
        <button className={`btn btn-sm ${activeTab === 'drives' ? 'btn-mentor' : 'btn-ghost'}`} onClick={() => setActiveTab('drives')}>Campus Drives</button>
        <button className={`btn btn-sm ${activeTab === 'profile' ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setActiveTab('profile')}>Company Profile</button>
      </div>

      {/* Tab contents */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <div className="grid grid-2 gap-xl">
            <div>
              <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)' }}>🏢 Company Profile Overview</h4>
                <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="avatar avatar-md" style={{ width: '64px', height: '64px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentUser.logo || currentUser.company[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{currentUser.company}</h3>
                    <p style={{ fontSize: '0.85rem' }}>{currentUser.industry || 'Technology'}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{currentUser.description || 'No description provided.'}</p>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: 'var(--space-lg)' }}>⚙️ Recent Job Openings</h4>
                <div className="flex flex-col gap-sm">
                  {jobs.slice(0, 3).map(j => (
                    <div className="flex justify-between items-center" key={j.id} style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{j.role}</div>
                        <span className="text-xs text-muted">{j.location} · {j.stipend}</span>
                      </div>
                      <span className={`badge ${j.status === 'Active' ? 'badge-green' : 'badge-outline'}`}>{j.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="card">
                <h4 style={{ marginBottom: 'var(--space-lg)' }}>⚡ Quick Applicants Process</h4>
                <div className="flex flex-col gap-sm">
                  {appliedList.slice(0, 4).map((a, idx) => {
                    const matchScore = Math.floor(75 + (a.student.name.charCodeAt(0) % 20));
                    return (
                      <div className="flex justify-between items-center gap-md" key={idx} style={{ padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.student.name}</div>
                          <span className="text-xs text-muted">{a.job.role} · Match: <strong style={{ color: 'var(--accent-green)' }}>{matchScore}%</strong></span>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('applicants')}>Process</button>
                      </div>
                    );
                  })}
                  {appliedList.length === 0 && <p className="text-muted">No applications received yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
              <h4>💼 Published Job Openings</h4>
              <button className="btn btn-primary btn-sm" onClick={() => setShowJobModal(true)}>Post Job Opening</button>
            </div>
            <div className="grid grid-3 gap-lg">
              {jobs.map(j => {
                const count = appliedList.filter(a => a.job.id === j.id).length;
                return (
                  <div className="card" key={j.id}>
                    <div className="flex justify-between items-start" style={{ marginBottom: 'var(--space-md)' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{j.role}</h4>
                        <span className="text-xs text-muted">{j.location} · {j.type}</span>
                      </div>
                      <span className={`badge ${j.status === 'Active' ? 'badge-green' : 'badge-rose'}`}>{j.status}</span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex gap-lg" style={{ margin: 'var(--space-md) 0' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{count}</div>
                        <span className="text-xs text-muted">Applicants</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-green)' }}>{j.stipend}</div>
                        <span className="text-xs text-muted">Stipend</span>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => setActiveTab('applicants')}>View Candidates</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'applicants' && (
          <div className="card">
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>👥 Candidate Applicants Database</h4>
            {appliedList.length === 0 ? (
              <p className="text-muted">No applicants found for your job postings.</p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Target Role</th>
                      <th>AI Match</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliedList.map((a, idx) => {
                      const score = Math.floor(75 + (a.student.name.charCodeAt(0) % 20));
                      return (
                        <tr key={idx}>
                          <td>
                            <div className="flex items-center gap-md">
                              <div className="avatar avatar-sm">{a.student.avatar}</div>
                              <div>
                                <div style={{ fontWeight: 600 }}>{a.student.name}</div>
                                <span className="text-xs text-muted">{a.student.college}</span>
                              </div>
                            </div>
                          </td>
                          <td>{a.job.role}</td>
                          <td><strong style={{ color: score > 85 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{score}%</strong></td>
                          <td><span className="badge badge-outline">{a.applied.status}</span></td>
                          <td>{new Date(a.applied.appliedAt).toLocaleDateString()}</td>
                          <td>
                            <div className="flex gap-xs">
                              <button className="btn btn-sm btn-exams" onClick={() => processApplicant(a.student.id, a.job.id, 'Shortlisted')}>Shortlist</button>
                              <button className="btn btn-sm btn-jobs" onClick={() => processApplicant(a.student.id, a.job.id, 'Interview')}>Interview</button>
                              <button className="btn btn-sm btn-ghost" onClick={() => processApplicant(a.student.id, a.job.id, 'Rejected')}>Reject</button>
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
        )}

        {activeTab === 'drives' && (
          <div className="grid grid-3 gap-lg">
            <div className="card">
              <h4 style={{ marginBottom: 'var(--space-lg)' }}>📅 Schedule Campus Drive</h4>
              <form onSubmit={handleScheduleDrive} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className="form-label">Target College</label>
                  <select
                    value={driveCollege}
                    onChange={(e) => setDriveCollege(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-md)',
                      background: 'var(--bg-surface-alt)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="">Select College...</option>
                    {colleges.map(c => <option value={c.name} key={c.id}>{c.name} ({c.location})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    value={driveDate}
                    onChange={(e) => setDriveDate(e.target.value)}
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
                  <label className="form-label">Target Branches</label>
                  <input
                    type="text"
                    value={driveBranches}
                    onChange={(e) => setDriveBranches(e.target.value)}
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
                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Request Campus Drive</button>
              </form>
            </div>

            <div className="card" style={{ gridColumn: 'span 2' }}>
              <h4 style={{ marginBottom: 'var(--space-lg)' }}>📜 Scheduled Campus Placements</h4>
              <div className="flex flex-col gap-md">
                {scheduledDrives.map((d, idx) => (
                  <div className="card" key={idx} style={{ background: 'var(--bg-surface-alt)' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-sm)' }}>
                      <span style={{ fontWeight: 700 }}>{d.college}</span>
                      <span className={`badge ${d.status === 'Approved' ? 'badge-green' : 'badge-amber'}`}>{d.status}</span>
                    </div>
                    <div className="text-sm text-muted">📅 Drive Date: {new Date(d.date).toLocaleDateString()}</div>
                    <div className="text-sm text-muted">🎓 Target Streams: {d.branches}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card" style={{ maxWidth: '600px' }}>
            <h4 style={{ marginBottom: 'var(--space-lg)' }}>⚙️ Edit Corporate Profile</h4>
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  value={corpName}
                  onChange={(e) => setCorpName(e.target.value)}
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
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  value={corpIndustry}
                  onChange={(e) => setCorpIndustry(e.target.value)}
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
                <label className="form-label">Website</label>
                <input
                  type="text"
                  value={corpWebsite}
                  onChange={(e) => setCorpWebsite(e.target.value)}
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
                <label className="form-label">Company Description</label>
                <textarea
                  rows="4"
                  value={corpDesc}
                  onChange={(e) => setCorpDesc(e.target.value)}
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
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Profile</button>
            </form>
          </div>
        )}
      </div>

      {/* POST JOB MODAL */}
      {showJobModal && (
        <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal" style={{ maxWidth: '600px', width: '100%', position: 'relative' }}>
            <button className="modal-close" onClick={() => setShowJobModal(false)}>✕</button>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>💼 Post a New Job opening</h3>
            <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer Intern"
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
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
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
                  <label className="form-label">Stipend / Salary</label>
                  <input
                    type="text"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
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
                <label className="form-label">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={newJobSkills}
                  onChange={(e) => setNewJobSkills(e.target.value)}
                  placeholder="React, JavaScript, HTML5, CSS3"
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
                <label className="form-label">Job Description</label>
                <textarea
                  rows="4"
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
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
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Publish Job opening</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
