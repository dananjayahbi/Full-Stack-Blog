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

// Mock data for featured articles
const featuredArticles = [
  {
    id: 1,
    slug: 'endangered-species-recovery-signs',
    title: 'Signs of Recovery: Endangered Species Making a Comeback',
    excerpt: 'Recent conservation efforts are showing promising results as several endangered species populations begin to stabilize and grow.',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?q=80&w=1744&auto=format&fit=crop',
    category: 'Conservation',
    categorySlug: 'conservation',
    author: 'Dr. Emma Richards',
    authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'May 3, 2025',
    readTime: '8 min read',
    featured: true,
    trending: false
  },
  {
    id: 2,
    slug: 'amazon-rainforest-new-species',
    title: 'Newly Discovered Species in the Amazon Rainforest',
    excerpt: 'Scientists have identified over 20 previously unknown species during a recent expedition to remote areas of the Amazon rainforest.',
    image: 'https://images.unsplash.com/photo-1605131545453-3828e8e99a2d?q=80&w=2039&auto=format&fit=crop',
    category: 'Biodiversity',
    categorySlug: 'biodiversity',
    author: 'Carlos Mendes',
    authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'April 27, 2025',
    readTime: '6 min read',
    featured: true,
    trending: true
  },
  {
    id: 3,
    slug: 'coral-reef-restoration-techniques',
    title: 'Innovative Techniques in Coral Reef Restoration',
    excerpt: 'Marine biologists are developing groundbreaking methods to accelerate coral growth and increase reef resilience in the face of climate change.',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1974&auto=format&fit=crop',
    category: 'Oceans',
    categorySlug: 'oceans',
    author: 'Dr. Sophia Chen',
    authorImage: 'https://randomuser.me/api/portraits/women/56.jpg',
    date: 'April 20, 2025',
    readTime: '9 min read',
    featured: true,
    trending: true
  }
];

// Mock data for recent articles
const recentArticles = [
  {
    id: 4,
    slug: 'sustainable-farming-practices',
    title: 'Sustainable Farming Practices That Protect Biodiversity',
    excerpt: 'Farmers around the world are adopting innovative methods that preserve local ecosystems while maintaining productivity.',
    image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2070&auto=format&fit=crop',
    category: 'Agriculture',
    categorySlug: 'agriculture',
    author: 'James Peterson',
    authorImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    date: 'May 1, 2025',
    readTime: '7 min read'
  },
  {
    id: 5,
    slug: 'wildlife-photography-techniques',
    title: 'Wildlife Photography: Capturing Nature Without Disruption',
    excerpt: 'Professional photographers share their secrets for stunning wildlife images that respect animal habitats.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop',
    category: 'Photography',
    categorySlug: 'photography',
    author: 'Nina Williams',
    authorImage: 'https://randomuser.me/api/portraits/women/23.jpg',
    date: 'April 29, 2025',
    readTime: '5 min read'
  },
  {
    id: 6,
    slug: 'microplastics-freshwater-systems',
    title: 'The Growing Concern of Microplastics in Freshwater Systems',
    excerpt: 'New research reveals the extent of microplastic pollution in lakes and rivers, raising alarms about ecosystem health.',
    image: 'https://images.unsplash.com/photo-1621451537984-a5aa446eaee3?q=80&w=1974&auto=format&fit=crop',
    category: 'Pollution',
    categorySlug: 'pollution',
    author: 'Dr. Robert Kim',
    authorImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    date: 'April 25, 2025',
    readTime: '8 min read'
  },
  {
    id: 7,
    slug: 'urban-forests-climate-change',
    title: 'How Urban Forests Are Helping Cities Combat Climate Change',
    excerpt: 'Cities are investing in green infrastructure to reduce temperatures, improve air quality, and enhance livability.',
    image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=2070&auto=format&fit=crop',
    category: 'Urban Planning',
    categorySlug: 'urban-planning',
    author: 'Olivia Martinez',
    authorImage: 'https://randomuser.me/api/portraits/women/67.jpg',
    date: 'April 23, 2025',
    readTime: '6 min read'
  }
];

