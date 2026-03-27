import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  InputAdornment, 
  Chip,
  Container
} from '@mui/material';
import { 
  DataGrid 
} from '@mui/x-data-grid';
import { 
  Globe, 
  CheckCircle2, 
  XCircle, 
  Search,
  ArrowUpRight
} from 'lucide-react';
import { ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getScrapes } from '../api/services';

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

  const columns = [
    { 
      field: 'company_name_raw', 
      headerName: 'Company (Raw)', 
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600" sx={{ mt: 1.5 }}>
          {params.value || '—'}
        </Typography>
      )
    },
    { 
      field: 'source', 
      headerName: 'Source', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ mt: 1.5 }}>
          <Chip 
            label={params.value || '—'} 
            size="small"
            icon={SOURCE_ICON[params.value] ? <span>{SOURCE_ICON[params.value]}</span> : <Globe size={11} />}
            sx={{ 
              bgcolor: `${SOURCE_COLOR[params.value] || '#2196f3'}15`, 
              color: SOURCE_COLOR[params.value] || '#2196f3',
              fontWeight: 700,
              border: 'none'
            }}
          />
        </Box>
      )
    },
    { 
      field: 'country_code', 
      headerName: 'Country', 
      width: 100,
      renderCell: (params) => (
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 0.8, py: 0.3, borderRadius: 1 }}>
            {params.value || '—'}
          </Typography>
        </Box>
      )
    },
    { field: 'team_size_raw', headerName: 'Team Size', width: 120 },
    { 
      field: 'is_hiring_raw', 
      headerName: 'Hiring?', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ mt: 1.5 }}>
          {params.value ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
              <CheckCircle2 size={14} />
              <Typography variant="caption" fontWeight="700">Yes</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
              <XCircle size={14} />
              <Typography variant="caption">No</Typography>
            </Box>
          )}
        </Box>
      )
    },
    { 
      field: 'batch_id', 
      headerName: 'Batch', 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', mt: 1.5, display: 'block' }}>
          {params.value || '—'}
        </Typography>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="700">Raw Scrape Events</Typography>
        <Typography variant="body2" color="text.secondary">
          {loading ? '…' : total} total events
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search raw scrape events..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, bgcolor: 'background.paper' }
            }}
          />
        </form>
      </Box>

      {error && <Box sx={{ mb: 2 }}><ErrorBanner message={error} /></Box>}

      <Paper sx={{ height: 650, width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <DataGrid
          rows={scrapes || []}
          columns={columns}
          loading={loading}
          rowCount={total || 0}
          paginationMode="server"
          paginationModel={{ page: page - 1, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page + 1);
            setPageSize(model.pageSize);
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
          }}
        />
      </Paper>
    </Box>
  );
};

export default RawScrapesPage;
