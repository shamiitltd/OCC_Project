import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../services/supabase_service.dart';

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({super.key});

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  String _activeTab = 'courses'; // 'courses', 'jobs'

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<SupabaseService>(context);
    final user = service.currentUser;
    final enrollments = service.getStudentEnrollments();
    final appliedJobs = service.getStudentAppliedJobs();

    if (user == null) {
      return const Scaffold(
        body: Center(child: Text('Unauthorized access. Please login.')),
      );
    }

    return Scaffold(
      body: Row(
        children: [
          // Sidebar Navigation Panel
          Container(
            width: 260,
            color: const Color(0xFF161129),
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Brand Header with Icon
                Row(
                  children: [
                    Image.asset(
                      'assets/images/favicon.png',
                      height: 32,
                      width: 32,
                      errorBuilder: (context, error, stackTrace) => const Icon(Icons.rocket_launch, color: Color(0xFF9B5FD0)),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      'OCCPortal',
                      style: GoogleFonts.outfit(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Active User Card
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E1837),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(user.fullName, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                      const SizedBox(height: 2),
                      Text('Active Student Profile', style: TextStyle(fontSize: 11, color: const Color(0xFF94A3B8))),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Navigation links
                _buildSidebarLink(
                  icon: Icons.dashboard_outlined,
                  label: 'Student Dashboard',
                  isActive: true,
                  onTap: () {},
                ),
                const SizedBox(height: 8),
                _buildSidebarLink(
                  icon: Icons.work_outline,
                  label: 'Careers Board',
                  isActive: false,
                  onTap: () => Navigator.pushNamed(context, '/careers'),
                ),
                const Spacer(),
                
                // Sign Out Action
                _buildSidebarLink(
                  icon: Icons.logout_outlined,
                  label: 'Sign Out',
                  isActive: false,
                  onTap: () {
                    service.signOut();
                    Navigator.pushReplacementNamed(context, '/login');
                  },
                ),
              ],
            ),
          ),

          // Main content workspace
          Expanded(
            child: Container(
              color: const Color(0xFF0F0B1A),
              padding: const EdgeInsets.all(40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Greeting header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Student Learning Dashboard',
                            style: GoogleFonts.outfit(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text('Manage programs, credentials, and job opportunities.', style: TextStyle(color: Color(0xFF94A3B8))),
                        ],
                      ),
                      Chip(
                        backgroundColor: const Color(0xFF06B6D4).withOpacity(0.1),
                        side: const BorderSide(color: Color(0xFF06B6D4)),
                        label: const Text('Session Status: Online', style: TextStyle(color: Color(0xFF06B6D4), fontWeight: FontWeight.bold, fontSize: 12)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 36),

                  // Summary Info Cards
                  Row(
                    children: [
                      _buildSummaryCard('🎓', enrollments.length.toString(), 'Enrolled Courses'),
                      const SizedBox(width: 24),
                      _buildSummaryCard('💼', appliedJobs.length.toString(), 'Applied Jobs'),
                      const SizedBox(width: 24),
                      _buildSummaryCard('📅', 'Joined', '7/13/2026'),
                    ],
                  ),
                  const SizedBox(height: 40),

                  // Tab headers
                  Row(
                    children: [
                      _buildTabButton('courses', 'My Courses'),
                      const SizedBox(width: 16),
                      _buildTabButton('jobs', 'Applied Jobs'),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Active Tab Content
                  Expanded(
                    child: _activeTab == 'courses'
                        ? _buildCoursesTab(enrollments)
                        : _buildAppliedJobsTab(appliedJobs),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebarLink({required IconData icon, required String label, required bool isActive, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isActive ? const Color(0xFF9B5FD0).withOpacity(0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Icon(icon, color: isActive ? const Color(0xFF9B5FD0) : const Color(0xFF94A3B8), size: 20),
            const SizedBox(width: 16),
            Text(
              label,
              style: TextStyle(
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? Colors.white : const Color(0xFF94A3B8),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard(String icon, String count, String label) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Row(
            children: [
              Text(icon, style: const TextStyle(fontSize: 36)),
              const SizedBox(width: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(count, style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 2),
                  Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTabButton(String tab, String label) {
    final isSelected = _activeTab == tab;
    return GestureDetector(
      onTap: () => setState(() => _activeTab = tab),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF9B5FD0) : const Color(0xFF1E1837),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : const Color(0xFF94A3B8),
          ),
        ),
      ),
    );
  }

  Widget _buildCoursesTab(List<Map<String, dynamic>> enrollments) {
    if (enrollments.isEmpty) {
      return Card(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('🎓', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 16),
              Text('No active courses', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Visit our catalog to enroll in learning programs!', style: TextStyle(color: Color(0xFF94A3B8))),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      itemCount: enrollments.length,
      itemBuilder: (context, index) {
        final data = enrollments[index];
        final CourseEnrollment enr = data['enrollment'];
        final Course course = data['course'];

        return Card(
          margin: const EdgeInsets.bottom(16),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Row(
                      children: [
                        Text(course.icon, style: const TextStyle(fontSize: 32)),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(course.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
                            const SizedBox(height: 4),
                            Text('Duration: ${course.duration} · ${course.category}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                          ],
                        ),
                      ],
                    ),
                    Text('${enr.progress}% Completed', style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF06B6D4))),
                  ],
                ),
                const SizedBox(height: 16),
                LinearProgressIndicator(
                  value: enr.progress / 100,
                  backgroundColor: const Color(0xFF1E1837),
                  color: const Color(0xFF9B5FD0),
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(4),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAppliedJobsTab(List<Map<String, dynamic>> appliedJobs) {
    if (appliedJobs.isEmpty) {
      return Card(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('💼', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 16),
              Text('No applied jobs yet', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Browse job openings on our Careers Board and apply!', style: TextStyle(color: Color(0xFF94A3B8))),
            ],
          ),
        ),
      );
    }

    return Card(
      child: SingleChildScrollView(
        child: DataTable(
          headingRowColor: WidgetStateProperty.all(const Color(0xFF1E1837)),
          columns: const [
            DataColumn(label: Text('Job Role', style: TextStyle(fontWeight: FontWeight.bold))),
            DataColumn(label: Text('Company', style: TextStyle(fontWeight: FontWeight.bold))),
            DataColumn(label: Text('Stipend', style: TextStyle(fontWeight: FontWeight.bold))),
            DataColumn(label: Text('Status', style: TextStyle(fontWeight: FontWeight.bold))),
            DataColumn(label: Text('Applied Date', style: TextStyle(fontWeight: FontWeight.bold))),
          ],
          rows: appliedJobs.map((data) {
            final JobApplication app = data['application'];
            final Job job = data['job'];
            return DataRow(
              cells: [
                DataCell(Text(job.role, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white))),
                DataCell(Text(job.company)),
                DataCell(Text(job.stipend, style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold))),
                DataCell(
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: app.status == 'Shortlisted' ? Colors.green.withOpacity(0.15) : Colors.blue.withOpacity(0.15),
                      border: Border.all(color: app.status == 'Shortlisted' ? Colors.green : Colors.blue),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      app.status,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: app.status == 'Shortlisted' ? Colors.greenAccent : Colors.blueAccent,
                      ),
                    ),
                  ),
                ),
                DataCell(Text(app.appliedAt)),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }
}
