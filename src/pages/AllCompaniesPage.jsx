import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  InputAdornment, 
  Avatar, 
  Chip, 
  Stack, 
  Link,
  TablePagination,
} from '@mui/material';
import { Search, ExternalLink, MapPin } from 'lucide-react';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getCompanies } from '../api/services';
import { SkeletonTable, ErrorBanner } from '../components/ui';

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
    setPage(1); // Reset to first page on search
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1); // MUI uses 0-based page index, our hook uses 1-based
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header & Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search all companies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoComplete="off"
            sx={{ 
              width: { xs: '100%', sm: 300 },
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 2,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="var(--text-dim)" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {loading ? '...' : total} total companies
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
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', width: '35%' }}>COMPANY</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', width: '10%' }}>SIZE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', width: '18%' }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', width: '20%' }}>SOURCES</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', width: '17%' }}>INDUSTRIES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <SkeletonTable colWidths={['35%', '10%', '18%', '20%', '17%']} rows={pageSize} />
              ) : companies.map((c) => (
                <TableRow 
                  key={c.id}
                  sx={{ 
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          fontSize: '0.875rem', 
                          bgcolor: 'primary.main',
                          fontWeight: 700,
                          borderRadius: 2
                        }}
                      >
                        {(c.name_display || '?').charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {c.name_display}
                        </Typography>
                        {c.website && (
                          <Link 
                            href={c.website} 
                            target="_blank" 
                            rel="noreferrer" 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5, 
                              fontSize: '0.75rem', 
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {c.website.replace(/^https?:\/\//, '').split('/')[0]}
                            <ExternalLink size={10} />
                          </Link>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {c.team_size || '—'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <MapPin size={12} />
                      <Typography variant="caption">
                        {[c.city, c.country_code].filter(Boolean).join(', ') || '—'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {(c.sources || []).map(s => (
                        <Chip 
                          key={s} 
                          label={s} 
                          size="small"
                          sx={{ 
                            bgcolor: `${SOURCE_COLOR[s] || '#666'}22`, 
                            color: SOURCE_COLOR[s] || '#666',
                            borderRadius: 1,
                            fontSize: '0.7rem',
                            height: 20,
                            fontWeight: 600,
                            border: 'none'
                          }} 
                        />
                      ))}
                      {!c.sources?.length && <Typography variant="caption" color="text.secondary">—</Typography>}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {(c.industries || []).slice(0, 2).join(', ') || '—'}
                  </TableCell>
                </TableRow>
              ))}
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

export default AllCompaniesPage;