// Mock data for categories
const categories = [
  { name: 'Wildlife', slug: 'wildlife', count: 42, image: 'https://images.unsplash.com/photo-1585994545900-82451786ee10?q=80&w=1935&auto=format&fit=crop' },
  { name: 'Oceans', slug: 'oceans', count: 38, image: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Forests', slug: 'forests', count: 35, image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop' },
  { name: 'Climate', slug: 'climate', count: 47, image: 'https://images.unsplash.com/photo-1600870069168-44b4c0a2f8c9?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Conservation', slug: 'conservation', count: 31, image: 'https://images.unsplash.com/photo-1535255558484-05a401f3e2a7?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Biodiversity', slug: 'biodiversity', count: 29, image: 'https://images.unsplash.com/photo-1624991519848-bf7e739a4ace?q=80&w=1973&auto=format&fit=crop' },
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
          mb: 8,
          mt: -4,
          mx: -3,
          height: { xs: '60vh', md: '70vh' },
          maxHeight: '800px',
          overflow: 'hidden',
          backgroundImage: 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2274&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          borderRadius: { xs: 0, sm: '0 0 16px 16px' },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.1) 100%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, pb: 6 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.light',
              fontWeight: 600,
              letterSpacing: 2,
              mb: 1,
              display: 'block'
            }}
          >
            Featured Story
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              mb: 2,
              maxWidth: '700px'
            }}
          >
            The Remarkable Recovery of Earth's Endangered Species
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              maxWidth: '600px',
              mb: 3,
              opacity: 0.9
            }}
          >
            After decades of conservation efforts, several critically endangered species are showing signs of recovery, offering hope for biodiversity.
          </Typography>
          <Button
            component={Link}
            href="/articles/endangered-species-recovery-signs"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '50px',
              fontWeight: 600
            }}
          >
            Read the Story
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
          {featuredArticles.map((article) => (
            <Grid item xs={12} md={4} key={article.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={article.image}
                    alt={article.title}
                  />
                </Link>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href={`/categories/${article.categorySlug}`} style={{ textDecoration: 'none' }}>
                      <Chip 
                        label={article.category} 
                        size="small" 
                        color="primary"
                        sx={{ borderRadius: 1 }}
                      />
                    </Link>
                    {article.trending && (
                      <Chip
                        label="Trending"
                        size="small"
                        color="secondary"
                        sx={{ borderRadius: 1 }}
                      />
                    )}
                  </Box>
                  <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.3,
                        fontFamily: 'Georgia, serif',
                        mb: 1.5
                      }}
                    >
                      {article.title}
                    </Typography>
                  </Link>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {article.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Avatar src={article.authorImage} alt={article.author} sx={{ width: 32, height: 32, mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{article.author}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">{article.date}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>•</Typography>
                        <Typography variant="caption" color="text.secondary">{article.readTime}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
            Explore Categories
          </Typography>
          <Button
            component={Link}
            href="/categories"
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: 600 }}
          >
            All Categories
          </Button>
        </Box>

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.name}>
              <Link href={`/categories/${category.slug}`} style={{ textDecoration: 'none' }}>
                <Card sx={{ 
                  position: 'relative',
                  overflow: 'hidden',
                  height: 140,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4,
                    '& .MuiCardMedia-root': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="100%"
                    image={category.image}
                    alt={category.name}
                    sx={{ transition: 'transform 0.3s ease' }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    textAlign: 'center',
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {category.count} articles
                    </Typography>
                  </Box>
                </Card>
              </Link>
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
          {recentArticles.map((article, index) => (
            <Grid item xs={12} md={6} key={article.id}>
              <Card sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                height: '100%',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}>
                <CardMedia
                  component="img"
                  sx={{ 
                    width: { xs: '100%', sm: 200 },
                    height: { xs: 200, sm: '100%' }
                  }}
                  image={article.image}
                  alt={article.title}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Link href={`/categories/${article.categorySlug}`} style={{ textDecoration: 'none' }}>
                    <Typography 
                      variant="caption" 
                      color="primary"
                      sx={{ 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        mb: 1,
                        display: 'block'
                      }}
                    >
                      {article.category}
                    </Typography>
                  </Link>
                  <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography 
                      variant="subtitle1" 
                      component="h3"
                      sx={{ 
                        fontWeight: 700, 
                        lineHeight: 1.3,
                        fontFamily: 'Georgia, serif',
                        mb: 1 
                      }}
                    >
                      {article.title}
                    </Typography>
                  </Link>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: { xs: 'none', md: 'block' } }}>
                    {article.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">{article.date}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>•</Typography>
                    <Typography variant="caption" color="text.secondary">{article.readTime}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                mb: 2
              }}
            >
              Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 3, opacity: 0.9 }}>
              Join our community of nature enthusiasts and receive the latest articles, 
              exclusive content, and updates on conservation initiatives delivered straight to your inbox.
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  marginBottom: '10px',
                  marginRight: '0'
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  px: 3,
                  borderTopLeftRadius: { xs: 4, sm: 0 },
                  borderBottomLeftRadius: { xs: 4, sm: 0 },
                  boxShadow: 0,
                  fontWeight: 600
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box
              component="img"
              src="/images/newsletter-illustration.svg"
              alt="Newsletter Illustration"
              sx={{
                maxWidth: '90%',
                maxHeight: '240px',
                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))'
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </MainLayout>
  );
}
