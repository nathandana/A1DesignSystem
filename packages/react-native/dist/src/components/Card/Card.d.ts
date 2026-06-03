import React from 'react';
import { type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
export type CardHeroColor = 'action' | 'neutral' | 'info' | 'success' | 'warn' | 'error';
export interface CardProps {
    children: React.ReactNode;
    /** Remove all visual chrome and padding — just structural containment */
    bare?: boolean;
    /** Small 40×40 icon badge rendered above children */
    icon?: React.ReactNode;
    /** Full-bleed colored header with a large icon */
    heroIcon?: React.ReactNode;
    /** Background color key for the hero area */
    heroColor?: CardHeroColor | string;
    /** Makes the entire card pressable with a spring press animation */
    onPress?: (e: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
}
export declare function Card({ children, bare, icon, heroIcon, heroColor, onPress, style, }: CardProps): React.JSX.Element;
