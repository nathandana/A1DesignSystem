import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Pages shown either side of the active page before ellipsis */
  siblings?: number;
  size?: 'md' | 'sm';
}

function getItems(page: number, total: number, siblings: number): (number | 'ellipsis')[] {
  const left  = Math.max(2, page - siblings);
  const right = Math.min(total - 1, page + siblings);
  const items: (number | 'ellipsis')[] = [1];
  if (left > 2)       items.push('ellipsis');
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push('ellipsis');
  if (total > 1)      items.push(total);
  return items;
}

export function Pagination({ page, totalPages, onChange, siblings = 1, size = 'md' }: PaginationProps) {
  const { colors, fontScale, theme } = useDesignSystem();
  const dim = size === 'sm' ? spacingTokens.component.pagination.itemSizeSm : spacingTokens.component.pagination.itemSize;
  const fs  = Math.round(typographyTokens.component.pagination.sizes[size].fontSize * fontScale);
  const iconSize = size === 'sm' ? spacingTokens.component.pagination.iconSizeSm : spacingTokens.component.pagination.iconSize;
  const radius = theme.buttonRadius;

  const items = getItems(page, totalPages, siblings);

  function NavBtn({ dir }: { dir: 'prev' | 'next' }) {
    const disabled = dir === 'prev' ? page <= 1 : page >= totalPages;
    return (
      <Pressable
        onPress={() => onChange(dir === 'prev' ? page - 1 : page + 1)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={dir === 'prev' ? 'Previous page' : 'Next page'}
        style={({ pressed }) => [
          styles.item,
          { width: dim, height: dim, borderRadius: radius, borderColor: 'transparent' },
          pressed && !disabled && { backgroundColor: colors.pressedBg },
          disabled && { opacity: 0.35 },
        ]}
      >
        <MaterialIcons
          name={dir === 'prev' ? 'chevron-left' : 'chevron-right'}
          size={iconSize}
          color={colors.textDefault}
        />
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      <NavBtn dir="prev" />

      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <Text key={`e${idx}`} style={[styles.ellipsis, { height: dim, color: colors.textMuted, fontSize: fs }]}>
            …
          </Text>
        ) : (
          <Pressable
            key={item}
            onPress={() => item !== page && onChange(item)}
            accessibilityRole="button"
            accessibilityLabel={`Page ${item}`}
            style={({ pressed }) => [
              styles.item,
              {
                minWidth: dim, height: dim, borderRadius: radius,
                backgroundColor: item === page ? colors.buttonPrimaryBg : 'transparent',
                borderColor: item === page ? colors.buttonPrimaryBg : colors.borderSubtle,
              },
              pressed && item !== page && { backgroundColor: colors.pressedBg },
            ]}
          >
            <Text style={[
              styles.label,
              {
                fontFamily: theme.fonts.body ?? Platform.select({ ios: undefined, default: 'sans-serif' }),
                fontSize: fs,
                color: item === page ? colors.buttonPrimaryFg : colors.textDefault,
                fontWeight: item === page ? '600' : '400',
              },
            ]}>
              {item}
            </Text>
          </Pressable>
        )
      )}

      <NavBtn dir="next" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacingTokens.component.pagination.gap },
  item: {
    alignItems: 'center', justifyContent: 'center',
    borderWidth: spacingTokens.component.pagination.borderWidth,
    paddingHorizontal: spacingTokens.component.pagination.paddingHorizontal,
  },
  label: { includeFontPadding: false },
  ellipsis: {
    alignItems: 'center', justifyContent: 'flex-end', textAlignVertical: 'bottom',
    paddingBottom: spacingTokens.component.pagination.ellipsisPaddingBottom,
  },
});
