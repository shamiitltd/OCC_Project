import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/supabase_service.dart';

class RecruiterPortalScreen extends StatefulWidget {
  const RecruiterPortalScreen({super.key});

  @override
  State<RecruiterPortalScreen> createState() => _RecruiterPortalScreenState();
}

class _RecruiterPortalScreenState extends State<RecruiterPortalScreen> {
  void _handleResumeLaunch(String urlString) async {
    final url = Uri.parse(urlString);
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open resume link.'), backgroundColor: Color(0xFFF43F5E)),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<SupabaseService>(context);
    final user = service.currentUser;
    final allApps = service.applications;
    final allJobs = service.jobs;

    if (user == null || user.role != 'corporate') {
      return const Scaffold(
        body: Center(child: Text('Unauthorized access. Recruiter login required.')),
      );
    }

    return Scaffold(
      body: Row(
        children: [
          // Sidebar Panel
          Container(
            width: 260,
            color: const Color(0xFF161129),
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
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
                      Text('Corporate Partner: ${user.company}', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Navigation links
                _buildSidebarLink(
                  icon: Icons.business_center_outlined,
                  label: 'Recruiter Portal',
                  isActive: true,
                  onTap: () {},
                ),
                const SizedBox(height: 8),
                _buildSidebarLink(
                  icon: Icons.work_outline,
                  label: 'Public Jobs Board',
                  isActive: false,
                  onTap: () => Navigator.pushNamed(context, '/careers'),
                ),
                const Spacer(),
                
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

          // Workspace
          Expanded(
            child: Container(
              color: const Color(0xFF0F0B1A),
              padding: const EdgeInsets.all(40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Greeting Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Corporate Recruiter Workspace',
                            style: GoogleFonts.outfit(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text('Review applications, verify student resumes, and update recruitment status.', style: TextStyle(color: const Color(0xFF94A3B8))),
                        ],
                      ),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.add),
                        label: const Text('Post Job Opening'),
                        onPressed: () {
                          // Trigger public page post flow
                          Navigator.pushNamed(context, '/careers');
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 36),

                  // Recruiter Summary Cards
                  Row(
                    children: [
                      _buildSummaryCard('💼', allJobs.where((j) => j.company == user.company).length.toString(), 'My Postings'),
                      const SizedBox(width: 24),
                      _buildSummaryCard('📥', allApps.length.toString(), 'Received Applications'),
                      const SizedBox(width: 24),
                      _buildSummaryCard('🎖️', 'Active Partner', user.professionalTitle ?? 'HR Recruiter'),
                    ],
                  ),
                  const SizedBox(height: 40),

                  Text(
                    'Candidate Job Applications',
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Candidate Applications table
                  Expanded(
                    child: Card(
                      child: allApps.isEmpty
                          ? const Center(
                              child: Text('No applications received yet.', style: TextStyle(color: Color(0xFF94A3B8))),
                            )
                          : SingleChildScrollView(
                              child: DataTable(
                                headingRowColor: WidgetStateProperty.all(const Color(0xFF1E1837)),
                                columns: const [
                                  DataColumn(label: Text('Candidate Name', style: TextStyle(fontWeight: FontWeight.bold))),
                                  DataColumn(label: Text('Job Role', style: TextStyle(fontWeight: FontWeight.bold))),
                                  DataColumn(label: Text('College/Institution', style: TextStyle(fontWeight: FontWeight.bold))),
                                  DataColumn(label: Text('Resume & Info', style: TextStyle(fontWeight: FontWeight.bold))),
                                  DataColumn(label: Text('Status Assessment', style: TextStyle(fontWeight: FontWeight.bold))),
                                ],
                                rows: allApps.map((app) {
                                  final job = allJobs.firstWhere((j) => j.id == app.jobId, orElse: () => Job(id: 'N/A', company: 'Unknown', companyLogo: 'U', role: 'N/A', type: 'N/A', domain: 'N/A', location: 'N/A', mode: 'N/A', stipend: 'N/A', skills: [], experience: 'N/A', description: 'N/A', postedAt: '', status: '', perks: [], process: []));
                                  return DataRow(
                                    cells: [
                                      DataCell(
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text(app.name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                                            Text(app.email, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                                          ],
                                        ),
                                      ),
                                      DataCell(Text(job.role)),
                                      DataCell(Text(app.college ?? 'N/A')),
                                      DataCell(
                                        TextButton.icon(
                                          icon: const Icon(Icons.picture_as_pdf_outlined, size: 16),
                                          label: const Text('Open Resume ↗'),
                                          onPressed: () => _handleResumeLaunch(app.resume),
                                        ),
                                      ),
                                      DataCell(
                                        DropdownButton<String>(
                                          value: app.status,
                                          dropdownColor: const Color(0xFF1E1837),
                                          style: const TextStyle(color: Colors.white, fontSize: 13),
                                          items: ['Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired'].map((statusOption) {
                                            return DropdownMenuItem(
                                              value: statusOption,
                                              child: Text(statusOption),
                                            );
                                          }).toList(),
                                          onChanged: (newStatus) {
                                            if (newStatus != null) {
                                              service.updateApplicationStatus(app.id, newStatus);
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(
                                                  content: Text('Status updated to $newStatus for ${app.name}!'),
                                                  backgroundColor: const Color(0xFF06B6D4),
                                                ),
                                              );
                                            }
                                          },
                                        ),
                                      ),
                                    ],
                                  );
                                }).toList(),
                              ),
                            ),
                    ),
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
}
