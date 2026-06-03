import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  A1_THEMES,
  FONT_SCALES,
  THEME_ACCENTS,
  type A1ThemeKey,
  type ColorMode,
  type TypeScaleKey,
  useDesignSystem,
} from '@gtivr4/a1-design-system-react-native';
import { Heading, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { useSettings } from '../context/SettingsContext';
import { ScreenShell, Section } from './ScreenShell';

// ── Generic option picker ─────────────────────────────────────────────────────

function OptionPicker<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; icon?: React.ComponentProps<typeof MaterialIcons>['name'] }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors, theme } = useDesignSystem();

  return (
    <View style={[styles.picker, { borderRadius: theme.cardRadius, backgroundColor: colors.surfaceBg, borderColor: colors.borderSubtle }]}>
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.option,
              i < options.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
              active   && { backgroundColor: colors.accentSurface },
              pressed && !active && { backgroundColor: colors.pressedBg },
            ]}
          >
            {opt.icon && (
              <MaterialIcons
                name={opt.icon}
                size={18}
                color={active ? colors.textAccent : colors.textMuted}
              />
            )}
            <Paragraph
              style={[
                styles.optionLabel,
                { color: active ? colors.textAccent : colors.textDefault },
                active && { fontWeight: '600' },
              ]}
            >
              {opt.label}
            </Paragraph>
            {active && <MaterialIcons name="check" size={18} color={colors.textAccent} />}
          </Pressable>
        );
      })}
    </View>
  );
}

// ── Theme swatches ────────────────────────────────────────────────────────────

function ThemeSwatch({
  themeKey, selected, onPress,
}: {
  themeKey: A1ThemeKey; selected: boolean; onPress: () => void;
}) {
  const { colors, theme: activeTheme } = useDesignSystem();
  const { accent } = THEME_ACCENTS[themeKey];
  const theme = A1_THEMES[themeKey];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.swatch,
        {
          borderRadius: activeTheme.cardRadius,
          borderColor: selected ? accent : colors.borderSubtle,
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      <View style={[styles.swatchCircle, { backgroundColor: accent }]}>
        {selected && <MaterialIcons name="check" size={16} color="#fff" />}
      </View>
      <Paragraph size="xs" style={{ color: selected ? accent : colors.textMuted, fontWeight: selected ? '600' : '400' }}>
        {theme.name}
      </Paragraph>
      <Paragraph size="xs" color="muted" style={{ textAlign: 'center', fontSize: 10 }}>
        {theme.buttonRadius}px
      </Paragraph>
    </Pressable>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function SettingsScreen() {
  const { colorMode, themeKey, typeScale, setColorMode, setThemeKey, setTypeScale } = useSettings();
  const { colors, theme } = useDesignSystem();

  const fontScale = FONT_SCALES[typeScale];
  const previewPx = Math.round(16 * fontScale);

  return (
    <ScreenShell title="Settings" subtitle="Customise the app appearance.">

      {/* Theme */}
      <Section title="Theme">
        <View style={styles.swatchRow}>
          {(['base', 'accessible', 'heritage'] as A1ThemeKey[]).map(key => (
            <ThemeSwatch
              key={key}
              themeKey={key}
              selected={themeKey === key}
              onPress={() => setThemeKey(key)}
            />
          ))}
        </View>
      </Section>

      {/* Color mode */}
      <Section title="Color mode">
        <OptionPicker<ColorMode>
          value={colorMode}
          onChange={setColorMode}
          options={[
            { value: 'light',  label: 'Light',  icon: 'wb-sunny'     },
            { value: 'dark',   label: 'Dark',   icon: 'nightlight'   },
            { value: 'system', label: 'System', icon: 'phone-iphone' },
          ]}
        />
      </Section>

      {/* Type scale */}
      <Section title="Type scale">
        <OptionPicker<TypeScaleKey>
          value={typeScale}
          onChange={setTypeScale}
          options={[
            { value: 'sm', label: 'Small — 14px base'   },
            { value: 'md', label: 'Normal — 16px base'  },
            { value: 'lg', label: 'Large — 18px base'   },
            { value: 'xl', label: 'X-Large — 20px base' },
          ]}
        />
        <Paragraph size="xs" color="muted">
          Base {previewPx}px · ×{fontScale}
        </Paragraph>
      </Section>

      {/* Package info */}
      <Section title="Package">
        <View style={[styles.infoCard, { borderRadius: theme.cardRadius, backgroundColor: colors.surfaceBg, borderColor: colors.borderSubtle }]}>
          {[
            { label: 'Version',  value: '0.1.0'          },
            { label: 'Expo SDK', value: '56.0'           },
            { label: 'RN',       value: '0.85'           },
            { label: 'Package',  value: '@gtivr4/a1-design-system-react-native' },
          ].map(({ label, value }, i, arr) => (
            <View
              key={label}
              style={[
                styles.infoRow,
                i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
              ]}
            >
              <Paragraph size="sm" color="muted">{label}</Paragraph>
              <Paragraph size="sm" style={{ fontWeight: '500' }}>{value}</Paragraph>
            </View>
          ))}
        </View>
      </Section>

    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  picker: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  optionLabel: {
    flex: 1,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  swatch: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },
  swatchCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
