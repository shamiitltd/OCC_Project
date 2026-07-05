import React, { createContext, useContext, useState, useEffect } from 'react';
import AppState from '../services/app-state';
import ApiClient from '../services/api-client';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [session, setSessionState] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  const refreshSession = () => {
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
  const login = (credentials) => {
    const { email, password } = credentials;

    // 1. Check Admin
    if (email === 'admin@oc2.in' && password === 'admin123') {
      AppState.setSession('admin', 'ADM001');
      refreshSession();
      return { success: true, user: { name: 'Admin', type: 'admin' } };
    }

    // 2. Check Student
    const student = AppState.getStudentByEmail(email);
    if (student && student.password === password) {
      AppState.setSession('student', student.id);
      refreshSession();
      return { success: true, user: { ...student, type: 'student' } };
    }

    // 3. Check Mentor
    const mentor = AppState.getMentors().find(m => m.email === email);
    if (mentor && password === 'mentor123') {
      AppState.setSession('mentor', mentor.id);
      refreshSession();
      return { success: true, user: { ...mentor, type: 'mentor' } };
    }

    // 4. Check Corporate
    const corps = AppState.getCorporates();
    const corp = corps.find(c => c.contact === email);
    if (corp && password === 'corp123') {
      AppState.setSession('corporate', corp.id);
      refreshSession();
      return { success: true, user: { ...corp, type: 'corporate' } };
    }

    // 5. Check Institute (College Partner)
    const colleges = AppState.getColleges();
    const college = colleges.find(c => c.name.toLowerCase().includes(email.split('@')[0].toLowerCase()) || c.id.toLowerCase() === email.split('@')[0].toLowerCase());
    if (college && password === 'institute123') {
      AppState.setSession('institute', college.id);
      refreshSession();
      return { success: true, user: { ...college, type: 'institute' } };
    }

    throw new Error('Invalid credentials. Please check your email and password.');
  };

  const logout = () => {
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