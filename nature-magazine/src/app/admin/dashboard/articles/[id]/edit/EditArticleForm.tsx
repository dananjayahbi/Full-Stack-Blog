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

// Fallback categories for error cases
const fallbackCategories = [
  { id: '1', name: 'Wildlife' },
  { id: '2', name: 'Conservation' },
  { id: '3', name: 'Ecosystems' },
  { id: '4', name: 'Climate Change' },
  { id: '5', name: 'Sustainability' }
];
const mockTagSuggestions = ['animals', 'plants', 'forests', 'oceans', 'endangered species', 'pollution'];

// Note: We receive articleId as a prop, not from params
export default function EditArticleForm({ articleId }: { articleId: string }) {
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
    authorId: '', 
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

  // State for categories from API
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  // State for users from API
  const [users, setUsers] = useState<Array<{id: string, name: string, email: string}>>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userError, setUserError] = useState('');

  // Loading state for the article
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch article data when component mounts
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/articles/${articleId}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Handle the author field which might be an object or ID
        let authorId = '';
        if (data.author) {
          if (typeof data.author === 'string') {
            authorId = data.author;
          } else if (typeof data.author === 'object' && data.author.id) {
            authorId = data.author.id;
          } else if (data.authorId) {
            authorId = data.authorId;
          }
        }
        
        // Populate form data with the article's current data
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          categories: data.categories?.map((cat: any) => cat.id) || [],
          tags: data.tags || [],
          featuredImage: data.featuredImage || '',
          authorId: authorId,
          published: !!data.published
        });
      } catch (err: any) {
        console.error('Error fetching article:', err);
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [articleId]); // Using articleId prop instead of params.id
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError('');
      
      try {
        // Fetch categories from the real API endpoint
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data);
        setIsLoadingCategories(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryError('Failed to load categories. Using default categories instead.');
        // Use fallback categories in case of an error
        setCategories(fallbackCategories);
        setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setUserError('');
      
      try {
        // Fetch users from the API endpoint
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
        setIsLoadingUsers(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUserError('Failed to load users.');
        setIsLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title only if slug is empty or unchanged from auto-generation
    if (name === 'title' && (!formData.slug || formData.slug === formData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'))) {
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
  
  // Handle select changes for author
  const handleAuthorChange = (event: any) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, authorId: value }));
    if (errors.authorId) {
      setErrors(prev => ({ ...prev, authorId: '' }));
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
    
    if (!formData.authorId) {
      newErrors.authorId = 'Author is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission for updating the article
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Send data to update the article via the API endpoint
        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'PUT', // Use PUT for updates
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        // Handle API response
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update article');
        }

        const updatedArticle = await response.json();
        console.log('Article updated:', updatedArticle);
        
        // Show success message
        setSuccess(true);
        
        // Redirect to articles list after successful submission
        setTimeout(() => {
          router.push('/admin/dashboard/articles');
        }, 2000);
      } catch (error: any) {
        console.error('Error updating article:', error);
        setErrors(prev => ({ 
          ...prev, 
          submit: error.message || 'Failed to update article. Please try again.' 
        }));
        setIsSubmitting(false);
      }
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
            Edit Article
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
      
      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Article updated successfully! Redirecting...
        </Alert>
      )}
      
      {/* Error Alert */}
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {errors.submit}
        </Alert>
      )}
      
      {/* Initial loading or error */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Form - only show when article is loaded */}
      {!loading && !error && (
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
                    helperText={errors.slug || "Used in the article's URL"}
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
                <Box sx={{ 
                  position: { md: 'sticky' },
                  top: { md: '24px' },
                  maxHeight: { md: 'calc(100vh - 48px)' },
                  overflowY: { md: 'auto' }
                }}>
                  {/* Author & Publish Status */}
                  <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      Publishing Settings
                    </Typography>
                    
                    {/* Author Dropdown */}
                    <FormControl 
                      fullWidth 
                      error={!!errors.authorId || !!userError}
                      sx={{ mb: 3 }}
                      disabled={isLoadingUsers}
                    >
                      <InputLabel id="author-label">Author</InputLabel>
                      <Select
                        labelId="author-label"
                        value={formData.authorId}
                        onChange={handleAuthorChange}
                        label="Author"
                        required
                        startAdornment={
                          isLoadingUsers ? (
                            <InputAdornment position="start">
                              <CircularProgress size={20} />
                            </InputAdornment>
                          ) : null
                        }
                      >
                        {users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name || user.email}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.authorId && (
                        <FormHelperText>{errors.authorId}</FormHelperText>
                      )}
                      {userError && !errors.authorId && (
                        <FormHelperText error>{userError}</FormHelperText>
                      )}
                    </FormControl>
                    
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
                      error={!!errors.categories || !!categoryError}
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
                      {categoryError && !errors.categories && (
                        <FormHelperText error>{categoryError}</FormHelperText>
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
                        value.map((option, index) => {
                          // Extract props but handle key separately to avoid React warning
                          const { key, ...chipProps } = getTagProps({ index });
                          return (
                            <Chip
                              key={key}
                              label={option}
                              size="small"
                              {...chipProps}
                            />
                          );
                        })
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
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
      
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
                By {formData.authorId || 'Unknown Author'}
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