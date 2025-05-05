'use client';

import { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Tooltip, 
  MenuItem, 
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// Navigation items
const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/articles' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

// User menu items for logged-in users
const userMenuItems = [
  { name: 'Profile', href: '/profile' },
  { name: 'My Bookmarks', href: '/bookmarks' },
  { name: 'Account Settings', href: '/settings' },
];

export default function Navbar() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for user menu
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Get current pathname for highlighting active link
  const pathname = usePathname();
  
  // Get session data
  const { data: session } = useSession();
  
  // Handle user menu open/close
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };
  
  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    handleCloseUserMenu();
  };
  
  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo for desktop */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <NaturePeopleIcon sx={{ color: 'primary.main', mr: 1, fontSize: { xs: 28, md: 32 } }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: 'Georgia, serif',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                NATURE MAGAZINE
              </Typography>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  sx={{
                    mx: 1,
                    color: 'text.primary',
                    display: 'block',
                    fontWeight: pathname === item.href ? 600 : 400,
                    position: 'relative',
                    '&::after': pathname === item.href ? {
                      content: '""',
                      position: 'absolute',
                      width: '60%',
                      height: '3px',
                      bottom: '0',
                      left: '20%',
                      backgroundColor: 'primary.main',
                      borderRadius: '2px',
                    } : {},
                  }}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </Box>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {session ? (
              <>
                <Tooltip title="Open user menu">
                  <IconButton onClick={handleOpenUserMenu}>
                    {session.user?.image ? (
                      <Avatar alt={session.user.name || ''} src={session.user.image} sx={{ width: 32, height: 32 }} />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {session.user?.name?.charAt(0) || 'U'}
                      </Avatar>
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={userMenuAnchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleCloseUserMenu}
                >
                  {/* User info section */}
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {session.user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  
                  {/* Menu items */}
                  {userMenuItems.map((item) => (
                    <Link key={item.name} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <MenuItem onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{item.name}</Typography>
                      </MenuItem>
                    </Link>
                  ))}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center" color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'none' }}>
                {/* Login/signup buttons have been removed as requested */}
              </Box>
            )}

            {/* Mobile menu button */}
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setMobileMenuOpen(true)}
              color="inherit"
              sx={{ display: { md: 'none' }, ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: '70%', maxWidth: '300px' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Georgia, serif' }}>
            Menu
          </Typography>
          <IconButton
            aria-label="close drawer"
            onClick={() => setMobileMenuOpen(false)}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        
        {/* User info in mobile menu */}
        {session ? (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            {session.user?.image ? (
              <Avatar alt={session.user.name || ''} src={session.user.image} sx={{ width: 32, height: 32, mr: 2 }} />
            ) : (
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mr: 2 }}>
                {session.user?.name?.charAt(0) || 'U'}
              </Avatar>
            )}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {session.user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {session.user?.email}
              </Typography>
            </Box>
          </Box>
        ) : null}
        
        <Divider />

        {/* Mobile Navigation Links */}
        <List sx={{ pt: 0 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <Link href={item.href} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton 
                  onClick={() => setMobileMenuOpen(false)}
                  selected={pathname === item.href}
                  sx={{
                    py: 1.5,
                    pl: 3,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      }
                    }
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          
          {/* User menu items in mobile drawer when logged in */}
          {session && (
            <>
              <Divider sx={{ my: 1 }} />
              {userMenuItems.map((item) => (
                <ListItem key={item.name} disablePadding>
                  <Link href={item.href} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                    <ListItemButton 
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{ py: 1.5, pl: 3 }}
                    >
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  sx={{ py: 1.5, pl: 3, color: 'error.main' }}
                >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}