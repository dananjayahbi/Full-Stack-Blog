'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
import Prism from 'prismjs';

// Import Prism languages - add more as needed
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';

export default function CodeHighlightPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CodeNode, CodeHighlightNode])) {
      throw new Error('CodeHighlightPlugin: CodeNode or CodeHighlightNode not registered on editor');
    }

    return editor.registerMutationListener(CodeNode, (mutations) => {
      for (const [key, prevNode] of mutations) {
        if (prevNode === null) {
          continue;
        }

        editor.update(() => {
          const node = $getNodeByKey(key);
          if (node !== null && node instanceof CodeNode) {
            node.toggleData('language', node.getLanguage() || 'javascript');
            node.getChildren().forEach((child) => {
              if (child instanceof CodeHighlightNode) {
                const text = child.getTextContent();
                const language = node.getLanguage() || 'javascript';
                const tokens = Prism.tokenize(text, Prism.languages[language] || Prism.languages.javascript);
                const highlightedCode = transformTokensToCodeHighlight(tokens, child);
              }
            });
          }
        });
      }
    });
  }, [editor]);

  return null;
}

function $getNodeByKey(key: string) {
  const editor = document.querySelector('[contenteditable="true"]')?.__lexicalEditor;
  if (editor) {
    const node = editor._editorState._nodeMap.get(key);
    return node;
  }
  return null;
}

function transformTokensToCodeHighlight(tokens: any[], node: any) {
  // This is a simplified implementation
  // In a full implementation, you'd transform tokens to proper CodeHighlight nodes
  return node; 
}