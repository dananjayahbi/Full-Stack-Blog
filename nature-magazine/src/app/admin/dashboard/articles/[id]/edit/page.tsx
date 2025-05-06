'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBackOutlined as BackIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<any>(null);
  const [error, setError] = useState('');
  
  // Fetch article data when component mounts
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/articles/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setArticle(data);
      } catch (err: any) {
        console.error('Error fetching article:', err);
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [params.id]);

  return (
    <Container maxWidth="xl" sx={{ mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            component={Link}
            href="/admin/dashboard/articles"
            startIcon={<BackIcon />}
            sx={{ mr: 2 }}
          >
            Back to Articles
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Edit Article
          </Typography>
        </Box>
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Article content */}
      {!loading && article && (
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>ID:</strong> {article.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>Slug:</strong> {article.slug}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>Status:</strong> {article.published ? 'Published' : 'Draft'}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Excerpt:</strong> {article.excerpt}
          </Typography>
          <Alert severity="info">
            This is a placeholder for the full article editor. The complete implementation would include a form similar to the create article page, pre-populated with this article&apos;s data.
          </Alert>
        </Paper>
      )}
    </Container>
  );
}