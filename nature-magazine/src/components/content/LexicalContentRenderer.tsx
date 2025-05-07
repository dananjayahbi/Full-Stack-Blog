'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface LexicalContentRendererProps {
  content: string;
}

/**
 * A specialized component to parse and render Lexical Editor JSON content
 */
const LexicalContentRenderer: React.FC<LexicalContentRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !content) return;
    
    try {
      // First, try to parse the content as JSON if it's a string
      let parsedContent = content;
      if (typeof content === 'string') {
        try {
          parsedContent = JSON.parse(content);
        } catch (e) {
          // If it fails to parse, use the original content
          console.log("Content is not valid JSON, using as is");
        }
      }

      // Convert the Lexical JSON structure to HTML
      const html = convertLexicalToHtml(parsedContent);
      
      // Set the resulting HTML to the container
      if (containerRef.current) {
        containerRef.current.innerHTML = html;
      }
    } catch (error) {
      console.error('Error rendering Lexical content:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = '<p>Error rendering content</p>';
      }
    }
  }, [content]);

  // This function converts Lexical JSON structure to HTML
  const convertLexicalToHtml = (content: any): string => {
    if (!content) return '';
    
    // Handle string content directly
    if (typeof content === 'string') {
      return content;
    }
    
    // If we have a root object from Lexical
    if (content.root) {
      return processLexicalNode(content.root);
    }
    
    return '';
  };

  // Process individual Lexical nodes recursively
  const processLexicalNode = (node: any): string => {
    if (!node) return '';
    
    // Handle different node types
    switch(node.type) {
      case 'paragraph':
        const paragraphContent = node.children?.map(processLexicalNode).join('') || '';
        return `<p>${paragraphContent}</p>`;
        
      case 'text':
        let textContent = node.text || '';
        
        // Apply formatting if available
        if (node.format === 1) textContent = `<strong>${textContent}</strong>`;
        if (node.format === 2) textContent = `<em>${textContent}</em>`;
        if (node.format === 4) textContent = `<u>${textContent}</u>`;
        if (node.format === 8) textContent = `<s>${textContent}</s>`;
        if (node.format === 16) textContent = `<code>${textContent}</code>`;
        
        return textContent;
        
      case 'heading':
        const headingLevel = node.tag || 'h1';
        const headingContent = node.children?.map(processLexicalNode).join('') || '';
        return `<${headingLevel}>${headingContent}</${headingLevel}>`;
        
      case 'list':
        const listTag = node.listType === 'bullet' ? 'ul' : 'ol';
        const listItems = node.children?.map(processLexicalNode).join('') || '';
        return `<${listTag}>${listItems}</${listTag}>`;
        
      case 'listitem':
        const listItemContent = node.children?.map(processLexicalNode).join('') || '';
        return `<li>${listItemContent}</li>`;
        
      case 'quote':
        const quoteContent = node.children?.map(processLexicalNode).join('') || '';
        return `<blockquote>${quoteContent}</blockquote>`;
        
      case 'image':
        return `<img src="${node.src}" alt="${node.altText || ''}" />`;
        
      case 'link':
        const linkContent = node.children?.map(processLexicalNode).join('') || '';
        return `<a href="${node.url}">${linkContent}</a>`;

      default:
        // For container nodes with children
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(processLexicalNode).join('');
        }
        return '';
    }
  };

  return (
    <Box 
      ref={containerRef}
      className="article-content"
      sx={{
        fontFamily: 'Georgia, serif',
        color: '#212121',
        lineHeight: 1.8,
        fontSize: '1.1rem',
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
        '& blockquote': {
          borderLeft: '4px solid #4CAF50',
          padding: '0.5em 1em',
          margin: '1em 0',
          fontStyle: 'italic',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
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
        }
      }}
    />
  );
};

export default LexicalContentRenderer;