import { Alert, View } from 'react-native';
import { Heading, Link, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function LinkScreen() {
  return (
    <ScreenShell title="Link" subtitle="Inline text links with underline and accent colour.">

      <Section title="Sizes">
        <View style={{ gap: 10 }}>
          {(['xl', 'lg', 'md', 'sm', 'xs'] as const).map(size => (
            <Link key={size} size={size} onPress={() => Alert.alert(size)}>
              {size.toUpperCase()} — Open link
            </Link>
          ))}
        </View>
      </Section>

      <Section title="Weights">
        <View style={{ gap: 10 }}>
          {(['normal', 'medium', 'semibold', 'bold'] as const).map(w => (
            <Link key={w} weight={w} onPress={() => {}}>
              Weight: {w}
            </Link>
          ))}
        </View>
      </Section>

      <Section title="With icons">
        <View style={{ gap: 12 }}>
          <Link
            icon="open-in-new"
            iconPosition="end"
            onPress={() => Alert.alert('Open')}
          >
            Open in browser
          </Link>
          <Link
            icon="arrow-back"
            iconPosition="start"
            onPress={() => Alert.alert('Back')}
          >
            Go back
          </Link>
          <Link
            icon="download"
            iconPosition="start"
            weight="semibold"
            onPress={() => Alert.alert('Download')}
          >
            Download report
          </Link>
        </View>
      </Section>

      <Section title="In context">
        <View style={{ gap: 8 }}>
          <Heading size="sm">Terms of service</Heading>
          <Paragraph color="muted">
            By continuing, you agree to our{' '}
            <Link size="md" onPress={() => Alert.alert('Terms')}>Terms of Service</Link>
            {' '}and{' '}
            <Link size="md" onPress={() => Alert.alert('Privacy')}>Privacy Policy</Link>.
          </Paragraph>
          <Paragraph color="muted">
            Already have an account?{' '}
            <Link size="md" weight="semibold" onPress={() => Alert.alert('Sign in')}>Sign in</Link>
          </Paragraph>
        </View>
      </Section>

    </ScreenShell>
  );
}
