import React, { useState } from 'react';
import { ExternalLink, MapPin, Search } from 'lucide-react';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner, TableHead } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getCompanies } from '../api/services';

const PAGE_SIZE  = 10;
const COLS       = ['Company', 'Size', 'Location', 'Sources', 'Industries'];
const COL_WIDTHS = ['35%', '10%', '18%', '20%', '17%'];

const SOURCE_COLOR = {
  YC: '#f59e0b', ProductHunt: '#ef4444', LinkedIn: '#0077b5',
  TechCrunch: '#00bb34', GoogleNews: '#4285f4', Naukri: '#4a00e0',
  Seek: '#00bcd4', Reed: '#e91e63',
};

const AllCompaniesPage = () => {
  const [pageSize, setPageSize]       = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = searchQuery ? { search: searchQuery } : {};

  const { data: companies, total, loading, error, page, setPage } =
    usePaginatedFetch(getCompanies, filters, pageSize);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  return (
    <>
      <div className="filter-pills" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.2rem 0.5rem' }}>
          <Search size={14} color="var(--text-dim)" />
          <input 
            type="text" 
            placeholder="Search all companies..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '0.85rem', padding: '0.2rem 0.5rem', width: '250px' }}
          />
        </form>

        <span className="ms-auto d-flex align-items-center" style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          {loading ? '…' : total} total companies
        </span>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="glass-card">
        <table className="page-table">
          <TableHead columns={COLS} widths={COL_WIDTHS} />
          <tbody>
            {loading
              ? <SkeletonTable colWidths={COL_WIDTHS} rows={PAGE_SIZE} />
              : companies.map(c => (
                <tr key={c.id} className="table-row">
                  <td className="td-cell td-cell-first">
                    <div className="d-flex align-items-center gap-2">
                      <div className="company-avatar">{(c.name_display || '?').charAt(0)}</div>
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '0.88rem' }}>{c.name_display}</div>
                        {c.website && (
                          <a href={c.website} target="_blank" rel="noreferrer" className="ats-link" style={{ fontSize: '0.73rem' }}>
                            {c.website.replace(/^https?:\/\//, '').split('/')[0]}<ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="td-cell text-muted" style={{ fontSize: '0.85rem' }}>{c.team_size || '—'}</td>
                  <td className="td-cell">
                    <span className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.83rem' }}>
                      <MapPin size={12} />{[c.city, c.country_code].filter(Boolean).join(', ') || '—'}
                    </span>
                  </td>
                  <td className="td-cell">
                    <div className="d-flex flex-wrap gap-1">
                      {(c.sources || []).map(s => (
                        <span key={s} className="source-pill" style={{ background: `${SOURCE_COLOR[s] || 'var(--primary)'}22`, color: SOURCE_COLOR[s] || 'var(--primary)' }}>{s}</span>
                      ))}
                      {!c.sources?.length && <span className="text-muted">—</span>}
                    </div>
                  </td>
                  <td className="td-cell text-muted" style={{ fontSize: '0.8rem' }}>{(c.industries || []).slice(0, 2).join(', ') || '—'}</td>
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

export default AllCompaniesPage;
