import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    /** Action buttons — render inside a row at the bottom */
    footer?: React.ReactNode;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function Dialog({ open, onClose, title, footer, children, style }: DialogProps): React.JSX.Element | null;
