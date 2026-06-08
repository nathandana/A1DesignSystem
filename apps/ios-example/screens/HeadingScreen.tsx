import { View } from 'react-native';
import { Heading, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

const headingSizes = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;
const displaySizes = ['jumbo', 'xxl', 'xl', 'lg', 'md', 'sm'] as const;

export function HeadingScreen() {
  return (
    <ScreenShell title="Heading" subtitle="Semantic headings using the type scale.">

      <Section title="Heading scale">
        <View style={{ gap: 4 }}>
          {headingSizes.map(size => (
            <View key={size} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Paragraph size="xs" color="muted" style={{ width: 28, textAlign: 'right' }}>{size}</Paragraph>
              <Heading size={size}>{size.toUpperCase()}</Heading>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Display scale">
        <View style={{ gap: 4 }}>
          {displaySizes.map(size => (
            <View key={size} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Paragraph size="xs" color="muted" style={{ width: 28, textAlign: 'right' }}>{size}</Paragraph>
              <Heading type="display" size={size} numberOfLines={1}>{size}</Heading>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Colors">
        <View style={{ gap: 6 }}>
          <Heading size="lg">Default color</Heading>
          <Heading size="lg" color="muted">Muted color</Heading>
          <Heading size="lg" color="accent">Accent color</Heading>
        </View>
      </Section>

      <Section title="In context">
        <View style={{ gap: 8 }}>
          <Heading type="display" size="md">Unlock the full potential of your design system</Heading>
          <Heading size="lg">Section heading</Heading>
          <Heading size="md">Subsection</Heading>
          <Paragraph color="muted">
            Body text follows naturally after a heading, providing the supporting detail that gives the heading its context and meaning.
          </Paragraph>
        </View>
      </Section>

    </ScreenShell>
  );
}
