import React from 'react';
import { type StyleProp, type TextStyle } from 'react-native';
import { typographyTokens } from '../../tokens/typography';
export type ParagraphSize = keyof typeof typographyTokens.body.sizes;
export type ParagraphColor = 'default' | 'muted';
export interface ParagraphProps {
    children: React.ReactNode;
    size?: ParagraphSize;
    color?: ParagraphColor;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
}
export declare function Paragraph({ children, size, color, style, numberOfLines, }: ParagraphProps): React.JSX.Element;
