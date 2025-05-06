'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress, FormHelperText } from '@mui/material';

// Dynamically import ReactQuill with no SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <Box 
      sx={{ 
        height: '400px', 
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <CircularProgress />
    </Box>
  ),
});

// Define props interface
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  hasError,
  error,
  helperText
}: RichTextEditorProps) {
  // Only run on client
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'blockquote', 'code-block',
    'link', 'image'
  ];
  
  if (!mounted) {
    return (
      <Box 
        sx={{ 
          height: '400px', 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        '.ql-container': { 
          height: '400px',
          fontSize: '1rem',
          border: (error || hasError) ? '1px solid #d32f2f' : undefined
        },
        '.ql-toolbar': {
          border: (error || hasError) ? '1px solid #d32f2f' : undefined,
          borderBottom: 'none'
        }
      }}>
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder={placeholder || "Write your article content here..."}
        />
      </Box>
      {helperText && (
        <FormHelperText error={!!error}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}