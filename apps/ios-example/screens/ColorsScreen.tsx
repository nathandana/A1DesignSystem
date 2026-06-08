import { View } from 'react-native';
import { Heading, Paragraph, useDesignSystem } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

function Swatch({ color, label, hex }: { color: string; label: string; hex: string }) {
  const { theme, colors } = useDesignSystem();
  const isLight = parseInt(hex.slice(1, 3), 16) > 180 &&
                  parseInt(hex.slice(3, 5), 16) > 180 &&
                  parseInt(hex.slice(5, 7), 16) > 180;
  return (
    <View style={{ flex: 1, minWidth: 80 }}>
      <View style={{
        height: 56, borderRadius: theme.cardRadius, backgroundColor: hex,
        borderWidth: isLight ? 1 : 0, borderColor: colors.borderSubtle,
        marginBottom: 4,
      }} />
      <Paragraph size="xs" style={{ fontWeight: '500' }}>{label}</Paragraph>
      <Paragraph size="xs" color="muted">{hex}</Paragraph>
    </View>
  );
}

function SwatchRow({ swatches }: { swatches: Array<{ label: string; hex: string }> }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {swatches.map(s => <Swatch key={s.label} color={s.hex} label={s.label} hex={s.hex} />)}
    </View>
  );
}

export function ColorsScreen() {
  return (
    <ScreenShell title="Colors" subtitle="Semantic color tokens from the design system.">

      <Section title="Action">
        <SwatchRow swatches={[
          { label: 'Background',  hex: '#7c3aed' },
          { label: 'Pressed',     hex: '#230051' },
          { label: 'Surface',     hex: '#f5f3ff' },
          { label: 'Border',      hex: '#b5a0ff' },
          { label: 'Foreground',  hex: '#e8e4ff' },
        ]} />
      </Section>

      <Section title="Text">
        <SwatchRow swatches={[
          { label: 'Default',  hex: '#060b14' },
          { label: 'Muted',    hex: '#64748b' },
          { label: 'Accent',   hex: '#7c3aed' },
          { label: 'Inverse',  hex: '#ffffff' },
        ]} />
      </Section>

      <Section title="Surface">
        <SwatchRow swatches={[
          { label: 'Page',    hex: '#ffffff' },
          { label: 'Panel',   hex: '#f0f6fe' },
          { label: 'Raised',  hex: '#e1e8f3' },
          { label: 'Inverse', hex: '#060b14' },
        ]} />
      </Section>

      <Section title="Border">
        <SwatchRow swatches={[
          { label: 'Subtle',  hex: '#c8d2e0' },
          { label: 'Default', hex: '#a6b2c4' },
          { label: 'Strong',  hex: '#64748b' },
        ]} />
      </Section>

      <Section title="Status — Info">
        <SwatchRow swatches={[
          { label: 'Background', hex: '#2563eb' },
          { label: 'Surface',    hex: '#f0f5ff' },
          { label: 'Border',     hex: '#87b0ff' },
          { label: 'Foreground', hex: '#fafcff' },
        ]} />
      </Section>

      <Section title="Status — Success">
        <SwatchRow swatches={[
          { label: 'Background', hex: '#003f17' },
          { label: 'Surface',    hex: '#dfffe4' },
          { label: 'Border',     hex: '#78c687' },
          { label: 'Foreground', hex: '#f5fff6' },
        ]} />
      </Section>

      <Section title="Status — Error">
        <SwatchRow swatches={[
          { label: 'Background', hex: '#dc2626' },
          { label: 'Surface',    hex: '#fff2f0' },
          { label: 'Border',     hex: '#ff8b7e' },
          { label: 'Foreground', hex: '#fffbfa' },
        ]} />
      </Section>

      <Section title="Status — Warn">
        <SwatchRow swatches={[
          { label: 'Background', hex: '#4f2700' },
          { label: 'Surface',    hex: '#fff3ea' },
          { label: 'Border',     hex: '#e59f68' },
          { label: 'Foreground', hex: '#fffbf8' },
        ]} />
      </Section>

    </ScreenShell>
  );
}
