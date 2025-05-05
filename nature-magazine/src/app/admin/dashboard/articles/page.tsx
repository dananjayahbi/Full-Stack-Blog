'use client';

import React, { useState } from 'react';
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

// Mock data for articles
const mockArticles = [
  {
    id: '1',
    title: 'Secrets of the Deep Ocean: Exploring the Mariana Trench',
    slug: 'secrets-of-the-deep-ocean',
    author: 'James Rivera',
    date: '2025-04-28',
    status: 'published',
    category: 'Marine Life',
    views: 845,
  },
  {
    id: '2',
    title: 'How the Amazon Rainforest Acts as Earth\'s Carbon Sink',
    slug: 'amazon-rainforest-carbon-sink',
    author: 'Sofia Chen',
    date: '2025-04-22',
    status: 'published',
    category: 'Forests',
    views: 1203,
  },
  {
    id: '3',
    title: 'The Return of Wolves to Yellowstone: 30 Years Later',
    slug: 'return-of-wolves-yellowstone',
    author: 'Marcus Johnson',
    date: '2025-04-15',
    status: 'draft',
    category: 'Wildlife',
    views: 0,
  },
  {
    id: '4',
    title: 'Coral Reefs Face Unprecedented Threats from Climate Change',
    slug: 'coral-reefs-climate-change',
    author: 'Emma Wilson',
    date: '2025-04-10',
    status: 'published',
    category: 'Marine Life',
    views: 678,
  },
  {
    id: '5',
    title: 'Bird Migration Patterns Shifting Due to Climate Change',
    slug: 'bird-migration-patterns-changing',
    author: 'Sofia Chen',
    date: '2025-04-03',
    status: 'published',
    category: 'Birds',
    views: 521,
  },
  {
    id: '6',
    title: 'Microplastics Found Throughout the Food Chain',
    slug: 'microplastics-food-chain',
    author: 'James Rivera',
    date: '2025-03-27',
    status: 'published',
    category: 'Pollution',
    views: 892,
  },
  {
    id: '7',
    title: 'Indigenous Communities and Traditional Ecological Knowledge',
    slug: 'traditional-ecological-knowledge',
    author: 'Marcus Johnson',
    date: '2025-03-20',
    status: 'draft',
    category: 'Indigenous Cultures',
    views: 0,
  },
  {
    id: '8',
    title: 'Desert Blooms: Changing Patterns in Arid Ecosystems',
    slug: 'desert-blooms-climate-change',
    author: 'Emma Wilson',
    date: '2025-03-15',
    status: 'published',
    category: 'Deserts',
    views: 435,
  },
  {
    id: '9',
    title: 'Urban Wildlife: Adapting to City Living',
    slug: 'urban-wildlife-city-living',
    author: 'James Rivera',
    date: '2025-03-08',
    status: 'published',
    category: 'Wildlife',
    views: 623,
  },
  {
    id: '10',
    title: 'Sustainable Fishing Practices in Coastal Communities',
    slug: 'sustainable-fishing-coastal-communities',
    author: 'Sofia Chen',
    date: '2025-03-01',
    status: 'published',
    category: 'Oceans',
    views: 782,
  },
];

// Extract unique categories and statuses for filters
const categories = Array.from(new Set(mockArticles.map(article => article.category)));
const statuses = Array.from(new Set(mockArticles.map(article => article.status)));

export default function ArticlesPage() {
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
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    // Delete article logic would go here
    console.log(`Deleting article ${articleToDelete}`);
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter articles
  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || article.category === categoryFilter;
    const matchesStatus = statusFilter === '' || article.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Slice for pagination
  const displayedArticles = filteredArticles
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
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

        {/* Articles Table */}
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
                  <TableCell>{article.author}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={article.status}
                      size="small"
                      color={article.status === 'published' ? 'success' : 'default'}
                      variant={article.status === 'published' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>{formatDate(article.date)}</TableCell>
                  <TableCell>{article.views.toLocaleString()}</TableCell>
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
              {displayedArticles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No articles found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Try adjusting your search or filter criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Table Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredArticles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}