'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import Link from 'next/link';

// Interface for articles
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  featuredImage?: string;
  categoryIds: string[];
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags: string[];
}

const statuses = ['published', 'draft'];

export default function ArticlesPage() {
  // State for articles and loading
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // State for table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // State for filter menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  // Function to fetch articles from API
  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/articles');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status}`);
      }
      
      const data = await response.json();
      setArticles(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(
          data.flatMap((article: Article) => 
            article.categories.map((category) => category.name)
          )
        )
      );
      setCategories(uniqueCategories as string[]);
      
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Handle filter changes
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
    handleFilterClose();
  };

  // Open delete confirmation
  const handleDeleteClick = (id: string) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
    setDeleteError('');
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      const response = await fetch(`/api/articles/${articleToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete article');
      }
      
      // Remove the deleted article from state
      setArticles(prevArticles => 
        prevArticles.filter(article => article.id !== articleToDelete)
      );
      
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
      
    } catch (error: any) {
      console.error('Error deleting article:', error);
      setDeleteError(error.message || 'Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
    setDeleteError('');
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get the primary category of an article
  const getPrimaryCategory = (article: Article) => {
    return article.categories.length > 0 ? article.categories[0].name : 'Uncategorized';
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.slug?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === '' || 
      article.categories?.some(category => category.name === categoryFilter);
      
    const status = article.published ? 'published' : 'draft';
    const matchesStatus = statusFilter === '' || status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Slice for pagination
  const displayedArticles = filteredArticles
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mx: 'auto', width: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Articles
        </Typography>
        <Button
          component={Link}
          href="/admin/dashboard/articles/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          New Article
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        {/* Filters and Search */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            id="filter-button"
            aria-controls={open ? 'filter-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleFilterClick}
            startIcon={<FilterListIcon />}
            size="medium"
            sx={{ mr: 1 }}
            variant="outlined"
          >
            Filters
          </Button>

          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleFilterClose}
          >
            <Box sx={{ p: 2, width: 250 }}>
              <Typography variant="subtitle2" gutterBottom>
                Filter Articles
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2, mt: 1 }}>
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={categoryFilter}
                  label="Category"
                  onChange={handleCategoryFilterChange}
                  disabled={categories.length === 0}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                size="small" 
                fullWidth
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </Menu>

          {(categoryFilter || statusFilter) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categoryFilter && (
                <Chip
                  label={`Category: ${categoryFilter}`}
                  size="small"
                  onDelete={() => setCategoryFilter('')}
                />
              )}
              {statusFilter && (
                <Chip
                  label={`Status: ${statusFilter}`}
                  size="small"
                  onDelete={() => setStatusFilter('')}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Articles Table */}
        {!loading && (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="articles table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedArticles.map((article) => (
                  <TableRow
                    key={article.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link 
                        href={`/admin/dashboard/articles/${article.id}/edit`}
                        style={{ 
                          color: 'inherit', 
                          textDecoration: 'none',
                          fontWeight: 500
                        }}
                      >
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>{article.author?.name || 'Unknown'}</TableCell>
                    <TableCell>{getPrimaryCategory(article)}</TableCell>
                    <TableCell>
                      <Chip
                        label={article.published ? 'published' : 'draft'}
                        size="small"
                        color={article.published ? 'success' : 'default'}
                        variant={article.published ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(article.published ? article.publishedAt : article.createdAt)}</TableCell>
                    <TableCell>{article.viewCount?.toLocaleString() || 0}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ '& > *': { ml: 1 } }}>
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/articles/${article.slug}`}
                          target="_blank"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          component={Link}
                          href={`/admin/dashboard/articles/${article.id}/edit`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(article.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && displayedArticles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">No articles found</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {searchQuery || categoryFilter || statusFilter ? 
                          'Try adjusting your search or filter criteria' : 
                          'Click "New Article" to create your first article'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Table Pagination */}
        {!loading && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredArticles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

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
            Are you sure you want to delete this article? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}