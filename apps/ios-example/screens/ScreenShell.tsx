import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Heading, Paragraph, useDesignSystem } from '@gtivr4/a1-design-system-react-native';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Heading size="xs" color="muted" style={styles.sectionLabel}>{title}</Heading>
      {children}
    </View>
  );
}

export function Row({ children, wrap = false }: { children: React.ReactNode; wrap?: boolean }) {
  return <View style={[styles.row, wrap && styles.wrap]}>{children}</View>;
}

interface ScreenShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ScreenShell({ title, subtitle, children }: ScreenShellProps) {
  const { isDark } = useDesignSystem();
  const bg = isDark ? '#0f172a' : '#f5f5f7';

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: bg }]}
      style={{ backgroundColor: bg }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Heading type="display" size="md">{title}</Heading>
        {subtitle && <Paragraph color="muted">{subtitle}</Paragraph>}
      </View>
      {children}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  wrap: {
    flexWrap: 'wrap',
  },
});
