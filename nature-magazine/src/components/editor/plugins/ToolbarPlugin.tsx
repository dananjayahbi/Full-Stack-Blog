'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getRoot,
  $createTextNode,
  SELECTION_CHANGE_COMMAND,
  $isElementNode,
  $createLineBreakNode,
} from 'lexical';
import { $wrapNodes } from '@lexical/selection';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $isHeadingNode, $createHeadingNode } from '@lexical/rich-text';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $isTableNode } from '@lexical/table';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { css } from '@emotion/css';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';

// Material UI Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import CodeIcon from '@mui/icons-material/Code';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ImageIcon from '@mui/icons-material/Image';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { ImageAlignment } from '../nodes/ImageNode';

// Toolbar styles
const toolbarStyles = css`
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 8px;
  border: 1px solid #ddd;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  .toolbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    margin-right: 4px;
    margin-bottom: 4px;
    background-color: transparent;
    cursor: pointer;
    border-radius: 4px;
    padding: 6px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f1f1f1;
    }

    &.active {
      background-color: rgba(25, 118, 210, 0.12);
      color: rgb(25, 118, 210);
    }

    &.disabled {
      opacity: 0.3;
      cursor: not-allowed;
      &:hover {
        background-color: transparent;
      }
    }
  }

  .divider {
    width: 1px;
    background-color: #ddd;
    margin: 0 8px;
    align-self: stretch;
  }

  .toolbar-section {
    display: flex;
    align-items: center;
    margin-right: 8px;
    margin-bottom: 4px;
  }
`;

