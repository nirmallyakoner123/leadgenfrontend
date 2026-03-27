import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Stack, 
  Divider,
  TablePagination
} from '@mui/material';
import { CheckCircle2, Clock, Globe, CreditCard } from 'lucide-react';
import { SkeletonCards, ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getPipelineRuns } from '../api/services';

const fmtDate = iso =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const dur = (a, b) => {
  if (!a || !b) return null;
  return `${Math.round((new Date(b) - new Date(a)) / 60000)}m`;
};

const STAT_META = [
  { key: 'companies_scraped',       label: 'Scraped',   color: 'text.primary' },
  { key: 'companies_filtered',      label: 'Filtered',  color: 'text.primary' },
  { key: 'companies_job_checked',   label: 'Job Chkd',  color: 'text.primary' },
  { key: 'companies_ai_evaluated',  label: "AI Eval'd", color: 'text.primary' },
  { key: 'hot_count',               label: '🔥 HOT',    color: 'error.main' },
  { key: 'warm_count',              label: '🟡 WARM',   color: 'warning.main' },
];

const PipelineRunsPage = () => {
  const [pageSize, setPageSize] = useState(5);

  const { data: runs, total, loading, error, page, setPage } =
    usePaginatedFetch(getPipelineRuns, {}, pageSize);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {loading ? '...' : total} pipeline runs
        </Typography>
      </Box>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <SkeletonCards cards={pageSize} />
      ) : (
        <Stack spacing={3} sx={{ mb: 3 }}>
          {runs.map((run) => (
            <Card 
              key={run.id} 
              variant="outlined"
              sx={{ 
                borderRadius: 3, 
                bgcolor: 'background.paper', 
                backgroundImage: 'none',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <Typography variant="subtitle1" component="code" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                        {run.id}
                      </Typography>
                      {run.pipeline_version && (
                        <Chip label={run.pipeline_version} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <Clock size={14} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {fmtDate(run.started_at)} → {fmtDate(run.completed_at)}
                        {dur(run.started_at, run.completed_at) && (
                          <Box component="span" sx={{ ml: 1, opacity: 0.7 }}>
                            ({dur(run.started_at, run.completed_at)})
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(run.geographies_run || []).map((g) => (
                      <Chip 
                        key={g} 
                        label={g} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20, bgcolor: 'rgba(25, 118, 210, 0.05)', borderColor: 'rgba(25, 118, 210, 0.2)', color: 'primary.main', fontWeight: 600 }} 
                      />
                    ))}
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {STAT_META.map((s) => (
                    <Grid item xs={4} sm={2} key={s.key}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2.5, 
                        bgcolor: 'rgba(255, 255, 255, 0.02)', 
                        textAlign: 'center',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: s.color, lineHeight: 1.2 }}>
                          {run[s.key] ?? '0'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {s.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {(run.sources_run?.length > 0 || run.total_llm_cost_usd != null) && (
                  <>
                    <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      {run.sources_run?.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                          <Globe size={14} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Sources: {run.sources_run.join(' · ')}
                          </Typography>
                        </Box>
                      )}
                      {run.total_llm_cost_usd != null && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                          <CreditCard size={14} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            LLM Cost: <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>${Number(run.total_llm_cost_usd).toFixed(4)}</Box>
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Paper 
        variant="outlined" 
        sx={{ 
          borderRadius: 3, 
          bgcolor: 'background.paper', 
          borderColor: 'divider',
          backgroundImage: 'none'
        }}
      >
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          sx={{ border: 'none' }}
        />
      </Paper>
    </Box>
  );
};

export default PipelineRunsPage;

