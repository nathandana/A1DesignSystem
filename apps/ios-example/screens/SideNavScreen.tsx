import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Card, Heading, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

function PropRow({ name, type, description }: { name: string; type: string; description: string }) {
  return (
    <View style={{ gap: 2, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e8ecf2' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Heading size="xs" color="accent">{name}</Heading>
        <Paragraph size="xs" color="muted">{type}</Paragraph>
      </View>
      <Paragraph size="sm" color="muted">{description}</Paragraph>
    </View>
  );
}

export function SideNavScreen() {
  return (
    <ScreenShell title="SideNav" subtitle="Full-screen navigation drawer with safe-area support.">

      <Section title="Overview">
        <Card>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <MaterialIcons name="menu" size={24} color="#7c3aed" style={{ marginTop: 2 }} />
            <View style={{ flex: 1, gap: 6 }}>
              <Paragraph>
                You're looking at it. The hamburger <Paragraph style={{ color: '#7c3aed', fontWeight: '600' }}>☰</Paragraph> in the top bar opens this component.
              </Paragraph>
              <Paragraph color="muted" size="sm">
                It slides in full-width with a spring animation, dims the background with a scrim, and respects the Dynamic Island safe area at the top.
              </Paragraph>
            </View>
          </View>
        </Card>
      </Section>

      <Section title="Sub-components">
        <View style={{ gap: 8 }}>
          {[
            { icon: 'menu' as const,        name: 'SideNav',      desc: 'The drawer shell. Manages open/close animation, scrim, and safe-area insets.' },
            { icon: 'link' as const,        name: 'SideNavItem',  desc: 'A leaf navigation item with icon, label, active state, and optional badge.' },
            { icon: 'folder-open' as const, name: 'SideNavGroup', desc: 'Expandable group that reveals nested items. Supports controlled and uncontrolled open state.' },
          ].map(({ icon, name, desc }) => (
            <Card key={name} icon={icon}>
              <Heading size="sm" style={{ marginBottom: 4 }}>{name}</Heading>
              <Paragraph size="sm" color="muted">{desc}</Paragraph>
            </Card>
          ))}
        </View>
      </Section>

      <Section title="SideNav props">
        <View>
          <PropRow name="open"     type="boolean"          description="Controls drawer visibility." />
          <PropRow name="onClose" type="() => void"        description="Called when scrim is tapped or hardware back is pressed." />
          <PropRow name="header"  type="ReactNode"         description="Content shown above nav items, below the safe-area inset." />
          <PropRow name="footer"  type="ReactNode"         description="Content pinned to the bottom, padded for the home indicator." />
        </View>
      </Section>

      <Section title="SideNavItem props">
        <View>
          <PropRow name="label"   type="string"            description="Visible text label." />
          <PropRow name="icon"    type="ReactNode"         description="Any icon element (e.g. MaterialIcons)." />
          <PropRow name="active"  type="boolean"           description="Highlights item as the current route." />
          <PropRow name="badge"   type="string | number"   description="Badge shown at the end of the row." />
          <PropRow name="onPress" type="() => void"        description="Called when the item is tapped." />
        </View>
      </Section>

    </ScreenShell>
  );
}
