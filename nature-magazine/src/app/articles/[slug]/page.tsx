'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Typography, Box, Chip, Avatar, Grid, Divider, Button, CircularProgress } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

// This is a dynamic route page component that receives params from the URL
export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<any>(null);
  const [error, setError] = useState(false);

  // Fetch article data when component mounts
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // For demonstration, check if this is a preview from the admin panel
        if (params.slug.startsWith('preview-')) {
          // For preview, we'll just show a mock article
          // In a real app, you might fetch from a preview API or use local storage
          setArticle({
            title: "Preview Article",
            category: "Preview",
            author: { 
              name: "Admin User", 
              avatar: "/images/default-avatar.png",
              bio: "This is a preview of how your article will appear."
            },
            date: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            readingTime: "5 min read",
            image: "https://source.unsplash.com/random/1200x600/?nature",
            content: "<p>This is a preview of your article content. In the published version, your formatted content will appear here.</p>",
            tags: ["Preview", "Draft"],
            relatedArticles: []
          });
        } else {
          // For real articles, fetch from the API
          const response = await fetch(`/api/articles/by-slug/${params.slug}`);
          if (!response.ok) throw new Error('Article not found');
          const data = await response.json();
          setArticle(data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.slug]);

  // Handle loading state
  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading article...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  // Handle error or article not found
  if (error || !article) {
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
          label={article.category || 'Uncategorized'} 
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
              {article.author?.name || 'Unknown Author'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {article.date || new Date().toLocaleDateString()}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {article.readingTime || 'Quick read'}
          </Typography>
        </Box>

        {/* Featured Image */}
        {article.image || article.featuredImage ? (
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
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${article.image || article.featuredImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />
          </Box>
        ) : null}
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
          {article.tags && article.tags.length > 0 && (
            <Box sx={{ mt: 6, mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Tags:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {article.tags.map((tag: string) => (
                  <Chip 
                    key={tag} 
                    label={tag} 
                    size="small" 
                    clickable
                  />
                ))}
              </Box>
            </Box>
          )}

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
          {article.author && (
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
                  src={article.author.avatar || '/images/default-avatar.png'} 
                  sx={{ 
                    width: 64,
                    height: 64,
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {article.author.name || 'Unknown Author'}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Author
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">
                {article.author.bio || 'No biography available for this author.'}
              </Typography>
            </Box>
          )}
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
              {article.relatedArticles && article.relatedArticles.length > 0 ? (
                article.relatedArticles.map((relatedArticle: any) => (
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
                          component={Link} 
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
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No related articles available.
                </Typography>
              )}
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