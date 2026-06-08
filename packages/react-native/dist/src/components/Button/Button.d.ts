import React from 'react';
import { type PressableProps, type ViewStyle } from 'react-native';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: string;
    /** React element from any icon library, e.g. @expo/vector-icons */
    icon?: React.ReactNode;
    iconPosition?: 'start' | 'end';
    fullWidth?: boolean;
    /** Fully rounded pill shape */
    pill?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}
export declare function Button({ variant, size, children, icon, iconPosition, fullWidth, pill, loading, disabled, style, onPress, onPressIn, onPressOut, ...props }: ButtonProps): React.JSX.Element;
