import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import DashboardPage    from './pages/DashboardPage';
import ActiveLeadsPage  from './pages/ActiveLeadsPage';
import HighIntentPage   from './pages/HighIntentPage';
import AllCompaniesPage from './pages/AllCompaniesPage';
import RawScrapesPage   from './pages/RawScrapesPage';
import JobEventsPage    from './pages/JobEventsPage';
import AIEvaluationsPage from './pages/AIEvaluationsPage';
import PipelineRunsPage from './pages/PipelineRunsPage';
import TokenCachePage   from './pages/TokenCachePage';
import OutreachPage     from './pages/OutreachPage';

import './App.css';

// ─── Page slide transition ────────────────────────────────────────
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
    className="page-content"
  >
    {children}
  </motion.div>
);

import PipelineRunnerPopup from './pages/PipelineRunnerPopup';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone terminal popup — no sidebar/header */}
        <Route path="/pipeline-runner" element={<PipelineRunnerPopup />} />

        {/* Main App Layout */}
        <Route
          path="*"
          element={
            <div className="app-layout">
              {/* Mobile overlay */}
              <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
              />

              {/* Sidebar */}
              <div className={`sidebar-col ${sidebarOpen ? 'open' : ''}`}>
                <Sidebar onNavigate={() => setSidebarOpen(false)} />
              </div>

              {/* Main content */}
              <div className="main-col">
                <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<PageWrapper><DashboardPage /></PageWrapper>} />
                    <Route path="/active-leads" element={<PageWrapper><ActiveLeadsPage /></PageWrapper>} />
                    <Route path="/high-intent" element={<PageWrapper><HighIntentPage /></PageWrapper>} />
                    <Route path="/outreach" element={<PageWrapper><OutreachPage /></PageWrapper>} />
                    <Route path="/companies" element={<PageWrapper><AllCompaniesPage /></PageWrapper>} />
                    <Route path="/raw-scrapes" element={<PageWrapper><RawScrapesPage /></PageWrapper>} />
                    <Route path="/job-events" element={<PageWrapper><JobEventsPage /></PageWrapper>} />
                    <Route path="/ai-evaluations" element={<PageWrapper><AIEvaluationsPage /></PageWrapper>} />
                    <Route path="/pipeline-runs" element={<PageWrapper><PipelineRunsPage /></PageWrapper>} />
                    <Route path="/token-cache" element={<PageWrapper><TokenCachePage /></PageWrapper>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
