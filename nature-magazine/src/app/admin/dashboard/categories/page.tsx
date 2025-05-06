'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment,
  Container,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ImageOutlined as ImageIcon
} from '@mui/icons-material';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  articleCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to fetch categories from the API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load categories',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle opening the new category dialog
  const handleNewCategoryOpen = () => {
    setNewCategoryOpen(true);
  };

  // Handle closing the new category dialog
  const handleNewCategoryClose = () => {
    setNewCategoryOpen(false);
  };

  // Handle opening the edit category dialog
  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setEditCategoryOpen(true);
  };

  // Handle closing the edit category dialog
  const handleEditCategoryClose = () => {
    setEditCategoryOpen(false);
    setCategoryToEdit(null);
  };

  // Handle opening the delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle confirming deletion
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/categories/${categoryToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }
      
      // Remove from state
      setCategories(prevCategories => 
        prevCategories.filter(cat => cat.id !== categoryToDelete)
      );
      
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete category',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Handle canceling deletion
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Handle closing the snackbar
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Convert string to slug
  const toSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
  };

  // Handle form submission for create/edit
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get('name') as string;
    // Generate slug from name if not provided or use the provided slug
    let slug = formData.get('slug') as string;
    if (!slug || slug.trim() === '') {
      slug = toSlug(name);
    }
    
    const categoryData = {
      name,
      slug,
      description: formData.get('description') as string || '',
      image: formData.get('image') as string || '/images/placeholder.jpg',
    };
    
    try {
      let response;
      
      if (categoryToEdit) {
        // Update existing category
        response = await fetch(`/api/categories/${categoryToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        });
      } else {
        // Create new category
        response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }
      
      const savedCategory = await response.json();
      
      if (categoryToEdit) {
        // Update in state
        setCategories(prevCategories => 
          prevCategories.map(cat => 
            cat.id === categoryToEdit.id ? { ...savedCategory, articleCount: cat.articleCount } : cat
          )
        );
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success'
        });
        handleEditCategoryClose();
      } else {
        // Add to state
        setCategories(prevCategories => [...prevCategories, { ...savedCategory, articleCount: 0 }]);
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success'
        });
        handleNewCategoryClose();
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to save category',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mx: 'auto', width: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewCategoryOpen}
        >
          New Category
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Categories Grid */}
      {!loading && (
        <Grid container spacing={3}>
          {filteredCategories.length === 0 ? (
            <Grid sx={{ gridColumn: '1 / -1' }}>
              <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>No categories found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create your first category to start organizing your articles
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleNewCategoryOpen}
                >
                  Create First Category
                </Button>
              </Paper>
            </Grid>
          ) : (
            filteredCategories.map((category) => (
              <Grid key={category.id} sx={{ 
                gridColumn: {
                  xs: 'span 12',
                  sm: 'span 6',
                  md: 'span 4'
                }
              }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="div"
                    sx={{ height: 160, position: 'relative' }}
                    image={category.image}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        padding: '8px 16px',
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {category.articleCount} articles
                      </Typography>
                    </Box>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', borderTop: 1, borderColor: 'divider' }}>
                    <Box>
                      <Link href={`/categories/${category.slug}`} target="_blank" style={{ textDecoration: 'none' }}>
                        <Button size="small">View</Button>
                      </Link>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleEditCategory(category)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(category.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* New Category Dialog */}
      <Dialog
        open={newCategoryOpen}
        onClose={handleNewCategoryClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Category</DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="Category Name"
                  name="name"
                  fullWidth
                  required
                  autoFocus
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="URL Slug"
                  name="slug"
                  fullWidth
                  helperText="Used in category URLs. Use lowercase letters, numbers, and hyphens (will be auto-generated if left empty)"
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="Image URL"
                  name="image"
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
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNewCategoryClose} disabled={isSubmitting}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog
        open={editCategoryOpen}
        onClose={handleEditCategoryClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Category</DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="Category Name"
                  name="name"
                  fullWidth
                  required
                  autoFocus
                  defaultValue={categoryToEdit?.name}
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="URL Slug"
                  name="slug"
                  fullWidth
                  required
                  helperText="Used in category URLs. Use lowercase letters, numbers, and hyphens"
                  defaultValue={categoryToEdit?.slug}
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                  defaultValue={categoryToEdit?.description}
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12' }}>
                <TextField
                  label="Image URL"
                  name="image"
                  fullWidth
                  defaultValue={categoryToEdit?.image}
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
                />
              </Grid>
              {categoryToEdit?.image && (
                <Grid sx={{ gridColumn: 'span 12' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 160,
                      backgroundImage: `url(${categoryToEdit.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCategoryClose} disabled={isSubmitting}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Category'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this category? All articles will remain but will no longer be associated with this category.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isSubmitting}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}