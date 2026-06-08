import {
  Blockquote,
  Card,
  Grid,
  Heading,
  Link,
  MessageBadge,
  Paragraph,
  Section,
} from "../../../packages/react/src/index.js";
import { testimonials } from "../data/testimonials.js";

export function TestimonialsPage() {
  return (
    <>
      <Section inverse padding="lg" contentWidth="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge size="lg" icon="forum">Recommendations</MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            Testimonials
          </Heading>
          <Paragraph size="lg" color="muted">
            A sampling of recommendations shared by colleagues and collaborators.
            Quotes are pulled from my{" "}
            <Link href="https://www.linkedin.com/in/midbrain" target="_blank" rel="noopener noreferrer" className="pf-inverse-link">
              LinkedIn profile
            </Link>.
          </Paragraph>
        </div>
      </Section>

      <Section as="div" padding="lg" contentWidth="lg">
        <Grid columns={{ xs: 1, md: 2 }} gap="xxl">
          {testimonials.map((item) => (
            
              <Blockquote  key={item.author} variant="minimal" cite={item.author}>
                {item.quote}
              </Blockquote>
          ))}
        </Grid>
      </Section>
    </>
  );
}
