import MainLayout from '@/components/MainLayout';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Breadcrumbs, Chip, Button } from '@mui/material';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Empty categories data - to be filled with real data later
const categoriesData = {};

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
          <Button 
            component={Link}
            href="/categories"
            variant="contained" 
          >
            Back to Categories
          </Button>
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
        
        {category.articles && category.articles.length > 0 ? (
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
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom>No articles available in this category yet</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              New content will be added soon.
            </Typography>
            <Button 
              variant="outlined"
              component={Link}
              href="/categories"
              sx={{ mt: 2 }}
            >
              Browse All Categories
            </Button>
          </Box>
        )}
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
            sx={{ m: 0.5 }}
          />
        </Box>
      </Box>
    </MainLayout>
  );
}