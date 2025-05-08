'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';

interface DirectContentRendererProps {
  content: any;  // Accept any type of content
}

/**
 * Emergency fallback component for article content rendering
 * Uses multiple approaches to ensure something always displays
 */
const DirectContentRenderer: React.FC<DirectContentRendererProps> = ({ content }) => {
  const [renderedContent, setRenderedContent] = useState<string>("Loading content...");
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    try {
      console.log("Content type:", typeof content);
      console.log("Content raw:", content);
      
      // Start with an empty string
      let displayContent = "";
      
      // APPROACH 1: If content is a string that looks like JSON, try to parse it
      if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
        try {
          const parsedContent = JSON.parse(content);
          console.log("Parsed JSON:", parsedContent);
          
          // If it has a root object with children (Lexical format)
          if (parsedContent.root && parsedContent.root.children) {
            displayContent = extractTextFromLexical(parsedContent);
          }
        } catch (e) {
          console.error("JSON parse error:", e);
          // If JSON parsing fails, fall through to other approaches
        }
      }
      
      // APPROACH 2: If content is already an object with a root (pre-parsed Lexical)
      if (!displayContent && typeof content === 'object' && content?.root?.children) {
        displayContent = extractTextFromLexical(content);
      }
      
      // APPROACH 3: Direct string rendering for HTML content
      if (!displayContent && typeof content === 'string' && 
          (content.includes('<p>') || content.includes('<div>') || content.includes('<h'))) {
        displayContent = content;
      }
      
      // APPROACH 4: Raw string for plain text
      if (!displayContent && typeof content === 'string') {
        displayContent = `<p>${content}</p>`;
      }
      
      // APPROACH 5: If it's an object but not in a format we recognize, convert to string
      if (!displayContent && typeof content === 'object') {
        try {
          displayContent = `<pre>${JSON.stringify(content, null, 2)}</pre>`;
        } catch (e) {
          console.error("JSON stringify error:", e);
        }
      }
      
      // APPROACH 6: Ultimate fallback
      if (!displayContent) {
        displayContent = "<p>Unable to display content. Please try again later.</p>";
      }
      
      // Set the content
      setRenderedContent(displayContent);
      
    } catch (err) {
      console.error("Content rendering error:", err);
      setError(true);
    }
  }, [content]);
  
  // Extract text from Lexical format - extremely simplified version
  const extractTextFromLexical = (data: any): string => {
    try {
      let html = '';
      
      // Get the children array
      const children = data.root.children;
      if (!Array.isArray(children)) {
        return '<p>Invalid content structure</p>';
      }
      
      // Process each node to extract text
      children.forEach(node => {
        if (node.type === 'paragraph') {
          // Extract text from paragraph children
          let paragraphText = '';
          
          if (Array.isArray(node.children)) {
            node.children.forEach(textNode => {
              if (textNode.type === 'text') {
                paragraphText += textNode.text || '';
              }
            });
          }
          
          html += `<p>${paragraphText}</p>`;
        } 
        else if (node.type === 'heading') {
          // Extract text from heading
          let headingText = '';
          const tag = node.tag || 'h2';
          
          if (Array.isArray(node.children)) {
            node.children.forEach(textNode => {
              if (textNode.type === 'text') {
                headingText += textNode.text || '';
              }
            });
          }
          
          html += `<${tag}>${headingText}</${tag}>`;
        }
      });
      
      if (!html) {
        // Direct text extraction fallback
        html = '<p>' + JSON.stringify(data)
          .replace(/[{},"]/g, ' ')
          .replace(/root|children|type|text|paragraph/g, ' ')
          .replace(/\s+/g, ' ')
          .trim() + '</p>';
      }
      
      return html;
    } catch (e) {
      console.error("Error extracting text from Lexical:", e);
      return '<p>Error extracting content</p>';
    }
  };
  
  // If there was an error rendering the content
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        There was an error rendering the article content
      </Alert>
    );
  }
  
  return (
    <Box className="article-content" sx={{ 
      fontFamily: 'Georgia, serif',
      color: '#212121',
      lineHeight: 1.8,
      '& p': { mb: 2 },
      '& h1, h2, h3, h4, h5, h6': { 
        mb: 2, 
        mt: 3, 
        fontWeight: 600,
        color: '#1B5E20',
      }
    }}>
      {/* Render the HTML content */}
      <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
      
      {/* Fallback in case dangerouslySetInnerHTML doesn't render */}
      {!renderedContent && (
        <Typography>
          {typeof content === 'string' ? content : 'No content available'}
        </Typography>
      )}
    </Box>
  );
};

export default DirectContentRenderer;