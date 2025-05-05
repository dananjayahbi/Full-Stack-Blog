import MainLayout from '@/components/MainLayout';
import { Typography, Box, Chip, Avatar, Grid, Card, CardContent, CardMedia, Divider, Button } from '@mui/material';
import Image from 'next/image';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

// Mock articles data - in a real app, this would come from a database
const articlesData = {
  'majestic-redwood-forests': {
    title: 'The Majestic Redwood Forests: A Living Link to Ancient Times',
    excerpt: 'Explore the breathtaking beauty and ecological importance of California\'s redwood forests, home to some of the oldest living organisms on Earth.',
    image: '/images/redwoods.jpg',
    category: 'Forests',
    author: {
      name: 'Emma Wilson',
      avatar: '/images/avatars/emma.jpg',
      bio: 'Emma is a conservation biologist specializing in forest ecosystems. She has been studying redwood forests for over 15 years.'
    },
    date: 'May 2, 2025',
    readingTime: '8 min read',
    content: `
      <p>Standing beneath the towering canopy of a redwood forest is an experience that defies description. These ancient giants, some older than human civilization itself, create an atmosphere of hushed reverence. The filtered sunlight, the soft carpet of needles underfoot, and the sense of timelessness combine to make these forests among Earth's most magical places.</p>

      <h2>Living Monuments of Time</h2>
      
      <p>California's coast redwoods (<em>Sequoia sempervirens</em>) are the tallest trees on Earth, reaching heights of over 350 feet—taller than a 30-story building. Their inland cousins, the giant sequoias (<em>Sequoiadendron giganteum</em>), while not quite as tall, are the largest trees by volume, with some individuals containing enough wood to build dozens of homes.</p>
      
      <p>What's truly remarkable about these trees is their longevity. Many of the redwoods standing today were already ancient when Christopher Columbus sailed to America. The oldest known coast redwood is estimated to be about 2,200 years old, while some giant sequoias have lived for more than 3,000 years.</p>

      <h2>Ecological Importance</h2>
      
      <p>Redwood forests are more than just collections of impressive trees; they're complex ecosystems that provide habitat for countless species. The forest canopy, which can reach 300 feet above the ground, creates its own microclimate. This environment supports unique communities of plants and animals that have adapted to life high above the forest floor.</p>
      
      <p>These forests are also champions at carbon sequestration. A single mature redwood can store more carbon than any other tree on Earth—up to 250 tons per tree. This makes redwood forests crucial allies in our fight against climate change.</p>

      <h2>Conservation Challenges</h2>
      
      <p>Despite their imposing size and apparent indestructibility, redwood forests are vulnerable. Of the original old-growth redwood forest that once covered more than 2 million acres of California's coast, less than 5% remains today. Logging, development, and climate change all pose threats to these ancient ecosystems.</p>
      
      <p>Fortunately, conservation efforts are making a difference. Organizations like Save the Redwoods League and the Sempervirens Fund have been working for decades to protect these forests. Through land purchases, restoration projects, and public education, they're ensuring that future generations will still have the opportunity to stand in awe beneath these living monuments.</p>

      <h2>Experiencing the Redwoods</h2>
      
      <p>For those lucky enough to visit a redwood forest, the experience can be transformative. Whether you're walking through the fog-shrouded groves of Redwood National and State Parks in northern California or marveling at the massive trunks of giant sequoias in Sequoia National Park, these forests offer a profound connection to the natural world and its rhythms.</p>
      
      <p>As visitors step into these ancient groves, they're not just witnessing beautiful scenery—they're entering a living link to Earth's distant past. In a world that moves at an ever-accelerating pace, redwood forests remind us of nature's patience and persistence. They invite us to slow down, look up, and consider our place in the grand timeline of life on Earth.</p>
    `,
    tags: ['Forests', 'Conservation', 'California', 'Ecology', 'Ancient Trees'],
    relatedArticles: [
      {
        id: '6',
        title: 'The Silent Communication of Trees',
        excerpt: 'New research reveals how trees communicate and share resources through vast underground networks.',
        image: '/images/trees.jpg',
        slug: 'silent-communication-trees',
        category: 'Forests',
        author: 'David Chen',
        date: 'April 25, 2025',
      },
      {
        id: '10',
        title: 'Mushroom Networks: The Unseen Web Beneath Our Feet',
        excerpt: 'How fungal networks help forests thrive through nutrient sharing and communication systems.',
        image: '/images/mushrooms.jpg',
        slug: 'mushroom-networks',
        category: 'Forests',
        author: 'Michael Zhang',
        date: 'March 30, 2025',
      },
      {
        id: '4',
        title: 'Climate Adaptation: How Plants Survive in Changing Conditions',
        excerpt: 'Research shows remarkable resilience in plant species adapting to climate shifts.',
        image: '/images/plants.jpg',
        slug: 'climate-adaptation-plants',
        category: 'Botany',
        author: 'Marcus Johnson',
        date: 'May 1, 2025',
      }
    ]
  },
  'ocean-depths-new-species': {
    title: 'Ocean Depths: Discovering New Marine Species',
    excerpt: 'Scientists have discovered over 30 new marine species in deep-sea explorations last year. What does this tell us about our vast, unexplored oceans?',
    image: '/images/ocean.jpg',
    category: 'Marine Life',
    author: {
      name: 'James Rivera',
      avatar: '/images/avatars/james.jpg',
      bio: 'James is a marine biologist and oceanographer with a passion for deep-sea exploration and conservation.'
    },
    date: 'April 15, 2025',
    readingTime: '6 min read',
    content: `
      <p>The ocean covers more than 70% of our planet, yet scientists estimate that less than 20% of its depths have been explored and mapped. Every deep-sea expedition brings new discoveries, reinforcing just how little we know about the vast realms beneath the waves.</p>

      <h2>Recent Discoveries</h2>
      
      <p>Last year alone, researchers documented over 30 previously unknown marine species during a series of deep-sea expeditions. These creatures range from tiny crustaceans to bizarre deep-sea fish with extraordinary adaptations for survival in one of Earth's most extreme environments.</p>
      
      <p>Among the most fascinating discoveries was a species of anglerfish found at depths exceeding 3,000 meters. Unlike previously known anglerfish, this new species possesses bioluminescent patches along its entire body, not just at the tip of its characteristic lure. Researchers believe these additional light organs may serve both to attract prey and to communicate with potential mates in the perpetual darkness of the deep ocean.</p>

      <h2>Challenges of Deep-Sea Exploration</h2>
      
      <p>Exploring the ocean depths presents unique challenges. Crushing pressure, near-freezing temperatures, and total darkness create an environment hostile to both human divers and much of our technology. Modern deep-sea exploration relies on specialized equipment including remotely operated vehicles (ROVs), autonomous underwater vehicles (AUVs), and specially designed submersibles.</p>
      
      <p>Despite technological advances, deep-sea research remains expensive and logistically complex. A single expedition can cost millions of dollars and requires teams of scientists, engineers, and support staff working around the clock.</p>

      <h2>Why Deep-Sea Exploration Matters</h2>
      
      <p>Beyond satisfying our innate curiosity about the natural world, deep-sea exploration has practical importance. The unique adaptations of deep-sea organisms have inspired advances in medicine, materials science, and biotechnology. For example, enzymes from deep-sea bacteria that thrive near hydrothermal vents are now used in DNA testing and industrial processes because they remain stable at high temperatures.</p>
      
      <p>Deep-sea exploration also helps us understand the ocean's role in regulating climate and provides insights into the potential impacts of human activities such as deep-sea mining and bottom trawling.</p>

      <h2>The Future of Ocean Discovery</h2>
      
      <p>As technology improves and becomes more accessible, the pace of deep-sea discovery is likely to accelerate. New generation ROVs can dive deeper, stay underwater longer, and carry more sophisticated scientific instruments than their predecessors.</p>
      
      <p>Initiatives like the Nippon Foundation-GEBCO Seabed 2030 Project aim to map the entire ocean floor by the end of this decade. Such comprehensive mapping will provide a foundation for more targeted exploration and help identify priority areas for conservation.</p>
      
      <p>Each new species discovered in the ocean depths reminds us of how much remains to be learned about our blue planet. These discoveries not only expand our scientific knowledge but also reinforce the importance of protecting these largely unseen ecosystems before they're altered by human activity—potentially before we even know what we're losing.</p>
    `,
    tags: ['Marine Life', 'Ocean', 'Discovery', 'Science', 'Exploration'],
    relatedArticles: [
      {
        id: '7',
        title: 'Coral Reef Restoration: Progress and Challenges',
        excerpt: 'Examining innovative approaches to rebuilding damaged coral reefs around the world.',
        image: '/images/coral.jpg',
        slug: 'coral-reef-restoration',
        category: 'Marine Conservation',
        author: 'Nadia Santos',
        date: 'April 20, 2025',
      },
      {
        id: '11',
        title: 'River Ecosystems: The Flowing Lifelines of Our Planet',
        excerpt: 'The critical role rivers play in biodiversity, human civilization, and environmental health.',
        image: '/images/river.jpg',
        slug: 'river-ecosystems',
        category: 'Freshwater',
        author: 'Sarah Thompson',
        date: 'March 25, 2025',
      },
      {
        id: '12',
        title: 'Arctic Transformation: Monitoring Climate Change at the Poles',
        excerpt: 'Scientists document rapid changes in Arctic ecosystems and what they mean for global climate patterns.',
        image: '/images/arctic.jpg',
        slug: 'arctic-transformation',
        category: 'Climate',
        author: 'Anders Nielsen',
        date: 'March 18, 2025',
      }
    ]
  },
};

