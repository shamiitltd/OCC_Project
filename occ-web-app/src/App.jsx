import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import PublicLayout from './PublicLayout';
import PortalLayout from './PortalLayout';
import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';
import MentorsPage from './pages/MentorsPage';
import CareersPage from './pages/CareersPage';
import ExamsPage from './pages/ExamsPage';
import CorporatePage from './pages/CorporatePage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import PlacementPage from './pages/PlacementPage';
import './App.css';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes (with Navbar & Footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/mentors" element={<MentorsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/corporate" element={<CorporatePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/placement" element={<PlacementPage />} />
          </Route>

          {/* Portal Routes (with Sidebar) */}
          <Route path="/portal/*" element={<PortalLayout />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

