import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/supabase_service.dart';

class CareersBoardScreen extends StatefulWidget {
  const CareersBoardScreen({super.key});

  @override
  State<CareersBoardScreen> createState() => _CareersBoardScreenState();
}

class _CareersBoardScreenState extends State<CareersBoardScreen> {
  String _searchQuery = '';
  String _selectedDomain = 'All';

  // Controllers for job creation form
  final _postJobKey = GlobalKey<FormState>();
  final _companyController = TextEditingController();
  final _roleController = TextEditingController();
  final _typeController = TextEditingController(text: 'Job');
  final _domainController = TextEditingController(text: 'Web Dev');
  final _locationController = TextEditingController();
  final _modeController = TextEditingController(text: 'On-site');
  final _stipendController = TextEditingController();
  final _skillsController = TextEditingController();
  final _descController = TextEditingController();
  final _applyLinkController = TextEditingController();

  // Controllers for guest apply form
  final _applyFormKey = GlobalKey<FormState>();
  final _guestNameController = TextEditingController();
  final _guestEmailController = TextEditingController();
  final _guestPhoneController = TextEditingController();
  final _guestCollegeController = TextEditingController();
  final _guestResumeController = TextEditingController();
  final _guestCoverController = TextEditingController();

  void _handleUrlLaunch(String urlString) async {
    final url = Uri.parse(urlString);
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Redirecting to official application site...')),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not launch official URL.'), backgroundColor: Color(0xFFF43F5E)),
        );
      }
    }
  }

  void _showPostJobDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF161129),
          title: Text('Post a Job Opening', style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: Colors.white)),
          content: SizedBox(
            width: 500,
            child: SingleChildScrollView(
              child: Form(
                key: _postJobKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextFormField(
                      controller: _companyController,
                      decoration: const InputDecoration(labelText: 'Company Name'),
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _roleController,
                      decoration: const InputDecoration(labelText: 'Job Role / Designation'),
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _typeController.text,
                            dropdownColor: const Color(0xFF1E1837),
                            decoration: const InputDecoration(labelText: 'Job Type'),
                            items: ['Job', 'Internship', 'Freelance'].map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                            onChanged: (val) => _typeController.text = val ?? 'Job',
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _domainController.text,
                            dropdownColor: const Color(0xFF1E1837),
                            decoration: const InputDecoration(labelText: 'Domain'),
                            items: ['Web Dev', 'AI/ML', 'Cloud', 'Data Science', 'Tech'].map((d) => DropdownMenuItem(value: d, child: Text(d))).toList(),
                            onChanged: (val) => _domainController.text = val ?? 'Web Dev',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _locationController,
                            decoration: const InputDecoration(labelText: 'Location', hintText: 'e.g. Noida'),
                            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            value: _modeController.text,
                            dropdownColor: const Color(0xFF1E1837),
                            decoration: const InputDecoration(labelText: 'Mode'),
                            items: ['On-site', 'Remote', 'Hybrid'].map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                            onChanged: (val) => _modeController.text = val ?? 'On-site',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _stipendController,
                      decoration: const InputDecoration(labelText: 'Stipend / Salary', hintText: 'e.g. ₹15,000/month or 8 LPA'),
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _skillsController,
                      decoration: const InputDecoration(labelText: 'Skills (Comma separated)', hintText: 'React, Node, SQL'),
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _applyLinkController,
                      decoration: const InputDecoration(labelText: 'External Apply Link (Optional)', hintText: 'https://company.com/apply'),
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _descController,
                      maxLines: 3,
                      decoration: const InputDecoration(labelText: 'Detailed Description'),
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                  ],
                ),
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                if (!_postJobKey.currentState!.validate()) return;
                final service = Provider.of<SupabaseService>(context, listen: false);
                final newJob = Job(
                  id: 'JOB_${DateTime.now().millisecondsSinceEpoch}',
                  company: _companyController.text.trim(),
                  companyLogo: _companyController.text[0].toUpperCase(),
                  role: _roleController.text.trim(),
                  type: _typeController.text,
                  domain: _domainController.text,
                  location: _locationController.text.trim(),
                  mode: _modeController.text,
                  stipend: _stipendController.text.trim(),
                  skills: _skillsController.text.split(',').map((s) => s.trim()).toList(),
                  experience: 'Fresher',
                  description: _descController.text.trim(),
                  postedAt: DateTime.now().toIso8601String().split('T')[0],
                  status: 'Active',
                  perks: ['Stipend', 'Certificate', 'Mentorship'],
                  process: ['Online Assessment', 'Technical Round', 'HR Round'],
                  applyLink: _applyLinkController.text.isNotEmpty ? _applyLinkController.text.trim() : null,
                );

                service.postJob(newJob);
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Job posted successfully!'), backgroundColor: Colors.green),
                );
              },
              child: const Text('Post Listing'),
            ),
          ],
        );
      },
    );
  }

  void _showApplyDialog(Job job, UserProfile? currentUser) {
    if (job.applyLink != null) {
      _handleUrlLaunch(job.applyLink!);
      return;
    }

    if (currentUser != null) {
      // Auto-submit using profile data
      final service = Provider.of<SupabaseService>(context, listen: false);
      service.applyToJob(
        job.id,
        currentUser.fullName,
        currentUser.email,
        '',
        currentUser.college ?? 'N/A',
        'https://tip.offcampuscareer.com/resumes/${currentUser.id}',
        'Applying directly with portal profile.',
      );
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Successfully applied to ${job.role} at ${job.company}!'),
          backgroundColor: const Color(0xFF06B6D4),
        ),
      );
      return;
    }

    // Guest apply modal
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF161129),
          title: Text('Apply as Guest - ${job.role}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          content: SizedBox(
            width: 480,
            child: SingleChildScrollView(
              child: Form(
                key: _applyFormKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextFormField(
                      controller: _guestNameController,
                      decoration: const InputDecoration(labelText: 'Your Name'),
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _guestEmailController,
                      decoration: const InputDecoration(labelText: 'Email Address'),
                      validator: (v) => v == null || !v.contains('@') ? 'Enter valid email' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _guestPhoneController,
                      decoration: const InputDecoration(labelText: 'Contact Phone'),
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _guestCollegeController,
                      decoration: const InputDecoration(labelText: 'College Name'),
                      validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _guestResumeController,
                      decoration: const InputDecoration(labelText: 'Resume Link (Drive/Dropbox)'),
                      validator: (v) => v == null || !v.startsWith('http') ? 'Enter valid link' : null,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _guestCoverController,
                      maxLines: 2,
                      decoration: const InputDecoration(labelText: 'Short Cover Letter'),
                    ),
                  ],
                ),
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () {
                if (!_applyFormKey.currentState!.validate()) return;
                final service = Provider.of<SupabaseService>(context, listen: false);
                service.applyToJob(
                  job.id,
                  _guestNameController.text.trim(),
                  _guestEmailController.text.trim(),
                  _guestPhoneController.text.trim(),
                  _guestCollegeController.text.trim(),
                  _guestResumeController.text.trim(),
                  _guestCoverController.text.trim(),
                );
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Successfully applied to ${job.role}!'),
                    backgroundColor: const Color(0xFF06B6D4),
                  ),
                );
              },
              child: const Text('Submit Application'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final service = Provider.of<SupabaseService>(context);
    final user = service.currentUser;
    final allJobs = service.jobs;

    // Filtered jobs
    final filteredJobs = allJobs.where((j) {
      final matchesSearch = j.role.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          j.company.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          j.skills.any((s) => s.toLowerCase().contains(_searchQuery.toLowerCase()));

      final matchesDomain = _selectedDomain == 'All' || j.domain == _selectedDomain;

      return matchesSearch && matchesDomain;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Public Careers Board'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_box_outlined, color: Color(0xFF9B5FD0)),
            tooltip: 'Post a Job Opening',
            onPressed: _showPostJobDialog,
          ),
          const SizedBox(width: 8),
          if (user != null)
            TextButton.icon(
              icon: const Icon(Icons.dashboard_outlined),
              label: const Text('My Dashboard'),
              onPressed: () {
                if (user.role == 'corporate') {
                  Navigator.pushReplacementNamed(context, '/recruiter');
                } else {
                  Navigator.pushReplacementNamed(context, '/dashboard');
                }
              },
            ),
          const SizedBox(width: 16),
        ],
      ),
      body: Container(
        color: const Color(0xFF0F0B1A),
        padding: const EdgeInsets.all(40),
        child: Column(
          children: [
            // Search and domain filter panel
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: const InputDecoration(
                      prefixIcon: Icon(Icons.search, color: Color(0xFF9B5FD0)),
                      hintText: 'Search jobs by title, company, or skills...',
                    ),
                    onChanged: (val) => setState(() => _searchQuery = val),
                  ),
                ),
                const SizedBox(width: 24),
                // Domain dropdown
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E1837),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF261D44)),
                  ),
                  child: DropdownButton<String>(
                    value: _selectedDomain,
                    dropdownColor: const Color(0xFF1E1837),
                    underline: const SizedBox(),
                    items: ['All', 'Web Dev', 'AI/ML', 'Cloud', 'Data Science', 'Tech']
                        .map((d) => DropdownMenuItem(value: d, child: Text(d)))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() => _selectedDomain = val);
                      }
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Job cards layout
            Expanded(
              child: filteredJobs.isEmpty
                  ? Center(
                      child: Text(
                        'No job listings match your current filters.',
                        style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontSize: 16),
                      ),
                    )
                  : GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 24,
                        mainAxisSpacing: 24,
                        childAspectRatio: 1.5,
                      ),
                      itemCount: filteredJobs.length,
                      itemBuilder: (context, index) {
                        final job = filteredJobs[index];
                        return Card(
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
                                        CircleAvatar(
                                          backgroundColor: const Color(0xFF9B5FD0).withOpacity(0.15),
                                          child: Text(
                                            job.companyLogo,
                                            style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF9B5FD0)),
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(job.role, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
                                            const SizedBox(height: 2),
                                            Text('${job.company} · ${job.location}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                                          ],
                                        ),
                                      ],
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF06B6D4).withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        job.type,
                                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF06B6D4)),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  job.description,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                                ),
                                const SizedBox(height: 16),
                                // Skills row
                                Wrap(
                                  spacing: 8,
                                  children: job.skills.take(3).map((s) {
                                    return Chip(
                                      backgroundColor: const Color(0xFF1E1837),
                                      side: BorderSide.none,
                                      padding: EdgeInsets.zero,
                                      label: Text(s, style: const TextStyle(fontSize: 10, color: Colors.white)),
                                    );
                                  }).toList(),
                                ),
                                const Spacer(),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.between,
                                  children: [
                                    Text(
                                      job.stipend,
                                      style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold),
                                    ),
                                    ElevatedButton(
                                      style: ElevatedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                      ),
                                      onPressed: () => _showApplyDialog(job, user),
                                      child: Text(
                                        job.applyLink != null ? 'Apply External ↗' : 'Apply Now',
                                        style: const TextStyle(fontSize: 12),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
