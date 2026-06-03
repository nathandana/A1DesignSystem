import React from 'react';
import { type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
export interface SideNavItemProps {
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    badge?: string | number;
    onPress?: (e: GestureResponderEvent) => void;
}
export declare function SideNavItem({ label, icon, active, badge, onPress }: SideNavItemProps): React.JSX.Element;
export interface SideNavGroupProps {
    label: string;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}
export declare function SideNavGroup({ label, icon, defaultOpen, open: controlledOpen, onOpenChange, children, }: SideNavGroupProps): React.JSX.Element;
export interface SideNavProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function SideNav({ open, onClose, children, header, footer, style }: SideNavProps): React.JSX.Element | null;
