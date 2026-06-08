import React from 'react';
import { type StyleProp, type TextStyle } from 'react-native';
import { typographyTokens } from '../../tokens/typography';
export type LinkSize = keyof typeof typographyTokens.body.sizes;
export type LinkWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export interface LinkProps {
    children: React.ReactNode;
    href?: string;
    size?: LinkSize;
    weight?: LinkWeight;
    /** Icon element rendered before/after the label */
    icon?: React.ReactNode;
    iconPosition?: 'start' | 'end';
    onPress?: () => void;
    style?: StyleProp<TextStyle>;
}
export declare function Link({ children, href, size, weight, icon, iconPosition, onPress, style, }: LinkProps): React.JSX.Element;
