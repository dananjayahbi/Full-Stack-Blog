'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Container, 
  Paper,
  Avatar,
  Chip,
  Divider,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';

// Empty featured articles array - to be filled with real data later
const featuredArticles = [];

// Empty recent articles array - to be filled with real data later
const recentArticles = [];

// Categories data structure is maintained for navigation
const categories = [
  { name: 'Wildlife', slug: 'wildlife', count: 0, image: 'https://images.unsplash.com/photo-1585994545900-82451786ee10?q=80&w=1935&auto=format&fit=crop' },
  { name: 'Oceans', slug: 'oceans', count: 0, image: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Forests', slug: 'forests', count: 0, image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop' },
  { name: 'Climate', slug: 'climate', count: 0, image: 'https://images.unsplash.com/photo-1600870069168-44b4c0a2f8c9?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Conservation', slug: 'conservation', count: 0, image: 'https://images.unsplash.com/photo-1535255558484-05a401f3e2a7?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Biodiversity', slug: 'biodiversity', count: 0, image: 'https://images.unsplash.com/photo-1624991519848-bf7e739a4ace?q=80&w=1973&auto=format&fit=crop' },
];

export default function Home() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '60vh', md: '80vh' },
          mb: 8,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1526335966769-3b7cbd742ddb?q=80&w=2069&auto=format&fit=crop)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            color="white"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontFamily: 'Georgia, serif',
              mb: 3,
              maxWidth: '700px',
            }}
          >
            Discover the Wonders of the Natural World
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{ 
              mb: 4, 
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            Immerse yourself in captivating stories about wildlife, conservation, and the breathtaking diversity of our planet's ecosystems.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontSize: '1rem',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 28,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
            component={Link}
            href="/articles"
          >
            Explore Articles
          </Button>
        </Container>
      </Box>

      {/* Featured Articles Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
            }}
          >
            Featured Articles
          </Typography>
          <Button
            component={Link}
            href="/articles"
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: 600 }}
          >
            View All Articles
          </Button>
        </Box>

        <Grid container spacing={4}>
          {featuredArticles.length > 0 ? (
            featuredArticles.map((article) => (
              <Grid item xs={12} md={4} key={article.id}>
                {/* Article card content */}
                <Card></Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  No featured articles available yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New content will be added soon.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Category Highlights Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
            }}
          >
            Explore Topics
          </Typography>
          <Button
            component={Link}
            href="/categories"
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: 600 }}
          >
            View All Categories
          </Button>
        </Box>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} lg={4} key={category.name}>
              <Card
                component={Link}
                href={`/categories/${category.slug}`}
                sx={{
                  display: 'flex',
                  height: '140px',
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                  textDecoration: 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6)), url(${category.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    width: '100%'
                  }}
                >
                  <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {category.count} Articles
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Latest Articles Section with Tabs */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            mb: 2
          }}
        >
          Latest Articles
        </Typography>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 4 }}
        >
          <Tab label="Recent" />
          <Tab label="Popular" />
          <Tab label="Editor's Picks" />
        </Tabs>

        <Grid container spacing={3}>
          {recentArticles.length > 0 ? (
            recentArticles.map((article, index) => (
              <Grid item xs={12} md={6} key={article.id}>
                {/* Article card content */}
                <Card></Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  No articles available yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New content will be added soon.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button 
            component={Link}
            href="/articles"
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ px: 4, borderRadius: 28 }}
          >
            Browse All Articles
          </Button>
        </Box>
      </Box>

      {/* Newsletter Section */}
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          backgroundColor: 'primary.light',
          color: 'white',
          background: 'linear-gradient(45deg, #2E7D32 0%, #43A047 100%)',
          mb: 2
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box component="img" src="/images/newsletter-illustration.svg" alt="" sx={{ width: 60, mr: 2 }} />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700, fontFamily: 'Georgia, serif', }}>
                Stay Connected with Nature
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
              Join our newsletter to receive monthly updates on the latest environmental news, research findings, and conservation initiatives from around the world.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                variant="outlined"
                placeholder="Your email address"
                fullWidth
                sx={{ 
                  maxWidth: { sm: 350 },
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                  }
                }}
              />
              <Button 
                variant="contained"
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.dark',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.85)',
                  }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              component="img" 
              src="/images/newsletter-illustration.svg" 
              alt="Newsletter illustration"
              sx={{ maxWidth: '100%', height: 'auto' }}
            />
          </Grid>
        </Grid>
      </Paper>
    </MainLayout>
  );
}
