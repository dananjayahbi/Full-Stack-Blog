'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Storage as StorageIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';

export default function SettingsPage() {
  // State for database connection check
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');

  // Function to check database connection
  const checkDatabaseConnection = async () => {
    setIsChecking(true);
    setConnectionStatus('idle');
    setConnectionMessage('');
    
    try {
      const response = await fetch('/api/admin/check-database', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setConnectionStatus('success');
        setConnectionMessage(data.message || 'Database connection successful');
      } else {
        setConnectionStatus('error');
        setConnectionMessage(data.error || 'Failed to connect to database');
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionMessage('An error occurred while checking the database connection');
      console.error('Database connection check error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Admin Settings
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Database Connection */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <StorageIcon sx={{ mr: 1 }} /> Database Connection
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" paragraph>
                Check your connection to the database to ensure the application can properly store and retrieve data.
              </Typography>
              
              <Button
                variant="contained"
                onClick={checkDatabaseConnection}
                disabled={isChecking}
                startIcon={isChecking ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isChecking ? 'Checking...' : 'Check Database Connection'}
              </Button>
              
              {connectionStatus === 'success' && (
                <Alert 
                  severity="success" 
                  icon={<CheckCircleOutlineIcon />}
                  sx={{ mt: 2 }}
                >
                  {connectionMessage}
                </Alert>
              )}
              
              {connectionStatus === 'error' && (
                <Alert 
                  severity="error"
                  icon={<ErrorOutlineIcon />}
                  sx={{ mt: 2 }}
                >
                  {connectionMessage}
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ borderRadius: 2, p: 3 }}>
            <Typography variant="h6" gutterBottom>System Information</Typography>
            <List>
              <ListItem divider>
                <ListItemText 
                  primary="Application Version" 
                  secondary="1.0.0"
                />
              </ListItem>
              <ListItem divider>
                <ListItemText 
                  primary="Next.js Version" 
                  secondary="14.0.0"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Node.js Version" 
                  secondary={process.version}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Additional Settings */}
        <Grid item xs={12}>
          <Paper sx={{ borderRadius: 2, p: 3 }}>
            <Typography variant="h6" gutterBottom>General Settings</Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable comments on articles"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Show author information on articles"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch />}
                  label="Require approval for comments before publishing"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}