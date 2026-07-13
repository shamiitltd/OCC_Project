import 'package:flutter/material';
import 'package:supabase_flutter/supabase_flutter.dart';

// User Profile Model
class UserProfile {
  final String id;
  final String email;
  final String fullName;
  final String role; // 'student', 'corporate', 'mentor'
  final String? college;
  final String? company;
  final String? professionalTitle;

  UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.college,
    this.company,
    this.professionalTitle,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      fullName: json['full_name'] ?? json['fullName'] ?? '',
      role: json['role'] ?? 'student',
      college: json['college'],
      company: json['company'],
      professionalTitle: json['professional_title'] ?? json['professionalTitle'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'role': role,
      'college': college,
      'company': company,
      'professional_title': professionalTitle,
    };
  }
}

// Job Model
class Job {
  final String id;
  final String company;
  final String companyLogo;
  final String role;
  final String type;
  final String domain;
  final String location;
  final String mode;
  final String stipend;
  final List<String> skills;
  final String experience;
  final String description;
  final String postedAt;
  final String? deadline;
  final String status;
  final String? aboutCompany;
  final List<String> perks;
  final List<String> process;
  final String? applyLink;

  Job({
    required this.id,
    required this.company,
    required this.companyLogo,
    required this.role,
    required this.type,
    required this.domain,
    required this.location,
    required this.mode,
    required this.stipend,
    required this.skills,
    required this.experience,
    required this.description,
    required this.postedAt,
    this.deadline,
    required this.status,
    this.aboutCompany,
    required this.perks,
    required this.process,
    this.applyLink,
  });
}

// Application Model
class JobApplication {
  final String id;
  final String jobId;
  final String studentId;
  final String name;
  final String email;
  final String? phone;
  final String? college;
  final String resume;
  final String? cover;
  String status;
  final String appliedAt;

  JobApplication({
    required this.id,
    required this.jobId,
    required this.studentId,
    required this.name,
    required this.email,
    this.phone,
    this.college,
    required this.resume,
    this.cover,
    required this.status,
    required this.appliedAt,
  });
}

// Enrollment Model
class CourseEnrollment {
  final String id;
  final String studentId;
  final String courseId;
  final int progress;
  final bool certificateIssued;
  final List<String> completedModules;

  CourseEnrollment({
    required this.id,
    required this.studentId,
    required this.courseId,
    required this.progress,
    required this.certificateIssued,
    required this.completedModules,
  });
}

// Course Model
class Course {
  final String id;
  final String title;
  final String category;
  final String duration;
  final String icon;
  final String description;
  final List<String> modules;

  Course({
    required this.id,
    required this.title,
    required this.category,
    required this.duration,
    required this.icon,
    required this.description,
    required this.modules,
  });
}

class SupabaseService extends ChangeNotifier {
  bool _isInitialized = false;
  bool _useMockMode = true; // Default to mock mode for easy offline evaluation
  
  UserProfile? _currentUser;
  
  // Local Database Mock States (Seeds)
  final List<UserProfile> _mockProfiles = [
    UserProfile(id: 'STU001', email: 'rahul@oc2.in', fullName: 'Rahul Sharma', role: 'student', college: 'IIT Delhi'),
    UserProfile(id: 'STU002', email: 'priya@oc2.in', fullName: 'Priya Patel', role: 'student', college: 'BITS Pilani'),
    UserProfile(id: 'CORP001', email: 'tcs@oc2.in', fullName: 'TCS Recruiter', role: 'corporate', company: 'TCS', professionalTitle: 'HR Lead'),
    UserProfile(id: 'MENT001', email: 'vinay@oc2.in', fullName: 'Vinay Prem', role: 'mentor', professionalTitle: 'Senior SDE at Google'),
  ];

