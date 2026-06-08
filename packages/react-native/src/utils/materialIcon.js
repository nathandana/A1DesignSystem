import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export function renderMaterialIcon(icon, size, color) {
  if (icon === null || icon === undefined) return icon;

  if (typeof icon === 'string') {
    return <MaterialIcons name={icon} size={size} color={color} />;
  }

  if (!React.isValidElement(icon)) return icon;

  return React.cloneElement(icon, {
    size,
    color,
  });
}

export function renderIconRenderer(icon, size, color) {
  if (typeof icon === 'function') return icon(color);

  return renderMaterialIcon(icon, size, color);
}
