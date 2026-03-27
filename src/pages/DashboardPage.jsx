import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import LeadTable from '../components/LeadTable';
import LeadDetails from '../components/LeadDetails';
import Pagination from '../components/Pagination';
import { ErrorBanner } from '../components/ui';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import { getLeads, getDashboardStats } from '../api/services';

const PAGE_SIZE = 10;

const DashboardPage = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setStatsLoading(true);
    getDashboardStats()
      .then(res => { if (!cancelled) setStats(res.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setStatsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const { data: leads, total, loading: leadsLoading, error, page, setPage } =
    usePaginatedFetch(getLeads, {}, PAGE_SIZE);

  const statCards = [
    { label: 'Total Leads',   value: stats?.total_leads,    icon: <Users size={20} /> },
    { label: 'Hot Leads',     value: stats?.hot_leads,      icon: <Zap size={20} /> },
    { label: 'Warm Leads',    value: stats?.warm_leads,     icon: <TrendingUp size={20} /> },
    { label: 'Pipeline /day', value: stats?.pipeline_speed, icon: <Target size={20} /> },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lead Intelligence Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time AI verification and scoring for prospective clients.
        </Typography>
      </Box>

      {/* Stat Cards — matching reference StatCard pattern */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        {statCards.map((card, i) => (
          <Card key={i} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="overline" color="text.secondary">{card.label}</Typography>
              <Box color="primary.main">{card.icon}</Box>
            </Box>
            <Typography variant="h4">
              {statsLoading ? <CircularProgress size={24} thickness={4} /> : (card.value ?? '—')}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* Leads table section */}
      {error && <Box sx={{ mb: 3 }}><ErrorBanner message={error} /></Box>}

      <Card sx={{ p: 0 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Qualified Prospects</Typography>
          <Chip 
            label={`${leadsLoading ? '…' : total} total`} 
            size="small" 
            sx={{ fontWeight: 700 }} 
          />
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          {leadsLoading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">Loading leads...</Typography>
            </Box>
          ) : (
            <LeadTable leads={leads} onSelectLead={setSelectedLead} />
          )}
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Pagination currentPage={page} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Box>
      </Card>

      <AnimatePresence>
        {selectedLead && <LeadDetails lead={selectedLead} onClose={() => setSelectedLead(null)} />}
      </AnimatePresence>
    </Box>
  );
};

export default DashboardPage;
