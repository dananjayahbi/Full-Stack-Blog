import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

// Define fonts
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Create a nature-inspired theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Forest green
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8D6E63', // Warm brown
      light: '#A1887F',
      dark: '#6D4C41',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#FFA000',
    },
    info: {
      main: '#0288D1',
    },
    success: {
      main: '#388E3C',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontFamily: 'Georgia, serif',
    },
    h2: {
      fontFamily: 'Georgia, serif',
    },
    h3: {
      fontFamily: 'Georgia, serif',
    },
    h4: {
      fontFamily: 'Georgia, serif',
    },
    h5: {
      fontFamily: 'Georgia, serif',
    },
    h6: {
      fontFamily: 'Georgia, serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});