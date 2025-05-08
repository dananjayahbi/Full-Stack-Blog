'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface SimpleArticleContentProps {
  content: string;
}

/**
 * A simplified component to render article content that handles both raw HTML and Lexical JSON
 */
const SimpleArticleContent: React.FC<SimpleArticleContentProps> = ({ content }) => {
  // Prepare the content for rendering
  const prepareContent = () => {
    if (!content) return '<p>No content available</p>';
    
    try {
      // Try to parse as JSON first
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
        
        // Check if it's a Lexical format with root and children
        if (parsedContent && parsedContent.root && parsedContent.root.children) {
          // Extract plain text from the Lexical structure
          return extractTextFromLexical(parsedContent);
        }
      } catch (e) {
        // Not JSON, continue with content as-is
      }
      
      // If content looks like HTML, return it directly
      if (content.includes('<p>') || content.includes('<h1>') || content.includes('<div>')) {
        return content;
      }
      
      // Just plain text, wrap in paragraph tags
      return `<p>${content}</p>`;
    } catch (e) {
      console.error('Error preparing content:', e);
      return '<p>Error displaying content</p>';
    }
  };
  
  // Extract plain text from Lexical JSON structure
  const extractTextFromLexical = (lexicalJson: any): string => {
    try {
      let result = '';
      const rootChildren = lexicalJson.root.children;
      
      if (!rootChildren || !Array.isArray(rootChildren)) {
        return '<p>Invalid content format</p>';
      }
      
      // Process each top-level node
      rootChildren.forEach(node => {
        if (node.type === 'paragraph') {
          // For paragraphs, extract text from children
          let paragraphText = '';
          if (node.children && Array.isArray(node.children)) {
            node.children.forEach((textNode: any) => {
              if (textNode.type === 'text') {
                // Apply basic formatting if available
                let text = textNode.text || '';
                if (textNode.format === 1) text = `<strong>${text}</strong>`;
                if (textNode.format === 2) text = `<em>${text}</em>`;
                paragraphText += text;
              }
            });
          }
          result += `<p>${paragraphText}</p>`;
        } else if (node.type === 'heading') {
          // For headings
          let headingText = '';
          const tag = node.tag || 'h2';
          if (node.children && Array.isArray(node.children)) {
            node.children.forEach((textNode: any) => {
              if (textNode.type === 'text') {
                headingText += textNode.text || '';
              }
            });
          }
          result += `<${tag}>${headingText}</${tag}>`;
        }
      });
      
      return result || '<p>No content found</p>';
    } catch (e) {
      console.error('Error extracting text from Lexical:', e);
      return '<p>Error processing content</p>';
    }
  };
  
  // Prepare the sanitized content
  const sanitizedContent = prepareContent();
  
  return (
    <Box className="article-content">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </Box>
  );
};

export default SimpleArticleContent;