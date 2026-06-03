import { Blockquote, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function BlockquoteScreen() {
  return (
    <ScreenShell title="Blockquote" subtitle="A callout for quoted guidance, testimonials, or editorial emphasis.">
      <Section title="Basic">
        <Blockquote>
          Design systems work best when they make the common path feel obvious.
        </Blockquote>
      </Section>

      <Section title="With citation">
        <Blockquote cite="A1 product principle">
          Tokens should describe intent first, then resolve to the right visual value for the current theme.
        </Blockquote>
      </Section>

      <Section title="In content">
        <Paragraph color="muted">
          Use blockquotes sparingly inside editorial or guidance screens. They should add emphasis, not replace the page hierarchy.
        </Paragraph>
      </Section>
    </ScreenShell>
  );
}
