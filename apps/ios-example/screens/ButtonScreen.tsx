import { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@gtivr4/a1-design-system-react-native';
import { Row, ScreenShell, Section } from './ScreenShell';

export function ButtonScreen() {
  const [loading, setLoading] = useState(false);

  function handleLoadingDemo() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <ScreenShell title="Button" subtitle="Trigger actions and navigate the app.">

      <Section title="Variants">
        <View style={{ gap: 8 }}>
          <Button variant="primary"     fullWidth onPress={() => {}}>Primary</Button>
          <Button variant="secondary"   fullWidth onPress={() => {}}>Secondary</Button>
          <Button variant="tertiary"    fullWidth onPress={() => {}}>Tertiary</Button>
          <Button variant="destructive" fullWidth onPress={() => {}}>Destructive</Button>
          <Button variant="success"     fullWidth onPress={() => {}}>Success</Button>
        </View>
      </Section>

      <Section title="Sizes">
        <Row>
          <Button variant="primary" size="sm" onPress={() => {}}>Small</Button>
          <Button variant="primary" size="md" onPress={() => {}}>Medium</Button>
          <Button variant="primary" size="lg" onPress={() => {}}>Large</Button>
        </Row>
      </Section>

      <Section title="Pill shape">
        <Row>
          <Button variant="primary" pill onPress={() => {}}>Continue</Button>
          <Button variant="secondary" pill onPress={() => {}}>Cancel</Button>
          <Button variant="tertiary" pill onPress={() => {}}>Skip</Button>
        </Row>
      </Section>

      <Section title="With icons">
        <View style={{ gap: 8 }}>
          <Row>
            <Button variant="primary"   icon="add" onPress={() => {}}>Add item</Button>
            <Button variant="secondary" icon="download" onPress={() => {}}>Download</Button>
          </Row>
          <Row>
            <Button variant="primary"   icon="arrow-forward" iconPosition="end" onPress={() => {}}>Continue</Button>
            <Button variant="destructive" icon="delete" iconPosition="end" onPress={() => {}}>Delete</Button>
          </Row>
        </View>
      </Section>

      <Section title="Full width">
        <View style={{ gap: 8 }}>
          <Button variant="primary" size="lg" pill fullWidth icon="arrow-forward" iconPosition="end" onPress={() => {}}>
            Get started
          </Button>
          <Button variant="secondary" fullWidth onPress={() => {}}>Sign in instead</Button>
          <Button variant="tertiary"  fullWidth onPress={() => {}}>Maybe later</Button>
        </View>
      </Section>

      <Section title="Loading state">
        <Button variant="primary" fullWidth loading={loading} onPress={handleLoadingDemo}>
          {loading ? 'Saving…' : 'Tap to simulate save'}
        </Button>
      </Section>

      <Section title="Disabled">
        <Row>
          <Button variant="primary"   disabled onPress={() => {}}>Primary</Button>
          <Button variant="secondary" disabled onPress={() => {}}>Secondary</Button>
          <Button variant="tertiary"  disabled onPress={() => {}}>Tertiary</Button>
        </Row>
      </Section>

    </ScreenShell>
  );
}
