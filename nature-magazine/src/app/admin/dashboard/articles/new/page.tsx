'use client';

import React, { useState, useEffect } from 'react';
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
  Alert,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { 
  SaveOutlined as SaveIcon,
  VisibilityOutlined as PreviewIcon,
  ArrowBackOutlined as BackIcon,
  ImageOutlined as ImageIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Link from 'next/link';
import RichTextEditor from '@/components/editor/RichTextEditor';
import LexicalEditor from '@/components/editor/LexicalEditor';

// Mock categories for demonstration - would be fetched from API in real app
const mockCategories = [
  { id: '1', name: 'Wildlife' },
  { id: '2', name: 'Conservation' },
  { id: '3', name: 'Ecosystems' },
  { id: '4', name: 'Climate Change' },
  { id: '5', name: 'Sustainability' }
];
const mockTagSuggestions = ['animals', 'plants', 'forests', 'oceans', 'endangered species', 'pollution'];

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
  
  // State for form validation and UI
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlignment, setImageAlignment] = useState('left');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // State for real categories from API
  const [categories, setCategories] = useState(mockCategories);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        // This would be a real API call in production
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        // setCategories(data);
        
        // For demo purposes, just use mock data after a delay
        setTimeout(() => {
          setCategories(mockCategories);
          setIsLoadingCategories(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
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
  
  // Handle rich text editor content change
  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };
  
  // Handle select changes for categories
  const handleCategoryChange = (event: any) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, categories: typeof value === 'string' ? value.split(',') : value }));
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };
  
  // Handle tags change
  const handleTagsChange = (_event: any, newValue: string[]) => {
    setFormData(prev => ({ ...prev, tags: newValue }));
  };
  
  // Handle publish toggle
  const handlePublishToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, published: event.target.checked }));
  };
  
  // Handle image insertion
  const handleImageInsert = () => {
    setIsLoadingImage(true);
    setImageError('');
    
    // Check if image URL is valid
    if (!imageUrl) {
      setImageError('Please enter an image URL');
      setIsLoadingImage(false);
      return;
    }
    
    // Simulate image loading
    const img = new Image();
    img.onload = () => {
      setIsLoadingImage(false);
      
      // Insert image in the content
      const imageHtml = `<img src="${imageUrl}" alt="Inserted image" style="text-align: ${imageAlignment};" />`;
      const updatedContent = formData.content 
        ? formData.content.replace(/<p><br><\/p>$/, '') + imageHtml 
        : imageHtml;
        
      setFormData(prev => ({ ...prev, content: updatedContent }));
      
      // Close dialog and reset state
      setImageDialogOpen(false);
      setImageUrl('');
    };
    
    img.onerror = () => {
      setImageError('Invalid image URL or image could not be loaded');
      setIsLoadingImage(false);
    };
    
    img.src = imageUrl;
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
    
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
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
  
  // Handle preview
  const handlePreview = () => {
    if (validateForm()) {
      // In a real app, you would create a temporary preview URL
      // For demo, we'll open a dialog with the preview
      setPreviewOpen(true);
      
      // Alternatively, open in a new tab with a special preview route
      // window.open(`/articles/preview/${formData.slug}`, '_blank');
    }
  };

  // Handle tab change for different editor views
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
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
            New Article
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
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
            {/* Left Column - Main Article Info */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Article Information
                </Typography>
              
                {/* Title */}
                <TextField
                  name="title"
                  label="Article Title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title}
                  sx={{ mb: 3 }}
                />
                
                {/* Slug */}
                <TextField
                  name="slug"
                  label="URL Slug"
                  value={formData.slug}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.slug}
                  helperText={errors.slug || "Used in the article's URL (auto-generated from title)"}
                  sx={{ mb: 3 }}
                />
                
                {/* Excerpt */}
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
              </Paper>
              
              {/* Rich Text Editor */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Article Content
                </Typography>
                
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={activeTab} onChange={handleTabChange} aria-label="editor tabs">
                    <Tab label="Editor" />
                    <Tab label="HTML" />
                    <Tab label="Preview" />
                  </Tabs>
                </Box>
                
                <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                  <LexicalEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    error={!!errors.content}
                    helperText={errors.content}
                    placeholder="Write your article content here..."
                  />
                </Box>
                
                <Box sx={{ display: activeTab === 1 ? 'block' : 'none', mt: 2 }}>
                  <TextField
                    value={formData.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    multiline
                    rows={20}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      style: { fontFamily: 'monospace' }
                    }}
                  />
                </Box>
                
                <Box 
                  sx={{ 
                    display: activeTab === 2 ? 'block' : 'none', 
                    mt: 2,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    minHeight: '400px'
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              </Paper>
            </Grid>
            
            {/* Right Column - Settings */}
            <Grid item xs={12} md={4}>
              {/* Author & Publish Status */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Publishing Settings
                </Typography>
                
                {/* Author */}
                <TextField
                  name="author"
                  label="Author"
                  value={formData.author}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.author}
                  helperText={errors.author}
                  sx={{ mb: 3 }}
                />
                
                {/* Publish Status */}
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
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting}
                    fullWidth
                  >
                    {isSubmitting ? 'Saving...' : formData.published ? 'Save & Publish' : 'Save Draft'}
                  </Button>
                </Box>
              </Paper>
              
              {/* Categories & Tags */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Categories & Tags
                </Typography>
                
                {/* Categories */}
                <FormControl 
                  fullWidth 
                  error={!!errors.categories}
                  sx={{ mb: 3 }}
                >
                  <InputLabel id="categories-label">Categories</InputLabel>
                  <Select
                    labelId="categories-label"
                    multiple
                    value={formData.categories}
                    onChange={handleCategoryChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const category = categories.find(cat => cat.id === value);
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
                    disabled={isLoadingCategories}
                    startAdornment={
                      isLoadingCategories ? (
                        <InputAdornment position="start">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ) : null
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categories && (
                    <FormHelperText>{errors.categories}</FormHelperText>
                  )}
                </FormControl>
                
                {/* Tags */}
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
              </Paper>
              
              {/* Featured Image */}
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Featured Image
                </Typography>
                
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
                        Select
                      </Button>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                {/* Image Preview */}
                {formData.featuredImage ? (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      backgroundImage: `url(${formData.featuredImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed #ccc',
                      borderRadius: 1,
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No featured image selected
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Image Insert Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL"
            type="url"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            error={!!imageError}
            helperText={imageError}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="subtitle2" gutterBottom>
            Alignment:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={imageAlignment === 'left' ? 'contained' : 'outlined'}
              startIcon={<AlignLeftIcon />}
              onClick={() => setImageAlignment('left')}
            >
              Left
            </Button>
            <Button
              variant={imageAlignment === 'center' ? 'contained' : 'outlined'}
              startIcon={<AlignCenterIcon />}
              onClick={() => setImageAlignment('center')}
            >
              Center
            </Button>
            <Button
              variant={imageAlignment === 'right' ? 'contained' : 'outlined'}
              startIcon={<AlignRightIcon />}
              onClick={() => setImageAlignment('right')}
            >
              Right
            </Button>
          </Box>
          
          {/* Image preview */}
          {imageUrl && !imageError && (
            <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: imageAlignment }}>
              <Box
                component="img"
                src={imageUrl}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '200px'
                }}
                onError={() => setImageError('Invalid image URL or image could not be loaded')}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={handleImageInsert} 
            variant="contained" 
            color="primary" 
            disabled={isLoadingImage || !!imageError}
            startIcon={isLoadingImage ? <CircularProgress size={16} /> : <CheckCircleIcon />}
          >
            {isLoadingImage ? 'Loading...' : 'Insert Image'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{ 
          sx: { 
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
          } 
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Article Preview</Typography>
            <Button 
              variant="outlined"
              onClick={() => window.open(`/articles/preview/${formData.slug}`, '_blank')}
              startIcon={<PreviewIcon />}
            >
              Open in New Tab
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ flex: 1, overflow: 'auto' }}>
          <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            {/* Header */}
            {formData.featuredImage && (
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  backgroundImage: `url(${formData.featuredImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                  mb: 3
                }}
              />
            )}
            
            <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}>
              {formData.title || 'Untitled Article'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3, color: 'text.secondary' }}>
              <Typography variant="body2">
                By {formData.author || 'Unknown Author'}
              </Typography>
              <Typography variant="body2">
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
            
            {formData.categories.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.categories.map(catId => {
                  const category = categories.find(c => c.id === catId);
                  return category ? (
                    <Chip 
                      key={catId} 
                      label={category.name} 
                      size="small" 
                      color="primary"
                    />
                  ) : null;
                })}
              </Box>
            )}
            
            <Typography variant="subtitle1" sx={{ mb: 4, fontStyle: 'italic' }}>
              {formData.excerpt || 'No excerpt provided.'}
            </Typography>
            
            {/* Content */}
            <Box 
              sx={{
                '& img': { maxWidth: '100%', height: 'auto' },
                '& h1, & h2, & h3, & h4, & h5, & h6': { fontFamily: 'Georgia, serif' }
              }}
              dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content provided.</p>' }}
            />
            
            {/* Tags */}
            {formData.tags.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tags:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}