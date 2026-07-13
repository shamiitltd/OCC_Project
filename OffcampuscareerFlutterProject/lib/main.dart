import 'package:flutter/material';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'services/supabase_service.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/student_dashboard.dart';
import 'screens/careers_board_screen.dart';
import 'screens/recruiter_portal_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Try to initialize Supabase, but catch exception to run in mock fallback mode
  final supabaseService = SupabaseService();
  await supabaseService.initialize();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<SupabaseService>.value(value: supabaseService),
      ],
      child: const OffcampuscareerApp(),
    ),
  );
}

class OffcampuscareerApp extends StatelessWidget {
  const OffcampuscareerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Offcampuscareer TIP',
      debugShowCheckedModeBanner: false,
      
      // Gorgeous premium design system using Outfit & Inter fonts matching purple-to-cyan NeoVerse 2.0 colors
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF9B5FD0),
        scaffoldBackgroundColor: const Color(0xFF0F0B1A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF9B5FD0),
          secondary: Color(0xFF06B6D4),
          surface: Color(0xFF161129),
          surfaceContainerHighest: Color(0xFF1E1837),
          error: Color(0xFFF43F5E),
          onPrimary: Colors.white,
          onSecondary: Colors.white,
          onSurface: Color(0xFFE2E8F0),
        ),
        textTheme: GoogleFonts.interTextTheme(
          ThemeData.dark().textTheme.copyWith(
            bodyLarge: GoogleFonts.inter(color: const Color(0xFFCBD5E1), fontSize: 16),
            bodyMedium: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 14),
            titleLarge: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 22),
            headlineMedium: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 32),
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF161129),
          elevation: 0,
          centerTitle: false,
          titleTextStyle: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        cardTheme: CardTheme(
          color: const Color(0xFF161129),
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFF261D44), width: 1),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF9B5FD0),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            textStyle: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 16),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: const Color(0xFF06B6D4),
            textStyle: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 14),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF1E1837),
          hintStyle: GoogleFonts.inter(color: const Color(0xFF64748B)),
          labelStyle: GoogleFonts.inter(color: const Color(0xFF94A3B8)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF261D44)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF261D44)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF9B5FD0), width: 2),
          ),
        ),
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/dashboard': (context) => const StudentDashboardScreen(),
        '/careers': (context) => const CareersBoardScreen(),
        '/recruiter': (context) => const RecruiterPortalScreen(),
      },
    );
  }
}