export default function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<string>('paragraph');
  const [alignment, setAlignment] = useState<string>('left');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkSelected, setIsLinkSelected] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageAlignment, setImageAlignment] = useState<ImageAlignment>('center');

  // Update toolbar state based on selection
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      const node = selection.anchor.getNode();
      let parent = node.getParent();
      
      if (parent) {
        const parentFormat = parent.getFormatType();
        setAlignment(parentFormat || 'left');
        
        // Check if the selection contains a link
        setIsLinkSelected($isLinkNode(parent) || $isLinkNode(node));
        
        // Check block type
        if ($isHeadingNode(parent)) {
          setBlockType(parent.getTag());
        } else if ($isListNode(parent)) {
          const listType = parent.getListType();
          setBlockType(listType === 'bullet' ? 'ul' : 'ol');
        } else if ($isElementNode(parent) && parent.getParentOrThrow && parent.getParent()) {
          const grandParent = parent.getParent();
          if (grandParent && $isListNode(grandParent)) {
            const listType = grandParent.getListType();
            setBlockType(listType === 'bullet' ? 'ul' : 'ol');
          } else {
            setBlockType('paragraph');
          }
        } else if ($isCodeNode(parent)) {
          setBlockType('code');
        } else {
          setBlockType('paragraph');
        }
      } else {
        setBlockType('paragraph');
        setAlignment('left');
      }
    }
  }, []);

  // Listen for selection changes
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  // Listen for undo/redo state
  useEffect(() => {
    return activeEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // Check if undo and redo are available using the appropriate Lexical API
        setCanUndo(activeEditor._history && activeEditor._history.undoStack.length > 0);
        setCanRedo(activeEditor._history && activeEditor._history.redoStack.length > 0);
      });
    });
  }, [activeEditor]);

  // Format handlers
  const formatBold = () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const formatStrikethrough = () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  };

  const formatCode = () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  };

  const formatAlignment = (alignType: string) => {
    activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignType);
    setAlignment(alignType);
  };

  // Block format handlers
  const formatHeading = (headingTag: string) => {
    if (headingTag === 'paragraph') {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    } else {
      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode(headingTag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'));
        }
      });
    }
    setBlockType(headingTag);
  };

  const formatBulletList = () => {
    if (blockType === 'ul') {
      activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType('paragraph');
    } else {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockType('ul');
    }
  };

  const formatNumberList = () => {
    if (blockType === 'ol') {
      activeEditor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType('paragraph');
    } else {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      setBlockType('ol');
    }
  };

  const insertHorizontalRule = () => {
    activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  };

  // Link handling
  const openLinkDialog = () => {
    setLinkUrl('');
    setIsLinkOpen(true);
  };

  const insertLink = () => {
    activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    setIsLinkOpen(false);
  };

  const removeLink = () => {
    activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  };

  // Image handling
  const openImageDialog = () => {
    setImageUrl('');
    setImageAlt('');
    setImageAlignment('center');
    setIsImageDialogOpen(true);
  };

  const insertImage = () => {
    if (imageUrl) {
      activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: imageUrl,
        altText: imageAlt || 'Article image',
        alignment: imageAlignment,
      });
      setIsImageDialogOpen(false);
    }
  };

  return (
    <div className={toolbarStyles}>
      {/* Block Type Dropdown */}
      <div className="toolbar-section">
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, marginRight: 1 }}>
          <InputLabel id="block-type-select-label">Format</InputLabel>
          <Select
            labelId="block-type-select-label"
            value={blockType}
            onChange={(e) => formatHeading(e.target.value)}
            label="Format"
          >
            <MenuItem value="paragraph">Normal</MenuItem>
            <MenuItem value="h1">Heading 1</MenuItem>
            <MenuItem value="h2">Heading 2</MenuItem>
            <MenuItem value="h3">Heading 3</MenuItem>
            <MenuItem value="h4">Heading 4</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="divider" />

      {/* Text Formatting */}
      <div className="toolbar-section">
        <Tooltip title="Bold">
          <button
            type="button"
            className={`toolbar-item ${isBold ? 'active' : ''}`}
            onClick={formatBold}
            aria-label="Format text as bold"
          >
            <FormatBoldIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Italic">
          <button
            type="button"
            className={`toolbar-item ${isItalic ? 'active' : ''}`}
            onClick={formatItalic}
            aria-label="Format text as italic"
          >
            <FormatItalicIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Underline">
          <button
            type="button"
            className={`toolbar-item ${isUnderline ? 'active' : ''}`}
            onClick={formatUnderline}
            aria-label="Format text as underlined"
          >
            <FormatUnderlinedIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Strikethrough">
          <button
            type="button"
            className={`toolbar-item ${isStrikethrough ? 'active' : ''}`}
            onClick={formatStrikethrough}
            aria-label="Format text with strikethrough"
          >
            <StrikethroughSIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Code">
          <button
            type="button"
            className={`toolbar-item ${isCode ? 'active' : ''}`}
            onClick={formatCode}
            aria-label="Format text as code"
          >
            <CodeIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>

      <div className="divider" />

      {/* Alignment */}
      <div className="toolbar-section">
        <Tooltip title="Align Left">
          <button
            type="button"
            className={`toolbar-item ${alignment === 'left' ? 'active' : ''}`}
            onClick={() => formatAlignment('left')}
            aria-label="Align text to the left"
          >
            <FormatAlignLeftIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Align Center">
          <button
            type="button"
            className={`toolbar-item ${alignment === 'center' ? 'active' : ''}`}
            onClick={() => formatAlignment('center')}
            aria-label="Align text to the center"
          >
            <FormatAlignCenterIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Align Right">
          <button
            type="button"
            className={`toolbar-item ${alignment === 'right' ? 'active' : ''}`}
            onClick={() => formatAlignment('right')}
            aria-label="Align text to the right"
          >
            <FormatAlignRightIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Justify">
          <button
            type="button"
            className={`toolbar-item ${alignment === 'justify' ? 'active' : ''}`}
            onClick={() => formatAlignment('justify')}
            aria-label="Justify text"
          >
            <FormatAlignJustifyIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>

      <div className="divider" />

      {/* Lists */}
      <div className="toolbar-section">
        <Tooltip title="Bulleted List">
          <button
            type="button"
            className={`toolbar-item ${blockType === 'ul' ? 'active' : ''}`}
            onClick={formatBulletList}
            aria-label="Format as bulleted list"
          >
            <FormatListBulletedIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Numbered List">
          <button
            type="button"
            className={`toolbar-item ${blockType === 'ol' ? 'active' : ''}`}
            onClick={formatNumberList}
            aria-label="Format as numbered list"
          >
            <FormatListNumberedIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>

      <div className="divider" />

      {/* Links */}
      <div className="toolbar-section">
        <Tooltip title="Insert Link">
          <button
            type="button"
            className={`toolbar-item ${isLinkSelected ? 'active' : ''}`}
            onClick={openLinkDialog}
            aria-label="Insert a link"
          >
            <InsertLinkIcon fontSize="small" />
          </button>
        </Tooltip>

        {isLinkSelected && (
          <Tooltip title="Remove Link">
            <button
              type="button"
              className="toolbar-item"
              onClick={removeLink}
              aria-label="Remove link"
            >
              <LinkOffIcon fontSize="small" />
            </button>
          </Tooltip>
        )}
      </div>

      <div className="divider" />

      {/* Insert options */}
      <div className="toolbar-section">
        <Tooltip title="Insert Image">
          <button
            type="button"
            className="toolbar-item"
            onClick={openImageDialog}
            aria-label="Insert an image"
          >
            <ImageIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Insert Horizontal Line">
          <button
            type="button"
            className="toolbar-item"
            onClick={insertHorizontalRule}
            aria-label="Insert a horizontal rule"
          >
            <HorizontalRuleIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>

      <div className="divider" />

      {/* History */}
      <div className="toolbar-section">
        <Tooltip title="Undo">
          <button
            type="button"
            className={`toolbar-item ${!canUndo ? 'disabled' : ''}`}
            onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)}
            disabled={!canUndo}
            aria-label="Undo"
          >
            <UndoIcon fontSize="small" />
          </button>
        </Tooltip>

        <Tooltip title="Redo">
          <button
            type="button"
            className={`toolbar-item ${!canRedo ? 'disabled' : ''}`}
            onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)}
            disabled={!canRedo}
            aria-label="Redo"
          >
            <RedoIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>

      {/* Link Dialog */}
      <Dialog open={isLinkOpen} onClose={() => setIsLinkOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="URL"
            type="url"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLinkOpen(false)}>Cancel</Button>
          <Button onClick={insertLink} variant="contained" color="primary" disabled={!linkUrl}>
            Insert
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onClose={() => setIsImageDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="imageUrl"
            label="Image URL"
            type="url"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="imageAlt"
            label="Alt Text"
            type="text"
            fullWidth
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Image description"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="image-alignment-label">Alignment</InputLabel>
            <Select
              labelId="image-alignment-label"
              value={imageAlignment}
              onChange={(e) => setImageAlignment(e.target.value as ImageAlignment)}
              label="Alignment"
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>
          </FormControl>
          {imageUrl && (
            <Box sx={{ mt: 2, p: 1, border: '1px solid #ddd', borderRadius: '4px', textAlign: imageAlignment }}>
              <Box
                component="img"
                src={imageUrl}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsImageDialogOpen(false)}>Cancel</Button>
          <Button onClick={insertImage} variant="contained" color="primary" disabled={!imageUrl}>
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}