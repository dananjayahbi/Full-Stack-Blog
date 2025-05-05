'use client';

import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './navigation/Navbar';
import Footer from './navigation/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}