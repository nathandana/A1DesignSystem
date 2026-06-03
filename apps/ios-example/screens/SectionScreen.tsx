import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Heading, Paragraph, Section, useDesignSystem } from '@gtivr4/a1-design-system-react-native';

// Helper label shown above each demo section
function DemoLabel({ text }: { text: string }) {
  return (
    <Heading size="xs" color="muted" style={{ letterSpacing: 0.5, textTransform: 'uppercase', paddingHorizontal: 20 }}>
      {text}
    </Heading>
  );
}

export function SectionScreen() {
  const { colors } = useDesignSystem();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.pageBg }}
      contentContainerStyle={{ gap: 20, paddingTop: 24, paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page title — inset */}
      <View style={{ paddingHorizontal: 20, gap: 4 }}>
        <Heading type="display" size="md">Section</Heading>
        <Paragraph color="muted">Full-viewport layout container with surface, padding, gap, and inverse.</Paragraph>
      </View>

      {/* ── Surfaces ────────────────────────────────────── */}
      <DemoLabel text="Surfaces" />
      <Section surface="page" padding="md" gap="sm">
        <Heading size="sm">Page surface</Heading>
        <Paragraph size="sm" color="muted">Uses the page background — blends into the screen.</Paragraph>
      </Section>
      <Section surface="panel" padding="md" gap="sm">
        <Heading size="sm">Panel surface</Heading>
        <Paragraph size="sm" color="muted">Slightly tinted — used for sidebars and grouped content.</Paragraph>
      </Section>
      <Section surface="raised" padding="md" gap="sm">
        <Heading size="sm">Raised surface</Heading>
        <Paragraph size="sm" color="muted">Highest elevation — floating panels and popovers.</Paragraph>
      </Section>

      {/* ── Inverse ─────────────────────────────────────── */}
      <DemoLabel text="Inverse" />
      <Section inverse padding="lg" gap="md">
        <Heading size="md">Inverse section</Heading>
        <Paragraph color="muted">
          Dark island on a light page. All child components — Heading, Paragraph, Button — automatically switch to the dark token set.
        </Paragraph>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button variant="primary"   onPress={() => {}}>Primary</Button>
          <Button variant="secondary" onPress={() => {}}>Secondary</Button>
          <Button variant="tertiary"  onPress={() => {}}>Tertiary</Button>
        </View>
      </Section>

      {/* ── Padding ─────────────────────────────────────── */}
      <DemoLabel text="Padding" />
      {(['lg', 'md', 'sm', 'none'] as const).map(p => (
        <Section key={p} surface="panel" padding={p}>
          <Paragraph size="sm">padding="{p}"</Paragraph>
        </Section>
      ))}

      {/* ── Gap ─────────────────────────────────────────── */}
      <DemoLabel text="Gap" />
      {(['lg', 'md', 'sm', 'xs'] as const).map(g => (
        <Section key={g} surface="panel" padding="md" gap={g}>
          <Heading size="xs">gap="{g}"</Heading>
          <Paragraph size="sm" color="muted">Items spaced with token gap value.</Paragraph>
          <Button variant="secondary" onPress={() => {}}>Action</Button>
        </Section>
      ))}

      {/* ── Combined CTA ────────────────────────────────── */}
      <DemoLabel text="Combined" />
      <Section surface="panel" padding="lg" gap="md">
        <Heading size="md">Get started today</Heading>
        <Paragraph color="muted">
          Combine surface, padding, and gap for consistent full-width layout blocks across screens.
        </Paragraph>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button variant="primary"   onPress={() => {}}>Get started</Button>
          <Button variant="secondary" onPress={() => {}}>Learn more</Button>
        </View>
      </Section>
    </ScrollView>
  );
}
