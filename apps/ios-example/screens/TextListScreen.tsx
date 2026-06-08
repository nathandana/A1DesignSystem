import { View } from 'react-native';
import { TextList, TextListItem } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

const ITEMS = [
  'Design tokens ensure visual consistency.',
  'Semantic color roles adapt to light and dark mode.',
  'Components share type scale, spacing, and interaction rules.',
];

export function TextListScreen() {
  return (
    <ScreenShell title="Text List" subtitle="Typography-first lists for prose, checklists, ordered steps, and divided text rows.">
      <Section title="Unordered">
        <TextList>
          {ITEMS.map(item => <TextListItem key={item}>{item}</TextListItem>)}
        </TextList>
      </Section>

      <Section title="Ordered">
        <TextList as="ol">
          {ITEMS.map(item => <TextListItem key={item}>{item}</TextListItem>)}
        </TextList>
      </Section>

      <Section title="Icon">
        <TextList
          icon="check-circle"
        >
          <TextListItem>Full theme support</TextListItem>
          <TextListItem>Dark mode by semantic token</TextListItem>
          <TextListItem icon="auto-awesome">
            Per-item icon override
          </TextListItem>
          <TextListItem icon={null}>No icon for this item</TextListItem>
        </TextList>
      </Section>

      <Section title="Divider">
        <TextList variant="divider">
          {ITEMS.map(item => <TextListItem key={item}>{item}</TextListItem>)}
        </TextList>
      </Section>

      <Section title="Size and color">
        <View style={{ gap: 16 }}>
          <TextList size="sm" color="muted">
            <TextListItem>Small muted list text.</TextListItem>
            <TextListItem>Uses the same body scale as Paragraph.</TextListItem>
          </TextList>
          <TextList size="lg" marginBottom="sm">
            <TextListItem>Large list text.</TextListItem>
            <TextListItem>Margin-bottom follows the React prop name.</TextListItem>
          </TextList>
        </View>
      </Section>
    </ScreenShell>
  );
}
