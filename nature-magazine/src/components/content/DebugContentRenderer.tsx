'use client';

import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

interface DebugContentRendererProps {
  content: any;
}

/**
 * A diagnostic component that attempts to display content in multiple ways
 * to help troubleshoot rendering issues
 */
const DebugContentRenderer: React.FC<DebugContentRendererProps> = ({ content }) => {
  // Convert any content to a string representation for display
  const stringifyContent = (content: any): string => {
    if (typeof content === 'undefined') return 'undefined';
    if (content === null) return 'null';
    if (typeof content === 'string') return content;
    try {
      return JSON.stringify(content, null, 2);
    } catch (e) {
      return 'Error converting to string: ' + e;
    }
  };

  // Extract plain text from a potential Lexical object
  const extractPlainText = (content: any): string => {
    try {
      // Try to parse if it's a string
      let data = content;
      if (typeof content === 'string') {
        try {
          data = JSON.parse(content);
        } catch (e) {
          // Not JSON, use as is
        }
      }

      // Handle Lexical format
      if (data && data.root && Array.isArray(data.root.children)) {
        return data.root.children
          .map((node: any) => {
            if (node.children && Array.isArray(node.children)) {
              return node.children
                .filter((child: any) => child.type === 'text')
                .map((child: any) => child.text || '')
                .join(' ');
            }
            return '';
          })
          .filter(Boolean)
          .join('\n');
      }

      return typeof data === 'string' ? data : JSON.stringify(data);
    } catch (e) {
      console.error('Error extracting plain text:', e);
      return 'Error extracting text';
    }
  };

  // Different methods to try displaying
  const rawContent = stringifyContent(content);
  const parsedContent = typeof content === 'string' 
    ? stringifyContent(JSON.parse(content)) 
    : 'Not a string';
  const plainText = extractPlainText(content);

  // Type information for debugging
  const contentType = typeof content;
  const contentIsNull = content === null;
  const contentIsEmpty = 
    (contentType === 'string' && content.trim() === '') || 
    (contentType === 'object' && !contentIsNull && Object.keys(content).length === 0);

  return (
    <Box sx={{ fontFamily: 'monospace' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Content Diagnostics
        </Typography>
        
        <Typography variant="body2">
          Content type: <strong>{contentType}</strong>
        </Typography>
        
        <Typography variant="body2">
          Content is null: <strong>{contentIsNull ? 'Yes' : 'No'}</strong>
        </Typography>
        
        <Typography variant="body2">
          Content is empty: <strong>{contentIsEmpty ? 'Yes' : 'No'}</strong>
        </Typography>
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Method 1: Plain Text Extraction
      </Typography>
      <Paper 
        variant="outlined"
        sx={{ 
          p: 2, 
          mb: 3,
          fontFamily: 'Georgia, serif',
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#212121',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          bgcolor: '#fff'
        }}
      >
        {plainText || 'No plain text content found'}
      </Paper>

      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Method 2: Direct Content (toString)
      </Typography>
      <Paper 
        variant="outlined"
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: '#fff', 
          overflow: 'auto',
          maxHeight: '200px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: String(content) }} />
      </Paper>

      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Method 3: JSON.stringify Result
      </Typography>
      <Paper 
        variant="outlined"
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: '#fff', 
          overflow: 'auto',
          maxHeight: '200px',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      >
        {rawContent}
      </Paper>

      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        Method 4: Raw HTML if Content is String
      </Typography>
      <Paper 
        variant="outlined"
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: '#fff',
          fontFamily: 'Georgia, serif',
          fontSize: '1rem',
          lineHeight: 1.6, 
          '& > *': { mb: 1 }
        }}
      >
        {typeof content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <Typography variant="body2" fontStyle="italic">
            Content is not a string
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DebugContentRenderer;