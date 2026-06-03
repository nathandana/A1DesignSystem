import React from 'react';
import { type PressableProps } from 'react-native';
export type IconButtonVariant = 'tertiary' | 'secondary' | 'destructive' | 'success';
export type IconButtonSize = 'sm' | 'md';
export interface IconButtonProps extends Omit<PressableProps, 'children' | 'style'> {
    /**
     * Icon to render. Prefer the render-function form so the component can
     * forward the resolved token colour:
     *   icon={(color) => <MaterialIcons name="add" size={22} color={color} />}
     * A plain ReactNode is also accepted (colour must be set manually).
     */
    icon: React.ReactNode | ((color: string) => React.ReactNode);
    /** Accessible label (required — replaces visible text) */
    label: string;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
}
export declare function IconButton({ icon, label, variant, size, disabled, onPress, onPressIn, onPressOut, ...props }: IconButtonProps): React.JSX.Element;
