import { View } from 'react-native';
import { Heading, Paragraph, typographyTokens } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function TypographyScreen() {
  return (
    <ScreenShell title="Typography" subtitle="The complete type scale and token values.">

      <Section title="Heading scale">
        {(Object.entries(typographyTokens.heading.sizes) as [string, number][]).map(([size, px]) => (
          <View key={size} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#e8ecf2' }}>
            <Paragraph size="xs" color="muted" style={{ width: 32, textAlign: 'right' }}>{size}</Paragraph>
            <Heading size={size as any} style={{ flex: 1 }} numberOfLines={1}>Heading {size}</Heading>
            <Paragraph size="xs" color="muted">{px}px · 700</Paragraph>
          </View>
        ))}
      </Section>

      <Section title="Display scale">
        {(Object.entries(typographyTokens.display.sizes) as [string, number][]).map(([size, px]) => (
          <View key={size} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#e8ecf2' }}>
            <Paragraph size="xs" color="muted" style={{ width: 32, textAlign: 'right' }}>{size}</Paragraph>
            <Heading type="display" size={size as any} style={{ flex: 1 }} numberOfLines={1}>Display {size}</Heading>
            <Paragraph size="xs" color="muted">{px}px · 900</Paragraph>
          </View>
        ))}
      </Section>

      <Section title="Body scale">
        {(Object.entries(typographyTokens.body.sizes) as [string, number][]).map(([size, px]) => (
          <View key={size} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#e8ecf2' }}>
            <Paragraph size="xs" color="muted" style={{ width: 32, textAlign: 'right' }}>{size}</Paragraph>
            <Paragraph size={size as any} style={{ flex: 1 }}>The quick brown fox jumps over the lazy dog.</Paragraph>
            <Paragraph size="xs" color="muted">{px}px · 400</Paragraph>
          </View>
        ))}
      </Section>

    </ScreenShell>
  );
}
