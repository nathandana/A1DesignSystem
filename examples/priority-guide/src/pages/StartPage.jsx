import React from "react";
import {
  Button,
  ButtonContainer,
  Card,
  Dialog,
  Grid,
  Heading,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuItem,
  MenuSection,
  MessageBadge,
  PageLayout,
  Paragraph,
  Section,
  SegmentedControl,
  SelectField,
  SideNav,
  SideNavItem,
  Snackbar,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextareaField,
  TextField,
} from "../../../../packages/react/src/index.js";
import { examplePrompt, startTips, workflow } from "../lib/data.jsx";
import { getRoutePath } from "../lib/routing.js";

export function StartPage({ onNavigate }) {
  return (
    <main>
      <Section className="priority-guide-start-hero" padding="none" inverse>
        <div className="priority-guide-shell priority-guide-start-hero__inner">
          <div className="priority-guide-start-hero__copy">
            <Heading as="h1" type="display" size={{ xs: "md", md: "lg" }}>
              Start with the page, not the pixels.
            </Heading>
            <Paragraph size="lg" color="muted">
              Describe the page, audience, decision, and constraints. The clearer the prompt, the easier it is to turn the response into a useful priority guide.
            </Paragraph>
          </div>
          <form className="priority-guide-prompt" role="search" aria-label="Create a priority guide with AI">
            <TextareaField
              label="AI prompt"
              size="comfortable"
              rows="lg"
              defaultValue={examplePrompt}
              hint="Include the audience, decision, desired outcome, out-of-scope items, and any known content."
            />
            <ButtonContainer align="center">
              <Button
                as="a"
                size="lg"
                href={getRoutePath("editor")}
                icon="arrow_forward"
                iconPosition="end"
                onClick={(e) => onNavigate(e, "editor")}
              >
                Generate guide
              </Button>
            </ButtonContainer>
          </form>
        </div>
      </Section>

      <Section className="priority-guide-start-tips">
        <div className="priority-guide-shell">
          <div className="priority-guide-section-heading">
            <MessageBadge subtle icon="tips_and_updates">
              Best practices
            </MessageBadge>
            <Heading as="h2" type="display" size={{ xs: "lg", md: "xl" }}>
              Prompt for alignment, not layout.
            </Heading>
            <Paragraph size="lg" color="muted">
              A good prompt gives AI enough context to prioritize content without jumping straight into wireframe decisions.
            </Paragraph>
          </div>

          <Grid columns={{ xs: 1, md: 2 }} gap="md" className="priority-guide-tip-grid">
            {startTips.map((tip) => (
              <Card key={tip.title} as="article" icon={tip.icon} className="priority-guide-tip">
                <Heading as="h3" size="sm">
                  {tip.title}
                </Heading>
                <Paragraph size="md" color="muted">
                  {tip.description}
                </Paragraph>
              </Card>
            ))}
          </Grid>

          <div className="priority-guide-workflow-heading">
            <MessageBadge subtle icon="low_priority">
              Workflow
            </MessageBadge>
            <Heading as="h2" size="lg">
              Shape the guide in four passes.
            </Heading>
          </div>

          <ol className="priority-guide-workflow priority-guide-start-workflow">
            {workflow.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <div>
                  <Heading as="h3" size="xs">
                    {title}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {description}
                  </Paragraph>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </main>
  );
}
