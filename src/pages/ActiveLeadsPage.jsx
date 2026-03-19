import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LeadTable from '../components/LeadTable';
import LeadDetails from '../components/LeadDetails';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getLeads } from '../api/services';

const PAGE_SIZE      = 10;
const COL_WIDTHS     = ['35%', '12%', '10%', '10%', '10%', '23%'];
const HEADER_LABELS  = ['COMPANY', 'INDUSTRY', 'LOCATION', 'SCORE', 'VERDICT', 'ACTION'];
const FILTERS        = ['ALL', 'HOT', 'WARM', 'COLD'];

const ActiveLeadsPage = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter]             = useState('ALL');

  const filters = filter === 'ALL' ? {} : { verdict: filter };
  const { data: leads, total, loading, error, page, setPage } =
    usePaginatedFetch(getLeads, filters, PAGE_SIZE);

  return (
    <>
      <div className="filter-pills">
        {/* {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-pill ${filter === f ? `active-${f.toLowerCase()}` : ''}`}
          >
            {f}
          </button>
        ))} */}
        <span className="ms-auto d-flex align-items-center" style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          {loading ? '…' : total} leads
        </span>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="glass-card">
        {loading ? (
          /* Skeleton table — exact same column structure as LeadTable */
          <table className="page-table">
            <colgroup>
              {COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
            </colgroup>
            <thead>
              <tr>
                {HEADER_LABELS.map((h, i) => (
                  <th key={i} className={`th-cell ${i === 0 ? 'th-cell-first' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <SkeletonTable colWidths={COL_WIDTHS} rows={PAGE_SIZE} />
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

export default ActiveLeadsPage;
