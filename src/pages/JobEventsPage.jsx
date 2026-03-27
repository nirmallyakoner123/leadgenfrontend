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
  Link,
  TablePagination
} from '@mui/material';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SkeletonTable, ErrorBanner, TableHead } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getJobEvents } from '../api/services';

const COLS       = ['Company', 'ATS / Method', 'Jobs', 'HR Role', 'HR Tech', 'Board URL'];
const COL_WIDTHS = ['26%', '16%', '9%', '9%', '9%', '31%'];

const METHOD_COLOR = {
  Greenhouse: '#2ecc71', Lever: '#e74c3c', Ashby: '#9b59b6',
  Indeed: '#2089e2', google_search: '#4285f4', careers_page: '#f59e0b',
};

const JobEventsPage = () => {
  const [pageSize, setPageSize] = useState(10);

  const { data: jobs, total, loading, error, page, setPage } =
    usePaginatedFetch(getJobEvents, {}, pageSize);

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
          {loading ? '...' : total} job events
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
              ) : jobs.map((j) => {
                const mc = METHOD_COLOR[j.check_method] || '#666';
                return (
                  <TableRow 
                    key={j.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.88rem' }}>
                      {j.company || j.company_id}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={j.check_method || '—'} 
                        size="small"
                        sx={{ 
                          bgcolor: `${mc}22`, 
                          color: mc,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          height: 20,
                          fontWeight: 600,
                          border: 'none'
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: (j.job_count ?? 0) > 10 ? '#10b981' : 'inherit' }}>
                      {j.job_count ?? '—'}
                    </TableCell>
                    <TableCell align="center">
                      {j.hr_role_found ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="rgba(255, 255, 255, 0.3)" />}
                    </TableCell>
                    <TableCell align="center">
                      {j.hr_tech_role_found ? <CheckCircle2 size={16} color="#10b981" /> : <XCircle size={16} color="rgba(255, 255, 255, 0.3)" />}
                    </TableCell>
                    <TableCell>
                      {j.ats_board_url ? (
                        <Link 
                          href={j.ats_board_url} 
                          target="_blank" 
                          rel="noreferrer"
                          sx={{ 
                            fontSize: '0.8rem', 
                            color: 'primary.main', 
                            textDecoration: 'none',
                            fontWeight: 600,
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          View Board →
                        </Link>
                      ) : (
                        <Typography variant="caption" color="text.secondary">N/A</Typography>
                      )}
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

export default JobEventsPage;

