import React, { useMemo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { spacingTokens } from '../../tokens/spacing';

export type ButtonContainerAlign = 'start' | 'center' | 'end';
export type ButtonContainerSize = 'sm' | 'md' | 'lg';

export interface ButtonContainerProps {
  /** Horizontal alignment of buttons. Default: "start" */
  align?: ButtonContainerAlign;
  /** Uniform size applied to child buttons. */
  size?: ButtonContainerSize;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ALIGNMENTS: ButtonContainerAlign[] = ['start', 'center', 'end'];
const SIZES: ButtonContainerSize[] = ['sm', 'md', 'lg'];
const COMPACT_BREAKPOINT = 480;

const alignmentStyles: Record<ButtonContainerAlign, ViewStyle> = {
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

function isValidAlign(align: ButtonContainerAlign): align is ButtonContainerAlign {
  return ALIGNMENTS.includes(align);
}

function isValidSize(size: ButtonContainerSize | undefined): size is ButtonContainerSize {
  return size !== undefined && SIZES.includes(size);
}

function renderChildren(children: React.ReactNode, size: ButtonContainerSize | undefined, isCompact: boolean) {
  const childSize = size === 'lg' && isCompact ? 'md' : size;

  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;

    const nextProps: { size?: ButtonContainerSize; fullWidth?: boolean } = {};
    const childProps = child.props as { size?: ButtonContainerSize; fullWidth?: boolean };

    if (childSize && childProps.size === undefined) {
      nextProps.size = childSize;
    }

    if (isCompact && childProps.fullWidth === undefined) {
      nextProps.fullWidth = true;
    }

    return Object.keys(nextProps).length > 0
      ? React.cloneElement(child as React.ReactElement<{ size?: ButtonContainerSize; fullWidth?: boolean }>, nextProps)
      : child;
  });
}

export function ButtonContainer({
  align = 'start',
  size,
  children,
  style,
}: ButtonContainerProps) {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const resolvedAlign = isValidAlign(align) ? align : 'start';
  const resolvedSize = isValidSize(size) ? size : undefined;
  const isCompact = containerWidth === null || containerWidth < COMPACT_BREAKPOINT;
  const gap = resolvedSize === 'lg' && !isCompact
    ? spacingTokens.semantic.gap.md
    : spacingTokens.semantic.gap.xs;

  const handleLayout = (event: LayoutChangeEvent) => {
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
