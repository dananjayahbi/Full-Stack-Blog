import MainLayout from '@/components/MainLayout';
import { Typography, Grid, Card, Box, CardMedia, CardContent } from '@mui/material';
import Link from 'next/link';

// Mock data for categories
const allCategories = [
  { 
    id: '1',
    name: 'Wildlife',
    slug: 'wildlife',
    description: 'Discover fascinating articles about animals and wildlife from around the globe.',
    image: '/images/wildlife.jpg',
    articleCount: 24
  },
  { 
    id: '2',
    name: 'Oceans',
    slug: 'oceans',
    description: 'Dive deep into the mysteries of our oceans and the creatures that inhabit them.',
    image: '/images/ocean-category.jpg',
    articleCount: 18
  },
  { 
    id: '3',
    name: 'Forests',
    slug: 'forests',
    description: 'Explore the majestic forests and woodlands that provide habitat for countless species.',
    image: '/images/forest-category.jpg',
    articleCount: 15
  },
  { 
    id: '4',
    name: 'Mountains',
    slug: 'mountains',
    description: 'Journey to the highest peaks and mountain ecosystems around the world.',
    image: '/images/mountains.jpg',
    articleCount: 12
  },
  { 
    id: '5',
    name: 'Conservation',
    slug: 'conservation',
    description: 'Learn about conservation efforts and how you can help protect our natural world.',
    image: '/images/conservation.jpg',
    articleCount: 20
  },
  { 
    id: '6',
    name: 'Climate',
    slug: 'climate',
    description: 'Understand the latest research on climate change and its impact on our environment.',
    image: '/images/climate.jpg',
    articleCount: 17
  },
  { 
    id: '7',
    name: 'Botany',
    slug: 'botany',
    description: 'Discover the fascinating world of plants and their important role in ecosystems.',
    image: '/images/botany.jpg',
    articleCount: 14
  },
  { 
    id: '8',
    name: 'Marine Life',
    slug: 'marine-life',
    description: 'Explore the incredible diversity of creatures that live in our oceans and seas.',
    image: '/images/marine-life.jpg',
    articleCount: 16
  },
  { 
    id: '9',
    name: 'Freshwater',
    slug: 'freshwater',
    description: 'Learn about rivers, lakes, and the freshwater ecosystems vital to our planet.',
    image: '/images/freshwater.jpg',
    articleCount: 8
  },
];

export default function CategoriesPage() {
  return (
    <MainLayout>
      <Box sx={{ mb: 6 }}>
        <Typography 
          component="h1" 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            fontFamily: 'Georgia, serif', 
            textAlign: 'center',
            mb: 2
          }}
        >
          Categories
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto',
            mb: 6
          }}
        >
          Explore our collection of articles by topic. From wildlife and conservation to ecosystems and natural phenomena.
        </Typography>

        <Grid container spacing={4}>
          {allCategories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ position: 'relative', pt: '56.25%' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundImage: `url(${category.image})`,
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component={Link}
                    href={`/categories/${category.slug}`}
                    sx={{ 
                      fontFamily: 'Georgia, serif',
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      mb: 1,
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                  >
                    {category.description}
                  </Typography>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ 
                      mt: 'auto',
                      fontWeight: 500,
                    }}
                  >
                    {category.articleCount} Articles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
}