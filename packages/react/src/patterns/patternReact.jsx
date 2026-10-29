"use client";

import { Children, Fragment, cloneElement, isValidElement } from 'react';
import { Button } from '../components/button/Button.jsx';
import { ButtonContainer } from '../components/button-container/ButtonContainer.jsx';
import { IconButton } from '../components/icon-button/IconButton.jsx';
import { Link } from '../components/link/Link.jsx';
import { MessageBadge } from '../components/message/Message.jsx';
import { SplitButton } from '../components/split-button/SplitButton.jsx';
import { normalizePatternItems } from './patternPolicies.js';

const types = new Map([[Button, 'Button'], [ButtonContainer, 'ButtonContainer'], [IconButton, 'IconButton'], [Link, 'Link'], [MessageBadge, 'MessageBadge'], [SplitButton, 'SplitButton']]);
function describe(children) {
  return Children.toArray(children).flatMap(child => {
    if (isValidElement(child) && child.type === Fragment) return describe(child.props.children);
    const type = isValidElement(child) ? types.get(child.type) : undefined;
    return [{ type, props: child?.props, original: child, ...(type === 'ButtonContainer' ? { children: describe(child.props.children) } : {}) }];
  });
}
function restore(item) {
  if (!isValidElement(item.original)) return item.original;
  return cloneElement(item.original, { ...item.props, ...(item.children ? { children: item.children.map(restore) } : {}) });
}
export function normalizePatternReactItems(type, areaId, children) {
  return normalizePatternItems(type, areaId, describe(children)).map(restore);
}

export function normalizePatternActionData(type, actions) {
  const nodes = actions.map(action => ({
    type: action.kind === 'link' ? 'Link' : action.kind === 'icon-button' ? 'IconButton' : 'Button',
    props: { ...action, variant: action.variant ?? (action.kind === 'icon-button' ? 'tertiary' : 'secondary') },
  }));
  return normalizePatternItems(type, 'actions', nodes).map(node => node.props);
}
