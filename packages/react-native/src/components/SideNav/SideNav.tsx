import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDesignSystem } from '../../context/DesignSystemContext';
import { sideNavTokens } from '../../tokens/sideNav';
import { spacingTokens } from '../../tokens/spacing';
import { typographyTokens } from '../../tokens/typography';
import { renderMaterialIcon, type IconSource } from '../../utils/materialIcon';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ── Depth context (indent nested groups) ─────────────────────────────────────

const DepthCtx = createContext(0);

// ── SideNavItem ───────────────────────────────────────────────────────────────

export interface SideNavItemProps {
  label: string;
  icon?: IconSource;
  active?: boolean;
  badge?: string | number;
  onPress?: (e: GestureResponderEvent) => void;
}

export function SideNavItem({ label, icon, active = false, badge, onPress }: SideNavItemProps) {
  const depth = useContext(DepthCtx);
  const t = sideNavTokens.item;
  const { colors, fontScale, theme } = useDesignSystem();
  const itemFontSize = Math.round(typographyTokens.component.sideNav.itemFontSize * fontScale);
  const itemLineHeight = Math.round(typographyTokens.component.sideNav.itemLineHeight * fontScale);
  const badgeFontSize = Math.round(typographyTokens.component.sideNav.badgeFontSize * fontScale);
  const styledIcon = renderMaterialIcon(icon, t.iconSize, active ? colors.textAccent : colors.textMuted);

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        { paddingLeft: t.paddingInline + t.indent * depth, borderRadius: theme.navItemRadius },
        active && { backgroundColor: colors.accentSurface },
        pressed && !active && { backgroundColor: colors.pressedBg },
      ]}
    >
      {icon && <View style={styles.itemIcon}>{styledIcon}</View>}
      <Text
        numberOfLines={1}
        style={[
          styles.itemLabel,
          {
            color: active ? colors.textAccent : colors.textDefault,
            fontSize: itemFontSize,
            fontWeight: active ? t.activeFontWeight : undefined,
            lineHeight: itemLineHeight,
          },
        ]}
      >
        {label}
      </Text>
      {badge != null && (
        <Text
          style={[
            styles.badge,
            {
              borderRadius: spacingTokens.component.sideNav.item.badgeBorderRadius,
              color: colors.textAccent,
              backgroundColor: colors.accentSurface,
              fontSize: badgeFontSize,
            },
          ]}
        >
          {badge}
        </Text>
      )}
    </Pressable>
  );
}

// ── SideNavGroup ──────────────────────────────────────────────────────────────

export interface SideNavGroupProps {
  label: string;
  icon?: IconSource;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function SideNavGroup({
  label,
  icon,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
}: SideNavGroupProps) {
  const depth = useContext(DepthCtx);
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen! : internalOpen;
  const chevronAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const t = sideNavTokens.item;
  const { colors, fontScale, theme } = useDesignSystem();
  const itemFontSize = Math.round(typographyTokens.component.sideNav.itemFontSize * fontScale);
  const itemLineHeight = Math.round(typographyTokens.component.sideNav.itemLineHeight * fontScale);
  const closeIconFontSize = Math.round(typographyTokens.component.sideNav.closeIconFontSize * fontScale);
  const styledIcon = renderMaterialIcon(icon, t.iconSize, colors.textMuted);

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
    Animated.timing(chevronAnim, {
      toValue: next ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen, isControlled, onOpenChange, chevronAnim]);

  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={toggle}
        style={({ pressed }) => [
        styles.item,
        { paddingLeft: t.paddingInline + t.indent * depth, borderRadius: theme.navItemRadius },
        pressed && { backgroundColor: colors.pressedBg },
      ]}
      >
        {icon && <View style={styles.itemIcon}>{styledIcon}</View>}
        <Text numberOfLines={1} style={[styles.itemLabel, styles.itemLabelFlex, { color: colors.textDefault, fontSize: itemFontSize, lineHeight: itemLineHeight }]}>
          {label}
        </Text>
        <Animated.Text
          style={[styles.chevron, { color: colors.textMuted, fontSize: closeIconFontSize, lineHeight: closeIconFontSize + 2, transform: [{ rotate: chevronRotate }] }]}
        >
          ›
        </Animated.Text>
      </Pressable>

      {isOpen && (
        <DepthCtx.Provider value={depth + 1}>
          <View style={styles.groupChildren}>
            {children}
          </View>
        </DepthCtx.Provider>
      )}
    </View>
  );
}

// ── SideNav ───────────────────────────────────────────────────────────────────

