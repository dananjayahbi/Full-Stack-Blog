'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import {
  ArticleOutlined as ArticleIcon,
  CategoryOutlined as CategoryIcon,
  CommentOutlined as CommentIcon,
  PersonOutline as PersonIcon,
  VisibilityOutlined as ViewIcon,
  AddCircleOutline as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import Link from 'next/link';

// Mock data for dashboard
const dashboardStats = {
  articles: 28,
  categories: 8,
  comments: 145,
  users: 3,
  views: 12580,
  trendsUp: 18.5,
  trendsDown: 4.2
};

// Mock data for recent articles
const recentArticles = [
  {
    id: '1',
    title: 'Secrets of the Deep Ocean: Exploring the Mariana Trench',
    date: '2025-04-28',
    author: 'James Rivera',
    status: 'published',
  },
  {
    id: '2',
    title: 'How the Amazon Rainforest Acts as Earth\'s Carbon Sink',
    date: '2025-04-22',
    author: 'Sofia Chen',
    status: 'published',
  },
  {
    id: '3',
    title: 'The Return of Wolves to Yellowstone: 30 Years Later',
    date: '2025-04-15',
    author: 'Marcus Johnson',
    status: 'draft',
  },
  {
    id: '4',
    title: 'Coral Reefs Face Unprecedented Threats from Climate Change',
    date: '2025-04-10',
    author: 'Emma Wilson',
    status: 'published',
  },
];

// Stat card component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 2,
      height: '100%',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Box
        sx={{
          backgroundColor: `${color}20`,
          borderRadius: '12px',
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon as React.ReactElement, { sx: { color: color, fontSize: 28 } })}
      </Box>
      {trend && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: trend.isUp ? 'success.main' : 'error.main',
            backgroundColor: trend.isUp ? 'success.light' : 'error.light',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            opacity: 0.8
          }}
        >
          {trend.isUp ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
          <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600 }}>
            {trend.value}%
          </Typography>
        </Box>
      )}
    </Box>
    <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Paper>
);

export default function AdminDashboard() {
  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Box>
          <Button 
            component={Link} 
            href="/admin/dashboard/articles/new" 
            variant="contained"
            startIcon={<AddIcon />}
          >
            New Article
          </Button>
        </Box>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Articles"
            value={dashboardStats.articles}
            icon={<ArticleIcon />}
            color="#2E7D32"
            trend={{ value: dashboardStats.trendsUp, isUp: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Categories"
            value={dashboardStats.categories}
            icon={<CategoryIcon />}
            color="#1976D2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Comments"
            value={dashboardStats.comments}
            icon={<CommentIcon />}
            color="#FFA000"
            trend={{ value: dashboardStats.trendsUp, isUp: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Users"
            value={dashboardStats.users}
            icon={<PersonIcon />}
            color="#7B1FA2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Views"
            value={dashboardStats.views.toLocaleString()}
            icon={<ViewIcon />}
            color="#D32F2F"
            trend={{ value: dashboardStats.trendsDown, isUp: false }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Articles */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Articles
              </Typography>
              <Button 
                component={Link}
                href="/admin/dashboard/articles"
                endIcon={<ArrowForwardIcon />}
                size="small"
              >
                View All
              </Button>
            </Box>
            <List>
              {recentArticles.map((article, index) => (
                <React.Fragment key={article.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          component={Link}
                          href={`/admin/dashboard/articles/${article.id}/edit`}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    sx={{ px: 0 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Link 
                            href={`/admin/dashboard/articles/${article.id}/edit`}
                            style={{ 
                              textDecoration: 'none',
                              color: 'inherit',
                              fontWeight: 500
                            }}
                          >
                            {article.title}
                          </Link>
                          <Chip 
                            label={article.status} 
                            size="small"
                            color={article.status === 'published' ? 'success' : 'default'}
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(article.date)} by {article.author}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < recentArticles.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/admin/dashboard/articles/new"
                startIcon={<ArticleIcon />}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Create New Article
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/admin/dashboard/categories/new"
                startIcon={<CategoryIcon />}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Add New Category
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/admin/dashboard/media"
                startIcon={<ViewIcon />}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Upload Media
              </Button>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                href="/admin/dashboard/comments"
                startIcon={<CommentIcon />}
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Moderate Comments
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}