import React, { useState } from 'react';
import { Globe, CheckCircle2, XCircle, Search } from 'lucide-react';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner, TableHead } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getScrapes } from '../api/services';

const PAGE_SIZE  = 10;
const COLS       = ['Company (Raw)', 'Source', 'Country', 'Team Size', 'Hiring?', 'Batch'];
const COL_WIDTHS = ['28%', '14%', '10%', '10%', '10%', '28%'];

const SOURCE_COLOR = {
  YC: '#f59e0b', ProductHunt: '#ef4444', LinkedIn: '#0077b5',
  TechCrunch: '#00bb34', GoogleNews: '#4285f4', Naukri: '#4a00e0',
  Seek: '#00bcd4', Reed: '#e91e63',
};
const SOURCE_ICON = { YC: '🚀', ProductHunt: '🔺', LinkedIn: '💼', TechCrunch: '🟢' };

const RawScrapesPage = () => {
  const [pageSize, setPageSize]       = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = searchQuery ? { search: searchQuery } : {};

  const { data: scrapes, total, loading, error, page, setPage } =
    usePaginatedFetch(getScrapes, filters, pageSize);

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
            placeholder="Search raw scrape events..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '0.85rem', padding: '0.2rem 0.5rem', width: '250px' }}
          />
        </form>

        <span className="ms-auto d-flex align-items-center" style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          {loading ? '…' : total} scrapes
        </span>
      </div>

      {error && <ErrorBanner message={error} />}
      <div className="glass-card">
        <table className="page-table">
          <TableHead columns={COLS} widths={COL_WIDTHS} />
          <tbody>
            {loading
              ? <SkeletonTable colWidths={COL_WIDTHS} rows={PAGE_SIZE} />
              : scrapes.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="td-cell td-cell-first fw-semibold" style={{ fontSize: '0.88rem' }}>{s.company_name_raw || '—'}</td>
                  <td className="td-cell">
                    <span className="source-pill" style={{ background: `${SOURCE_COLOR[s.source] || 'var(--primary)'}18`, color: SOURCE_COLOR[s.source] || 'var(--primary)' }}>
                      {SOURCE_ICON[s.source] || <Globe size={11} />} {s.source || '—'}
                    </span>
                  </td>
                  <td className="td-cell">
                    <code style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-main)', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      {s.country_code || '—'}
                    </code>
                  </td>
                  <td className="td-cell text-muted" style={{ fontSize: '0.85rem' }}>{s.team_size_raw ?? '—'}</td>
                  <td className="td-cell">
                    {s.is_hiring_raw
                      ? <span className="d-flex align-items-center gap-1" style={{ color: '#10b981', fontSize: '0.8rem' }}><CheckCircle2 size={14} />Yes</span>
                      : <span className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.8rem' }}><XCircle size={14} />No</span>
                    }
                  </td>
                  <td className="td-cell" style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-dim)' }}>{s.batch_id || '—'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <Pagination currentPage={page} totalItems={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
    </>
  );
};

export default RawScrapesPage;
