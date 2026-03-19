import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LeadTable from '../components/LeadTable';
import LeadDetails from '../components/LeadDetails';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getLeads } from '../api/services';

const PAGE_SIZE     = 10;
const COL_WIDTHS    = ['35%', '12%', '10%', '10%', '10%', '23%'];
const HEADER_LABELS = ['COMPANY', 'INDUSTRY', 'LOCATION', 'SCORE', 'VERDICT', 'ACTION'];

const HighIntentPage = () => {
  const [selectedLead, setSelectedLead] = useState(null);

  const { data: leads, total, loading, error, page, setPage } =
    usePaginatedFetch(getLeads, {}, PAGE_SIZE);

  const highIntent = leads.filter(l =>
    Array.isArray(l.signal_results) &&
    l.signal_results.some(s => s.signal_id === 'ats_confirmed' && s.passed)
  );

  return (
    <>
      {error && <ErrorBanner message={error} />}

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="table-header-bar">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger bg-opacity-10 text-danger px-3" style={{ borderRadius: '20px', fontSize: '0.77rem', fontWeight: 700 }}>
              {loading ? '…' : highIntent.length} ATS-Confirmed
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 400 }}>on this page</span>
          </div>
          <span className="table-header-bar__count">{loading ? '…' : total} total leads</span>
        </div>

        {loading ? (
          <table className="page-table">
            <colgroup>{COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
            <thead>
              <tr>{HEADER_LABELS.map((h, i) => <th key={i} className={`th-cell ${i === 0 ? 'th-cell-first' : ''}`}>{h}</th>)}</tr>
            </thead>
            <tbody><SkeletonTable colWidths={COL_WIDTHS} rows={PAGE_SIZE} /></tbody>
          </table>
        ) : (
          <LeadTable leads={highIntent} onSelectLead={setSelectedLead} />
        )}
        <Pagination currentPage={page} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      <AnimatePresence>
        {selectedLead && <LeadDetails lead={selectedLead} onClose={() => setSelectedLead(null)} />}
      </AnimatePresence>
    </>
  );
};

export default HighIntentPage;
