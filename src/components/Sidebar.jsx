import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Zap, Users, Building2, Inbox,
  Briefcase, BrainCircuit, RefreshCcw, Database,
  Settings, HelpCircle, ChevronRight, ChevronLeft
} from 'lucide-react';
import '../styles/Sidebar.css';

const NAV_GROUPS = [
  {
    label: 'MAIN',
    items: [
      { to: '/',                icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/active-leads',    icon: Zap,             label: 'Active Leads' },
      { to: '/high-intent',     icon: Users,           label: 'High Intent' },
    ],
  },
  {
    label: 'PIPELINE',
    items: [
      { to: '/companies',       icon: Building2,    label: 'All Companies' },
      { to: '/raw-scrapes',     icon: Inbox,        label: 'Raw Scrapes' },
      { to: '/job-events',      icon: Briefcase,    label: 'Job Events' },
      { to: '/ai-evaluations',  icon: BrainCircuit, label: 'AI Evaluations' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/pipeline-runs',   icon: RefreshCcw, label: 'Pipeline Runs' },
      { to: '/token-cache',     icon: Database,   label: 'Token Cache' },
    ],
  },
];

const Sidebar = ({ onNavigate }) => (
  <div className="sidebar">
    <span className="sidebar-logo">LEADGEN</span>

    <nav className="nav-main">
      {NAV_GROUPS.map(group => (
        <div key={group.label} className="nav-group">
          <div className="nav-group-label">{group.label}</div>
          {group.items.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onNavigate}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon size={16} className="nav-icon" />
                <span>{item.label}</span>
                {/* Right chevron shown on active via CSS pseudo or conditional */}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>

    {/* Footer */}
    <div className="sidebar-footer">
      <div className="sidebar-footer-links">
        <button className="nav-item">
          <Settings size={16} className="nav-icon" />
          <span>Settings</span>
        </button>
        <button className="nav-item">
          <HelpCircle size={16} className="nav-icon" />
          <span>Support</span>
        </button>
      </div>
      <div className="sidebar-user">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nirmallya"
          alt="avatar"
          className="sidebar-avatar"
        />
        <div>
          <div className="sidebar-user-name">Nirmallya</div>
          <div className="sidebar-user-role">Admin</div>
        </div>
      </div>
    </div>
  </div>
);

export default Sidebar;
