import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];
export type IconSource = MaterialIconName | React.ReactNode;
export type IconRenderer = IconSource | ((color: string) => React.ReactNode);

export function renderMaterialIcon(icon: IconSource | null | undefined, size: number, color: string) {
  if (icon === null || icon === undefined) return icon;

  if (typeof icon === 'string') {
    return <MaterialIcons name={icon as MaterialIconName} size={size} color={color} />;
  }

  if (!React.isValidElement(icon)) return icon;

  return React.cloneElement(icon as React.ReactElement<{ size?: number; color?: string }>, {
    size,
    color,
  });
}

export function renderIconRenderer(icon: IconRenderer | null | undefined, size: number, color: string) {
  if (typeof icon === 'function') return icon(color);

  return renderMaterialIcon(icon, size, color);
}
