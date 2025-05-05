import MainLayout from '@/components/MainLayout';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Breadcrumbs, Chip } from '@mui/material';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Mock data for categories and their articles
const categoriesData = {
  'wildlife': {
    name: 'Wildlife',
    description: 'Discover fascinating articles about animals and wildlife from around the globe.',
    image: '/images/wildlife.jpg',
    articles: [
      {
        id: '3',
        title: 'The Extraordinary Migration of the Monarch Butterfly',
        excerpt: 'Following the incredible journey of monarch butterflies as they travel thousands of miles in one of nature\'s most remarkable migrations.',
        image: '/images/monarch.jpg',
        slug: 'monarch-butterfly-migration',
        category: 'Wildlife',
        author: 'Sofia Chen',
        date: 'March 28, 2025',
      },
      {
        id: '9',
        title: 'Wolves Return: Restoring Nature\'s Balance',
        excerpt: 'The ecological impact of wolf reintroduction programs and what they teach us about ecosystem management.',
        image: '/images/wolves.jpg',
        slug: 'wolves-return',
        category: 'Wildlife',
        author: 'Elena Rodriguez',
        date: 'April 8, 2025',
      },
      {
        id: '13',
        title: 'The Secret Life of Wild Elephants',
        excerpt: 'New research reveals the complex social structures and emotional intelligence of elephant herds.',
        image: '/images/elephants.jpg',
        slug: 'secret-life-wild-elephants',
        category: 'Wildlife',
        author: 'Thomas Brown',
        date: 'March 12, 2025',
      },
      {
        id: '14',
        title: 'Tropical Birds: Nature\'s Living Rainbows',
        excerpt: 'Exploring the evolutionary adaptations behind the dazzling colors of tropical bird species.',
        image: '/images/tropical-birds.jpg',
        slug: 'tropical-birds-living-rainbows',
        category: 'Wildlife',
        author: 'Maria Lopez',
        date: 'February 28, 2025',
      },
    ]
  },
  'forests': {
    name: 'Forests',
    description: 'Explore the majestic forests and woodlands that provide habitat for countless species.',
    image: '/images/forest-category.jpg',
    articles: [
      {
        id: '1',
        title: 'The Majestic Redwood Forests: A Living Link to Ancient Times',
        excerpt: 'Explore the breathtaking beauty and ecological importance of California\'s redwood forests, home to some of the oldest living organisms on Earth.',
        image: '/images/redwoods.jpg',
        slug: 'majestic-redwood-forests',
        category: 'Forests',
        author: 'Emma Wilson',
        date: 'May 2, 2025',
      },
      {
        id: '6',
        title: 'The Silent Communication of Trees',
        excerpt: 'New research reveals how trees communicate and share resources through vast underground networks.',
        image: '/images/trees.jpg',
        slug: 'silent-communication-trees',
        category: 'Forests',
        author: 'David Chen',
        date: 'April 25, 2025',
      },
      {
        id: '10',
        title: 'Mushroom Networks: The Unseen Web Beneath Our Feet',
        excerpt: 'How fungal networks help forests thrive through nutrient sharing and communication systems.',
        image: '/images/mushrooms.jpg',
        slug: 'mushroom-networks',
        category: 'Forests',
        author: 'Michael Zhang',
        date: 'March 30, 2025',
      },
    ]
  },
  'marine-life': {
    name: 'Marine Life',
    description: 'Explore the incredible diversity of creatures that live in our oceans and seas.',
    image: '/images/marine-life.jpg',
    articles: [
      {
        id: '2',
        title: 'Ocean Depths: Discovering New Marine Species',
        excerpt: 'Scientists have discovered over 30 new marine species in deep-sea explorations last year. What does this tell us about our vast, unexplored oceans?',
        image: '/images/ocean.jpg',
        slug: 'ocean-depths-new-species',
        category: 'Marine Life',
        author: 'James Rivera',
        date: 'April 15, 2025',
      },
      {
        id: '15',
        title: 'The Secret Language of Dolphin Pods',
        excerpt: 'How dolphins use unique vocalizations and body language to communicate within their social groups.',
        image: '/images/dolphins.jpg',
        slug: 'secret-language-dolphin-pods',
        category: 'Marine Life',
        author: 'Patricia Kim',
        date: 'February 15, 2025',
      },
      {
        id: '16',
        title: 'Colorful Coral: The Ocean\'s Living Canvas',
        excerpt: 'Understanding the beauty and biological importance of coral species worldwide.',
        image: '/images/coral-reefs.jpg',
        slug: 'colorful-coral-oceans-canvas',
        category: 'Marine Life',
        author: 'Omar Hassan',
        date: 'January 30, 2025',
      },
    ]
  },
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // In a real app, we would fetch the category data from a database
  // based on the slug parameter
  const category = categoriesData[params.slug];

  // If category doesn't exist, this would typically redirect to 404
  // but for simplicity we're just showing a message
  if (!category) {
    return (
      <MainLayout>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Category Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The category you're looking for doesn't exist or has been removed.
          </Typography>
          <Link href="/categories">
            Back to Categories
          </Link>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <Link href="/categories" style={{ color: 'inherit', textDecoration: 'none' }}>
            Categories
          </Link>
          <Typography color="text.primary">{category.name}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Category Header */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '200px', md: '300px' },
          borderRadius: 2,
          overflow: 'hidden',
          mb: 5,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${category.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }
          }}
        />
        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 5 },
            width: '100%',
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
              mb: 1,
            }}
          >
            {category.name}
          </Typography>
          <Typography 
            variant="h6" 
            color="white" 
            sx={{ 
              maxWidth: '800px',
            }}
          >
            {category.description}
          </Typography>
        </Box>
      </Box>

      {/* Articles Grid */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontFamily: 'Georgia, serif', 
            fontWeight: 700,
            position: 'relative',
            display: 'inline-block',
            mb: 4,
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '80px',
              height: '4px',
              backgroundColor: 'primary.main',
            }
          }}
        >
          Articles in {category.name}
        </Typography>
        
        <Grid container spacing={4}>
          {category.articles.map((article) => (
            <Grid item key={article.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{
                    pt: '56.25%', // 16:9 aspect ratio
                    position: 'relative',
                  }}
                  image={article.image || '/images/placeholder.jpg'}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 500,
                      fontSize: '0.8rem',
                    }}
                  >
                    {article.category}
                  </Box>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h2"
                    sx={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}
                  >
                    <Link href={`/articles/${article.slug}`} style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}>
                      {article.title}
                    </Link>
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {article.excerpt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Related Categories */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontFamily: 'Georgia, serif',
            fontWeight: 600,
            mb: 3
          }}
        >
          Explore Other Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(categoriesData)
            .filter(([slug]) => slug !== params.slug)
            .slice(0, 5)
            .map(([slug, catData]) => (
              <Chip 
                key={slug}
                label={catData.name}
                component={Link}
                href={`/categories/${slug}`}
                clickable
                color="primary"
                variant="outlined"
                sx={{ m: 0.5 }}
              />
            ))
          }
          <Chip 
            label="View All Categories"
            component={Link}
            href="/categories"
            clickable
            color="primary"
            sx={{ m: 0.5, fontWeight: 600 }}
          />
        </Box>
      </Box>
    </MainLayout>
  );
}