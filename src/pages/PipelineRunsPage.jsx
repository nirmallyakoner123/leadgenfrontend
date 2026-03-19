import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import Pagination from '../components/Pagination';
import { SkeletonCards, ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getPipelineRuns } from '../api/services';

const PAGE_SIZE = 5;

const fmtDate = iso =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const dur = (a, b) => {
  if (!a || !b) return null;
  return `${Math.round((new Date(b) - new Date(a)) / 60000)}m`;
};

const STAT_META = [
  { key: 'companies_scraped',       label: 'Scraped',   color: 'var(--text-main)' },
  { key: 'companies_filtered',      label: 'Filtered',  color: 'var(--text-main)' },
  { key: 'companies_job_checked',   label: 'Job Chkd',  color: 'var(--text-main)' },
  { key: 'companies_ai_evaluated',  label: "AI Eval'd", color: 'var(--text-main)' },
  { key: 'hot_count',               label: '🔥 HOT',    color: 'var(--accent-hot)' },
  { key: 'warm_count',              label: '🟡 WARM',   color: 'var(--accent-warm)' },
];

const PipelineRunsPage = () => {
  const { data: runs, total, loading, error, page, setPage } =
    usePaginatedFetch(getPipelineRuns, {}, PAGE_SIZE);

  return (
    <>
      {error && <ErrorBanner message={error} />}

      {loading
        ? <SkeletonCards cards={PAGE_SIZE} />
        : (
          <div className="d-flex flex-column gap-3 mb-3">
            {runs.map(run => (
              <div key={run.id} className="glass-card run-card">
                <div className="run-card__header">
                  <div>
                    <div className="run-card__id-row">
                      <CheckCircle2 size={15} color="#10b981" />
                      <code className="run-card__id">{run.id}</code>
                      {run.pipeline_version && <span className="run-card__version">{run.pipeline_version}</span>}
                    </div>
                    <div className="run-card__time">
                      <Clock size={12} />
                      {fmtDate(run.started_at)} → {fmtDate(run.completed_at)}
                      {dur(run.started_at, run.completed_at) && (
                        <span className="text-muted">({dur(run.started_at, run.completed_at)})</span>
                      )}
                    </div>
                  </div>
                  <div className="run-card__geo">
                    {(run.geographies_run || []).map(g => (
                      <span key={g} className="run-card__geo-badge">{g}</span>
                    ))}
                  </div>
                </div>

                <div className="run-card__stat-grid">
                  {STAT_META.map(s => (
                    <div key={s.key} className="run-stat-box">
                      <div className="run-stat-box__value" style={{ color: s.color }}>{run[s.key] ?? '—'}</div>
                      <div className="run-stat-box__label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {(run.sources_run?.length || run.total_llm_cost_usd != null) && (
                  <div className="run-card__footer">
                    {run.sources_run?.length > 0 && <span>Sources: {run.sources_run.join(' · ')}</span>}
                    {run.total_llm_cost_usd != null && (
                      <span>LLM Cost: <strong className="text-muted">${Number(run.total_llm_cost_usd).toFixed(4)}</strong></span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }

      <div className="glass-card">
        <Pagination currentPage={page} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </>
  );
};

export default PipelineRunsPage;
