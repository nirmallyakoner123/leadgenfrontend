import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
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
  const { data: companies, total, loading, error, page, setPage } =
    usePaginatedFetch(getCompanies, {}, PAGE_SIZE);

  return (
    <>
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
        <Pagination currentPage={page} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </>
  );
};

export default AllCompaniesPage;
