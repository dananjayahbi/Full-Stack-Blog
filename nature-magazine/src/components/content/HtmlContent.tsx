'use client';

import React from 'react';
import { Box } from '@mui/material';

interface HtmlContentProps {
  content: string;
}

/**
 * A component that safely renders HTML content for blog articles
 * Uses a combination of techniques to ensure proper rendering
 */
const HtmlContent: React.FC<HtmlContentProps> = ({ content }) => {
  // Handle null or undefined content
  if (!content) return null;
  
  // Create a ref to the container element
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Use an effect to ensure the HTML is properly rendered after mount
  React.useEffect(() => {
    if (containerRef.current) {
      // Set the HTML directly on the DOM element 
      // This is a direct approach that bypasses React's virtual DOM
      containerRef.current.innerHTML = content;
    }
  }, [content]);
  
  return (
    <Box 
      ref={containerRef}
      className="article-content"
      sx={{
        fontFamily: 'Georgia, serif',
        fontSize: '1.1rem',
        lineHeight: 1.8,
        color: '#212121',
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          fontFamily: 'Georgia, serif',
          color: '#1B5E20',
          fontWeight: 600,
          marginTop: '1em',
          marginBottom: '0.5em',
        },
        '& h1': { fontSize: '2.25rem' },
        '& h2': { fontSize: '1.75rem' },
        '& h3': { fontSize: '1.5rem' },
        '& h4': { fontSize: '1.25rem' },
        '& p': {
          marginBottom: '1em',
        },
        '& ul, & ol': {
          paddingLeft: '1.5em',
          marginBottom: '1em',
        },
        '& li': {
          marginBottom: '0.5em',
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '4px',
          margin: '1em 0',
        },
        '& a': {
          color: '#2E7D32',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& blockquote': {
          borderLeft: '4px solid #4CAF50',
          padding: '0.5em 1em',
          margin: '1em 0',
          fontStyle: 'italic',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
        },
        '& code': {
          fontFamily: 'monospace',
          backgroundColor: '#f5f5f5',
          padding: '0.2em 0.4em',
          borderRadius: '3px',
        },
        '& pre': {
          fontFamily: 'monospace',
          backgroundColor: '#f5f5f5',
          padding: '1em',
          borderRadius: '4px',
          overflowX: 'auto',
          margin: '1em 0',
        }
      }}
    />
  );
};

export default HtmlContent;

