'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import LexicalContentRenderer from '@/components/content/LexicalContentRenderer';
import DirectContentRenderer from '@/components/content/DirectContentRenderer';
import DebugContentRenderer from '@/components/content/DebugContentRenderer';
import ArticleContentRenderer from '@/components/content/ArticleContentRenderer';
import { 
  Typography, 
  Box, 
  Chip, 
  Avatar, 
  Grid, 
  Divider, 
  Button, 
  CircularProgress,
  Paper,
  Container,
  IconButton
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

// This is a dynamic route page component that receives params from the URL
export default function ArticlePage({ params }: { params: { slug: string } }) {
  // Unwrap params to access slug safely
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams.slug;
  
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<any>(null);
  const [error, setError] = useState(false);

  // Fetch article data when component mounts
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // For real articles, fetch from the API
        const response = await fetch(`/api/articles/by-slug/${slug}`);
        if (!response.ok) throw new Error('Article not found');
        const data = await response.json();
        setArticle(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Handle loading state
  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'background.paper' }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.primary' }}>
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
        <Box sx={{ py: 8, textAlign: 'center', bgcolor: 'background.paper' }}>
          <Typography variant="h4" gutterBottom color="text.primary">
            Article Not Found
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
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
      <Box sx={{ 
        bgcolor: 'background.paper', 
        py: { xs: 3, md: 4 },
        borderBottom: '1px solid',
        borderColor: 'divider' 
      }}>
        <Container maxWidth="lg">
          {/* Back button */}
          <Box sx={{ mb: 2 }}>
            <Button 
              component={Link}
              href="/articles" 
              startIcon={<ArrowBackIcon />}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', backgroundColor: 'transparent' }
              }}
              variant="text"
              size="small"
            >
              Back to Articles
            </Button>
          </Box>

          {/* Category Chip */}
          {article.category && (
            <Chip 
              label={article.category} 
              color="primary" 
              size="small"
              sx={{ mb: 2, borderRadius: '16px' }}
            />
          )}

          {/* Article Title */}
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
              mb: 2,
              color: 'text.primary',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' }
            }}
          >
            {article.title}
          </Typography>

          {/* Article Meta */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3 },
              mb: { xs: 3, sm: 4 },
              alignItems: 'center'
            }}
          >
            {article.author && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 18, mr: 0.75, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {article.author.name}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon sx={{ fontSize: 18, mr: 0.75, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {article.date}
              </Typography>
            </Box>
            
            {article.readingTime && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  fontStyle: 'italic',
                  bgcolor: 'rgba(0,0,0,0.04)', 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: '12px',
                  display: 'inline-flex'
                }}
              >
                {article.readingTime}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      {/* Featured Image */}
      {article.image && (
        <Box
          sx={{
            width: '100%',
            height: { xs: '250px', sm: '350px', md: '450px' },
            backgroundImage: `url(${article.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            mb: { xs: 3, sm: 5 }
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={1}
              sx={{ 
                p: { xs: 2.5, sm: 4 },
                borderRadius: 2,
                mb: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              {/* Article Content */}
              <ArticleContentRenderer content={article.content} />
            </Paper>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {article.tags.map((tag: string) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      color="secondary"
                      variant="outlined"
                      sx={{ 
                        borderRadius: 4,
                        px: 0.5,
                        '&:hover': { backgroundColor: 'rgba(141, 110, 99, 0.08)' }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Share buttons */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
                Share this article
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <IconButton 
                  aria-label="share on facebook"
                  sx={{ 
                    bgcolor: '#3b5998', 
                    color: 'white',
                    '&:hover': { bgcolor: '#2d4373' },
                    width: 40,
                    height: 40
                  }}
                >
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="share on twitter"
                  sx={{ 
                    bgcolor: '#1DA1F2', 
                    color: 'white',
                    '&:hover': { bgcolor: '#0c85d0' },
                    width: 40,
                    height: 40
                  }}
                >
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  aria-label="share on linkedin"
                  sx={{ 
                    bgcolor: '#0077b5', 
                    color: 'white',
                    '&:hover': { bgcolor: '#00669c' },
                    width: 40,
                    height: 40
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Author Box */}
            {article.author && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  bgcolor: 'rgba(46, 125, 50, 0.05)',
                  borderRadius: 2,
                  mb: 6,
                  border: '1px solid',
                  borderColor: 'primary.light',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  gap: 3,
                }}
              >
                <Avatar 
                  src={article.author.avatar || '/images/default-avatar.png'} 
                  alt={article.author.name}
                  sx={{ 
                    width: 80,
                    height: 80,
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                />
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                    {article.author.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, mb: 1.5 }}>
                    Author
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {article.author.bio || 'No biography available for this author.'}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={1}
              sx={{ 
                p: 3,
                borderRadius: 2,
                position: 'sticky',
                top: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: 'Georgia, serif',
                  pb: 1.5,
                  mb: 2,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  color: 'primary.dark',
                  fontSize: '1.125rem'
                }}
              >
                Related Articles
              </Typography>
              
              {article.relatedArticles && article.relatedArticles.length > 0 ? (
                article.relatedArticles.map((relatedArticle: any) => (
                  <Box key={relatedArticle.id} sx={{ mb: 2.5, pb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 70,
                          height: 50,
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundImage: `url(${relatedArticle.image || '/images/placeholder.jpg'})`,
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
                            color: 'text.primary',
                            lineHeight: 1.3,
                            fontSize: '0.9rem',
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
                <Box sx={{ 
                  bgcolor: 'rgba(0,0,0,0.02)', 
                  p: 2, 
                  borderRadius: 1, 
                  textAlign: 'center',
                  mb: 2 
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No related articles available
                  </Typography>
                </Box>
              )}
              
              <Button 
                component={Link}
                href="/articles" 
                fullWidth 
                variant="contained" 
                color="primary"
                sx={{ 
                  mt: 2,
                  py: 1,
                  fontWeight: 500,
                  boxShadow: 1
                }}
              >
                Browse All Articles
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}