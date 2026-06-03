import { View } from 'react-native';
import { Button, EmptyState } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function EmptyStateScreen() {
  return (
    <ScreenShell title="Empty State" subtitle="Centered placeholder content for blank, filtered, or permission-limited views.">
      <Section title="Default">
        <EmptyState
          title="No projects yet"
          description="Create your first project to start collecting screens, components, and tokens."
          icon="folder-open"
          actions={<Button variant="primary" onPress={() => {}}>Create project</Button>}
        />
      </Section>

      <Section title="With secondary action">
        <EmptyState
          title="No matching results"
          description="Try clearing filters or searching for a broader component name."
          icon="search-off"
          actions={
            <>
              <Button variant="secondary" onPress={() => {}}>Clear filters</Button>
              <Button variant="tertiary" onPress={() => {}}>Browse all</Button>
            </>
          }
        />
      </Section>

      <Section title="Compact">
        <View style={{ gap: 8 }}>
          <EmptyState
            compact
            title="No comments"
            description="Feedback will appear here when reviewers respond."
            icon="chat-bubble-outline"
          />
        </View>
      </Section>
    </ScreenShell>
  );
}
