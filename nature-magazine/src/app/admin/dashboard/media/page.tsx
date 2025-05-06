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
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Chip,
  InputAdornment,
  Skeleton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  Container,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CloudUpload as CloudUploadIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Movie as VideoIcon,
  PictureAsPdf as PdfIcon,
  Description as FileIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

// Empty media array to be populated with real data later
const mockMedia = [];

export default function MediaLibraryPage() {
  // State for tabs, search, and filtering
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  
  // State for upload dialog
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  
  // State for media details dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null);
  
  // State for copy notification
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter media based on search query, tab value and media type filter
  const filteredMedia = mockMedia
    .filter(media => {
      // Filter by search query
      const matchesSearch = media.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by tab value (0 = All, 1 = Images, 2 = Documents, 3 = Videos)
      let matchesTab = true;
      if (tabValue === 1) matchesTab = media.type === 'image';
      if (tabValue === 2) matchesTab = ['pdf', 'file'].includes(media.type);
      if (tabValue === 3) matchesTab = media.type === 'video';
      
      // Filter by media type if not "all"
      const matchesType = mediaTypeFilter === 'all' || media.type === mediaTypeFilter;
      
      return matchesSearch && matchesTab && matchesType;
    })
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  // Handle opening the upload dialog
  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
    setUploadingStatus('idle');
  };

  // Handle closing the upload dialog
  const handleUploadDialogClose = () => {
    if (uploadingStatus !== 'uploading') {
      setUploadDialogOpen(false);
    }
  };

  // Simulate file upload
  const handleFileUpload = () => {
    setUploadingStatus('uploading');
    
    // Simulate API call
    setTimeout(() => {
      setUploadingStatus('success');
      
      // Close dialog after success
      setTimeout(() => {
        setUploadDialogOpen(false);
        setUploadingStatus('idle');
      }, 1500);
    }, 2000);
  };

  // Handle opening media details dialog
  const handleMediaDetails = (media: any) => {
    setSelectedMedia(media);
    setDetailsDialogOpen(true);
  };

  // Handle copying URL to clipboard
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySnackbarOpen(true);
  };

  // Handle opening delete confirmation
  const handleDeleteClick = (id: string) => {
    setMediaToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle confirm deletion
  const handleDeleteConfirm = () => {
    // Delete media logic would go here
    console.log(`Deleting media ${mediaToDelete}`);
    setDeleteDialogOpen(false);
    setMediaToDelete(null);
  };

  // Handle cancel deletion
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMediaToDelete(null);
  };

  // Get icon for media type
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon />;
      case 'video':
        return <VideoIcon />;
      case 'pdf':
        return <PdfIcon />;
      default:
        return <FileIcon />;
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Container maxWidth="xl" sx={{ mx: 'auto', width: '100%' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Media Library
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadDialogOpen}
        >
          Upload Files
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        {/* Filter Bar */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder="Search media..."
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
          
          <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel id="media-type-label">Media Type</InputLabel>
            <Select
              labelId="media-type-label"
              id="media-type-select"
              value={mediaTypeFilter}
              label="Media Type"
              onChange={(e) => setMediaTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="image">Images</MenuItem>
              <MenuItem value="video">Videos</MenuItem>
              <MenuItem value="pdf">PDFs</MenuItem>
              <MenuItem value="file">Other Files</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="media library tabs"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Media" />
          <Tab label="Images" />
          <Tab label="Documents" />
          <Tab label="Videos" />
        </Tabs>

        {/* Media Grid */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" gutterBottom>
              No media found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload media files to use in your articles and pages
            </Typography>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadDialogOpen}
            >
              Upload Files
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
        aria-labelledby="upload-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="upload-dialog-title">
          Upload Media
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload images, videos, documents, or other files to your media library.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported formats: JPG, PNG, GIF, WebP, PDF, MP4, MOV
            </Typography>
          </Box>
          
          {uploadingStatus === 'idle' && (
            <Box 
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                backgroundColor: 'background.default',
                cursor: 'pointer',
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                Drag and drop files here
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                or
              </Typography>
              <Button variant="contained">
                Select Files
              </Button>
              <input 
                type="file" 
                hidden 
                multiple 
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx" 
              />
            </Box>
          )}
          
          {uploadingStatus === 'uploading' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgressWithLabel value={65} />
              </Box>
              <Typography>Uploading...</Typography>
            </Box>
          )}
          
          {uploadingStatus === 'success' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Alert severity="success">Files uploaded successfully!</Alert>
            </Box>
          )}
          
          {uploadingStatus === 'error' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Alert severity="error">There was a problem uploading your files. Please try again.</Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleUploadDialogClose}
            disabled={uploadingStatus === 'uploading'}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFileUpload}
            variant="contained"
            disabled={uploadingStatus !== 'idle'}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Details Dialog */}
      {selectedMedia && (
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          aria-labelledby="media-details-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="media-details-dialog-title">
            {selectedMedia.title}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Media Preview */}
              <Grid item xs={12} md={7}>
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    style={{
                      width: '100%',
                      borderRadius: '4px',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <Box sx={{
                    backgroundColor: 'grey.100',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '300px'
                  }}>
                    {getMediaTypeIcon(selectedMedia.type)}
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      {selectedMedia.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {selectedMedia.type.toUpperCase()} file
                    </Typography>
                  </Box>
                )}
              </Grid>
              
              {/* Media Details */}
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle1" gutterBottom>
                  File Details
                </Typography>
                
                <Box component="dl" sx={{ 
                  '& dt': { 
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    mb: 0.5
                  },
                  '& dd': { 
                    ml: 0, 
                    mb: 2,
                    fontSize: '0.975rem'
                  }
                }}>
                  <dt>File name</dt>
                  <dd>{selectedMedia.title}</dd>
                  
                  <dt>File type</dt>
                  <dd>{selectedMedia.type.toUpperCase()}</dd>
                  
                  <dt>File size</dt>
                  <dd>{selectedMedia.size}</dd>
                  
                  {selectedMedia.dimensions && (
                    <>
                      <dt>Dimensions</dt>
                      <dd>{selectedMedia.dimensions}</dd>
                    </>
                  )}
                  
                  <dt>Uploaded by</dt>
                  <dd>{selectedMedia.uploadedBy}</dd>
                  
                  <dt>Upload date</dt>
                  <dd>{formatDate(selectedMedia.uploadDate)}</dd>
                  
                  <dt>URL</dt>
                  <dd>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        size="small"
                        value={selectedMedia.url}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton 
                                edge="end"
                                onClick={() => handleCopyUrl(selectedMedia.url)}
                                size="small"
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </dd>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleDeleteClick(selectedMedia.id);
                    }}
                    color="error"
                  >
                    Delete
                  </Button>
                  <Button 
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    onClick={() => handleCopyUrl(selectedMedia.url)}
                  >
                    Copy URL
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this media item? This action cannot be undone and may affect articles that use this media.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy URL Snackbar */}
      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setCopySnackbarOpen(false)}
        message="URL copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

// Progress bar component for file uploads
function LinearProgressWithLabel(props: { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}