'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface ArticleContentRendererProps {
  content: any;  // Accept any type of content
}

/**
 * A component to render article content from Lexical Editor JSON format
 * Supports formatted text including bold, italic, underline, etc.
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
  
  // Render formatted text for child nodes with format properties
  const renderFormattedText = (node: any) => {
    // If it's a plain text node with no formatting
    if (!node.format && node.text) {
      return node.text;
    }
    
    let formattedText = node.text || '';
    let element = <>{formattedText}</>;
    
    // Apply styles based on format flags
    if (node.format) {
      // Bold formatting (1)
      if (node.format & 1) {
        element = <strong>{element}</strong>;
      }
      
      // Italic formatting (2)
      if (node.format & 2) {
        element = <em>{element}</em>;
      }
      
      // Underline formatting (4)
      if (node.format & 4) {
        element = <u>{element}</u>;
      }
      
      // Strikethrough formatting (8)
      if (node.format & 8) {
        element = <s>{element}</s>;
      }
      
      // Subscript formatting (16)
      if (node.format & 16) {
        element = <sub>{element}</sub>;
      }
      
      // Superscript formatting (32)
      if (node.format & 32) {
        element = <sup>{element}</sup>;
      }
      
      // Code formatting (64)
      if (node.format & 64) {
        element = <code style={{ backgroundColor: '#f0f0f0', padding: '0.2rem', borderRadius: '3px', fontFamily: 'monospace' }}>{element}</code>;
      }
      
      // Highlight formatting (128)
      if (node.format & 128) {
        element = <mark>{element}</mark>;
      }
    }
    
    return element;
  };
  
  // Extract and render links
  const renderLink = (node: any) => {
    // Extract URL from node
    const url = node.url || '#';
    
    // Get text from children if available
    const linkText = node.children
      ?.filter((child: any) => child.type === 'text')
      .map((child: any, i: number) => <React.Fragment key={i}>{renderFormattedText(child)}</React.Fragment>);
      
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#2e7d32', textDecoration: 'underline' }}>
        {linkText}
      </a>
    );
  };
  
  // Extract text content for a node and its children
  const extractTextContent = (node: any) => {
    if (!node.children || node.children.length === 0) {
      return renderFormattedText(node);
    }
    
    return node.children.map((child: any, i: number) => {
      if (child.type === 'text') {
        return <React.Fragment key={i}>{renderFormattedText(child)}</React.Fragment>;
      } else if (child.type === 'link') {
        return <React.Fragment key={i}>{renderLink(child)}</React.Fragment>;
      }
      return null;
    });
  };
  
  // Extract formatted content from Lexical structure
  const extractFromLexical = (data: any) => {
    try {
      const nodes = data.root.children;
      
      return nodes.map((node: any, index: number) => {
        // Handle paragraph nodes
        if (node.type === 'paragraph') {
          // If paragraph has no content, return an empty paragraph for spacing
          if (!node.children || node.children.length === 0) {
            return <Typography key={`p-empty-${index}`} paragraph>&nbsp;</Typography>;
          }
          
          return (
            <Typography key={`p-${index}`} paragraph sx={{ lineHeight: 1.8 }}>
              {extractTextContent(node)}
            </Typography>
          );
        }
        
        // Handle heading nodes
        if (node.type === 'heading') {
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
              {extractTextContent(node)}
            </Typography>
          );
        }
        
        // Handle list nodes
        if (node.type === 'list') {
          const ListComponent = node.listType === 'bullet' ? 'ul' : 'ol';
          
          return (
            <Box component={ListComponent} key={`list-${index}`} sx={{ pl: 2, mb: 2 }}>
              {node.children?.map((item: any, itemIndex: number) => (
                <li key={`list-item-${index}-${itemIndex}`}>
                  <Typography component="span" sx={{ fontSize: '1rem' }}>
                    {extractTextContent(item)}
                  </Typography>
                </li>
              ))}
            </Box>
          );
        }
        
        // Handle quote blocks
        if (node.type === 'quote') {
          return (
            <Box 
              key={`quote-${index}`} 
              sx={{ 
                borderLeft: '4px solid',
                borderColor: 'primary.light',
                pl: 2,
                py: 1,
                my: 2,
                bgcolor: 'rgba(46, 125, 50, 0.05)',
                fontStyle: 'italic'
              }}
            >
              {node.children?.map((quoteChild: any, quoteIndex: number) => (
                <Typography key={`quote-p-${index}-${quoteIndex}`} paragraph sx={{ mb: 1 }}>
                  {extractTextContent(quoteChild)}
                </Typography>
              ))}
            </Box>
          );
        }
        
        // Handle code blocks 
        if (node.type === 'code') {
          const codeContent = node.children?.[0]?.children?.[0]?.text || '';
          
          return (
            <Box 
              component="pre" 
              key={`code-${index}`} 
              sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: '4px',
                overflow: 'auto',
                mb: 2,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <code>{codeContent}</code>
            </Box>
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