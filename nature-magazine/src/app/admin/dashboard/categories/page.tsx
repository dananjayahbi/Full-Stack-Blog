'use client';

import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ImageOutlined as ImageIcon
} from '@mui/icons-material';
import Link from 'next/link';

// Mock data for categories
const mockCategories = [
  {
    id: '1',
    name: 'Wildlife',
    slug: 'wildlife',
    description: 'Stories about wild animals and their habitats around the world.',
    image: 'https://images.unsplash.com/photo-1585994545900-82451786ee10?q=80&w=1935&auto=format&fit=crop',
    articleCount: 42
  },
  {
    id: '2',
    name: 'Conservation',
    slug: 'conservation',
    description: 'Articles about preserving natural resources and protecting endangered species.',
    image: 'https://images.unsplash.com/photo-1535255558484-05a401f3e2a7?q=80&w=2070&auto=format&fit=crop',
    articleCount: 31
  },
  {
    id: '3',
    name: 'Oceans',
    slug: 'oceans',
    description: 'Exploring marine ecosystems, ocean conservation, and underwater discoveries.',
    image: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=2070&auto=format&fit=crop',
    articleCount: 38
  },
  {
    id: '4',
    name: 'Forests',
    slug: 'forests',
    description: 'From rainforests to boreal forests, stories about Earth\'s vital woodland ecosystems.',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop',
    articleCount: 35
  },
  {
    id: '5',
    name: 'Climate',
    slug: 'climate',
    description: 'Climate change impacts, research, and solutions from around the world.',
    image: 'https://images.unsplash.com/photo-1600870069168-44b4c0a2f8c9?q=80&w=2070&auto=format&fit=crop',
    articleCount: 47
  },
  {
    id: '6',
    name: 'Biodiversity',
    slug: 'biodiversity',
    description: 'Exploring the rich diversity of life on our planet and efforts to preserve it.',
    image: 'https://images.unsplash.com/photo-1624991519848-bf7e739a4ace?q=80&w=1973&auto=format&fit=crop',
    articleCount: 29
  },
  {
    id: '7',
    name: 'Pollution',
    slug: 'pollution',
    description: 'Articles about environmental pollution, its effects, and cleanup efforts.',
    image: 'https://images.unsplash.com/photo-1558640476-437a5d356cb4?q=80&w=2070&auto=format&fit=crop',
    articleCount: 18
  },
  {
    id: '8',
    name: 'Indigenous Cultures',
    slug: 'indigenous-cultures',
    description: 'Traditional ecological knowledge and indigenous conservation practices.',
    image: 'https://images.unsplash.com/photo-1594708053019-5336680bbc35?q=80&w=2070&auto=format&fit=crop',
    articleCount: 12
  }
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Filter categories based on search query
  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
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
  const handleEditCategory = (category: any) => {
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
  const handleDeleteConfirm = () => {
    // Delete category logic would go here
    console.log(`Deleting category ${categoryToDelete}`);
    setSnackbar({
      open: true,
      message: 'Category deleted successfully',
      severity: 'success'
    });
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
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

  // Mock function to handle form submission for create/edit
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      image: formData.get('image')
    };
    
    console.log('Category data:', categoryData);
    
    // Show success message and close dialog
    setSnackbar({
      open: true,
      message: categoryToEdit
        ? 'Category updated successfully'
        : 'Category created successfully',
      severity: 'success'
    });
    
    if (categoryToEdit) {
      handleEditCategoryClose();
    } else {
      handleNewCategoryClose();
    }
  };

  return (
    <>
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

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {filteredCategories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
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
        ))}

        {filteredCategories.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">No categories found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search or create a new category
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewCategoryOpen}
                sx={{ mt: 2 }}
              >
                New Category
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

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
              <Grid item xs={12}>
                <TextField
                  label="Category Name"
                  name="name"
                  fullWidth
                  required
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="URL Slug"
                  name="slug"
                  fullWidth
                  required
                  helperText="Used in category URLs. Use lowercase letters, numbers, and hyphens"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
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
            <Button onClick={handleNewCategoryClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create Category
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
              <Grid item xs={12}>
                <TextField
                  label="Category Name"
                  name="name"
                  fullWidth
                  required
                  autoFocus
                  defaultValue={categoryToEdit?.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="URL Slug"
                  name="slug"
                  fullWidth
                  required
                  helperText="Used in category URLs. Use lowercase letters, numbers, and hyphens"
                  defaultValue={categoryToEdit?.slug}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                  defaultValue={categoryToEdit?.description}
                />
              </Grid>
              <Grid item xs={12}>
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
                <Grid item xs={12}>
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
            <Button onClick={handleEditCategoryClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update Category
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
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
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
    </>
  );
}