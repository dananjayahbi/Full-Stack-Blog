'use client';

import MainLayout from '@/components/MainLayout';
import { useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  InputAdornment,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  LinearProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';

// Mock article data
const mockArticles = [
  {
    id: '1',
    slug: 'secrets-of-the-deep-ocean',
    title: 'Secrets of the Deep Ocean: Exploring the Mariana Trench',
    excerpt: 'New discoveries from the deepest part of our oceans reveal extraordinary life forms adapted to extreme pressure and darkness.',
    author: 'James Rivera',
    date: '2025-04-28',
    image: '/images/articles/deep-ocean.jpg',
    readTime: 8,
    categories: ['Marine Life', 'Discoveries']
  },
  {
    id: '2',
    slug: 'amazon-rainforest-carbon-sink',
    title: 'How the Amazon Rainforest Acts as Earth\'s Carbon Sink',
    excerpt: 'Research shows the vital role of the world\'s largest rainforest in regulating global climate patterns and carbon cycling.',
    author: 'Sofia Chen',
    date: '2025-04-22',
    image: '/images/articles/amazon-rainforest.jpg',
    readTime: 12,
    categories: ['Climate', 'Forests']
  },
  {
    id: '3',
    slug: 'return-of-wolves-yellowstone',
    title: 'The Return of Wolves to Yellowstone: 30 Years Later',
    excerpt: 'Three decades after wolf reintroduction, Yellowstone\'s ecosystem shows dramatic improvements in biodiversity and ecological health.',
    author: 'Marcus Johnson',
    date: '2025-04-15',
    image: '/images/articles/yellowstone-wolves.jpg',
    readTime: 10,
    categories: ['Wildlife', 'Conservation']
  },
  {
    id: '4',
    slug: 'coral-reefs-climate-change',
    title: 'Coral Reefs Face Unprecedented Threats from Climate Change',
    excerpt: 'Scientists warn that warming oceans and acidification could eliminate most coral reef ecosystems by 2050 without intervention.',
    author: 'Emma Wilson',
    date: '2025-04-10',
    image: '/images/articles/coral-reef.jpg',
    readTime: 6,
    categories: ['Marine Life', 'Climate']
  },
  {
    id: '5',
    slug: 'bird-migration-patterns-changing',
    title: 'Bird Migration Patterns Shifting Due to Climate Change',
    excerpt: 'Researchers document significant changes in timing and routes as birds adapt to altered seasonal patterns across continents.',
    author: 'Sofia Chen',
    date: '2025-04-03',
    image: '/images/articles/bird-migration.jpg',
    readTime: 7,
    categories: ['Birds', 'Climate']
  },
  {
    id: '6',
    slug: 'microplastics-food-chain',
    title: 'Microplastics Found Throughout the Food Chain',
    excerpt: 'A concerning new study reveals the extent of plastic pollution in marine and terrestrial food webs, reaching remote ecosystems.',
    author: 'James Rivera',
    date: '2025-03-27',
    image: '/images/articles/microplastics.jpg',
    readTime: 9,
    categories: ['Pollution', 'Marine Life']
  },
  {
    id: '7',
    slug: 'traditional-ecological-knowledge',
    title: 'Indigenous Communities and Traditional Ecological Knowledge',
    excerpt: 'How indigenous practices and knowledge systems offer valuable insights for modern conservation and sustainable land management.',
    author: 'Marcus Johnson',
    date: '2025-03-20',
    image: '/images/articles/indigenous-knowledge.jpg',
    readTime: 11,
    categories: ['Conservation', 'Indigenous Cultures']
  },
  {
    id: '8',
    slug: 'desert-blooms-climate-change',
    title: 'Desert Blooms: Changing Patterns in Arid Ecosystems',
    excerpt: 'Unusual rainfall patterns are transforming desert landscapes, with both promising and concerning implications for biodiversity.',
    author: 'Emma Wilson',
    date: '2025-03-15',
    image: '/images/articles/desert-bloom.jpg',
    readTime: 8,
    categories: ['Deserts', 'Climate']
  },
];

// Extract unique categories from articles
const allCategories = Array.from(
  new Set(mockArticles.flatMap(article => article.categories))
).sort();

export default function ArticlesPage() {
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Filter and sort articles
  const filteredArticles = mockArticles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === '' || article.categories.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'title_desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const displayedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
            }}
          >
            All Articles
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mb: 4,
            }}
          >
            Explore our collection of in-depth stories about nature, wildlife, and conservation from around the world.
          </Typography>
        </Box>

        {/* Filters Section */}
        <Box sx={{ mb: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1); // Reset to first page on new filter
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {allCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="sort-select-label">Sort By</InputLabel>
                <Select
                  labelId="sort-select-label"
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="title_asc">Title (A-Z)</MenuItem>
                  <MenuItem value="title_desc">Title (Z-A)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Results Summary */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Showing {filteredArticles.length === 0 ? 0 : (currentPage - 1) * articlesPerPage + 1}-
            {Math.min(currentPage * articlesPerPage, filteredArticles.length)} of {filteredArticles.length} articles
          </Typography>
        </Box>

        {/* Articles Grid */}
        {displayedArticles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom>No articles found</Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {displayedArticles.map((article) => (
              <Grid item key={article.id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    }
                  }}
                  component={Link}
                  href={`/articles/${article.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <CardMedia
                    component="div"
                    sx={{ 
                      pt: '56.25%', // 16:9 aspect ratio
                      position: 'relative'
                    }}
                    image={article.image}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        padding: '4px 8px',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {article.readTime} min read
                      </Typography>
                    </Box>
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 1.5 }}>
                      {article.categories.slice(0, 2).map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h2"
                      sx={{ 
                        fontWeight: 600,
                        fontFamily: 'Georgia, serif',
                        lineHeight: 1.3,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '52px' // Keep consistent height for titles
                      }}
                    >
                      {article.title}
                    </Typography>
                    
                    <Typography
                      variant="body2" 
                      color="text.secondary"
                      paragraph
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                        minHeight: '60px' // Keep consistent height for excerpts
                      }}
                    >
                      {article.excerpt}
                    </Typography>
                    
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        By {article.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(article.date)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </MainLayout>
  );
}