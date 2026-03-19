import React from 'react';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner, TableHead } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getAIResults } from '../api/services';

const PAGE_SIZE  = 10;
const COLS       = ['Company', 'Verdict', 'Score', 'Confidence', 'Model', 'Cost', 'Batch'];
const COL_WIDTHS = ['24%', '10%', '18%', '10%', '16%', '8%', '14%'];

const VERDICT_CLASS = { HOT: 'badge-hot', WARM: 'badge-warm', COLD: 'badge-cold' };
const VERDICT_BAR   = { HOT: 'var(--accent-hot)', WARM: 'var(--accent-warm)', COLD: 'var(--accent-cold)' };
const CONF_COLOR    = { HIGH: '#10b981', MED: '#f59e0b', LOW: '#ef4444' };

const AIEvaluationsPage = () => {
  const { data: results, total, loading, error, page, setPage } =
    usePaginatedFetch(getAIResults, {}, PAGE_SIZE);

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <div className="glass-card">
        <table className="page-table">
          <TableHead columns={COLS} widths={COL_WIDTHS} />
          <tbody>
            {loading
              ? <SkeletonTable colWidths={COL_WIDTHS} rows={PAGE_SIZE} />
              : results.map(a => {
                  const pct      = a.max_score ? Math.round((a.final_score / a.max_score) * 100) : 0;
                  const barColor = VERDICT_BAR[a.verdict] || 'var(--primary)';
                  const vClass   = VERDICT_CLASS[a.verdict] || '';
                  return (
                    <tr key={a.id} className="table-row">
                      <td className="td-cell td-cell-first fw-semibold" style={{ fontSize: '0.88rem' }}>{a.company || a.company_id}</td>
                      <td className="td-cell">
                        <span className={`verdict-pill ${vClass}`}>{a.verdict}</span>
                      </td>
                      <td className="td-cell">
                        <div className="score-bar-wrap">
                          <span className="fw-bold" style={{ fontSize: '0.9rem', minWidth: '22px' }}>{a.final_score}</span>
                          <div className="score-bar-track">
                            <div className="score-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', flexShrink: 0 }}>/{a.max_score}</span>
                        </div>
                      </td>
                      <td className="td-cell fw-bold" style={{ color: CONF_COLOR[a.data_confidence], fontSize: '0.82rem' }}>
                        {a.data_confidence || '—'}
                      </td>
                      <td className="td-cell text-muted" style={{ fontFamily: 'monospace', fontSize: '0.74rem' }}>{a.llm_model_used || '—'}</td>
                      <td className="td-cell" style={{ fontSize: '0.8rem' }}>
                        {a.llm_cost_usd != null ? `$${Number(a.llm_cost_usd).toFixed(4)}` : '—'}
                      </td>
                      <td className="td-cell" style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {(a.batch_id || '—').slice(0, 12)}&hellip;
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

export default AIEvaluationsPage;
