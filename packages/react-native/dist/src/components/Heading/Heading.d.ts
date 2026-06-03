import React from 'react';
import { type StyleProp, type TextStyle } from 'react-native';
import { typographyTokens } from '../../tokens/typography';
export type HeadingType = 'heading' | 'display';
export type HeadingSize = keyof typeof typographyTokens.heading.sizes | keyof typeof typographyTokens.display.sizes;
export type HeadingColor = keyof typeof typographyTokens.color;
export interface HeadingProps {
    children: React.ReactNode;
    type?: HeadingType;
    size?: HeadingSize;
    color?: HeadingColor;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
}
export declare function Heading({ children, type, size, color, style, numberOfLines, }: HeadingProps): React.JSX.Element;
