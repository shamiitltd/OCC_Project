import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../services/supabase_service.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _collegeController = TextEditingController();
  final _companyController = TextEditingController();
  final _titleController = TextEditingController();

  String _selectedRole = 'student'; // 'student', 'corporate', 'mentor'
  bool _isLoading = false;

  void _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    final service = Provider.of<SupabaseService>(context, listen: false);
    final success = await service.signUp(
      email: _emailController.text.trim(),
      password: _passwordController.text,
      fullName: _fullNameController.text.trim(),
      role: _selectedRole,
      college: _selectedRole == 'student' ? _collegeController.text.trim() : null,
      company: _selectedRole == 'corporate' ? _companyController.text.trim() : null,
      professionalTitle: _selectedRole == 'mentor'
          ? _titleController.text.trim()
          : (_selectedRole == 'corporate' ? _titleController.text.trim() : null),
    );
    setState(() => _isLoading = false);

    if (success) {
      if (mounted) {
        if (_selectedRole == 'corporate') {
          Navigator.pushReplacementNamed(context, '/recruiter');
        } else {
          Navigator.pushReplacementNamed(context, '/dashboard');
        }
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Account registered successfully! Welcome ${service.currentUser?.fullName}!'),
            backgroundColor: const Color(0xFF06B6D4),
          ),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Registration failed. Email might already exist.'),
            backgroundColor: Color(0xFFF43F5E),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Left side brand panel
          Expanded(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF181236), Color(0xFF0F0B1A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(48),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Image.asset(
                        'assets/images/logo.png',
                        height: 64,
                        errorBuilder: (context, error, stackTrace) => Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            border: Border.all(color: const Color(0xFF9B5FD0)),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'OFFCAMPUSCAREER',
                            style: GoogleFonts.outfit(
                              fontSize: 24,
                              fontWeight: FontWeight.w900,
                              color: const Color(0xFF9B5FD0),
                              letterSpacing: 2,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Join India\'s Premier Career Platform',
                        style: GoogleFonts.outfit(
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Choose your profile role and register your details. Accelerate your career growth today.',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: const Color(0xFF94A3B8),
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          
          // Right Form Panel
          Container(
            width: 480,
            color: const Color(0xFF161129),
            padding: const EdgeInsets.all(48),
            child: Center(
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Tab selector simulation (Toggle to SignIn)
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E1837),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: GestureDetector(
                                onTap: () => Navigator.pushReplacementNamed(context, '/login'),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  child: const Center(
                                    child: Text(
                                      'Sign In',
                                      style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF9B5FD0),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Center(
                                  child: Text(
                                    'Sign Up',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),
                      
                      // Role Selection Header
                      Text(
                        'Choose Profile Role',
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          _buildRoleButton('student', 'Student'),
                          const SizedBox(width: 8),
                          _buildRoleButton('corporate', 'Recruiter'),
                          const SizedBox(width: 8),
                          _buildRoleButton('mentor', 'Mentor'),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Common Inputs
                      TextFormField(
                        controller: _fullNameController,
                        decoration: const InputDecoration(
                          labelText: 'Full Name',
                          prefixIcon: Icon(Icons.person_outline, color: Color(0xFF9B5FD0)),
                        ),
                        validator: (value) => value == null || value.isEmpty ? 'Enter your name' : null,
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Email Address',
                          prefixIcon: Icon(Icons.email_outlined, color: Color(0xFF9B5FD0)),
                        ),
                        validator: (value) => value == null || !value.contains('@') ? 'Enter a valid email' : null,
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          prefixIcon: Icon(Icons.lock_outline, color: Color(0xFF9B5FD0)),
                        ),
                        validator: (value) => value == null || value.length < 6 ? 'Password must be >= 6 chars' : null,
                      ),
                      const SizedBox(height: 16),

                      // Conditional Fields
                      if (_selectedRole == 'student')
                        TextFormField(
                          controller: _collegeController,
                          decoration: const InputDecoration(
                            labelText: 'College Name',
                            prefixIcon: Icon(Icons.school_outlined, color: Color(0xFF9B5FD0)),
                          ),
                          validator: (value) => value == null || value.isEmpty ? 'Enter your college' : null,
                        ),
                      if (_selectedRole == 'corporate') ...[
                        TextFormField(
                          controller: _companyController,
                          decoration: const InputDecoration(
                            labelText: 'Company Name',
                            prefixIcon: Icon(Icons.business_outlined, color: Color(0xFF9B5FD0)),
                          ),
                          validator: (value) => value == null || value.isEmpty ? 'Enter company name' : null,
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _titleController,
                          decoration: const InputDecoration(
                            labelText: 'Job/HR Title',
                            prefixIcon: Icon(Icons.badge_outlined, color: Color(0xFF9B5FD0)),
                          ),
                          validator: (value) => value == null || value.isEmpty ? 'Enter your professional title' : null,
                        ),
                      ],
                      if (_selectedRole == 'mentor')
                        TextFormField(
                          controller: _titleController,
                          decoration: const InputDecoration(
                            labelText: 'Professional Designation',
                            hintText: 'Senior SDE at Google',
                            prefixIcon: Icon(Icons.work_outline, color: Color(0xFF9B5FD0)),
                          ),
                          validator: (value) => value == null || value.isEmpty ? 'Enter professional title' : null,
                        ),
                      
                      const SizedBox(height: 24),

                      // Signup Action
                      _isLoading
                          ? const Center(child: CircularProgressIndicator())
                          : ElevatedButton(
                              onPressed: _handleSignup,
                              child: const Text('Create New Account'),
                            ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoleButton(String role, String label) {
    final isSelected = _selectedRole == role;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedRole = role;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF1E1837) : const Color(0xFF161129),
            border: Border.all(
              color: isSelected ? const Color(0xFF9B5FD0) : const Color(0xFF261D44),
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                fontSize: 13,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
