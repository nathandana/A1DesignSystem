import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Card, Heading, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

const EASINGS = [
  { name: 'Standard',   value: 'cubic-bezier(0.4, 0, 0.2, 1)',   rn: [0.4, 0, 0.2, 1]   as [number,number,number,number] },
  { name: 'Enter',      value: 'cubic-bezier(0, 0, 0.2, 1)',      rn: [0, 0, 0.2, 1]     as [number,number,number,number] },
  { name: 'Exit',       value: 'cubic-bezier(0.4, 0, 1, 1)',      rn: [0.4, 0, 1, 1]     as [number,number,number,number] },
  { name: 'Expressive', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', rn: [0.34, 1.56, 0.64, 1] as [number,number,number,number] },
  { name: 'Sharp',      value: 'cubic-bezier(0.4, 0, 0.6, 1)',    rn: [0.4, 0, 0.6, 1]   as [number,number,number,number] },
];

const DURATIONS = [
  { name: 'Instant', ms: 0 },
  { name: 'Quick',   ms: 100 },
  { name: 'Fast',    ms: 150 },
  { name: 'Normal',  ms: 200 },
  { name: 'Slow',    ms: 300 },
  { name: 'Slower',  ms: 500 },
  { name: 'Slowest', ms: 750 },
];

function EasingDemo({ name, easing }: { name: string; easing: [number, number, number, number] }) {
  const x = useRef(new Animated.Value(0)).current;
  const [running, setRunning] = useState(false);

  function play() {
    if (running) return;
    setRunning(true);
    x.setValue(0);
    Animated.timing(x, {
      toValue: 1,
      duration: 600,
      easing: require('react-native').Easing.bezier(...easing),
      useNativeDriver: true,
    }).start(() => setRunning(false));
  }

  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [0, 200] });

  return (
    <Pressable onPress={play} style={styles.easingRow}>
      <Paragraph size="sm" style={{ width: 80 }}>{name}</Paragraph>
      <View style={styles.track}>
        <Animated.View style={[styles.dot, { transform: [{ translateX }] }]} />
      </View>
    </Pressable>
  );
}

export function MotionScreen() {
  return (
    <ScreenShell title="Motion" subtitle="Duration and easing tokens. Tap a row to preview.">

      <Section title="Durations">
        <View style={{ gap: 0 }}>
          {DURATIONS.map(({ name, ms }) => (
            <View key={name} style={styles.durationRow}>
              <Paragraph size="sm" style={{ width: 64 }}>{name}</Paragraph>
              <View style={styles.durationBar}>
                <View style={[styles.durationFill, { width: Math.max(4, ms / 750 * 200) }]} />
              </View>
              <Paragraph size="xs" color="muted" style={{ width: 36, textAlign: 'right' }}>{ms}ms</Paragraph>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Easing curves — tap to animate">
        <Card>
          <View style={{ gap: 4 }}>
            {EASINGS.map(e => <EasingDemo key={e.name} name={e.name} easing={e.rn} />)}
          </View>
        </Card>
      </Section>

    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf2',
  },
  durationBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e8ecf2',
    borderRadius: 3,
    overflow: 'hidden',
  },
  durationFill: {
    height: 6,
    backgroundColor: '#7c3aed',
    borderRadius: 3,
  },
  easingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf2',
  },
  track: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#7c3aed',
  },
});
