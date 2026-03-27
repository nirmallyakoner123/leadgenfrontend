import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  TextField, 
  InputAdornment, 
  Chip,
  Container
} from '@mui/material';
import { Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import LeadTable from '../components/LeadTable';
import LeadDetails from '../components/LeadDetails';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getLeads } from '../api/services';

const PAGE_SIZE      = 10;
const FILTERS        = ['ALL', 'HOT', 'WARM', 'COLD'];

const ActiveLeadsPage = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [filter, setFilter]             = useState('ALL');
  const [pageSize, setPageSize]         = useState(10);
  const [searchInput, setSearchInput]   = useState('');
  const [searchQuery, setSearchQuery]   = useState('');

  const filters = {
    ...(filter !== 'ALL' && { verdict: filter }),
    ...(searchQuery && { search: searchQuery })
  };

  const { data: leads, total, loading, error, page, setPage } =
    usePaginatedFetch(getLeads, filters, pageSize);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="700">Active Leads</Typography>
        <Typography variant="body2" color="text.secondary">
          {loading ? '…' : total} leads
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
        <Tabs 
          value={filter} 
          onChange={handleFilterChange}
          sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            px: 1,
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          {FILTERS.map(f => (
            <Tab 
              key={f} 
              label={f} 
              value={f} 
              sx={{ fontWeight: 700, minWidth: 80, textTransform: 'none' }}
            />
          ))}
        </Tabs>

        <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search companies..."
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

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ overflowX: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Loading leads...</Typography>
            </Box>
          ) : (
            <LeadTable leads={leads} onSelectLead={setSelectedLead} />
          )}
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination currentPage={page} totalItems={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </Box>
      </Paper>

      <AnimatePresence>
        {selectedLead && <LeadDetails lead={selectedLead} onClose={() => setSelectedLead(null)} />}
      </AnimatePresence>
    </Box>
  );
};

export default ActiveLeadsPage;
