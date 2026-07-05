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
        setCurrentUser(res.user);
        AppState.setSession(res.type, res.user.id);
      } else {
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
      }
    } catch (err) {
      const activeSession = AppState.getSession();
      setSessionState(activeSession);
      if (activeSession) {
        if (activeSession.type === 'student') {
          setCurrentUser(AppState.getStudent(activeSession.userId));
        } else {
          setCurrentUser({ id: activeSession.userId, name: 'Offline User', role: activeSession.type });
        }
      } else {
        setCurrentUser(null);
      }
    }
  };

  useEffect(() => {
    refreshSession();
    // Theme setup
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const login = async (credentials) => {
    const { email, password } = credentials;
    try {
      const res = await ApiClient.login(email, password, 'student');
      if (res && res.success) {
        AppState.setSession(res.user.role || 'student', res.user.id);
        await refreshSession();
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn("PHP login failed, trying fallback local accounts:", err.message);
    }

    if (email === 'admin@oc2.in' && password === 'admin123') {
      AppState.setSession('admin', 'ADM001');
      await refreshSession();
      return { success: true, user: { name: 'Admin', type: 'admin' } };
    }

    const student = AppState.getStudentByEmail(email);
    if (student && student.password === password) {
      AppState.setSession('student', student.id);
      await refreshSession();
      return { success: true, user: { ...student, type: 'student' } };
    }

    const mentor = AppState.getMentors().find(m => m.email === email);
    if (mentor && password === 'mentor123') {
      AppState.setSession('mentor', mentor.id);
      await refreshSession();
      return { success: true, user: { ...mentor, type: 'mentor' } };
    }

    const corps = AppState.getCorporates();
    const corp = corps.find(c => c.contact === email);
    if (corp && password === 'corp123') {
      AppState.setSession('corporate', corp.id);
      await refreshSession();
      return { success: true, user: { ...corp, type: 'corporate' } };
    }

    const colleges = AppState.getColleges();
    const college = colleges.find(c => c.name.toLowerCase().includes(email.split('@')[0].toLowerCase()) || c.id.toLowerCase() === email.split('@')[0].toLowerCase());
    if (college && password === 'institute123') {
      AppState.setSession('institute', college.id);
      await refreshSession();
      return { success: true, user: { ...college, type: 'institute' } };
    }

    throw new Error('Invalid credentials. Please check your email and password.');
  };

  const signup = async (signupData) => {
    try {
      const res = await ApiClient.signup(signupData);
      if (res && res.success) {
        AppState.setSession(res.user.role || 'student', res.user.id);
        await refreshSession();
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn("PHP signup failed, trying fallback local registration:", err.message);
    }

    const studentId = 'STU' + Math.floor(Math.random() * 1000000);
    const newStu = {
      id: studentId,
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      phone: signupData.phone,
      college: signupData.college,
      year: signupData.year || '3rd Year',
      role: 'student',
      joinedAt: new Date().toISOString().split('T')[0]
    };
    AppState.addStudent(newStu);
    AppState.setSession('student', studentId);
    await refreshSession();
    return { success: true, user: newStu };
  };

  const logout = async () => {
    try {
      await ApiClient.logout();
    } catch (e) {}
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
      signup,
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