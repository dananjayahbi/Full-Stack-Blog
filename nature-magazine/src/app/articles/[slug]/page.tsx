import MainLayout from '@/components/MainLayout';
import { Typography, Box, Chip, Avatar, Grid, Card, CardContent, CardMedia, Divider, Button } from '@mui/material';
import Image from 'next/image';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

// Empty articles data - to be populated with real data later
const articlesData = {}

// This is a dynamic route page component that receives params from the URL
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  // In a real app, we would fetch the article data from a database
  // based on the slug parameter
  const article = articlesData[params.slug];

  // If article doesn't exist, show a message
  if (!article) {
    return (
      <MainLayout>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Article Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The article you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            component={Link}
            href="/articles"
            variant="contained" 
            startIcon={<ArrowBackIcon />}
          >
            Back to Articles
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Article Header - This part will only render if an article is found */}
      <Box sx={{ mb: 6 }}>
        <Button 
          component={Link}
          href="/articles" 
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Articles
        </Button>

        <Chip 
          label={article.category} 
          color="primary" 
          size="small"
          sx={{ mb: 2 }}
        />

        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            mb: 3,
          }}
        >
          {article.title}
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 3,
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {article.author.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {article.date}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {article.readingTime}
          </Typography>
        </Box>

        {/* Featured Image */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: '300px', md: '500px' },
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 6,
          }}
        >
          {/* This would normally be an Image component but we're using a div for simplicity */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${article.image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
        </Box>
      </Box>

      {/* Article Content */}
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box 
            sx={{ 
              typography: 'body1',
              '& h2': {
                mt: 4,
                mb: 2,
                fontFamily: 'Georgia, serif',
                fontWeight: 600,
              },
              '& p': {
                mb: 2,
                lineHeight: 1.8,
              },
              '& em': {
                fontStyle: 'italic',
              },
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Tags */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {article.tags.map((tag) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  clickable
                />
              ))}
            </Box>
          </Box>

          {/* Share Icons */}
          <Box sx={{ mt: 4, mb: 6 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Share:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" size="small" startIcon={<FacebookIcon />}>
                Facebook
              </Button>
              <Button variant="outlined" size="small" startIcon={<TwitterIcon />}>
                Twitter
              </Button>
              <Button variant="outlined" size="small" startIcon={<LinkedInIcon />}>
                LinkedIn
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Author Box */}
          <Box 
            sx={{ 
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              mb: 6,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={article.author.avatar} 
                sx={{ 
                  width: 64,
                  height: 64,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {article.author.name}
                </Typography>
                <Typography variant="body2" color="primary">
                  Author
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">
              {article.author.bio}
            </Typography>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              position: 'sticky',
              top: 24,
              bgcolor: 'background.paper',
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                fontFamily: 'Georgia, serif',
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              Related Articles
            </Typography>
            <Box sx={{ mt: 2 }}>
              {article.relatedArticles.map((relatedArticle) => (
                <Box key={relatedArticle.id} sx={{ mb: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundImage: `url(${relatedArticle.image})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        component="a" 
                        href={`/articles/${relatedArticle.slug}`}
                        sx={{ 
                          fontWeight: 600,
                          display: 'block',
                          mb: 0.5,
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            color: 'primary.main',
                          }
                        }}
                      >
                        {relatedArticle.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {relatedArticle.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            <Button 
              component={Link}
              href="/articles" 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 2 }}
            >
              View All Articles
            </Button>
          </Box>
        </Grid>
      </Grid>
    </MainLayout>
  );
}