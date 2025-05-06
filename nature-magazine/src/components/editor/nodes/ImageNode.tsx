'use client';

import { 
  DecoratorNode, 
  EditorConfig, 
  LexicalEditor, 
  LexicalNode, 
  NodeKey, 
  SerializedLexicalNode, 
  Spread 
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { $getNodeByKey, $getSelection, $isNodeSelection } from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';

export type ImageAlignment = 'left' | 'center' | 'right';

export type ImagePayload = {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  alignment?: ImageAlignment;
  showCaption?: boolean;
  caption?: string;
};

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    alignment: ImageAlignment;
    width?: number;
    height?: number;
    showCaption: boolean;
    caption: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __alignment: ImageAlignment;
  __width: number | undefined;
  __height: number | undefined;
  __showCaption: boolean;
  __caption: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__alignment,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, alignment, width, height, showCaption, caption } = serializedNode;
    const node = $createImageNode({
      src,
      altText,
      alignment,
      width,
      height,
      showCaption,
      caption,
    });
    return node;
  }

  constructor(
    src: string,
    altText: string,
    alignment: ImageAlignment = 'left',
    width?: number,
    height?: number,
    showCaption = false,
    caption = '',
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__alignment = alignment;
    this.__width = width;
    this.__height = height;
    this.__showCaption = showCaption;
    this.__caption = caption;
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      altText: this.__altText,
      alignment: this.__alignment,
      width: this.__width,
      height: this.__height,
      showCaption: this.__showCaption,
      caption: this.__caption,
      type: 'image',
      version: 1,
    };
  }

  setAlignment(alignment: ImageAlignment): void {
    const writable = this.getWritable();
    writable.__alignment = alignment;
  }

  setCaption(caption: string): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const className = `editor-image align-${this.__alignment}`;
    div.className = className;
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return <ImageComponent 
      src={this.__src} 
      altText={this.__altText} 
      nodeKey={this.__key}
      alignment={this.__alignment}
      width={this.__width}
      height={this.__height}
      showCaption={this.__showCaption}
      caption={this.__caption}
    />;
  }
}

interface ImageComponentProps {
  src: string;
  altText: string;
  nodeKey: NodeKey;
  alignment: ImageAlignment;
  width?: number;
  height?: number;
  showCaption: boolean;
  caption: string;
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  alignment,
  width,
  height,
  showCaption,
  caption
}: ImageComponentProps) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [selection, setSelection] = useState<any | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && selection === null && (event.key === 'Backspace' || event.key === 'Delete')) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isNodeSelection(selection) && node) {
            node.remove();
          }
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey, selection]
  );

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const selection = $getSelection();
        setSelection(selection);
      });
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('keydown', onDelete);
    
    return () => {
      document.removeEventListener('keydown', onDelete);
    };
  }, [onDelete]);

  const onResizeEnd = useCallback(
    (nextWidth: number, nextHeight: number) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node instanceof ImageNode) {
          // Update the width and height
          node.updateDOM();
        }
      });
    },
    [editor, nodeKey]
  );

  const onClickHandler = () => {
    if (!isSelected) {
      setSelected(true);
    }
    return true;
  };

  return (
    <div className={`image-container align-${alignment}`}>
      <div
        className={`editor-image ${isSelected ? 'selected' : ''}`}
        onClick={onClickHandler}
      >
        <img
          src={src}
          alt={altText}
          ref={imageRef}
          style={{
            width: width ? `${width}px` : 'auto',
            height: height ? `${height}px` : 'auto',
          }}
        />
      </div>
      {showCaption && (
        <div className="image-caption">
          {caption}
        </div>
      )}
    </div>
  );
}

export function $createImageNode({
  src,
  altText,
  alignment,
  width,
  height,
  showCaption,
  caption,
}: ImagePayload): ImageNode {
  return new ImageNode(
    src,
    altText,
    alignment || 'left',
    width,
    height,
    showCaption || false,
    caption || ''
  );
}