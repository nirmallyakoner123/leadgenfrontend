import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  InputBase, 
  Badge, 
  Avatar, 
  Tooltip,
  Paper,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as BellIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { 
  BarChart3, 
  Users, 
  Target, 
  Mail, 
  Building2, 
  Database, 
  Briefcase, 
  BrainCircuit, 
  PlaySquare, 
  KeyRound,
  Zap
} from 'lucide-react';
import RegionModal from '../components/RegionModal';

// Page title map
const PAGE_TITLES = {
  '/':               { title: 'Dashboard',       sub: 'Lead intelligence overview' },
  '/active-leads':   { title: 'Active Leads',    sub: 'AI-qualified prospects' },
  '/high-intent':    { title: 'High Intent',     sub: 'ATS-confirmed buying signals' },
  '/outreach':       { title: 'Outreach',        sub: 'Email campaign management' },
  '/companies':      { title: 'All Companies',   sub: 'Full company registry' },
  '/raw-scrapes':    { title: 'Raw Scrapes',     sub: 'Unfiltered scrape events' },
  '/job-events':     { title: 'Job Events',      sub: 'ATS detections & job checks' },
  '/ai-evaluations': { title: 'AI Evaluations',  sub: 'Brain scoring results' },
  '/pipeline-runs':  { title: 'Pipeline Runs',   sub: 'Execution history' },
  '/token-cache':    { title: 'Token Cache',     sub: 'Freshness status' },
};

const drawerWidth = 260;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const meta = PAGE_TITLES[location.pathname] || { title: 'LeadGen', sub: '' };

  const handleStartPipeline = (region) => {
    setIsModalOpen(false);
    const url = `/pipeline-runner?region=${region}`;
    window.open(url, 'PipelineRunner', 'width=900,height=700,status=no,menubar=no,toolbar=no');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <BarChart3 size={20} />, path: '/' },
    { label: 'Active Leads', icon: <Users size={20} />, path: '/active-leads' },
    { label: 'High Intent', icon: <Target size={20} />, path: '/high-intent' },
    { label: 'Outreach', icon: <Mail size={20} />, path: '/outreach' },
    { label: 'All Companies', icon: <Building2 size={20} />, path: '/companies' },
    { label: 'Raw Scrapes', icon: <Database size={20} />, path: '/raw-scrapes' },
    { label: 'Job Events', icon: <Briefcase size={20} />, path: '/job-events' },
    { label: 'AI Evaluations', icon: <BrainCircuit size={20} />, path: '/ai-evaluations' },
    { label: 'Pipeline Runs', icon: <PlaySquare size={20} />, path: '/pipeline-runs' },
    { label: 'Token Cache', icon: <KeyRound size={20} />, path: '/token-cache' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 3, gap: 1.5 }}>
        <Box 
          component="div" 
          sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'primary.main', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.contrastText'
          }}
        >
          <Target size={20} />
        </Box>
        <Typography variant="h6" fontWeight="700" color="text.primary">
          LeadGen
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflowY: 'auto', py: 2, flexGrow: 1 }}>
        <List sx={{ px: 1.5 }}>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{ 
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'inherit' },
                    '&:hover': { bgcolor: 'primary.dark' }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: location.pathname === item.path ? 700 : 500 }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton 
          sx={{ borderRadius: 2 }}
          onClick={() => navigate('/settings')}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.875rem' }} />
        </ListItemButton>
        <ListItemButton 
          sx={{ borderRadius: 2, mt: 0.5, color: 'error.main' }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <AppBar 
          position="sticky" 
          color="inherit" 
          elevation={0} 
          sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 4 }, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box>
                <Typography variant="h6" fontWeight="800" lineHeight={1.2}>
                  {meta.title}
                </Typography>
                {meta.sub && (
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {meta.sub}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<Zap size={16} />}
                onClick={() => setIsModalOpen(true)}
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none', 
                  fontWeight: 700,
                  px: 2,
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Run Pipeline
              </Button>
              <Tooltip title="Notifications">
                <IconButton size="small">
                  <Badge variant="dot" color="primary">
                    <BellIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="caption" fontWeight="800" display="block">Admin User</Typography>
                  <Typography variant="caption" color="text.secondary">admin@leadgen.ai</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>A</Avatar>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>

      <RegionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleStartPipeline}
      />
    </Box>
  );
};

export default MainLayout;
