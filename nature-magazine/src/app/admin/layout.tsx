'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import ImageIcon from '@mui/icons-material/Image';
import CommentIcon from '@mui/icons-material/Comment';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const drawerWidth = 240;

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  // Track client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if this is the login page
  const isLoginPage = pathname?.includes('/admin/login');

  // If this is the login page, just render the children without protection
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Protect admin routes (but not for login page)
  useEffect(() => {
    if (mounted && status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, router, mounted, isLoginPage]);

  // Handle loading state
  if (status === 'loading' || !mounted) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  // Handle unauthenticated state for non-login pages
  if (status === 'unauthenticated' && !isLoginPage) {
    return null; // Will redirect in useEffect
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  const navigationItems: NavigationItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      text: 'Articles',
      icon: <ArticleIcon />,
      path: '/admin/dashboard/articles',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      path: '/admin/dashboard/categories',
    },
    {
      text: 'Media',
      icon: <ImageIcon />,
      path: '/admin/dashboard/media',
    },
    {
      text: 'Comments',
      icon: <CommentIcon />,
      path: '/admin/dashboard/comments',
    },
    {
      text: 'Users',
      icon: <PersonIcon />,
      path: '/admin/dashboard/users',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/dashboard/settings',
    },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NaturePeopleIcon sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
            }}
          >
            NATURE ADMIN
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              selected={pathname === item.path}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon
                sx={{
                  color: pathname === item.path ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: pathname === item.path ? 600 : 400,
                  color: pathname === item.path ? 'primary.main' : 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 2 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component={Link}
            href="/"
            target="_blank"
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          >
            View Site
          </Button>
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={session?.user?.name || 'Admin User'}
              src={session?.user?.image || '/images/default-avatar.png'}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem dense>
              <Typography variant="body2">{session?.user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem 
              component={Link} 
              href="/admin/dashboard/profile"
              onClick={handleMenuClose}
              dense
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut} dense>Sign Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#f5f5f7',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}