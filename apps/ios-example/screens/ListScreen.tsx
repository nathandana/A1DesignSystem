import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Badge, List, ListItem, useDesignSystem } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function ListScreen() {
  const { colors } = useDesignSystem();

  return (
    <ScreenShell title="List" subtitle="Structured rows for navigation, settings, and grouped content.">
      <Section title="Navigation">
        <List>
          <ListItem
            title="Components"
            description="Buttons, cards, banners, and more"
            leading={<MaterialIcons name="widgets" size={22} color={colors.textAccent} />}
            trailing={<MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />}
            onPress={() => {}}
          />
          <ListItem
            title="Design tokens"
            description="Color, typography, and motion"
            leading={<MaterialIcons name="style" size={22} color={colors.textAccent} />}
            trailing={<MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />}
            onPress={() => {}}
          />
          <ListItem
            title="Settings"
            description="Theme, mode, and type scale"
            leading={<MaterialIcons name="settings" size={22} color={colors.textAccent} />}
            trailing={<MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />}
            onPress={() => {}}
          />
        </List>
      </Section>

      <Section title="Metadata">
        <List>
          <ListItem title="Base theme" description="Purple accent, rounded controls" trailing={<Badge size="sm">Default</Badge>} />
          <ListItem title="Accessible theme" description="Larger type and hyperlegible font" trailing={<Badge size="sm" tone="success">Ready</Badge>} />
          <ListItem title="Heritage theme" description="Warm neutrals with deep teal" trailing={<Badge size="sm" tone="neutral">Classic</Badge>} />
        </List>
      </Section>

      <Section title="Plain">
        <View style={{ gap: 8 }}>
          <List inset={false} divided={false}>
            <ListItem title="No inset container" description="Rows can sit inside another surface." />
            <ListItem title="No dividers" description="Use gap spacing for softer grouping." />
          </List>
        </View>
      </Section>
    </ScreenShell>
  );
}