// This is a dynamic route page component that receives params from the URL
export default function ArticlePage({ params }: { params: { slug: string } }) {
  // In a real app, we would fetch the article data from a database
  // based on the slug parameter
  const article = articlesData[params.slug];

  // If article doesn't exist, this would typically redirect to 404
  // but for simplicity we're just showing a message
  if (!article) {
    return (
      <MainLayout>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Article Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The article you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            component={Link}
            href="/articles"
            variant="contained" 
            startIcon={<ArrowBackIcon />}
          >
            Back to Articles
          </Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Article Header */}
      <Box sx={{ mb: 6 }}>
        <Button 
          component={Link}
          href="/articles" 
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Articles
        </Button>

        <Chip 
          label={article.category} 
          color="primary" 
          size="small"
          sx={{ mb: 2 }}
        />

        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            mb: 3,
          }}
        >
          {article.title}
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {article.author.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {article.date}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {article.readingTime}
          </Typography>
        </Box>

        {/* Featured Image */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: '300px', md: '500px' },
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 6,
          }}
        >
          {/* This would normally be an Image component but we're using a div for simplicity */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${article.image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
        </Box>
      </Box>

      {/* Article Content */}
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box 
            sx={{ 
              typography: 'body1',
              '& h2': {
                mt: 4,
                mb: 2,
                fontFamily: 'Georgia, serif',
                fontWeight: 600,
              },
              '& p': {
                mb: 2,
                lineHeight: 1.8,
              },
              '& em': {
                fontStyle: 'italic',
              },
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Tags */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {article.tags.map((tag) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  clickable
                />
              ))}
            </Box>
          </Box>

          {/* Share Icons */}
          <Box sx={{ mt: 4, mb: 6 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Share:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" size="small" startIcon={<FacebookIcon />}>
                Facebook
              </Button>
              <Button variant="outlined" size="small" startIcon={<TwitterIcon />}>
                Twitter
              </Button>
              <Button variant="outlined" size="small" startIcon={<LinkedInIcon />}>
                LinkedIn
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 6 }} />

          {/* Author Box */}
          <Box 
            sx={{ 
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              mb: 6,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={article.author.avatar} 
                sx={{ 
                  width: 64,
                  height: 64,
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {article.author.name}
                </Typography>
                <Typography variant="body2" color="primary">
                  Author
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">
              {article.author.bio}
            </Typography>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              position: 'sticky',
              top: 24,
              bgcolor: 'background.paper',
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                fontFamily: 'Georgia, serif',
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              Related Articles
            </Typography>
            <Box sx={{ mt: 2 }}>
              {article.relatedArticles.map((relatedArticle) => (
                <Box key={relatedArticle.id} sx={{ mb: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 60,
                        borderRadius: 1,
                        overflow: 'hidden',
                        flexShrink: 0,
                        backgroundImage: `url(${relatedArticle.image})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        component="a" 
                        href={`/articles/${relatedArticle.slug}`}
                        sx={{ 
                          fontWeight: 600,
                          display: 'block',
                          mb: 0.5,
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            color: 'primary.main',
                          }
                        }}
                      >
                        {relatedArticle.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {relatedArticle.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            <Button 
              component={Link}
              href="/articles" 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 2 }}
            >
              View All Articles
            </Button>
          </Box>
        </Grid>
      </Grid>
    </MainLayout>
  );
}