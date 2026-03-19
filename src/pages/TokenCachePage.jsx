import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Search } from 'lucide-react';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner, TableHead } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getTokenCache } from '../api/services';

const PAGE_SIZE  = 10;
const COLS       = ['Company', 'Profile Token', 'Job Token', 'AI Token', 'Last Verdict', 'Score'];
const COL_WIDTHS = ['30%', '14%', '14%', '14%', '14%', '14%'];

const VERDICT_CLASS = { HOT: 'badge-hot', WARM: 'badge-warm', COLD: 'badge-cold' };
const toTitle = (s = '') => s.replace(/\b\w/g, c => c.toUpperCase());

const TokenBadge = ({ needsRefresh }) =>
  needsRefresh
    ? <span className="token-stale"><AlertCircle size={11} />Stale</span>
    : <span className="token-fresh"><CheckCircle2 size={11} />Fresh</span>;

const TokenCachePage = () => {
  const [pageSize, setPageSize]       = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = searchQuery ? { search: searchQuery } : {};

  const { data: tokens, total, loading, error, page, setPage } =
    usePaginatedFetch(getTokenCache, filters, pageSize);

  const staleCount = tokens.filter(t =>
    t.profile_needs_refresh || t.job_needs_refresh || t.ai_needs_refresh
  ).length;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  return (
    <>
      <div className="filter-pills" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.2rem 0.5rem' }}>
          <Search size={14} color="var(--text-dim)" />
          <input 
            type="text" 
            placeholder="Search token cache..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '0.85rem', padding: '0.2rem 0.5rem', width: '250px' }}
          />
        </form>

        <span className="ms-auto d-flex align-items-center" style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          {loading ? '…' : total} tokens
        </span>
      </div>

      {error && <ErrorBanner message={error} />}

      {!loading && staleCount > 0 && (
        <div className="stale-warning mb-3">
          <AlertCircle size={14} />
          <strong>{staleCount}</strong> companies on this page have stale tokens — will re-evaluate next run.
        </div>
      )}

      <div className="glass-card">
        <table className="page-table">
          <TableHead columns={COLS} widths={COL_WIDTHS} />
          <tbody>
            {loading
              ? <SkeletonTable colWidths={COL_WIDTHS} rows={PAGE_SIZE} />
              : tokens.map(t => {
                  const vClass = VERDICT_CLASS[t.last_verdict] || '';
                  return (
                    <tr key={t.company_id} className="table-row">
                      <td className="td-cell td-cell-first fw-semibold" style={{ fontSize: '0.88rem' }}>{toTitle(t.name_normalized) || t.company_id}</td>
                      <td className="td-cell"><TokenBadge needsRefresh={t.profile_needs_refresh} /></td>
                      <td className="td-cell"><TokenBadge needsRefresh={t.job_needs_refresh} /></td>
                      <td className="td-cell"><TokenBadge needsRefresh={t.ai_needs_refresh} /></td>
                      <td className="td-cell">
                        {t.last_verdict
                          ? <span className={`verdict-pill ${vClass}`}>{t.last_verdict}</span>
                          : <span className="text-muted">—</span>
                        }
                      </td>
                      <td className="td-cell">
                        {t.last_score != null
                          ? <><span className="fw-bold">{t.last_score}</span><span className="text-muted" style={{ fontSize: '0.72rem' }}>/18</span></>
                          : <span className="text-muted">—</span>
                        }
                      </td>
                    </tr>
                  );
              })
            }
          </tbody>
        </table>
        <Pagination currentPage={page} totalItems={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
    </>
  );
};

export default TokenCachePage;