  final List<Job> _mockJobs = [
    Job(
      id: 'JOB001', company: 'TCS', companyLogo: 'T', role: 'Software Developer Intern',
      type: 'Internship', domain: 'Web Dev', location: 'Mumbai', mode: 'Hybrid',
      stipend: '₹15,000/month', skills: ['JavaScript', 'React', 'Node.js'], experience: 'Fresher',
      description: '6-month internship with TCS Digital team. Work on enterprise web applications using modern JS frameworks.',
      postedAt: '2026-06-20', deadline: '2026-07-31', status: 'Active',
      aboutCompany: 'Tata Consultancy Services (TCS) is India\'s largest IT services company.',
      perks: ['Stipend', 'PPO Opportunity', 'Certificate', 'Mentorship'],
      process: ['Online Test', 'Technical Interview', 'HR Interview']
    ),
    Job(
      id: 'JOB002', company: 'Infosys', companyLogo: 'I', role: 'AI/ML Engineer',
      type: 'Job', domain: 'AI/ML', location: 'Bangalore', mode: 'On-site',
      stipend: '₹8,00,000/year', skills: ['Python', 'TensorFlow', 'NLP', 'AWS'], experience: '0-2 years',
      description: 'Full-time role in Infosys AI lab. Develop ML models for enterprise solutions. Work with cutting-edge AI research teams.',
      postedAt: '2026-06-22', deadline: '2026-08-15', status: 'Active',
      aboutCompany: 'Infosys is a global leader in next-generation digital services and consulting.',
      perks: ['Health Insurance', 'WFH Option', 'Learning Budget', 'Stock Options'],
      process: ['Resume Shortlist', 'Online Assessment', 'Technical Interview x2', 'HR Interview']
    ),
    Job(
      id: 'JOB_SCRAPE_001', company: 'Infor', companyLogo: 'I', role: 'Software Engineer',
      type: 'Job', domain: 'Web Dev', location: 'Hyderabad, Telangana', mode: 'On-site',
      stipend: 'Best in Industry', skills: ['Python', 'Java', 'SQL', 'Cloud', 'Software Development'], experience: 'Fresher (2024-2028 batch)',
      description: 'Infor invites enthusiastic freshers to join its dynamic team as Software Engineers in Hyderabad. This off-campus opportunity is specifically designed for recent graduates from the 2024, 2025, 2026, 2027, and 2028 batches who are eager to kickstart their careers in enterprise software development.',
      postedAt: '2026-07-13', deadline: '2026-08-31', status: 'Active',
      aboutCompany: 'Infor is a global leader in business cloud software specialized by industry.',
      perks: ['Professional Training', 'Hybrid Options', 'Health Benefits', 'Mentorship'],
      process: ['Online Test', 'Technical Round', 'HR Interview'],
      applyLink: 'https://www.offcampusjobsindia.com/jobs/infor-software-engineer-off-campus-jobs-hyderabad'
    ),
    Job(
      id: 'JOB_SCRAPE_002', company: 'Amadeus', companyLogo: 'A', role: 'Junior Software Development Engineer',
      type: 'Job', domain: 'Web Dev', location: 'Bangalore, Karnataka', mode: 'On-site',
      stipend: 'Best in Industry', skills: ['Java', 'C++', 'Python', 'Algorithms', 'Data Structures'], experience: 'Fresher (2024-2028 batch)',
      description: 'Amadeus is actively seeking talented and enthusiastic Junior Software Development Engineers to join their innovative team in Bangalore. This entry-level role is specifically designed for fresh graduates and recent alumni from the 2024, 2025, 2026, 2027, and 2028 batches.',
      postedAt: '2026-07-13', deadline: '2026-08-30', status: 'Active',
      aboutCompany: 'Amadeus is a leading transaction processor for the global travel and tourism industry.',
      perks: ['Global Exposure', 'Learning Allowances', 'Health Insurance', 'Annual Bonus'],
      process: ['Coding Test', 'Technical Interview x2', 'Managerial Interview', 'HR'],
      applyLink: 'https://www.offcampusjobsindia.com/jobs/amadeus-junior-software-development-engineer-jobs-bangalore-freshers'
    ),
    Job(
      id: 'JOB_SCRAPE_009', company: 'Amazon', companyLogo: 'A', role: 'Software Development Engineer I',
      type: 'Job', domain: 'Web Dev', location: 'Bengaluru, Karnataka', mode: 'On-site',
      stipend: 'Highly Competitive', skills: ['Java', 'Linux', 'AWS', 'Data Structures', 'Distributed Systems'], experience: 'Fresher (2024-2028 batch)',
      description: 'Amazon is seeking a talented Software Development Engineer I (SDE I) for the FinOps FP&A team in Bengaluru. This role is open for recent graduates from the 2024, 2025, 2026, 2027, and 2028 batches.',
      postedAt: '2026-07-13', deadline: '2026-09-15', status: 'Active',
      aboutCompany: 'Amazon is guided by four principles: customer obsession, passion for invention, and long-term thinking.',
      perks: ['Vibrant Swag', 'Free Meals & Snacks', 'Stock Units (RSUs)', 'Healthcare coverage'],
      process: ['Online Coding Rounds x2', 'Technical Loop Interviews x3', 'Bar Raiser Round'],
      applyLink: 'https://www.offcampusjobsindia.com/jobs/amazon-software-development-engineer-i-finops-fpanda-2024-2028-bengaluru'
    )
  ];

