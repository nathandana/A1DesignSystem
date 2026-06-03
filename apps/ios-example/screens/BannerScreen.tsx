import { useState } from 'react';
import { View } from 'react-native';
import { Banner, Button } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function BannerScreen() {
  const [visible, setVisible] = useState(true);

  return (
    <ScreenShell title="Banner" subtitle="Inline status and announcement blocks for important page-level messages.">
      <Section title="Variants">
        <View style={{ gap: 10 }}>
          <Banner
            title="Workspace synced"
            status="info"
            icon="info-outline"
          >
            New design tokens are available to every connected screen.
          </Banner>
          <Banner
            title="Export complete"
            status="success"
            icon="check-circle-outline"
          >
            Assets were generated and saved to your project.
          </Banner>
          <Banner
            title="Review spacing"
            status="warn"
            icon="warning-amber"
          >
            Some elements are using legacy gap values.
          </Banner>
          <Banner
            title="Upload failed"
            status="error"
            icon="error-outline"
          >
            Check the file format and try again.
          </Banner>
        </View>
      </Section>

      <Section title="Action">
        <Banner
          title="Accessibility audit ready"
          status="info"
          icon="fact-check"
          action={<Button size="sm" variant="secondary" onPress={() => {}}>Open report</Button>}
        >
          Three screens need contrast review before release.
        </Banner>
      </Section>

      <Section title="System">
        <Banner
          variant="system"
          status="success"
          title="Release notes published"
          icon="campaign"
        >
          The latest component guidance is ready for the team.
        </Banner>
      </Section>

      <Section title="Dismissible">
        {visible ? (
          <Banner
            title="Beta feature"
            status="info"
            onDismiss={() => setVisible(false)}
            icon="science"
          >
            This pattern will keep evolving with the system.
          </Banner>
        ) : (
          <Button variant="secondary" onPress={() => setVisible(true)}>Show banner</Button>
        )}
      </Section>
    </ScreenShell>
  );
}
