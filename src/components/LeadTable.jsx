import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box, 
  Typography, 
  Avatar, 
  Chip,
  IconButton
} from '@mui/material';
import { ChevronRight, MapPin } from 'lucide-react';

const VERDICT_COLORS = {
  HOT: 'error',
  WARM: 'warning',
  COLD: 'info',
};

const LeadTable = ({ leads, onSelectLead }) => {
  if (!leads || leads.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <Typography color="text.secondary">No leads found.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Box}>
      <Table sx={{ minWidth: 650 }} aria-label="leads table">
        <TableHead>
          <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>COMPANY</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>INDUSTRY</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>LOCATION</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>SCORE</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }}>VERDICT</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem' }} align="right">ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)' },
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
                      fontWeight: 700
                    }}
                  >
                    {(lead.name_display || '?').charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {lead.name_display}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(lead.website || '').replace(/^https?:\/\//, '')}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>
                {lead.industry || '—'}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                  <MapPin size={12} />
                  <Typography variant="caption">
                    {[lead.city, lead.country_code].filter(Boolean).join(', ') || '—'}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {lead.final_score}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">/18</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={lead.verdict} 
                  color={VERDICT_COLORS[lead.verdict] || 'default'}
                  size="small"
                  sx={{ 
                    fontWeight: 700, 
                    borderRadius: 1,
                    fontSize: '0.7rem',
                    height: 20
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, color: 'text.secondary' }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>View Details</Typography>
                  <ChevronRight size={14} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeadTable;
