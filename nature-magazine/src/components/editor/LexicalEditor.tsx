'use client';

import { useEffect, useState, forwardRef, useRef } from 'react';
import { FormHelperText } from '@mui/material';
import { css } from '@emotion/css';

// Lexical imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ImageNode } from './nodes/ImageNode';
import { ImagePlugin } from './plugins/ImagePlugin';

// Custom plugins
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';

// Define the editor theme
const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  image: 'editor-image',
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
};

// Define node types
const editorConfig = {
  namespace: 'nature-magazine-editor',
  theme,
  onError: (error: Error) => {
    console.error('Lexical editor error:', error);
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    HorizontalRuleNode,
    ImageNode,
  ],
};

// Editor styles
const editorStyles = css`
  position: relative;
  border-radius: 4px;
  line-height: 1.5;
  font-size: 16px;
  
  .editor-container {
    position: relative;
    border-radius: 3px;
    background-color: #fff;
    min-height: 400px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    
    .editor-inner {
      flex-grow: 1;
      position: relative;
      background: #fff;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 15px;
      border: 1px solid #ddd;
      border-top: 0;
      
      .editor-input {
        min-height: 400px;
        padding-top: 10px;
        resize: none;
        font-size: 16px;
        position: relative;
        tab-size: 1;
        outline: 0;
        caret-color: #444;
      }
    }
  }
  
  .editor-placeholder {
    color: #999;
    overflow: hidden;
    position: absolute;
    top: 15px;
    left: 15px;
    user-select: none;
    pointer-events: none;
  }
  
  .editor-paragraph {
    margin: 0 0 15px 0;
    position: relative;
  }
  
  .editor-text-bold {
    font-weight: bold;
  }
  
  .editor-text-italic {
    font-style: italic;
  }
  
  .editor-text-underline {
    text-decoration: underline;
  }
  
  .editor-text-strikethrough {
    text-decoration: line-through;
  }
  
  .editor-text-underlineStrikethrough {
    text-decoration: underline line-through;
  }
  
  .editor-text-code {
    background-color: rgb(240, 242, 245);
    padding: 1px 0.25rem;
    font-family: Menlo, Consolas, Monaco, monospace;
    font-size: 94%;
  }
  
  .editor-link {
    color: rgb(33, 111, 219);
    text-decoration: none;
  }
  
  .editor-code {
    background-color: rgb(240, 242, 245);
    font-family: Menlo, Consolas, Monaco, monospace;
    display: block;
    padding: 8px 8px 8px 52px;
    line-height: 1.53;
    font-size: 13px;
    margin: 0;
    margin-bottom: 8px;
    tab-size: 2;
    overflow-x: auto;
    position: relative;
  }
  
  .editor-code:before {
    content: attr(data-gutter);
    position: absolute;
    background-color: #eee;
    left: 0;
    top: 0;
    padding: 8px;
    color: #777;
    white-space: pre-wrap;
    text-align: right;
    min-width: 25px;
    height: 100%;
    box-sizing: border-box;
  }
  
  .editor-heading-h1 {
    font-size: 24px;
    color: rgb(5, 5, 5);
    font-weight: 700;
    margin: 0 0 16px 0;
  }
  
  .editor-heading-h2 {
    font-size: 20px;
    color: rgb(5, 5, 5);
    font-weight: 700;
    margin: 24px 0 10px 0;
  }
  
  .editor-heading-h3 {
    font-size: 18px;
    color: rgb(5, 5, 5);
    font-weight: 700;
    margin: 22px 0 10px 0;
  }
  
  .editor-heading-h4 {
    font-size: 16px;
    color: rgb(5, 5, 5);
    font-weight: 700;
    margin: 20px 0 10px 0;
  }
  
  .editor-heading-h5 {
    font-size: 14px;
    color: rgb(5, 5, 5);
    font-weight: 700;
    margin: 18px 0 10px 0;
  }
  
  .editor-heading-h6 {
    font-size: 12px;
    color: rgb(5, 5, 5);
    font-weight: 700;
    margin: 16px 0 10px 0;
  }
  
  .editor-quote {
    margin: 0 0 16px 0;
    color: rgb(101, 103, 107);
    border-left: 4px solid rgb(206, 208, 212);
    padding-left: 16px;
  }
  
  .editor-list-ol {
    padding: 0;
    margin: 0 0 16px 16px;
  }
  
  .editor-list-ul {
    padding: 0;
    margin: 0 0 16px 16px;
  }
  
  .editor-listitem {
    margin: 8px 32px;
  }
  
  .editor-nested-listitem {
    list-style-type: none;
  }
  
  .editor-image {
    max-width: 100%;
    cursor: default;
    display: inline-block;
    position: relative;
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    &.align-left {
      float: left;
      margin-right: 16px;
    }
    
    &.align-center {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    
    &.align-right {
      float: right;
      margin-left: 16px;
    }
  }
  
  .editor-error-boundary {
    background-color: rgb(255, 235, 235);
    border: 1px solid red;
    border-radius: 3px;
    color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    margin: 10px 0;
  }
  
  // Tokens for code highlighting
  .editor-tokenComment {
    color: slategray;
  }
  
  .editor-tokenPunctuation {
    color: #999;
  }
  
  .editor-tokenProperty {
    color: #905;
  }
  
  .editor-tokenSelector {
    color: #690;
  }
  
  .editor-tokenOperator {
    color: #9a6e3a;
  }
  
  .editor-tokenAttr {
    color: #07a;
  }
  
  .editor-tokenVariable {
    color: #e90;
  }
  
  .editor-tokenFunction {
    color: #dd4a68;
  }
`;

// Define props interface
interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
}

export default function LexicalEditor({
  value,
  onChange,
  placeholder = 'Write your article content here...',
  hasError,
  error,
  helperText,
  readOnly = false,
}: LexicalEditorProps) {
  const editorStateRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  
  // Ensure client-side rendering only
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Define onChange handler
  const handleOnChange = (editorState: any) => {
    editorStateRef.current = editorState;
    
    // Convert the editor state to JSON and update the parent component
    editorState.read(() => {
      const jsonString = JSON.stringify(editorState);
      onChange(jsonString);
    });
  };
  
  if (!mounted) {
    return <div className={editorStyles} style={{ height: '400px', border: '1px solid #ddd', borderRadius: '4px' }} />;
  }
  
  return (
    <div className={editorStyles}>
      <LexicalComposer initialConfig={{
        ...editorConfig,
        editorState: value || undefined,
      }}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                  className="editor-input" 
                  style={{
                    border: (error || hasError) ? '1px solid #d32f2f' : undefined,
                  }}
                  readOnly={readOnly}
                />
              }
              placeholder={
                <div className="editor-placeholder">{placeholder}</div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleOnChange} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <ImagePlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
      </LexicalComposer>
      {helperText && (
        <FormHelperText error={!!error}>{helperText}</FormHelperText>
      )}
    </div>
  );
}