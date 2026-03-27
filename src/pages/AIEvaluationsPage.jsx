import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Chip, 
  LinearProgress,
  TablePagination
} from '@mui/material';
import { SkeletonTable, ErrorBanner, TableHead } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getAIResults } from '../api/services';

const COLS       = ['Company', 'Verdict', 'Score', 'Confidence', 'Model', 'Cost', 'Batch'];
const COL_WIDTHS = ['24%', '10%', '18%', '10%', '16%', '8%', '14%'];

const VERDICT_COLORS = { HOT: 'error', WARM: 'warning', COLD: 'info' };
const CONF_COLOR    = { HIGH: '#10b981', MED: '#f59e0b', LOW: '#ef4444' };

const AIEvaluationsPage = () => {
  const [pageSize, setPageSize] = useState(10);

  const { data: results, total, loading, error, page, setPage } =
    usePaginatedFetch(getAIResults, {}, pageSize);

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
          {loading ? '...' : total} evaluations
        </Typography>
      </Box>

      {error && <ErrorBanner message={error} />}

      <Paper 
        variant="outlined" 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          bgcolor: 'background.paper',
          borderColor: 'divider',
          backgroundImage: 'none'
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead columns={COLS} widths={COL_WIDTHS} />
            <TableBody>
              {loading ? (
                <SkeletonTable colWidths={COL_WIDTHS} rows={pageSize} />
              ) : results.map((a) => {
                const pct = a.max_score ? (a.final_score / a.max_score) * 100 : 0;
                const verdictColor = VERDICT_COLORS[a.verdict] || 'default';
                
                return (
                  <TableRow 
                    key={a.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                      {a.company || a.company_id}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={a.verdict} 
                        color={verdictColor}
                        size="small"
                        sx={{ 
                          fontWeight: 700, 
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 20 }}>
                          {a.final_score}
                        </Typography>
                        <Box sx={{ flexGrow: 1, minWidth: 60 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={pct} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                              }
                            }}
                            color={verdictColor}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          /{a.max_score}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: CONF_COLOR[a.data_confidence] || 'text.secondary', fontSize: '0.82rem' }}>
                      {a.data_confidence || '—'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.74rem', color: 'text.secondary' }}>
                      {a.llm_model_used || '—'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.8rem' }}>
                      {a.llm_cost_usd != null ? `$${Number(a.llm_cost_usd).toFixed(4)}` : '—'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'text.secondary', opacity: 0.6 }}>
                      {(a.batch_id || '—').slice(0, 12)}...
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        />
      </Paper>
    </Box>
  );
};

export default AIEvaluationsPage;

