import MainLayout from '@/components/MainLayout';
import { Typography, Box, Grid, Card, CardContent, Avatar, Divider, List, ListItem, ListItemIcon, ListItemText, Container } from '@mui/material';
import Image from 'next/image';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';

// Mock team member data
const teamMembers = [
  {
    id: '1',
    name: 'Emma Wilson',
    role: 'Editor-in-Chief',
    image: '/images/avatars/emma.jpg',
    bio: 'Emma is a conservation biologist with over 15 years of experience in forest ecology. She leads our editorial team with a passion for bringing nature\'s stories to a broader audience.'
  },
  {
    id: '2',
    name: 'James Rivera',
    role: 'Marine Life Editor',
    image: '/images/avatars/james.jpg',
    bio: 'James is a marine biologist who has participated in numerous oceanographic expeditions. He specializes in covering the latest discoveries from our oceans.'
  },
  {
    id: '3',
    name: 'Sofia Chen',
    role: 'Wildlife Editor',
    image: '/images/avatars/sofia.jpg',
    bio: 'Sofia is an award-winning nature photographer and writer who has documented wildlife on six continents. She leads our coverage of animal behavior and conservation.'
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    role: 'Climate & Environment Editor',
    image: '/images/avatars/marcus.jpg',
    bio: 'Marcus has a background in environmental science and data journalism. He translates complex climate research into accessible stories for our readers.'
  },
];

// Mission statement bullet points
const missionPoints = [
  'Educate readers about the wonders of the natural world',
  'Present the latest scientific research in accessible language',
  'Inspire conservation action through compelling storytelling',
  'Document the beauty of nature through exceptional photography'
];

// Core values
const coreValues = [
  {
    title: 'Scientific Accuracy',
    description: 'We are committed to rigorous fact-checking and presenting information with scientific integrity. We consult experts and cite peer-reviewed research in our reporting.'
  },
  {
    title: 'Environmental Ethics',
    description: 'Our field reporting follows Leave No Trace principles. We respect wildlife and natural spaces in our photography and storytelling practices.'
  },
  {
    title: 'Inclusive Storytelling',
    description: 'We seek diverse perspectives in environmental science and conservation, highlighting voices from communities around the world who live closely with nature.'
  },
  {
    title: 'Solutions-Oriented',
    description: 'While we don\'t shy away from environmental challenges, we emphasize constructive approaches and innovative solutions to conservation problems.'
  }
];

export default function AboutPage() {
  return (
    <MainLayout>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8, mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <NaturePeopleIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
            }}
          >
            About Nature Magazine
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mb: 4,
              fontFamily: 'Georgia, serif',
            }}
          >
            Exploring the wonders of our natural world through compelling stories, in-depth research, and stunning visuals.
          </Typography>
        </Box>

        {/* Mission Section */}
        <Grid container spacing={6} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: '100%',
                position: 'relative',
                minHeight: '400px',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(/images/nature-about.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  fontFamily: 'Georgia, serif',
                  position: 'relative',
                  display: 'inline-block',
                  mb: 3,
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '60px',
                    height: '4px',
                    backgroundColor: 'primary.main',
                  }
                }}
              >
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
                At Nature Magazine, we believe that understanding nature is the first step toward protecting it. Our mission is to inspire a deeper connection with the natural world by sharing its stories, complexities, and beauty.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Through rigorous reporting and compelling narratives, we aim to foster environmental awareness and encourage conservation efforts worldwide. We bring attention to both the wonders of nature and the challenges it faces.
              </Typography>
              
              <List sx={{ mt: 2 }}>
                {missionPoints.map((item, index) => (
                  <ListItem key={index} sx={{ p: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircleOutlineIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 8 }} />

        {/* Team Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
              mb: 6,
            }}
          >
            Meet Our Team
          </Typography>
          
          <Grid container spacing={4}>
            {teamMembers.map((member) => (
              <Grid item key={member.id} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    }
                  }}
                  elevation={2}
                >
                  <Box sx={{ p: 3, pb: 0 }}>
                    <Avatar
                      src={member.image}
                      alt={`${member.name} avatar`}
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.light',
                      }}
                    />
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 500 }}>
                      {member.role}
                    </Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* Story Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
              textAlign: 'center',
              mb: 5,
            }}
          >
            Our Story
          </Typography>
          
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Nature Magazine began in 2020 with a small team of environmental journalists and scientists who shared a passion for storytelling. We saw a need for engaging, science-based content that could bridge the gap between academic research and public understanding.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                What started as a digital-only publication has grown into a multi-platform resource for nature enthusiasts, educators, conservationists, and anyone curious about our planet's incredible biodiversity.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                Today, our team includes award-winning journalists, photographers, and scientists working together to bring you the most compelling stories from all corners of the natural world. We remain committed to accuracy, independence, and a deep respect for the subjects we cover.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  height: '400px',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 3,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/images/team-working.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Values Section */}
        <Box sx={{ mb: 8, mt: 10 }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
              mb: 6,
            }}
          >
            Our Values
          </Typography>
          
          <Grid container spacing={4}>
            {coreValues.map((value, index) => (
              <Grid item key={index} xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={2}>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, fontFamily: 'Georgia, serif' }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </MainLayout>
  );
}