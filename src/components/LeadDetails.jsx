import React from 'react';
import { 
  Box, 
  Typography, 
  Drawer, 
  IconButton, 
  Avatar, 
  Chip, 
  Divider, 
  Button, 
  Stack,
  Paper
} from '@mui/material';
import { X, ExternalLink, Globe, Briefcase, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

const LeadDetails = ({ lead, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={!!lead}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 500 }, bgcolor: 'background.default', p: 3, backgroundImage: 'none' }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="700">Lead Intelligence</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <X size={20} />
        </IconButton>
      </Box>

      {lead && (
        <>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2.5, 
              mb: 4, 
              borderRadius: 3, 
              bgcolor: 'rgba(25, 118, 210, 0.04)',
              borderColor: 'rgba(25, 118, 210, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  fontSize: '1.25rem', 
                  bgcolor: 'primary.main',
                  fontWeight: 700,
                  borderRadius: 2
                }}
              >
                {lead.name_display.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ lineHeight: 1.2, mb: 0.5 }}>{lead.name_display}</Typography>
                <Stack direction="row" spacing={2}>
                  <Box component="a" href={lead.website} target="_blank" rel="noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', textDecoration: 'none', fontSize: '0.8125rem' }}>
                    <Globe size={14} />
                    Website <ExternalLink size={12} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontSize: '0.8125rem' }}>
                    <Briefcase size={14} />
                    {lead.industry}
                  </Box>
                </Stack>
              </Box>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip label={`${lead.team_size} Employees`} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: '0.75rem', borderColor: 'divider' }} />
              <Chip label={`${lead.city}, ${lead.country_code}`} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: '0.75rem', borderColor: 'divider' }} />
            </Stack>
          </Paper>

          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                color: 'primary.main', 
                fontWeight: 800,
                mb: 1.5
              }}
            >
              <Zap size={16} />
              AI VERDICT: {lead.verdict} ({lead.final_score}/18)
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2.5, 
                borderRadius: 3, 
                bgcolor: 'rgba(255, 255, 255, 0.02)',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2 }}>
                {lead.why_they_fit}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, display: 'block', mb: 1, textTransform: 'uppercase' }}>
                Recommended Outreach Opener
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                "{lead.outreach_opener}"
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 700 }}>
              Verification Signals
            </Typography>
            <Stack spacing={1.5}>
              {lead.signal_results.map((signal, idx) => (
                <Paper 
                  key={idx} 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2.5,
                    bgcolor: 'background.paper',
                    display: 'flex',
                    gap: 2,
                    borderColor: 'divider'
                  }}
                >
                  {signal.passed ? (
                    <CheckCircle2 size={20} color="#10b981" />
                  ) : (
                    <AlertCircle size={20} style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                  )}
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: signal.passed ? 'text.primary' : 'text.secondary' }}>
                      {signal.signal_id.replace(/_/g, ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.4 }}>
                      {signal.evidence}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
            <Button variant="contained" fullWidth sx={{ borderRadius: 2, py: 1, fontWeight: 700, textTransform: 'none' }}>
              Copy Outreach
            </Button>
            <Button variant="outlined" fullWidth sx={{ borderRadius: 2, py: 1, fontWeight: 700, textTransform: 'none', color: 'text.primary', borderColor: 'divider' }}>
              Export PDF
            </Button>
          </Stack>
        </>
      )}
    </Drawer>
  );
};

export default LeadDetails;
