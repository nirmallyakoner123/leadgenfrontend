import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import '../styles/Header.css';

// Map route path → page title
const PAGE_TITLES = {
  '/':               { title: 'Dashboard',       sub: 'Lead intelligence overview' },
  '/active-leads':   { title: 'Active Leads',    sub: 'AI-qualified prospects' },
  '/high-intent':    { title: 'High Intent',     sub: 'ATS-confirmed buying signals' },
  '/companies':      { title: 'All Companies',   sub: 'Full company registry' },
  '/raw-scrapes':    { title: 'Raw Scrapes',     sub: 'Unfiltered scrape events' },
  '/job-events':     { title: 'Job Events',      sub: 'ATS detections & job checks' },
  '/ai-evaluations': { title: 'AI Evaluations',  sub: 'Brain scoring results' },
  '/pipeline-runs':  { title: 'Pipeline Runs',   sub: 'Execution history' },
  '/token-cache':    { title: 'Token Cache',     sub: 'Freshness status' },
};

const Header = ({ onMenuToggle }) => {
  const { pathname } = useLocation();
  const meta = PAGE_TITLES[pathname] || { title: 'LeadGen', sub: '' };

  return (
    <header className="app-header glass-effect">
      <div className="header-left">
        {/* Hamburger — visible only on mobile via CSS */}
        <button
          className="header-hamburger"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="header-page-title">{meta.title}</div>
          {meta.sub && <div className="header-page-breadcrumb">{meta.sub}</div>}
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn calendar-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="header-notif-dot" />
        </button>
        <div className="header-divider" />
        <div className="header-meta">
          <div className="header-meta-title">Lead Generation Mode</div>
          <div className="header-meta-sub">Active Run: #4012</div>
        </div>
      </div>
    </header>
  );
};

export default Header;