import MainLayout from '@/components/MainLayout';
import { Typography, Grid, Card, Box, CardMedia, CardContent, Button } from '@mui/material';
import Link from 'next/link';

// Empty categories array - to be filled with real data later
const allCategories = [];

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

        {allCategories.length > 0 ? (
          <Grid container spacing={4}>
            {allCategories.map((category) => (
              <Grid item key={category.id} xs={12} sm={6} md={4}>
                {/* Category card content */}
                <Card></Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom>No categories available yet</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              New categories will be added soon.
            </Typography>
            <Button 
              variant="outlined"
              component={Link}
              href="/"
              sx={{ mt: 2 }}
            >
              Back to Home
            </Button>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}