  final List<JobApplication> _mockApplications = [
    JobApplication(id: 'APP001', jobId: 'JOB001', studentId: 'STU001', name: 'Rahul Sharma', email: 'rahul@oc2.in', college: 'IIT Delhi', resume: 'https://drive.google.com/resume-rahul', status: 'Under Review', appliedAt: '2026-07-10'),
  ];

  final List<Course> _mockCourses = [
    Course(
      id: 'CRS001', title: 'Full Stack Web Development with React & Node', category: 'Web Dev', duration: '12 Weeks', icon: '💻',
      description: 'Master frontend and backend engineering. Build production ready projects, APIs, and databases.',
      modules: ['HTML & CSS Foundations', 'Modern JavaScript (ES6+)', 'React.js Component Architecture', 'Node.js & Express APIs']
    ),
    Course(
      id: 'CRS002', title: 'Practical Machine Learning & AI Engineering', category: 'AI/ML', duration: '16 Weeks', icon: '🤖',
      description: 'Deep dive into machine learning models, neural networks, computer vision, and NLP.',
      modules: ['Python for Data Science', 'Supervised Learning Algorithms', 'Neural Networks with PyTorch']
    )
  ];

  final List<CourseEnrollment> _mockEnrollments = [
    CourseEnrollment(id: 'ENR001', studentId: 'STU001', courseId: 'CRS001', progress: 45, certificateIssued: false, completedModules: ['HTML & CSS Foundations', 'Modern JavaScript (ES6+)']),
  ];

  UserProfile? get currentUser => _currentUser;
  bool get isInitialized => _isInitialized;
  bool get useMockMode => _useMockMode;

  List<Job> get jobs => _mockJobs;
  List<JobApplication> get applications => _mockApplications;
  List<Course> get courses => _mockCourses;

  // Initialize service
  Future<void> initialize() async {
    try {
      // Look for Supabase credentials - default fallback if error
      await Supabase.initialize(
        url: 'http://localhost:9999', // Local Supabase URL via Kong
        anonKey: 'public-anon-key-placeholder',
      );
      _useMockMode = false;
    } catch (e) {
      // Fallback silently to mock database environment
      _useMockMode = true;
    }
    _isInitialized = true;
    notifyListeners();
  }

