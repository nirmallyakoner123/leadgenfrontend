import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead as MuiTableHead, 
  TableRow, 
  TablePagination, 
  TextField, 
  InputAdornment, 
  Chip, 
  Alert 
} from '@mui/material';
import { CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { SkeletonTable, ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getTokenCache } from '../api/services';

const COLS = ['Company', 'Profile Token', 'Job Token', 'AI Token', 'Last Verdict', 'Score'];

const toTitle = (s = '') => s.replace(/\b\w/g, c => c.toUpperCase());

const TokenBadge = ({ needsRefresh }) => (
  <Chip
    icon={needsRefresh ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
    label={needsRefresh ? "Stale" : "Fresh"}
    size="small"
    variant="outlined"
    sx={{
      fontSize: '0.65rem',
      height: 20,
      fontWeight: 600,
      color: needsRefresh ? 'warning.main' : 'success.main',
      borderColor: needsRefresh ? 'rgba(237, 108, 2, 0.3)' : 'rgba(46, 125, 50, 0.3)',
      bgcolor: needsRefresh ? 'rgba(237, 108, 2, 0.05)' : 'rgba(46, 125, 50, 0.05)',
      '& .MuiChip-icon': {
        color: 'inherit'
      }
    }}
  />
);

const TokenCachePage = () => {
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = searchQuery ? { search: searchQuery } : {};

  const { data: tokens, total, loading, error, page, setPage } =
    usePaginatedFetch(getTokenCache, filters, pageSize);

  const staleCount = tokens.filter(t =>
    t.profile_needs_refresh || t.job_needs_refresh || t.ai_needs_refresh
  ).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Search and Stats */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit}>
          <TextField
            placeholder="Search token cache..."
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                bgcolor: 'background.paper',
              }
            }}
          />
        </form>

        <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary', fontWeight: 500 }}>
          {loading ? '...' : total} tokens
        </Typography>
      </Box>

      {error && <ErrorBanner message={error} />}

      {!loading && staleCount > 0 && (
        <Alert 
          severity="warning" 
          icon={<AlertCircle size={20} />}
          sx={{ mb: 3, borderRadius: 2.5, alignItems: 'center' }}
        >
          <strong>{staleCount}</strong> companies on this page have stale tokens — will re-evaluate next run.
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper', backgroundImage: 'none', mb: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <MuiTableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
            <TableRow>
              {COLS.map((col) => (
                <TableCell key={col} sx={{ py: 1.5, fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </MuiTableHead>
          <TableBody>
            {loading ? (
              <SkeletonTable rows={pageSize} />
            ) : (
              tokens.map((t) => (
                <TableRow key={t.company_id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>
                    {toTitle(t.name_normalized) || t.company_id}
                  </TableCell>
                  <TableCell>
                    <TokenBadge needsRefresh={t.profile_needs_refresh} />
                  </TableCell>
                  <TableCell>
                    <TokenBadge needsRefresh={t.job_needs_refresh} />
                  </TableCell>
                  <TableCell>
                    <TokenBadge needsRefresh={t.ai_needs_refresh} />
                  </TableCell>
                  <TableCell>
                    {t.last_verdict ? (
                      <Chip 
                        label={t.last_verdict} 
                        size="small"
                        sx={{ 
                          height: 22, 
                          fontSize: '0.7rem', 
                          fontWeight: 700,
                          bgcolor: t.last_verdict === 'HOT' ? 'rgba(239, 68, 68, 0.1)' : t.last_verdict === 'WARM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                          color: t.last_verdict === 'HOT' ? 'error.main' : t.last_verdict === 'WARM' ? 'warning.main' : 'text.secondary',
                          border: '1px solid',
                          borderColor: t.last_verdict === 'HOT' ? 'rgba(239, 68, 68, 0.2)' : t.last_verdict === 'WARM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        }} 
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {t.last_score != null ? (
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{t.last_score}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>/18</Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </TableContainer>
    </Box>
  );
};

export default TokenCachePage;

