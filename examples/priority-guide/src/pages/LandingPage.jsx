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
import { principles, workflow } from "../lib/data.jsx";
import { getRoutePath } from "../lib/routing.js";

export function LandingPage({ onNavigate }) {
  return (
    <main>
      <Section className="priority-guide-hero" padding="none" inverse>
        <div className="priority-guide-shell priority-guide-hero__inner">
          <MessageBadge status="info" icon="auto_awesome">
            Align before AI
          </MessageBadge>
          <div className="priority-guide-hero__copy">
            <Heading as="h1" type="display" size={{ xs: "xl", md: "xxl", lg: "jumbo" }}>
              The Priority Guide
            </Heading>
            <Paragraph size="xl">
              When you align together on content, the rest flows. Use this tool to create and manage priority guides for your application.
            </Paragraph>
          </div>
          <ButtonContainer className="priority-guide-actions" align="center" size="lg">
            <Button
              as="a"
              href={getRoutePath("examples")}
              variant="secondary"
              icon="view_list"
              iconPosition="start"
              onClick={(event) => onNavigate(event, "examples")}
            >
              View examples
            </Button>
            <Button
              as="a"
              href={getRoutePath("start")}
              icon="arrow_forward"
              iconPosition="end"
              onClick={(event) => onNavigate(event, "start")}
            >
              Start your guide
            </Button>
          </ButtonContainer>
        </div>
      </Section>

      <Section id="overview" surface="panel" className="priority-guide-overview">
        <div className="priority-guide-shell">
          <div className="priority-guide-section-heading">
            <MessageBadge status="success" icon="hub">
              Why it matters
            </MessageBadge>
            <Heading as="h2" type="display" size={{ xs: "lg", md: "xl" }}>
              A shared brief for collaboration.
            </Heading>
            <Paragraph size="lg" color="muted">
              Priority guides keep the conversation on what the screen must communicate and how it should behave. They make the first artifact useful to writers, product partners, designers, developers, testers, and the AI tools that increasingly help teams move from intent to interface.
            </Paragraph>
          </div>
          <Grid columns={{ xs: 1, md: 3 }} gap="md" className="priority-guide-principles">
            {principles.map((principle) => (
              <Card key={principle.key ?? principle.title} as="article" icon={principle.icon} className="priority-guide-principle">
                <Heading as="h3" size="sm">
                  {principle.title}
                </Heading>
                <Paragraph size="md" color="muted">
                  {principle.description}
                </Paragraph>
              </Card>
            ))}
          </Grid>
        </div>
      </Section>

      <Section surface="raised" className="priority-guide-future">
        <div className="priority-guide-shell priority-guide-future__inner">
          <Icon name="auto_awesome" />
          <div>
            <Heading as="h2" size="md">
              Next: guide components, an editor, and AI-assisted flows.
            </Heading>
            <Paragraph size="md" color="muted">
              Future pages can turn this landing page into a working content system: reusable guide blocks, collaborative editing, AI-generated first drafts, critique prompts, and flow maps that connect guides across an experience.
            </Paragraph>
          <Link href={getRoutePath("examples")} onClick={(event) => onNavigate(event, "examples")}>
            Explore example guides
          </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
