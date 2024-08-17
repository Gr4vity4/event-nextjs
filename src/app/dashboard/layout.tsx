'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/slices/authSlice';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AppRegistration as RegistrationIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Events', icon: <EventIcon />, path: '/dashboard/events' },
  {
    text: 'Registrations',
    icon: <RegistrationIcon />,
    path: '/dashboard/registrations',
  },
];

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <List
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={pathname === item.path}
            sx={{
              '&.Mui-selected': {
                // backgroundColor: theme.palette.primary.main,
                backgroundColor: 'rgba(0, 0, 0, 0.08)', // Light gray background
                // color: theme.palette.primary.contrastText,
                '&:hover': {
                  // backgroundColor: theme.palette.primary.dark,
                  backgroundColor: 'rgba(0, 0, 0, 0.12)', // Slightly darker on hover
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Events Management
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