  // Authentication: Sign In
  Future<bool> signIn(String email, String password) async {
    if (_useMockMode) {
      await Future.delayed(const Duration(milliseconds: 600)); // Simulate networking lag
      try {
        final profile = _mockProfiles.firstWhere((p) => p.email == email);
        _currentUser = profile;
        notifyListeners();
        return true;
      } catch (e) {
        return false;
      }
    } else {
      try {
        final response = await Supabase.instance.client.auth.signInWithPassword(
          email: email,
          password: password,
        );
        if (response.user != null) {
          // Fetch profile details from public.profiles table
          final profileData = await Supabase.instance.client
              .from('profiles')
              .select()
              .eq('id', response.user!.id)
              .single();
          _currentUser = UserProfile.fromJson(profileData);
          notifyListeners();
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
  }

  // Authentication: Sign Up
  Future<bool> signUp({
    required String email,
    required String password,
    required String fullName,
    required String role,
    String? college,
    String? company,
    String? professionalTitle,
  }) async {
    if (_useMockMode) {
      await Future.delayed(const Duration(milliseconds: 800));
      final newId = 'STU_${DateTime.now().millisecondsSinceEpoch}';
      final newProfile = UserProfile(
        id: newId,
        email: email,
        fullName: fullName,
        role: role,
        college: college,
        company: company,
        professionalTitle: professionalTitle,
      );
      _mockProfiles.add(newProfile);
      _currentUser = newProfile;
      notifyListeners();
      return true;
    } else {
      try {
        final response = await Supabase.instance.client.auth.signUp(
          email: email,
          password: password,
        );
        if (response.user != null) {
          final newProfile = UserProfile(
            id: response.user!.id,
            email: email,
            fullName: fullName,
            role: role,
            college: college,
            company: company,
            professionalTitle: professionalTitle,
          );
          // Insert profile into database
          await Supabase.instance.client
              .from('profiles')
              .insert(newProfile.toJson());
          _currentUser = newProfile;
          notifyListeners();
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
  }

  // Sign In with Google (Simulated)
  Future<void> signInWithGoogle(String email, String fullName, String role) async {
    await Future.delayed(const Duration(milliseconds: 600));
    // Find or create profile on the fly
    try {
      final profile = _mockProfiles.firstWhere((p) => p.email == email);
      _currentUser = profile;
    } catch (e) {
      final newProfile = UserProfile(
        id: 'GGL_${DateTime.now().millisecondsSinceEpoch}',
        email: email,
        fullName: fullName,
        role: role,
      );
      _mockProfiles.add(newProfile);
      _currentUser = newProfile;
    }
    notifyListeners();
  }

  // Sign Out
  void signOut() {
    _currentUser = null;
    notifyListeners();
  }

  // Get active student enrollments
  List<Map<String, dynamic>> getStudentEnrollments() {
    if (_currentUser == null) return [];
    
    final enrollments = _mockEnrollments.where((e) => e.studentId == _currentUser!.id).toList();
    List<Map<String, dynamic>> results = [];
    
    for (var e in enrollments) {
      final course = _mockCourses.firstWhere((c) => c.id == e.courseId);
      results.add({
        'enrollment': e,
        'course': course,
      });
    }
    return results;
  }

  // Get student applied jobs list
  List<Map<String, dynamic>> getStudentAppliedJobs() {
    if (_currentUser == null) return [];
    
    final studentApps = _mockApplications.where((a) => a.studentId == _currentUser!.id).toList();
    List<Map<String, dynamic>> results = [];
    
    for (var app in studentApps) {
      final job = _mockJobs.firstWhere((j) => j.id == app.jobId);
      results.add({
        'application': app,
        'job': job,
      });
    }
    return results;
  }

  // Post a new Job Listing
  void postJob(Job job) {
    _mockJobs.insert(0, job);
    notifyListeners();
  }

  // Apply to a Job
  void applyToJob(String jobId, String name, String email, String phone, String college, String resume, String cover) {
    final appId = 'APP_${DateTime.now().millisecondsSinceEpoch}';
    final application = JobApplication(
      id: appId,
      jobId: jobId,
      studentId: _currentUser?.id ?? 'GUEST_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      phone: phone,
      college: college,
      resume: resume,
      cover: cover,
      status: 'Under Review',
      appliedAt: DateTime.now().toIso8601String().split('T')[0],
    );

    _mockApplications.add(application);
    notifyListeners();
  }

  // Recruiter: Update applicant recruitment status
  void updateApplicationStatus(String appId, String newStatus) {
    try {
      final app = _mockApplications.firstWhere((a) => a.id == appId);
      app.status = newStatus;
      notifyListeners();
    } catch (e) {
      // Ignored
    }
  }
}
