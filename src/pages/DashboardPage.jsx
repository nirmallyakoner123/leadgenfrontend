import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Target, Zap, ArrowUpRight, Loader2 } from 'lucide-react';
import LeadTable from '../components/LeadTable';
import LeadDetails from '../components/LeadDetails';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getLeads, getDashboardStats } from '../api/services';
import '../styles/Dashboard.css';

const PAGE_SIZE = 10;

// Column widths must EXACTLY match LeadTable's colgroup (6 columns)
const LEAD_COL_WIDTHS = ['35%', '12%', '10%', '10%', '10%', '23%'];

const DashboardPage = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setStatsLoading(true);
    getDashboardStats()
      .then(res => { if (!cancelled) setStats(res.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setStatsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const { data: leads, total, loading: leadsLoading, error, page, setPage } =
    usePaginatedFetch(getLeads, {}, PAGE_SIZE);

  const statCards = [
    { label: 'Total Leads',   value: stats?.total_leads,    icon: <Users size={20} />,       colorClass: 'stat-icon--primary'   },
    { label: 'Hot Leads',     value: stats?.hot_leads,      icon: <Zap size={20} />,         colorClass: 'stat-icon--hot'       },
    { label: 'Warm Leads',    value: stats?.warm_leads,     icon: <TrendingUp size={20} />,  colorClass: 'stat-icon--warm'      },
    { label: 'Pipeline /day', value: stats?.pipeline_speed, icon: <Target size={20} />,      colorClass: 'stat-icon--secondary' },
  ];

  return (
    <>
      <div className="dashboard-hero">
        <div>
          <h2 className="dashboard-title">Lead Intelligence Dashboard</h2>
          <p className="dashboard-sub">Real-time AI verification and scoring for prospective clients.</p>
        </div>
        <button className="run-btn glass-effect">
          <Zap size={16} className="run-btn__icon" />
          Run New Analysis
        </button>
      </div>

      {/* ── Stat cards ── */}
      <Row className="g-3 mb-0">
        {statCards.map((card, i) => (
          <Col key={i} xs={6} md={3}>
            <div className="stat-card">
              <div className="stat-card__top">
                <div className={`stat-icon ${card.colorClass}`}>{card.icon}</div>
                <ArrowUpRight size={14} className="stat-card__arrow" />
              </div>
              <div className="stat-card__label">{card.label}</div>
              <div className="stat-card__value">
                {statsLoading
                  ? <Loader2 size={22} className="stat-spinner" />
                  : (card.value ?? '—')
                }
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Leads table ── */}
      {error && <div className="card-to-table-gap"><ErrorBanner message={error} /></div>}

      <div className="glass-card card-to-table-gap">
        <div className="table-header-bar">
          <h3 className="table-header-bar__title">Qualified Prospects</h3>
          <span className="table-header-bar__count">{leadsLoading ? '…' : total} total</span>
        </div>

        {/* Skeleton and LeadTable share the same <table> with colgroup */}
        {leadsLoading ? (
          <table className="page-table">
            <colgroup>
              {LEAD_COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
            </colgroup>
            <thead>
              <tr>
                {['COMPANY', 'INDUSTRY', 'LOCATION', 'SCORE', 'VERDICT', 'ACTION'].map((h, i) => (
                  <th key={i} className={`th-cell ${i === 0 ? 'th-cell-first' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <SkeletonTable colWidths={LEAD_COL_WIDTHS} rows={PAGE_SIZE} />
            </tbody>
          </table>
        ) : (
          <LeadTable leads={leads} onSelectLead={setSelectedLead} />
        )}

        <Pagination currentPage={page} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      <AnimatePresence>
        {selectedLead && <LeadDetails lead={selectedLead} onClose={() => setSelectedLead(null)} />}
      </AnimatePresence>
    </>
  );
};

export default DashboardPage;
