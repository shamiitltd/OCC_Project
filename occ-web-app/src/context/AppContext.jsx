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

  const login = (type, credentials) => {
    if (type === 'student') {
      const student = AppState.getStudentByEmail(credentials.email);
      if (student && student.password === credentials.password) {
        AppState.setSession('student', student.id);
        refreshSession();
        return { success: true, user: student };
      }
    } else if (type === 'mentor') {
      if (credentials.password === 'mentor123') {
        const mentor = AppState.getMentors().find(m => m.email === credentials.email) || AppState.getMentors()[0];
        AppState.setSession('mentor', mentor.id);
        refreshSession();
        return { success: true, user: mentor };
      }
    } else if (type === 'corporate') {
      if (credentials.password === 'corp123') {
        const corps = AppState.getCorporates();
        const corp = corps.find(c => c.contact === credentials.email) || corps[0];
        AppState.setSession('corporate', corp.id);
        refreshSession();
        return { success: true, user: corp };
      }
    } else if (type === 'admin') {
      if (credentials.email === 'admin@oc2.in' && credentials.password === 'admin123') {
        AppState.setSession('admin', 'ADM001');
        refreshSession();
        return { success: true, user: { name: 'Admin' } };
      }
    }
    throw new Error('Invalid credentials');
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
