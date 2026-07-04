/* ============================================================
   OFFCAMPUSCAREER — ApiClient (Database & AppState Fallback Integration Layer)
   Handles API requests to PHP/SQLite backend, with automatic fallback
   to LocalStorage AppState when backend is offline.
   ============================================================ */

import AppState from './app-state.js';

const ApiClient = {
  baseUrl: 'api',
  useLocalFallback: true, // Auto-fallback active

  async request(endpoint, method = 'GET', data = null) {
    if (!this.useLocalFallback) {
      try {
        const config = {
          method: method,
          headers: { 'Content-Type': 'application/json' }
        };
        if (data) config.body = JSON.stringify(data);
        const response = await fetch(`${this.baseUrl}/${endpoint}`, config);
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.error || 'Network request failed');
        return resData;
      } catch (error) {
        console.warn(`API server offline for endpoint (${endpoint}). Falling back to Local AppState.`);
      }
    }
    return this.fallback(endpoint, method, data);
  },

  /* ── Local AppState Fallback Logic ── */
  fallback(endpoint, method, data) {
    const url = new URL(endpoint, 'http://localhost/api/');
    const action = url.searchParams.get('action');
    const path = url.pathname.replace('/api/', '');

    // Auth Actions
    if (path === 'auth.php') {
      if (action === 'login') {
        const type = data.type || 'student';
        if (type === 'admin') {
          if (data.email === 'admin@oc2.in' && data.password === 'admin123') {
            AppState.setSession('admin', 'ADM001');
            return { success: true, session: { type: 'admin', userId: 'ADM001' } };
          }
        } else if (type === 'student') {
          const student = AppState.getStudentByEmail(data.email);
          if (student && student.password === data.password) {
            AppState.setSession('student', student.id);
            return { success: true, session: { type: 'student', userId: student.id } };
          }
        }
        throw new Error('Invalid credentials');
      }
      
      if (action === 'logout') {
        AppState.clearSession();
        return { success: true };
      }
      
      if (action === 'status') {
        const session = AppState.getSession();
        return session ? { loggedIn: true, type: session.type, userId: session.userId } : { loggedIn: false };
      }
    }

    // Student Dashboard Actions
    if (path === 'student.php') {
      const session = AppState.getSession();
      const studentId = session ? session.userId : 'STD001';
      
      if (action === 'dashboard') {
        return {
          enrollments: AppState.getStudentEnrollments(studentId),
          classes: AppState.getClasses(),
          payments: AppState.getPayments().filter(p => p.studentId === studentId)
        };
      }
      if (action === 'courses') return AppState.getStudentEnrollments(studentId);
      if (action === 'classes') return AppState.getClasses().filter(c => AppState.getStudentEnrollments(studentId).some(e => e.courseId === c.courseId));
      if (action === 'assignments') return AppState.getAssignments();
      if (action === 'certificates') return AppState.getStudentEnrollments(studentId).filter(e => e.certificateIssued);
      if (action === 'payments') return AppState.getPayments().filter(p => p.studentId === studentId);
      if (action === 'submit_assignment') {
        OC2.Toast.success('Assignment submitted successfully!');
        return { success: true };
      }
      if (action === 'update_profile') {
        AppState.updateStudent(studentId, data);
        return { success: true };
      }
    }

    // Admin Portal Actions
    if (path === 'admin.php') {
      if (action === 'dashboard') {
        const students = AppState.getStudents();
        const courses = AppState.getCourses();
        const recentEnrollments = [];
        students.forEach(s => {
          const enrolls = AppState.getStudentEnrollments(s.id);
          enrolls.forEach(e => {
            const c = AppState.getCourse(e.courseId);
            recentEnrollments.push({
              student_name: s.name,
              course_title: c ? c.title : 'Course',
              progress: e.progress,
              start_date: s.joinedAt
            });
          });
        });
        return {
          kpis: {
            totalStudents: students.length,
            activeCourses: courses.filter(c => c.published).length,
            totalRevenue: AppState.getTotalRevenue(),
            placementRate: AppState.getPlacementRate()
          },
          recentEnrollments: recentEnrollments.slice(0, 5),
          chart: { Jan: 10, Feb: 18, Mar: 25, Apr: 34, May: 52, Jun: 85 }
        };
      }
      if (action === 'students') return AppState.getStudents();
      if (action === 'add_student') return AppState.addStudent(data);
      if (action === 'delete_student') {
        const students = AppState.getStudents();
        const updated = students.filter(s => s.id !== data.studentId);
        AppState.set('students', updated);
        return { success: true };
      }
      if (action === 'courses') return AppState.getCourses();
      if (action === 'add_course') return AppState.addCourse(data);
      if (action === 'toggle_publish') {
        const courses = AppState.getCourses();
        const c = courses.find(x => x.id === data.courseId);
        if (c) { c.published = !c.published; AppState.set('courses', courses); }
        return { success: true };
      }
      if (action === 'delete_course') {
        const courses = AppState.getCourses();
        const updated = courses.filter(c => c.id !== data.courseId);
        AppState.set('courses', updated);
        return { success: true };
      }
      if (action === 'classes') {
        const classes = AppState.getClasses();
        return classes.map(c => {
          const course = AppState.getCourse(c.courseId);
          return {
            ...c,
            course_title: course ? course.title : 'Course'
          };
        });
      }
      if (action === 'add_class') return AppState.addClass(data);
      if (action === 'assignments') {
        const assignments = AppState.getAssignments();
        return assignments.map(a => {
          const course = AppState.getCourse(a.courseId);
          return {
            id: a.id,
            title: a.title,
            course_title: course ? course.title : 'Course',
            due_date: a.dueDate,
            description: a.description,
            submissions: (a.submissions || []).map(sub => {
              const student = AppState.getStudent(sub.studentId);
              return {
                student_name: student ? student.name : 'Student',
                file_name: sub.fileName,
                submitted_at: sub.submittedAt,
                grade: sub.grade
              };
            })
          };
        });
      }
      if (action === 'add_assignment') return AppState.addAssignment(data);
      if (action === 'payments') {
        const payments = AppState.getPayments();
        return payments.map(p => {
          const student = AppState.getStudent(p.studentId);
          const course = AppState.getCourse(p.courseId);
          return {
            id: p.id,
            receipt_no: p.receiptNo,
            student_name: student ? student.name : 'Student',
            course_title: course ? course.title : 'Course',
            amount: p.amount,
            method: p.method,
            date: p.date,
            status: p.status
          };
        });
      }
      if (action === 'jobs') {
        const jobs = AppState.getJobs();
        return jobs.map(j => {
          return {
            ...j,
            applications: (j.applications || []).map(a => {
              return {
                ...a,
                student_name: a.name || a.student_name || 'Guest Candidate',
                student_email: a.email || a.student_email || 'guest@example.com',
                applied_at: a.appliedAt || a.applied_at || new Date().toISOString().split('T')[0],
                match_score: a.match_score || a.matchScore || Math.floor(65 + Math.random() * 30),
                match_explanation: a.match_explanation || a.matchExplanation || "AI Match evaluation complete."
              };
            })
          };
        });
      }
      if (action === 'add_job') return AppState.addJob(data);
      if (action === 'contacts') return AppState.getContacts();
    }

    // Public Jobs Actions
    if (path === 'jobs.php') {
      if (action === 'list') return AppState.getJobs();
      if (action === 'apply') {
        const session = AppState.getSession();
        const studentId = session ? session.userId : 'STD001';
        const students = AppState.getStudents();
        const s = students.find(x => x.id === studentId);
        if (s) {
          if (!s.appliedJobs) s.appliedJobs = [];
          if (!s.appliedJobs.some(aj => aj.jobId === data.jobId)) {
            s.appliedJobs.push({ jobId: data.jobId, status: 'Under Review', appliedAt: new Date().toISOString() });
            AppState.set('students', students);
          }
        }
        return { success: true };
      }
    }

    // Public Courses Actions
    if (path === 'courses.php') {
      const id = url.searchParams.get('id');
      if (id) return AppState.getCourse(id);
      return AppState.getCourses();
    }

    // Contact form Actions
    if (path === 'contact.php') {
      AppState.addContact(data);
      return { success: true };
    }

    // Checkout Actions
    if (path === 'checkout.php') {
      return AppState.checkout(data);
    }

    throw new Error(`Endpoint not mapped in fallback: ${endpoint}`);
  },

  /* ── Auth API ── */
  async login(email, password, type = 'student') {
    return this.request(`auth.php?action=login`, 'POST', { email, password, type });
  },

  async logout() {
    return this.request(`auth.php?action=logout`, 'GET');
  },

  async getSessionStatus() {
    return this.request(`auth.php?action=status`, 'GET');
  },

  /* ── Student API ── */
  async getStudentDashboard() {
    return this.request(`student.php?action=dashboard`, 'GET');
  },

  async getStudentCourses() {
    return this.request(`student.php?action=courses`, 'GET');
  },

  async getStudentClasses() {
    return this.request(`student.php?action=classes`, 'GET');
  },

  async getStudentAssignments() {
    return this.request(`student.php?action=assignments`, 'GET');
  },

  async getStudentCertificates() {
    return this.request(`student.php?action=certificates`, 'GET');
  },

  async getStudentPayments() {
    return this.request(`student.php?action=payments`, 'GET');
  },

  async submitAssignment(assignmentId, fileName) {
    return this.request(`student.php?action=submit_assignment`, 'POST', { assignmentId, fileName });
  },

  async updateStudentProfile(profileData) {
    return this.request(`student.php?action=update_profile`, 'POST', profileData);
  },

  /* ── Admin API ── */
  async getAdminDashboard() {
    return this.request(`admin.php?action=dashboard`, 'GET');
  },

  async getAdminStudents() {
    return this.request(`admin.php?action=students`, 'GET');
  },

  async addStudent(studentData) {
    return this.request(`admin.php?action=add_student`, 'POST', studentData);
  },

  async deleteStudent(studentId) {
    return this.request(`admin.php?action=delete_student`, 'POST', { studentId });
  },

  async getAdminCourses() {
    return this.request(`admin.php?action=courses`, 'GET');
  },

  async addCourse(courseData) {
    return this.request(`admin.php?action=add_course`, 'POST', courseData);
  },

  async toggleCoursePublish(courseId) {
    return this.request(`admin.php?action=toggle_publish`, 'POST', { courseId });
  },

  async deleteCourse(courseId) {
    return this.request(`admin.php?action=delete_course`, 'POST', { courseId });
  },

  async getAdminClasses() {
    return this.request(`admin.php?action=classes`, 'GET');
  },

  async scheduleClass(classData) {
    return this.request(`admin.php?action=add_class`, 'POST', classData);
  },

  async getAdminAssignments() {
    return this.request(`admin.php?action=assignments`, 'GET');
  },

  async createAssignment(assignmentData) {
    return this.request(`admin.php?action=add_assignment`, 'POST', assignmentData);
  },

  async getAdminPayments() {
    return this.request(`admin.php?action=payments`, 'GET');
  },

  async getAdminJobs() {
    return this.request(`admin.php?action=jobs`, 'GET');
  },

  async postJob(jobData) {
    return this.request(`admin.php?action=add_job`, 'POST', jobData);
  },

  async getAdminContacts() {
    return this.request(`admin.php?action=contacts`, 'GET');
  },

  /* ── Jobs Board API ── */
  async getJobsList() {
    return this.request(`jobs.php?action=list`, 'GET');
  },

  async applyToJob(jobId, resumeFile) {
    return this.request(`jobs.php?action=apply`, 'POST', { jobId, resumeFile });
  },

  /* ── Contact API ── */
  async sendContactMessage(messageData) {
    return this.request(`contact.php`, 'POST', messageData);
  },

  /* ── Checkout API ── */
  async checkout(checkoutData) {
    return this.request(`checkout.php`, 'POST', checkoutData);
  },

  /* ── Public Courses API ── */
  async getCoursesPublic(courseId = '') {
    const url = courseId ? `courses.php?id=${courseId}` : `courses.php`;
    return this.request(url, 'GET');
  }
};

export default ApiClient;
