import { View } from 'react-native';
import { Heading, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

const SAMPLE = 'The quick brown fox jumps over the lazy dog. Design tokens are the atomic values that underpin your visual language.';

export function ParagraphScreen() {
  return (
    <ScreenShell title="Paragraph" subtitle="Body text using the type scale.">

      <Section title="Size scale">
        <View style={{ gap: 12 }}>
          {sizes.map(size => (
            <View key={size} style={{ gap: 2 }}>
              <Heading size="xs" color="muted">{size}</Heading>
              <Paragraph size={size}>{SAMPLE}</Paragraph>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Colors">
        <View style={{ gap: 8 }}>
          <Paragraph>Default — primary body text color for main content.</Paragraph>
          <Paragraph color="muted">Muted — supporting text, captions, and metadata.</Paragraph>
        </View>
      </Section>

      <Section title="In context">
        <View style={{ gap: 8 }}>
          <Heading size="lg">What is a design token?</Heading>
          <Paragraph>
            Design tokens are the atomic values that underpin your visual language — spacing, colour, and type all in one place. They replace hardcoded values like <Paragraph style={{ color: '#7c3aed' }}>#2563eb</Paragraph> or <Paragraph style={{ color: '#7c3aed' }}>16px</Paragraph> with named references that can be swapped across platforms.
          </Paragraph>
          <Paragraph color="muted" size="sm">
            A single token change ripples consistently across web, iOS, and Android simultaneously — no find-and-replace required.
          </Paragraph>
        </View>
      </Section>

    </ScreenShell>
  );
}
