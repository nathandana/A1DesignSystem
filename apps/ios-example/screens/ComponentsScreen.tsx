import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Heading, Paragraph, useDesignSystem } from '@gtivr4/a1-design-system-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavFn = (screen: string) => void;
type MIName = React.ComponentProps<typeof MaterialIcons>['name'];

interface ComponentEntry {
  screen: string;
  title: string;
  description: string;
  icon: MIName;
  isNew?: boolean;
}

const GROUPS: { label: string; items: ComponentEntry[] }[] = [
  {
    label: 'Actions',
    items: [
      { screen: 'button',     title: 'Button',      icon: 'smart-button',  description: 'Trigger actions and navigation' },
      { screen: 'iconbutton', title: 'IconButton',  icon: 'radio-button-checked', description: 'Square icon-only action button' },
      { screen: 'link',       title: 'Link',        icon: 'link',          description: 'Inline text link with underline' },
      { screen: 'snackbar',   title: 'Snackbar',    icon: 'announcement',  description: 'Temporary feedback with optional undo' },
    ],
  },
  {
    label: 'Containers',
    items: [
      { screen: 'card',    title: 'Card',    icon: 'crop-square',  description: 'Group related content with optional hero' },
      { screen: 'dialog', title: 'Dialog',  icon: 'open-in-new',  description: 'Modal overlay with title and footer' },
      { screen: 'section', title: 'Section', icon: 'view-agenda',  description: 'Layout container with surface and inverse' },
      { screen: 'banner', title: 'Banner', icon: 'campaign', description: 'Inline status and announcement message' },
      { screen: 'emptystate', title: 'Empty State', icon: 'inbox', description: 'Placeholder for blank or filtered views' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { screen: 'pagination', title: 'Pagination', icon: 'last-page', description: 'Navigate between pages of content' },
      { screen: 'sidenav',    title: 'SideNav',    icon: 'menu',      description: 'Full-screen navigation drawer' },
      { screen: 'list',       title: 'List',       icon: 'format-list-bulleted', description: 'Grouped rows for settings and navigation' },
    ],
  },
  {
    label: 'Typography',
    items: [
      { screen: 'heading',   title: 'Heading',   icon: 'title', description: 'Semantic headings — heading and display types' },
      { screen: 'paragraph', title: 'Paragraph', icon: 'notes', description: 'Body text with size and colour variants' },
      { screen: 'blockquote', title: 'Blockquote', icon: 'format-quote', description: 'Quoted or emphasized content block' },
      { screen: 'textlist', title: 'Text List', icon: 'format-list-bulleted', description: 'Prose lists with markers and dividers' },
      { screen: 'badge', title: 'Badge', icon: 'label', description: 'Compact status and metadata label' },
    ],
  },
];

function ComponentRow({ item, nav }: { item: ComponentEntry; nav: NavFn }) {
  const { colors, theme } = useDesignSystem();

  return (
    <Pressable
      onPress={() => nav(item.screen)}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? colors.accentSurface : colors.surfaceBg,
          borderColor: colors.borderSubtle,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.accentSurface, borderRadius: theme.navItemRadius }]}>
        <MaterialIcons name={item.icon} size={20} color={colors.textAccent} />
      </View>
      <View style={styles.rowText}>
        <Heading size="sm">{item.title}</Heading>
        <Paragraph size="sm" color="muted">{item.description}</Paragraph>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

export function ComponentsScreen({ nav }: { nav: NavFn }) {
  const { colors, theme } = useDesignSystem();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.pageBg }}
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Heading type="display" size="md">Components</Heading>
        <Paragraph color="muted">{GROUPS.reduce((n, g) => n + g.items.length, 0)} components</Paragraph>
      </View>

      {GROUPS.map(group => (
        <View key={group.label} style={styles.group}>
          <Heading size="xs" color="muted" style={styles.groupLabel}>{group.label.toUpperCase()}</Heading>
          <View style={[styles.list, { borderRadius: theme.cardRadius, borderColor: colors.borderSubtle }]}>
            {group.items.map((item, i) => (
              <View key={item.screen}>
                <ComponentRow item={item} nav={nav} />
                {i < group.items.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    letterSpacing: 0.5,
  },
  list: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 64,
  },
});
