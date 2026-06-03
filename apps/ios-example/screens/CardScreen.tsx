import { Alert, View } from 'react-native';
import { Button, Card, Heading, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { Row, ScreenShell, Section } from './ScreenShell';

export function CardScreen() {
  return (
    <ScreenShell title="Card" subtitle="Group related content and actions.">

      <Section title="Default">
        <Card>
          <Heading size="sm" style={{ marginBottom: 6 }}>Card title</Heading>
          <Paragraph color="muted">Supporting text that describes the card content in more detail.</Paragraph>
        </Card>
      </Section>

      <Section title="With icon badge">
        <Row>
          <Card style={{ flex: 1 }} icon="bolt">
            <Heading size="sm" style={{ marginBottom: 4 }}>Performance</Heading>
            <Paragraph size="sm" color="muted">Optimised rendering at any scale.</Paragraph>
          </Card>
          <Card style={{ flex: 1 }} icon="shield">
            <Heading size="sm" style={{ marginBottom: 4 }}>Security</Heading>
            <Paragraph size="sm" color="muted">Enterprise-grade protection.</Paragraph>
          </Card>
        </Row>
      </Section>

      <Section title="Hero cards">
        <Row>
          {([ { c: 'action', i: 'bolt'    },
               { c: 'info',   i: 'info'    },
               { c: 'success',i: 'check'   },
               { c: 'error',  i: 'warning' },
          ] as const).map(({ c, i }) => (
            <Card key={c} style={{ flex: 1 }} heroIcon={i} heroColor={c}>
              <Heading size="xs">{c.charAt(0).toUpperCase() + c.slice(1)}</Heading>
            </Card>
          ))}
        </Row>
      </Section>

      <Section title="Pressable">
        <View style={{ gap: 8 }}>
          <Card onPress={() => Alert.alert('Card tapped', 'Home screen')}>
            <Heading size="sm" style={{ marginBottom: 4 }}>Navigate anywhere</Heading>
            <Paragraph size="sm" color="muted">Tap this card — it scales on press and triggers haptic feedback.</Paragraph>
          </Card>
          <Row>
            <Card style={{ flex: 1 }} icon="star" onPress={() => Alert.alert('Quality')}>
              <Heading size="sm">Quality</Heading>
              <Paragraph size="xs" color="muted">Every component reviewed.</Paragraph>
            </Card>
            <Card style={{ flex: 1 }} icon="speed" onPress={() => Alert.alert('Speed')}>
              <Heading size="sm">Speed</Heading>
              <Paragraph size="xs" color="muted">Native performance on device.</Paragraph>
            </Card>
          </Row>
        </View>
      </Section>

      <Section title="With actions">
        <Card>
          <Heading size="sm" style={{ marginBottom: 6 }}>Confirm action</Heading>
          <Paragraph color="muted" style={{ marginBottom: 16 }}>
            Are you sure you want to proceed? This cannot be undone.
          </Paragraph>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button variant="primary"   style={{ flex: 1 }} onPress={() => Alert.alert('Confirmed')}>Confirm</Button>
            <Button variant="secondary" style={{ flex: 1 }} onPress={() => Alert.alert('Cancelled')}>Cancel</Button>
          </View>
        </Card>
      </Section>

      <Section title="Bare (no chrome)">
        <Card bare>
          <Heading size="sm" style={{ marginBottom: 4 }}>Bare card</Heading>
          <Paragraph color="muted">No border, shadow, or padding — just structural containment.</Paragraph>
        </Card>
      </Section>

    </ScreenShell>
  );
}
