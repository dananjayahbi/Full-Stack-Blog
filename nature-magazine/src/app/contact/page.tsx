'use client';

import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Container, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  InputAdornment,
  MenuItem,
  FormControl,
  FormHelperText,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Contact form topics
const topics = [
  'General Inquiry',
  'Article Submission',
  'Correction/Clarification',
  'Partnership Opportunity',
  'Press/Media Inquiry',
  'Subscription Issue',
  'Other'
];

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });
  
  // Form validation state
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    topic: false,
    message: false,
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === '',
      email: !/^\S+@\S+\.\S+$/.test(formData.email),
      topic: formData.topic === '',
      message: formData.message.trim().length < 10,
    };
    
    setErrors(newErrors);
    
    // Return true if no errors (form is valid)
    return !Object.values(newErrors).includes(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to submit the form
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        topic: '',
        message: '',
      });
    } catch (error) {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle closing success/error alerts
  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    
    setSubmitSuccess(false);
    setSubmitError(false);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
            }}
          >
            Contact Us
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mb: 4,
            }}
          >
            Have a question, story idea, or feedback? We'd love to hear from you.
          </Typography>
        </Box>

        <Grid container spacing={6} sx={{ mb: 8 }}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  fontFamily: 'Georgia, serif',
                  mb: 3,
                  position: 'relative',
                  display: 'inline-block',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '50px',
                    height: '3px',
                    backgroundColor: 'primary.main',
                  }
                }}
              >
                Send Us a Message
              </Typography>
              
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Name Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      id="name"
                      name="name"
                      label="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      helperText={errors.name && "Name is required"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Email Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      id="email"
                      name="email"
                      label="Your Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      helperText={errors.email && "Valid email is required"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Topic Select */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      select
                      id="topic"
                      name="topic"
                      label="Topic"
                      value={formData.topic}
                      onChange={handleChange}
                      error={errors.topic}
                      helperText={errors.topic && "Please select a topic"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SubjectIcon />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select a topic
                      </MenuItem>
                      {topics.map((topic) => (
                        <MenuItem key={topic} value={topic}>
                          {topic}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  {/* Message Field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={5}
                      id="message"
                      name="message"
                      label="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      helperText={errors.message && "Message must be at least 10 characters"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                            <MessageIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      endIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{ py: 1.5 }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, height: '100%', bgcolor: 'primary.main', color: 'white' }}>
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    fontFamily: 'Georgia, serif',
                    mb: 3,
                    color: 'white',
                  }}
                >
                  Get In Touch
                </Typography>
                <Typography variant="body2" paragraph>
                  We're here to help and answer any questions you might have. We look forward to hearing from you.
                </Typography>
              </Box>

              <List sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Address" 
                    secondary="123 Nature Way, Greenfield, CA 94539"
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ color: 'white', opacity: 0.8 }}
                  />
                </ListItem>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary="contact@naturemagazine.com"
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ color: 'white', opacity: 0.8 }}
                  />
                </ListItem>
                
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary="+1 (555) 123-4567"
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ color: 'white', opacity: 0.8 }}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Office Hours:
                </Typography>
                <Typography variant="body2">
                  Monday - Friday: 9:00 AM - 5:00 PM<br />
                  Saturday & Sunday: Closed
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
              textAlign: 'center',
              mb: 5,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                backgroundColor: 'primary.main',
              }
            }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 3 }}>
            {/*
              {
                question: 'How can I submit a story idea?',
                answer: 'We welcome story ideas related to nature, conservation, and environmental science. Please send your pitch to submissions@naturemagazine.com with a brief outline and any relevant credentials.'
              },
              {
                question: 'Do you accept guest contributors?',
                answer: 'Yes, we occasionally work with guest contributors who have expertise in specific areas of nature and environmental science. Please contact our editorial team with your proposed topic and writing samples.'
              },
              {
                question: 'How can I report a factual error in an article?',
                answer: 'Accuracy is important to us. If you spot an error, please email corrections@naturemagazine.com with the article title, the error, and the correct information with sources if possible.'
              },
              {
                question: 'Can I use your images or content for educational purposes?',
                answer: 'Our content is protected by copyright, but we do offer permissions for educational use. Please contact us with details about your intended use, and our permissions team will assist you.'
              }
            */}
            {Array.from(Array(4)).map((_, index) => (
              <Grid item key={index} xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontFamily: 'Georgia, serif' }}>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Answer to the question will be displayed here. This is a placeholder text.
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Map Placeholder */}
        <Box 
          sx={{ 
            height: 400, 
            backgroundColor: '#e9e9e9', 
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 6,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Map placeholder - Google Maps will be integrated here
          </Typography>
        </Box>
      </Container>
      
      {/* Success/Error Notifications */}
      <Snackbar open={submitSuccess} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
      
      <Snackbar open={submitError} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          There was an error sending your message. Please try again.
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}