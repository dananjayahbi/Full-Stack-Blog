'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormHelperText,
  Switch,
  FormControlLabel,
  Autocomplete,
  Divider,
  Alert
} from '@mui/material';
import { 
  SaveOutlined as SaveIcon,
  VisibilityOutlined as PreviewIcon,
  ArrowBackOutlined as BackIcon,
  ImageOutlined as ImageIcon
} from '@mui/icons-material';
import Link from 'next/link';

// Mock categories data
const mockCategories = [
  { id: '1', name: 'Wildlife' },
  { id: '2', name: 'Conservation' },
  { id: '3', name: 'Oceans' },
  { id: '4', name: 'Forests' },
  { id: '5', name: 'Climate' },
  { id: '6', name: 'Biodiversity' },
  { id: '7', name: 'Pollution' },
  { id: '8', name: 'Indigenous Cultures' }
];

// Mock tags suggestion data
const mockTagSuggestions = [
  'wildlife', 'conservation', 'endangered species', 'climate change', 
  'forests', 'oceans', 'marine life', 'biodiversity', 'pollution', 
  'sustainability', 'ecology', 'nature', 'coral reefs', 'rainforest', 
  'arctic', 'amazon', 'birds', 'mammals', 'reptiles', 'insects', 
  'plants', 'trees', 'water', 'mountains', 'deserts', 'national parks'
];

export default function NewArticlePage() {
  const router = useRouter();
  
  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categories: [] as string[],
    tags: [] as string[],
    featuredImage: '',
    author: '', // This would be pre-filled with current user in real app
    published: false
  });
  
  // State for form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
      
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle select changes for categories
  const handleCategoryChange = (event: any) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, categories: typeof value === 'string' ? value.split(',') : value }));
  };
  
  // Handle tags change
  const handleTagsChange = (_event: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, tags: newValue }));
  };
  
  // Handle publish toggle
  const handlePublishToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, published: event.target.checked }));
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt should be 300 characters or less';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Article submitted:', formData);
        setIsSubmitting(false);
        setSuccess(true);
        
        // Redirect to articles list after successful submission
        setTimeout(() => {
          router.push('/admin/dashboard/articles');
        }, 2000);
      }, 1000);
    }
  };
  
  return (
    <>
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
            New Article
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            sx={{ mr: 2 }}
          >
            Preview
          </Button>
          <Button
            type="submit"
            form="article-form"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Article'}
          </Button>
        </Box>
      </Box>
      
      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Article created successfully! Redirecting...
        </Alert>
      )}
      
      {/* Form */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box
          component="form"
          id="article-form"
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Article Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            
            {/* Slug */}
            <Grid item xs={12} md={6}>
              <TextField
                name="slug"
                label="URL Slug"
                value={formData.slug}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.slug}
                helperText={errors.slug || "Used in the article's URL (auto-generated from title)"}
              />
            </Grid>
            
            {/* Author */}
            <Grid item xs={12} md={6}>
              <TextField
                name="author"
                label="Author"
                value={formData.author}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.author}
                helperText={errors.author}
              />
            </Grid>
            
            {/* Excerpt */}
            <Grid item xs={12}>
              <TextField
                name="excerpt"
                label="Excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
                error={!!errors.excerpt}
                helperText={errors.excerpt || `${formData.excerpt.length}/300 characters - A brief summary shown in article previews`}
              />
            </Grid>
            
            {/* Categories */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.categories}>
                <InputLabel id="categories-label">Categories</InputLabel>
                <Select
                  labelId="categories-label"
                  multiple
                  value={formData.categories}
                  onChange={handleCategoryChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = mockCategories.find(cat => cat.id === value);
                        return (
                          <Chip 
                            key={value} 
                            label={category ? category.name : value} 
                            size="small" 
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {mockCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categories && (
                  <FormHelperText>{errors.categories}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Tags */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                freeSolo
                options={mockTagSuggestions}
                value={formData.tags}
                onChange={handleTagsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      label={option} 
                      size="small" 
                      {...getTagProps({ index })} 
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags..."
                    helperText="Press Enter to add new tags"
                  />
                )}
              />
            </Grid>
            
            {/* Featured Image */}
            <Grid item xs={12}>
              <TextField
                name="featuredImage"
                label="Featured Image URL"
                value={formData.featuredImage}
                onChange={handleChange}
                fullWidth
                placeholder="https://example.com/image.jpg"
                InputProps={{
                  endAdornment: (
                    <Button 
                      startIcon={<ImageIcon />}
                      onClick={() => console.log('Open media library')}
                    >
                      Select Image
                    </Button>
                  ),
                }}
              />
            </Grid>
            
            {/* Image Preview */}
            {formData.featuredImage && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    backgroundImage: `url(${formData.featuredImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 1,
                    mb: 2
                  }}
                />
              </Grid>
            )}
            
            {/* Content */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Article Content
              </Typography>
              <TextField
                name="content"
                value={formData.content}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={15}
                error={!!errors.content}
                helperText={errors.content}
              />
              <FormHelperText>
                Simple text area for now. A rich text editor would be implemented here in the complete solution.
              </FormHelperText>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.published}
                      onChange={handlePublishToggle}
                      color="primary"
                    />
                  }
                  label={formData.published ? "Published" : "Draft"}
                />
                
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : formData.published ? 'Save & Publish' : 'Save Draft'}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
}