export interface SideNavProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// Inner panel — needs its own component to call useSafeAreaInsets inside the Modal
interface PanelProps {
  slideAnim: Animated.Value;
  scrimAnim: Animated.Value;
  onClose: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

function Panel({ slideAnim, scrimAnim, onClose, header, footer, children, style }: PanelProps) {
  const insets = useSafeAreaInsets();
  const { colors, fontScale, theme } = useDesignSystem();
  const closeIconFontSize = Math.round(typographyTokens.component.sideNav.closeIconFontSize * fontScale);

  return (
    <>
      {/* Scrim — no longer needed for full-width but kept for back-compat */}
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Close navigation">
        <Animated.View style={[styles.scrim, { backgroundColor: colors.scrimBg, opacity: scrimAnim }]} />
      </TouchableWithoutFeedback>

      {/* Panel */}
      <Animated.View
        style={[
          styles.panel,
          { backgroundColor: colors.panelBg, shadowColor: colors.textDefault, transform: [{ translateX: slideAnim }] },
          style,
        ]}
      >
        {/* Header — padded for Dynamic Island / status bar */}
        <View style={[styles.panelHeader, { borderBottomColor: colors.borderSubtle, paddingTop: insets.top + spacingTokens.component.sideNav.paddingBlock }]}>
          {header && <View style={styles.panelHeaderContent}>{header}</View>}
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close navigation"
            style={({ pressed }) => [styles.closeBtn, { borderRadius: theme.navItemRadius }, pressed && { backgroundColor: colors.pressedBg }]}
          >
            <Text style={[styles.closeBtnText, { color: colors.textDefault, fontSize: closeIconFontSize }]}>✕</Text>
          </Pressable>
        </View>

        {/* Nav items */}
        <ScrollView
          style={styles.navScroll}
          contentContainerStyle={styles.navContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {/* Footer — padded for home indicator */}
        {footer && (
          <View style={[styles.panelFooter, { borderTopColor: colors.borderSubtle, paddingBottom: Math.max(t.paddingBlock, insets.bottom) }]}>
            {footer}
          </View>
        )}
      </Animated.View>
    </>
  );
}

export function SideNav({ open, onClose, children, header, footer, style }: SideNavProps) {
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const scrimAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          speed: 20,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.timing(scrimAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(scrimAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setVisible(false);
      });
    }
  }, [open, slideAnim, scrimAnim]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <Panel
        slideAnim={slideAnim}
        scrimAnim={scrimAnim}
        onClose={onClose}
        header={header}
        footer={footer}
        style={style}
      >
        {children}
      </Panel>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const t = sideNavTokens;

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFill,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH,
    ...t.shadow,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacingTokens.component.sideNav.panelHeader.paddingLeft,
    paddingRight: spacingTokens.component.sideNav.panelHeader.paddingRight,
    paddingBottom: spacingTokens.component.sideNav.panelHeader.paddingBottom,
    borderBottomWidth: t.borderWidth,
    gap: spacingTokens.component.sideNav.panelHeader.gap,
  },
  panelHeaderContent: {
    flex: 1,
    minWidth: 0,
  },
  closeBtn: {
    width: spacingTokens.component.sideNav.closeButtonSize,
    height: spacingTokens.component.sideNav.closeButtonSize,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  closeBtnText: {
  },
  navScroll: {
    flex: 1,
  },
  navContent: {
    paddingVertical: t.paddingBlock,
    paddingHorizontal: t.paddingInline,
    gap: spacingTokens.component.sideNav.item.groupGap,
  },
  panelFooter: {
    paddingHorizontal: t.paddingInline,
    paddingVertical: t.paddingBlock,
    borderTopWidth: t.borderWidth,
  },

  // Item
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: t.item.height,
    paddingRight: t.item.paddingInline,
    paddingVertical: spacingTokens.component.sideNav.item.paddingVertical,
    gap: t.item.gap,
  },
  itemIcon: {
    width: t.item.iconSize,
    height: t.item.iconSize,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemLabel: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    flex: 0,
  },
  itemLabelFlex: {
    flex: 1,
  },
  badge: {
    fontFamily: Platform.select({ ios: 'System', default: 'sans-serif' }),
    fontWeight: '600',
    borderRadius: spacingTokens.component.sideNav.item.badgeBorderRadius,
    paddingHorizontal: spacingTokens.component.sideNav.item.badgePaddingHorizontal,
    paddingVertical: spacingTokens.component.sideNav.item.badgePaddingVertical,
    overflow: 'hidden',
  },
  groupChildren: {
    gap: spacingTokens.component.sideNav.item.groupGap,
  },
  chevron: {
    flexShrink: 0,
  },
});
