import { MaterialIcons } from '@expo/vector-icons';
import { AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible';
import { LibreBaskerville_400Regular, LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { RobotoSlab_300Light } from '@expo-google-fonts/roboto-slab';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  A1_THEMES,
  DesignSystemProvider,
  FONT_SCALES,
  Paragraph,
  useDesignSystem,
  SideNav,
  SideNavGroup,
  SideNavItem,
} from '@gtivr4/a1-design-system-react-native';

import { SettingsProvider, useIsDark, useSettings } from './context/SettingsContext';
import { ButtonScreen }     from './screens/ButtonScreen';
import { BadgeScreen }      from './screens/BadgeScreen';
import { BannerScreen }     from './screens/BannerScreen';
import { BlockquoteScreen } from './screens/BlockquoteScreen';
import { ComponentsScreen } from './screens/ComponentsScreen';
import { CardScreen }       from './screens/CardScreen';
import { ColorsScreen }     from './screens/ColorsScreen';
import { DialogScreen }     from './screens/DialogScreen';
import { EmptyStateScreen } from './screens/EmptyStateScreen';
import { HeadingScreen }    from './screens/HeadingScreen';
import { HomeScreen }       from './screens/HomeScreen';
import { IconButtonScreen } from './screens/IconButtonScreen';
import { LinkScreen }       from './screens/LinkScreen';
import { ListScreen }       from './screens/ListScreen';
import { MotionScreen }     from './screens/MotionScreen';
import { PaginationScreen } from './screens/PaginationScreen';
import { ParagraphScreen }  from './screens/ParagraphScreen';
import { SectionScreen }    from './screens/SectionScreen';
import { SettingsScreen }   from './screens/SettingsScreen';
import { SideNavScreen }    from './screens/SideNavScreen';
import { SnackbarScreen }   from './screens/SnackbarScreen';
import { TypographyScreen } from './screens/TypographyScreen';
import { TextListScreen }   from './screens/TextListScreen';

const TITLES: Record<string, string> = {
  home: 'Home', components: 'Components',
  button: 'Button', card: 'Card', heading: 'Heading',
  paragraph: 'Paragraph', sidenav: 'SideNav', colors: 'Colors',
  typography: 'Typography', motion: 'Motion', settings: 'Settings',
  iconbutton: 'IconButton', link: 'Link', pagination: 'Pagination',
  section: 'Section', dialog: 'Dialog', banner: 'Banner',
  emptystate: 'Empty State', blockquote: 'Blockquote', badge: 'Badge',
  snackbar: 'Snackbar', list: 'List',
  textlist: 'Text List',
};

function ActiveScreen({ screen, nav }: { screen: string; nav: (s: string) => void }) {
  switch (screen) {
    case 'button':     return <ButtonScreen />;
    case 'badge':      return <BadgeScreen />;
    case 'banner':     return <BannerScreen />;
    case 'blockquote': return <BlockquoteScreen />;
    case 'card':       return <CardScreen />;
    case 'heading':    return <HeadingScreen />;
    case 'paragraph':  return <ParagraphScreen />;
    case 'sidenav':    return <SideNavScreen />;
    case 'emptystate': return <EmptyStateScreen />;
    case 'colors':     return <ColorsScreen />;
    case 'typography': return <TypographyScreen />;
    case 'textlist':   return <TextListScreen />;
    case 'motion':      return <MotionScreen />;
    case 'settings':    return <SettingsScreen />;
    case 'iconbutton':  return <IconButtonScreen />;
    case 'link':        return <LinkScreen />;
    case 'list':        return <ListScreen />;
    case 'pagination':  return <PaginationScreen />;
    case 'section':     return <SectionScreen />;
    case 'snackbar':    return <SnackbarScreen />;
    case 'dialog':      return <DialogScreen />;
    case 'components':  return <ComponentsScreen nav={nav} />;
    default:            return <HomeScreen nav={nav} />;
  }
}

type MI = React.ComponentProps<typeof MaterialIcons>['name'];

function NavIcon({ name, active, accentColor }: { name: MI; active?: boolean; accentColor: string }) {
  return <MaterialIcons name={name} size={20} color={active ? accentColor : '#64748b'} />;
}

// ── Bottom tab bar ────────────────────────────────────────────────────────────

const TABS: { id: string; icon: MI; label: string; defaultScreen: string }[] = [
  { id: 'home',       icon: 'home',      label: 'Home',       defaultScreen: 'home'     },
  { id: 'components', icon: 'widgets',   label: 'Components', defaultScreen: 'components' },
  { id: 'tokens',     icon: 'style',     label: 'Tokens',     defaultScreen: 'colors'   },
  { id: 'settings',   icon: 'settings',  label: 'Settings',   defaultScreen: 'settings' },
];

const SCREEN_TAB: Record<string, string> = {
  home:        'home',
  components:  'components',
  button:      'components', card:        'components', heading:    'components',
  paragraph:   'components', sidenav:     'components', iconbutton: 'components',
  link:        'components', pagination:  'components', section:    'components',
  dialog:      'components', badge:       'components', banner:     'components',
  blockquote:  'components', emptystate:  'components', snackbar:   'components',
  list:        'components',
  colors:      'tokens',     typography:  'tokens',     motion:     'tokens',
  textlist:    'components',
  settings:    'settings',
};

function TabBar({
  screen, onNav, bgColor, borderColor, accentColor,
}: {
  screen: string; onNav: (s: string) => void;
  bgColor: string; borderColor: string; accentColor: string;
}) {
  const insets = useSafeAreaInsets();
  const activeTab = SCREEN_TAB[screen] ?? 'home';

  return (
    <View style={[styles.tabBar, { backgroundColor: bgColor, borderTopColor: borderColor, paddingBottom: insets.bottom }]}>
      {TABS.map(tab => {
        const active = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onNav(tab.defaultScreen)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={styles.tabItem}
          >
            <MaterialIcons
              name={tab.icon}
              size={24}
              color={active ? accentColor : '#8290a5'}
            />
            <Text style={[
              styles.tabLabel,
              { color: active ? accentColor : '#8290a5' },
              active && { fontWeight: '600' },
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function TopBar({
  title, onMenuPress, bgColor, borderColor, textColor,
}: {
  title: string; onMenuPress: () => void;
  bgColor: string; borderColor: string; textColor: string;
}) {
  const insets = useSafeAreaInsets();
  const { theme } = useDesignSystem();
  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 8, backgroundColor: bgColor, borderBottomColor: borderColor }]}>
      <Pressable
        onPress={onMenuPress}
        accessibilityRole="button"
        accessibilityLabel="Open navigation menu"
        style={({ pressed }) => [styles.menuBtn, { borderRadius: theme.navItemRadius }, pressed && styles.menuBtnPressed]}
        hitSlop={8}
      >
        <MaterialIcons name="menu" size={24} color={textColor} />
      </Pressable>
      <Text style={[styles.topBarTitle, { color: textColor }]}>{title}</Text>
      <View style={styles.menuBtn} />
    </View>
  );
}

// ── Inner app — has access to SettingsContext ─────────────────────────────────

function AppShell() {
  const { colorMode, themeKey, typeScale } = useSettings();
  const isDark   = useIsDark(colorMode);
  const theme    = A1_THEMES[themeKey];
  const colors   = isDark ? theme.dark : theme.light;
  const fontScale = FONT_SCALES[typeScale] + theme.fontScaleBonus;

  const [screen,  setScreen]  = useState('home');
  const [navOpen, setNavOpen] = useState(false);

  function nav(s: string) { setScreen(s); setNavOpen(false); }
  const is = (s: string) => screen === s;

  return (
    <DesignSystemProvider value={{ fontScale, isDark, theme, colors }}>
      <SideNav
        open={navOpen}
        onClose={() => setNavOpen(false)}
        header={
          <View>
            <Text style={[styles.navTitle, { color: colors.textAccent }]}>{theme.name}</Text>
            <Paragraph size="xs" color="muted">v0.1.0</Paragraph>
          </View>
        }
        footer={
          <SideNavItem
            icon={<NavIcon name="settings" active={is('settings')} accentColor={colors.textAccent} />}
            label="Settings"
            active={is('settings')}
            onPress={() => nav('settings')}
          />
        }
      >
        <SideNavItem icon={<NavIcon name="home" active={is('home')} accentColor={colors.textAccent} />} label="Home" active={is('home')} onPress={() => nav('home')} />
        <SideNavGroup icon={<NavIcon name="widgets" accentColor={colors.textAccent} />} label="Components" defaultOpen>
          <SideNavItem label="Button"      active={is('button')}      onPress={() => nav('button')} />
          <SideNavItem label="Badge"       active={is('badge')}       onPress={() => nav('badge')} />
          <SideNavItem label="Banner"      active={is('banner')}      onPress={() => nav('banner')} />
          <SideNavItem label="Blockquote"  active={is('blockquote')}  onPress={() => nav('blockquote')} />
          <SideNavItem label="Card"        active={is('card')}        onPress={() => nav('card')} />
          <SideNavItem label="Dialog"      active={is('dialog')}      onPress={() => nav('dialog')} />
          <SideNavItem label="Empty State" active={is('emptystate')}  onPress={() => nav('emptystate')} />
          <SideNavItem label="Heading"     active={is('heading')}     onPress={() => nav('heading')} />
          <SideNavItem label="IconButton"  active={is('iconbutton')}  onPress={() => nav('iconbutton')} />
          <SideNavItem label="Link"        active={is('link')}        onPress={() => nav('link')} />
          <SideNavItem label="List"        active={is('list')}        onPress={() => nav('list')} />
          <SideNavItem label="Pagination"  active={is('pagination')}  onPress={() => nav('pagination')} />
          <SideNavItem label="Paragraph"   active={is('paragraph')}   onPress={() => nav('paragraph')} />
          <SideNavItem label="Section"     active={is('section')}     onPress={() => nav('section')} />
          <SideNavItem label="SideNav"     active={is('sidenav')}     onPress={() => nav('sidenav')} />
          <SideNavItem label="Snackbar"    active={is('snackbar')}    onPress={() => nav('snackbar')} />
          <SideNavItem label="Text List"   active={is('textlist')}    onPress={() => nav('textlist')} />
        </SideNavGroup>
        <SideNavGroup icon={<NavIcon name="style" accentColor={colors.textAccent} />} label="Design Tokens">
          <SideNavItem label="Colors"     active={is('colors')}     onPress={() => nav('colors')} />
          <SideNavItem label="Typography" active={is('typography')} onPress={() => nav('typography')} />
          <SideNavItem icon={<NavIcon name="animation" accentColor={colors.textAccent} />} label="Motion" active={is('motion')} onPress={() => nav('motion')} />
        </SideNavGroup>
      </SideNav>

      {/* Remove 'bottom' edge — TabBar handles its own bottom inset */}
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.pageBg }]} edges={['left', 'right']}>
        <TopBar
          title={TITLES[screen] ?? 'A1'}
          onMenuPress={() => setNavOpen(true)}
          bgColor={colors.surfaceBg}
          borderColor={colors.borderSubtle}
          textColor={colors.textDefault}
        />
        <View style={[styles.content, { backgroundColor: colors.pageBg }]}>
          <ActiveScreen screen={screen} nav={nav} />
        </View>
        <TabBar
          screen={screen}
          onNav={nav}
          bgColor={colors.surfaceBg}
          borderColor={colors.borderSubtle}
          accentColor={colors.textAccent}
        />
      </SafeAreaView>
    </DesignSystemProvider>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [fontsLoaded] = useFonts({
    // Accessible theme — Atkinson Hyperlegible (accessibility/legibility)
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    // Heritage theme — Nunito body, Libre Baskerville heading, Roboto Slab display
    Nunito_400Regular,
    Nunito_700Bold,
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
    RobotoSlab_300Light,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SettingsProvider>
        <AppShell />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f7' },
  safe: { flex: 1 },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingBottom: 4,
  },
  tabLabel: {
    fontFamily: 'System',
    fontSize: 10,
    letterSpacing: 0.1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  topBarTitle: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtnPressed: {
    backgroundColor: 'rgba(6, 11, 20, 0.08)',
  },
  navTitle: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
  },
});
