import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner, TableHead } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getJobEvents } from '../api/services';

const PAGE_SIZE  = 10;
const COLS       = ['Company', 'ATS / Method', 'Jobs', 'HR Role', 'HR Tech', 'Board URL'];
const COL_WIDTHS = ['26%', '16%', '9%', '9%', '9%', '31%'];

const METHOD_COLOR = {
  Greenhouse: '#2ecc71', Lever: '#e74c3c', Ashby: '#9b59b6',
  Indeed: '#2089e2', google_search: '#4285f4', careers_page: '#f59e0b',
};

const JobEventsPage = () => {
  const { data: jobs, total, loading, error, page, setPage } =
    usePaginatedFetch(getJobEvents, {}, PAGE_SIZE);

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <div className="glass-card">
        <table className="page-table">
          <TableHead columns={COLS} widths={COL_WIDTHS} />
          <tbody>
            {loading
              ? <SkeletonTable colWidths={COL_WIDTHS} rows={PAGE_SIZE} />
              : jobs.map(j => {
                  const mc = METHOD_COLOR[j.check_method] || 'var(--primary)';
                  return (
                    <tr key={j.id} className="table-row">
                      <td className="td-cell td-cell-first fw-semibold" style={{ fontSize: '0.88rem' }}>{j.company || j.company_id}</td>
                      <td className="td-cell">
                        <span className="source-pill" style={{ background: `${mc}20`, color: mc }}>{j.check_method || '—'}</span>
                      </td>
                      <td className="td-cell fw-bold" style={{ color: (j.job_count ?? 0) > 10 ? '#10b981' : 'inherit' }}>
                        {j.job_count ?? '—'}
                      </td>
                      <td className="td-cell text-center">
                        {j.hr_role_found ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="var(--text-dim)" />}
                      </td>
                      <td className="td-cell text-center">
                        {j.hr_tech_role_found ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="var(--text-dim)" />}
                      </td>
                      <td className="td-cell">
                        {j.ats_board_url
                          ? <a href={j.ats_board_url} target="_blank" rel="noreferrer" className="ats-link">View Board →</a>
                          : <span className="text-muted" style={{ fontSize: '0.8rem' }}>N/A</span>
                        }
                      </td>
                    </tr>
                  );
              })
            }
          </tbody>
        </table>
        <Pagination currentPage={page} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </>
  );
};

export default JobEventsPage;
