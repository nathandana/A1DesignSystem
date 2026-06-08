import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
export type SectionPadding = 'lg' | 'md' | 'sm' | 'xs' | 'none';
export type SectionSurface = 'page' | 'panel' | 'raised';
export type SectionGap = 'xs' | 'sm' | 'md' | 'lg';
export interface SectionProps {
    children: React.ReactNode;
    padding?: SectionPadding;
    surface?: SectionSurface;
    gap?: SectionGap;
    /**
     * Flip the colour scheme — dark island on a light page, matching .a1-inverse.
     * Wraps children in a DesignSystemProvider override so all nested components
     * (Heading, Paragraph, Button, etc.) automatically use the dark token set.
     */
    inverse?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function Section({ children, padding, surface, gap, inverse, style }: SectionProps): React.JSX.Element;
