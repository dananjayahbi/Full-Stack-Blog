'use client';

import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';
import { Button, Box, Typography } from '@mui/material';
import { css } from '@emotion/css';

const treeViewStyles = css`
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-family: monospace;
  max-height: 300px;
  overflow: auto;
  
  .tree-view-output {
    margin: 0;
    padding: 0;
  }
`;

export default function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [showTree, setShowTree] = useState(false);

  return (
    <>
      {showTree && (
        <Box className={treeViewStyles}>
          <Typography variant="subtitle2" gutterBottom>
            Editor Debug Tree
          </Typography>
          <TreeView
            viewClassName="tree-view-output"
            treeTypeButtonClassName="debug-tree-type-button"
            timeTravelButtonClassName="debug-tree-timetravel-button"
            timeTravelPanelButtonClassName="debug-tree-timetravel-panel-button"
            timeTravelPanelClassName="debug-tree-timetravel-panel"
            timeTravelPanelSliderClassName="debug-tree-timetravel-panel-slider"
            editor={editor}
          />
        </Box>
      )}
      <Button
        variant="outlined"
        size="small"
        onClick={() => setShowTree(prev => !prev)}
        sx={{ mt: 2, display: process.env.NODE_ENV === 'production' ? 'none' : 'block' }}
      >
        {showTree ? 'Hide Debug Tree' : 'Show Debug Tree'}
      </Button>
    </>
  );
}