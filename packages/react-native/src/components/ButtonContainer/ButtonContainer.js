import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacingTokens } from '../../tokens/spacing';

const ALIGNMENTS = ['start', 'center', 'end'];
const SIZES = ['sm', 'md', 'lg'];
const COMPACT_BREAKPOINT = 480;

const alignmentStyles = {
  start: {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  end: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
};

function isValidAlign(align) {
  return ALIGNMENTS.includes(align);
}

function isValidSize(size) {
  return size !== undefined && SIZES.includes(size);
}

function renderChildren(children, size, isCompact) {
  const childSize = size === 'lg' && isCompact ? 'md' : size;

  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;

    const nextProps = {};
    const childProps = child.props;

    if (childSize && childProps.size === undefined) {
      nextProps.size = childSize;
    }

    if (isCompact && childProps.fullWidth === undefined) {
      nextProps.fullWidth = true;
    }

    return Object.keys(nextProps).length > 0
      ? React.cloneElement(child, nextProps)
      : child;
  });
}

export function ButtonContainer({
  align = 'start',
  size,
  children,
  style,
}) {
  const [containerWidth, setContainerWidth] = useState(null);
  const resolvedAlign = isValidAlign(align) ? align : 'start';
  const resolvedSize = isValidSize(size) ? size : undefined;
  const isCompact = containerWidth === null || containerWidth < COMPACT_BREAKPOINT;
  const gap = resolvedSize === 'lg' && !isCompact
    ? spacingTokens.semantic.gap.md
    : spacingTokens.semantic.gap.xs;

  const handleLayout = event => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const resolvedChildren = useMemo(
    () => renderChildren(children, resolvedSize, isCompact),
    [children, resolvedSize, isCompact],
  );

  return (
    <View onLayout={handleLayout} style={[styles.container, style]}>
      <View
        style={[
          styles.inner,
          isCompact ? styles.compact : styles.wide,
          isCompact ? styles.alignStretch : alignmentStyles[resolvedAlign],
          { gap },
        ]}
      >
        {resolvedChildren}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  inner: {
    alignSelf: 'stretch',
  },
  compact: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  wide: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  alignStretch: {
    justifyContent: 'flex-start',
  },
});
