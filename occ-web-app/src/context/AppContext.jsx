import React, { createContext, useContext, useState, useEffect } from 'react';
import AppState from '../services/app-state';
import ApiClient from '../services/api-client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSessionState] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  const refreshSession = async () => {
    try {
      const res = await ApiClient.getSessionStatus();
      if (res && res.loggedIn) {
        setSessionState({ type: res.type, userId: res.user.id });
        setCurrentUser({
          ...res.user,
          // Map college to display names if needed
          college: res.user.college || '',
          company: res.user.college || ''
        });
        AppState.setSession(res.type, res.user.id);
        return;
      }
    } catch (e) {
      console.warn("Auth status check failed, falling back to Local session.", e);
    }

    const activeSession = AppState.getSession();
    setSessionState(activeSession);
    if (activeSession) {
      if (activeSession.type === 'student') {
        setCurrentUser(AppState.getStudent(activeSession.userId));
      } else if (activeSession.type === 'mentor') {
        setCurrentUser(AppState.getMentor(activeSession.userId) || AppState.getMentors()[0]);
      } else if (activeSession.type === 'corporate') {
        const corps = AppState.getCorporates();
        setCurrentUser(corps.find(c => c.id === activeSession.userId) || corps[0]);
      } else if (activeSession.type === 'admin') {
        setCurrentUser({ id: 'ADM001', name: 'System Admin', role: 'Administrator' });
      } else if (activeSession.type === 'institute') {
        const colleges = AppState.getColleges();
        setCurrentUser(colleges.find(c => c.id === activeSession.userId) || colleges[0]);
      }
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    refreshSession();
    // Theme setup
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  /**
   * Auto-detect user type from credentials and log in.
   * Checks: admin → student → mentor → corporate → institute
   */
  const login = async (credentials) => {
    const { email, password } = credentials;

    // Detect fallback user type based on local lists
    let fallbackRole = 'student';
    if (email === 'admin@oc2.in') {
      fallbackRole = 'admin';
    } else if (AppState.getMentors().some(m => m.email === email)) {
      fallbackRole = 'mentor';
    } else if (AppState.getCorporates().some(c => c.contact === email)) {
      fallbackRole = 'corporate';
    }

    try {
      const res = await ApiClient.login(email, password, fallbackRole);
      if (res && res.success) {
        const user = res.user;
        const finalRole = user.role || fallbackRole;
        AppState.setSession(finalRole, user.id);
        await refreshSession();
        return { success: true, user: user };
      }
    } catch (e) {
      console.warn("Backend login failed. Falling back to Local AppState authentication.");
    }

    // Local Fallback validation
    // 1. Check Admin
    if (email === 'admin@oc2.in' && password === 'admin123') {
      AppState.setSession('admin', 'ADM001');
      await refreshSession();
      return { success: true, user: { name: 'Admin', type: 'admin' } };
    }

    // 2. Check Student
    const student = AppState.getStudentByEmail(email);
    if (student && student.password === password) {
      AppState.setSession('student', student.id);
      await refreshSession();
      return { success: true, user: { ...student, type: 'student' } };
    }

    // 3. Check Mentor
    const mentor = AppState.getMentors().find(m => m.email === email);
    if (mentor && (mentor.password === password || password === 'mentor123')) {
      AppState.setSession('mentor', mentor.id);
      await refreshSession();
      return { success: true, user: { ...mentor, type: 'mentor' } };
    }

    // 4. Check Corporate
    const corps = AppState.getCorporates();
    const corp = corps.find(c => c.contact === email);
    if (corp && (corp.password === password || password === 'corp123')) {
      AppState.setSession('corporate', corp.id);
      await refreshSession();
      return { success: true, user: { ...corp, type: 'corporate' } };
    }

    // 5. Check Institute (College Partner)
    const colleges = AppState.getColleges();
    const college = colleges.find(c => c.name.toLowerCase().includes(email.split('@')[0].toLowerCase()) || c.id.toLowerCase() === email.split('@')[0].toLowerCase());
    if (college && password === 'institute123') {
      AppState.setSession('institute', college.id);
      await refreshSession();
      return { success: true, user: { ...college, type: 'institute' } };
    }

    throw new Error('Invalid credentials. Please check your email and password.');
  };

  /**
   * Register a new user in AppState and log them in
   */
  const register = async (userData) => {
    const { type, name, email, password, phone } = userData;

    try {
      const res = await ApiClient.register(userData);
      if (res && res.success) {
        const user = res.user;
        AppState.setSession(type, user.id);
        await refreshSession();
        return { success: true, user: user };
      }
    } catch (e) {
      console.warn("Backend signup failed. Falling back to Local AppState registration.");
    }

    // Local Fallback logic
    if (type === 'student' && AppState.getStudentByEmail(email)) {
      throw new Error('Email address already registered as a student.');
    }
    if (type === 'mentor' && AppState.getMentors().some(m => m.email === email)) {
      throw new Error('Email address already registered as a mentor.');
    }
    if (type === 'corporate' && AppState.getCorporates().some(c => c.contact === email)) {
      throw new Error('Email address already registered as an employer.');
    }

    let newUser;
    if (type === 'student') {
      newUser = AppState.addStudent({
        name,
        email,
        password,
        phone,
        college: userData.college || '',
        stream: userData.stream || 'Computer Science'
      });
    } else if (type === 'corporate') {
      newUser = AppState.addCorporate({
        company: name,
        contact: email,
        password,
        logo: name[0].toUpperCase(),
        industry: userData.industry || 'Technology',
        size: userData.size || '50-100',
        location: userData.location || 'Remote',
        partnerType: 'Hiring Partner',
        requirements: '',
        activeJobs: 0,
        placedStudents: 0
      });
    } else if (type === 'mentor') {
      newUser = AppState.addMentor({
        name,
        email,
        password,
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        title: userData.title || 'Career Mentor',
        company: userData.company || 'SHAMIIT Partner',
        specialties: userData.specialties || ['Career Mentorship'],
        domains: userData.domains || ['Career'],
        rating: 5.0,
        totalRatings: 0,
        students: 0,
        sessions: 0,
        experience: '3 years',
        price: 0,
        priceType: '/session',
        bio: userData.bio || 'Professional mentor registered on Offcampuscareer.',
        verified: true,
        active: true,
        languages: ['English'],
        responseTime: 'Within 24 hours'
      });
    }

    if (!newUser) {
      throw new Error('Registration failed. Invalid user type.');
    }

    AppState.setSession(type, newUser.id);
    await refreshSession();
    return { success: true, user: newUser };
  };

  const logout = async () => {
    try {
      await ApiClient.logout();
    } catch (e) {
      console.warn("Backend logout failed.", e);
    }
    AppState.clearSession();
    setSessionState(null);
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <AppContext.Provider value={{
      session,
      currentUser,
      theme,
      login,
      register,
      logout,
      toggleTheme,
      refreshSession,
      AppState,
      ApiClient
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);