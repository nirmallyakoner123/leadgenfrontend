import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip,
  Stack
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import LeadTable from '../components/LeadTable';
import LeadDetails from '../components/LeadDetails';
import Pagination from '../components/Pagination';
import { SkeletonTable, ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getLeads } from '../api/services';

const PAGE_SIZE     = 10;

const HighIntentPage = () => {
  const [selectedLead, setSelectedLead] = useState(null);

  const { data: leads, total, loading, error, page, setPage } =
    usePaginatedFetch(getLeads, {}, PAGE_SIZE);

  const highIntent = leads.filter(l =>
    Array.isArray(l.signal_results) &&
    l.signal_results.some(s => s.signal_id === 'ats_confirmed' && s.passed)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="700">High Intent Leads</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
           <Chip 
            label={`${loading ? '…' : highIntent.length} ATS-Confirmed`}
            color="error"
            size="small"
            sx={{ fontWeight: 700, borderRadius: 1.5, bgcolor: 'rgba(211, 47, 47, 0.1)', color: 'error.main' }}
          />
          <Typography variant="body2" color="text.secondary">
            {loading ? '…' : total} total leads
          </Typography>
        </Stack>
      </Box>

      {error && <Box sx={{ mb: 2 }}><ErrorBanner message={error} /></Box>}

      <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ overflowX: 'auto' }}>
          {loading ? (
             <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Loading leads...</Typography>
            </Box>
          ) : (
            <LeadTable leads={highIntent} onSelectLead={setSelectedLead} />
          )}
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination currentPage={page} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Box>
      </Paper>

      <AnimatePresence>
        {selectedLead && <LeadDetails lead={selectedLead} onClose={() => setSelectedLead(null)} />}
      </AnimatePresence>
    </Box>
  );
};

export default HighIntentPage;
