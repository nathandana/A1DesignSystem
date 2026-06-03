import { View } from 'react-native';
import { Badge, Card, Heading, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function BadgeScreen() {
  return (
    <ScreenShell title="Badge" subtitle="Small labels for state, category, count, and metadata.">
      <Section title="Statuses">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Badge status="neutral">Draft</Badge>
          <Badge status="info">In review</Badge>
          <Badge status="success">Live</Badge>
          <Badge status="warn">Needs review</Badge>
          <Badge status="error">Blocked</Badge>
        </View>
      </Section>

      <Section title="Subtle">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Badge status="neutral" subtle>Draft</Badge>
          <Badge status="info" subtle>In review</Badge>
          <Badge status="success" subtle>Live</Badge>
          <Badge status="warn" subtle>Needs review</Badge>
          <Badge status="error" subtle>Blocked</Badge>
        </View>
      </Section>

      <Section title="Sizes">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Badge size="sm" status="neutral">Small</Badge>
          <Badge size="md" status="info">Medium</Badge>
          <Badge size="lg" status="success">Large</Badge>
        </View>
      </Section>

      <Section title="In context">
        <Card>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <Heading size="sm">Design tokens</Heading>
              <Badge status="success" icon="check">Synced</Badge>
            </View>
            <Paragraph size="sm" color="muted">
              Semantic color, type scale, radius, and motion values are available to the app.
            </Paragraph>
            <Badge size="sm" status="info" subtle icon="style">Theme aware</Badge>
          </View>
        </Card>
      </Section>
    </ScreenShell>
  );
}
