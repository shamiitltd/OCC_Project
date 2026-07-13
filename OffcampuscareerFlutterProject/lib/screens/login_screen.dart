import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../services/supabase_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'rahul@oc2.in');
  final _passwordController = TextEditingController(text: 'password123');
  bool _isLoading = false;

  void _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    final service = Provider.of<SupabaseService>(context, listen: false);
    final success = await service.signIn(
      _emailController.text.trim(),
      _passwordController.text,
    );
    setState(() => _isLoading = false);

    if (success) {
      if (mounted) {
        final role = service.currentUser?.role ?? 'student';
        if (role == 'corporate') {
          Navigator.pushReplacementNamed(context, '/recruiter');
        } else {
          Navigator.pushReplacementNamed(context, '/dashboard');
        }
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Welcome back, ${service.currentUser?.fullName}!'),
            backgroundColor: const Color(0xFF06B6D4),
          ),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Invalid credentials. Please try again!'),
            backgroundColor: Color(0xFFF43F5E),
          ),
        );
      }
    }
  }

  void _showGoogleChooser() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF161129),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Choose a Google Account',
                style: GoogleFonts.outfit(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'to continue to Offcampuscareer Portal',
                style: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 13),
              ),
              const SizedBox(height: 24),
              _buildGoogleAccountTile(
                name: 'Rahul Sharma',
                email: 'rahul@oc2.in',
                role: 'student',
              ),
              const SizedBox(height: 12),
              _buildGoogleAccountTile(
                name: 'Vinay Prem',
                email: 'vinay@oc2.in',
                role: 'mentor',
              ),
              const SizedBox(height: 12),
              _buildGoogleAccountTile(
                name: 'Corporate Partner',
                email: 'tcs@oc2.in',
                role: 'corporate',
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildGoogleAccountTile({required String name, required String email, required String role}) {
    return ListTile(
      tileColor: const Color(0xFF1E1837),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      leading: CircleAvatar(
        backgroundColor: const Color(0xFF9B5FD0),
        child: Text(name[0], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
      subtitle: Text(email, style: const TextStyle(color: Color(0xFF94A3B8))),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          border: Border.all(color: const Color(0xFF261D44)),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          role.toUpperCase(),
          style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF06B6D4)),
        ),
      ),
      onTap: () async {
        Navigator.pop(context);
        setState(() => _isLoading = true);
        final service = Provider.of<SupabaseService>(context, listen: false);
        await service.signInWithGoogle(email, name, role);
        setState(() => _isLoading = false);

        if (mounted) {
          if (role == 'corporate') {
            Navigator.pushReplacementNamed(context, '/recruiter');
          } else {
            Navigator.pushReplacementNamed(context, '/dashboard');
          }
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Logged in successfully via Google as $name!'),
              backgroundColor: const Color(0xFF06B6D4),
            ),
          );
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Left visual brand panel (Responsive banner layout)
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
                    mainAxisAlignment: MainAxisSize.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Logo banner
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
                        'Learn Together, Work Together, Grow Together',
                        style: GoogleFonts.outfit(
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Access exclusive training, verify skills, apply for premium placements, and schedule sessions with elite industry mentors.',
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
          
          // Right Login Form Panel
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
                      // Tab selector simulation
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E1837),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF9B5FD0),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Center(
                                  child: Text(
                                    'Sign In',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: GestureDetector(
                                onTap: () => Navigator.pushNamed(context, '/signup'),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  child: const Center(
                                    child: Text(
                                      'Sign Up',
                                      style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 36),
                      
                      Text(
                        'Welcome Back',
                        style: GoogleFonts.outfit(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Enter your portal credentials to log in.',
                        style: TextStyle(color: Color(0xFF94A3B8)),
                      ),
                      const SizedBox(height: 36),

                      // Email input
                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Email Address',
                          hintText: 'john@example.com',
                          prefixIcon: Icon(Icons.email_outlined, color: Color(0xFF9B5FD0)),
                        ),
                        validator: (value) => value == null || !value.contains('@') ? 'Enter a valid email' : null,
                      ),
                      const SizedBox(height: 20),

                      // Password input
                      TextFormField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          prefixIcon: Icon(Icons.lock_outline, color: Color(0xFF9B5FD0)),
                        ),
                        validator: (value) => value == null || value.length < 6 ? 'Password must be >= 6 chars' : null,
                      ),
                      const SizedBox(height: 24),

                      // Sign in button
                      _isLoading
                          ? const Center(child: CircularProgressIndicator())
                          : ElevatedButton(
                              onPressed: _handleLogin,
                              child: const Text('Sign In to Account'),
                            ),
                      const SizedBox(height: 20),

                      Row(
                        children: [
                          const Expanded(child: Divider(color: Color(0xFF261D44))),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Text('OR', style: GoogleFonts.inter(color: const Color(0xFF64748B), fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                          const Expanded(child: Divider(color: Color(0xFF261D44))),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Google button
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFF261D44)),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: _showGoogleChooser,
                        icon: const Icon(Icons.g_mobiledata, size: 28, color: Colors.white),
                        label: Text('Continue with Google', style: GoogleFonts.inter(fontWeight: FontWeight.bold, color: Colors.white)),
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
}
