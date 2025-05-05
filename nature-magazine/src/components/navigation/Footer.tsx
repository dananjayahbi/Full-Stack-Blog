'use client';

import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link as MuiLink, 
  IconButton,
  TextField,
  Button,
  Divider,
  Stack
} from '@mui/material';
import Link from 'next/link';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

// Footer navigation sections
const footerSections = [
  {
    title: 'Explore',
    links: [
      { name: 'Latest Articles', href: '/articles' },
      { name: 'Featured Stories', href: '/featured' },
      { name: 'Editor\'s Picks', href: '/editors-picks' },
      { name: 'Photo Galleries', href: '/galleries' },
      { name: 'Video Content', href: '/videos' },
    ]
  },
  {
    title: 'Categories',
    links: [
      { name: 'Wildlife', href: '/categories/wildlife' },
      { name: 'Oceans', href: '/categories/oceans' },
      { name: 'Forests', href: '/categories/forests' },
      { name: 'Conservation', href: '/categories/conservation' },
      { name: 'Climate', href: '/categories/climate' },
    ]
  },
  {
    title: 'About Us',
    links: [
      { name: 'Our Mission', href: '/about' },
      { name: 'Meet the Team', href: '/about#team' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact Us', href: '/contact' },
    ]
  },
];

export default function Footer() {
  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This would connect to an API in a real implementation
    console.log('Newsletter subscription submitted');
    // Clear input and show success message in a real implementation
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', pt: 8, pb: 6, borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Brand section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NaturePeopleIcon sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: 'Georgia, serif',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                }}
              >
                NATURE MAGAZINE
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Exploring the wonders of the natural world through in-depth journalism and stunning photography.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Our mission is to inspire a deeper understanding and appreciation of nature, while promoting conservation efforts worldwide.
            </Typography>
            
            {/* Social media icons */}
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              <IconButton aria-label="Facebook" size="small" sx={{ color: '#3b5998' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" size="small" sx={{ color: '#1DA1F2' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="Instagram" size="small" sx={{ color: '#E1306C' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" size="small" sx={{ color: '#0e76a8' }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="YouTube" size="small" sx={{ color: '#FF0000' }}>
                <YouTubeIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          {/* Navigation sections */}
          {footerSections.map((section) => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ pb: 1 }}>
                    <MuiLink 
                      component={Link} 
                      href={link.href} 
                      underline="hover" 
                      color="text.secondary"
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {link.name}
                    </MuiLink>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
          
          {/* Newsletter subscription */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
              Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Stay updated with our latest articles, features, and conservation initiatives.
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', mt: 2 }}>
              <TextField
                hiddenLabel
                size="small"
                variant="outlined"
                placeholder="Your email address"
                required
                type="email"
                sx={{ flex: 1, mr: 1 }}
                InputProps={{
                  sx: { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
                }}
              />
              <Button 
                variant="contained" 
                type="submit"
                sx={{
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Bottom footer with copyright and legal links */}
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Nature Magazine. All rights reserved.
              <MuiLink 
                component={Link} 
                href="/admin/login" 
                underline="hover" 
                color="text.secondary" 
                variant="body2"
                sx={{ ml: 2, fontSize: '0.75rem' }}
              >
                Admin Login
              </MuiLink>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
              <MuiLink component={Link} href="/privacy" underline="hover" color="text.secondary" variant="body2">
                Privacy Policy
              </MuiLink>
              <MuiLink component={Link} href="/terms" underline="hover" color="text.secondary" variant="body2">
                Terms of Service
              </MuiLink>
              <MuiLink component={Link} href="/cookies" underline="hover" color="text.secondary" variant="body2">
                Cookie Policy
              </MuiLink>
              <MuiLink component={Link} href="/sitemap" underline="hover" color="text.secondary" variant="body2">
                Sitemap
              </MuiLink>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}