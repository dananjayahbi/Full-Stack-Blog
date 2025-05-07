'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface ArticleContentRendererProps {
  content: any;  // Accept any type of content
}

/**
 * A simplified component to render article content
 * Specifically optimized for Lexical Editor JSON format
 */
const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({ content }) => {
  // Function to extract and format content from Lexical JSON
  const renderContent = () => {
    try {
      // Handle different content types
      let data = content;
      
      // If content is a string that looks like JSON, try to parse it
      if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
        try {
          data = JSON.parse(content);
        } catch (e) {
          // If parsing fails, use original content
          console.error('Error parsing JSON content:', e);
        }
      }
      
      // Check if we have Lexical format (object with root and children)
      if (data && typeof data === 'object' && data.root && Array.isArray(data.root.children)) {
        return extractFromLexical(data);
      }
      
      // Fallback for plain text
      if (typeof content === 'string') {
        return <Typography paragraph>{content}</Typography>;
      }
      
      // Last resort fallback
      return <Typography paragraph>No content available</Typography>;
      
    } catch (error) {
      console.error('Error rendering content:', error);
      return <Typography paragraph color="error">Error displaying content</Typography>;
    }
  };
  
  // Extract formatted content from Lexical structure
  const extractFromLexical = (data: any) => {
    try {
      const nodes = data.root.children;
      
      return nodes.map((node: any, index: number) => {
        // Handle paragraph nodes
        if (node.type === 'paragraph') {
          const textContent = node.children
            ?.filter((child: any) => child.type === 'text')
            .map((child: any) => child.text || '')
            .join('');
            
          return (
            <Typography key={`p-${index}`} paragraph>
              {textContent}
            </Typography>
          );
        }
        
        // Handle heading nodes
        if (node.type === 'heading') {
          const headingText = node.children
            ?.filter((child: any) => child.type === 'text')
            .map((child: any) => child.text || '')
            .join('');
            
          const HeadingComponent = node.tag || 'h2';
          
          return (
            <Typography 
              key={`h-${index}`} 
              variant={node.tag === 'h1' ? 'h4' : node.tag === 'h2' ? 'h5' : 'h6'}
              component={HeadingComponent}
              gutterBottom
              sx={{ 
                color: 'primary.dark',
                fontWeight: 600,
                mt: index > 0 ? 3 : 0
              }}
            >
              {headingText}
            </Typography>
          );
        }
        
        // Fallback for unknown node types
        return null;
      });
    } catch (e) {
      console.error('Error extracting from Lexical:', e);
      return <Typography paragraph color="error">Error processing content</Typography>;
    }
  };

  return (
    <Box sx={{ 
      fontFamily: 'Georgia, serif',
      color: 'text.primary',
      lineHeight: 1.8,
    }}>
      {renderContent()}
    </Box>
  );
};

export default ArticleContentRenderer;