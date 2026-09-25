import type * as React from 'react';

export interface CustomBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** Body HTML fragment. Starts empty. Use only when A1 components cannot express the need. */
  markup?: string;
  /** CSS confined to this block's document. A1 token variables are available. */
  css?: string;
  /** JavaScript executed after markup inside the sandbox. Restarts when source or theme changes. */
  js?: string;
  /** Accessible frame title. Defaults to the localized “Custom block” label. */
  title?: string;
  /** Tokenized frame height; overflow scrolls inside the frame. Default: md. */
  height?: 'sm' | 'md' | 'lg';
}

export declare function CustomBlock(props: CustomBlockProps): React.ReactElement;
