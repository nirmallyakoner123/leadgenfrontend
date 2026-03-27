/**
 * ui.jsx — Shared UI primitives
 * ─────────────────────────────────────────────────────────────────
 * Refactored to use Material UI components while maintaining the 
 * original structural patterns for easy integration.
 */

import React from 'react';
import { 
  Box, 
  Typography, 
  TableHead as MuiTableHead, 
  TableRow, 
  TableCell, 
  Skeleton,
  Alert,
  AlertTitle,
  Card,
  Grid
} from '@mui/material';

/**
 * TableHead — MUI-based thead row.
 * @param {string[]} columns  — display labels
 * @param {string[]} widths   — col widths e.g. ['35%','12%','10%','15%','28%']
 */
export const TableHead = ({ columns, widths = [] }) => (
  <MuiTableHead>
    <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
      {columns.map((col, i) => (
        <TableCell 
          key={i} 
          sx={{ 
            fontWeight: 700, 
            color: 'text.secondary', 
            fontSize: '0.75rem',
            width: widths[i],
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {col}
        </TableCell>
      ))}
    </TableRow>
  </MuiTableHead>
);

/**
 * SkeletonTable — renders MUI TableRow + TableCell with Skeleton.
 * Must be placed directly inside a TableBody.
 *
 * @param {string[]} colWidths — column widths
 * @param {number}   rows      — number of skeleton rows
 */
export const SkeletonTable = ({ colWidths = [], rows = 10 }) => (
  <>
    {Array.from({ length: rows }, (_, r) => (
      <TableRow key={r} sx={{ '& td': { borderBottom: '1px solid', borderColor: 'divider' } }}>
        {colWidths.map((w, c) => (
          <TableCell key={c} sx={{ width: w, py: 2 }}>
            <Skeleton 
              variant="text" 
              width={`${55 + ((r * 7 + c * 13) % 38)}%`} 
              height={20} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}
            />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

/**
 * SkeletonCards — renders full card blocks for non-table pages.
 */
export const SkeletonCards = ({ cards = 5 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: cards }, (_, i) => (
      <Grid item xs={12} key={i}>
        <Card 
          variant="outlined" 
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: 'background.paper', 
            backgroundImage: 'none', 
            borderColor: 'divider' 
          }}
        >
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
          <Skeleton variant="text" width="20%" height={20} sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.03)' }} />
          <Grid container spacing={2}>
            {Array.from({ length: 6 }, (_, j) => (
              <Grid item xs={4} sm={2} key={j}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.02)', textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                  <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto', mb: 0.5, bgcolor: 'rgba(255, 255, 255, 0.05)' }} />
                  <Skeleton variant="text" width="80%" height={16} sx={{ mx: 'auto', bgcolor: 'rgba(255, 255, 255, 0.03)' }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Grid>
    ))}
  </Grid>
);

/**
 * ErrorBanner — consistent API error display using MUI Alert.
 */
export const ErrorBanner = ({ message }) => (
  <Alert 
    severity="error" 
    variant="outlined"
    sx={{ 
      mb: 3, 
      borderRadius: 2, 
      bgcolor: 'rgba(211, 47, 47, 0.05)', 
      borderColor: 'rgba(211, 47, 47, 0.2)',
      color: '#ffcdd2',
      '& .MuiAlert-icon': { color: '#ef5350' }
    }}
  >
    <AlertTitle sx={{ fontWeight: 700 }}>API Error</AlertTitle>
    {message} — <Typography variant="caption" component="span" sx={{ opacity: 0.8 }}>Ensure the FastAPI backend is running on port 8000.</Typography>
  </Alert>
);

export default SkeletonTable;

