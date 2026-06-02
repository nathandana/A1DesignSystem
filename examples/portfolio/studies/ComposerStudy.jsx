import {
  Divider,
  Figure,
  Heading,
  List,
  ListItem,
  Paragraph,
  Section,
} from "../../../packages/react/src/index.js";
import { CaseStudyLayout } from "../pages/CaseStudyLayout.jsx";

export function ComposerStudy() {
  return (
    <CaseStudyLayout
      title="Composer Architecture"
      tags={["UX Design", "CMS"]}
      meta={[
        { label: "Years", value: "2019–2020" },
        { label: "Company", value: "Dealer.com / Cox Automotive" },
        { label: "Role", value: "Senior UX Designer" },
      ]}
    >
      <Section as="div" padding="lg" contentWidth="md">

        <Figure src="img/composer-main.png" alt="Composer CMS" marginBottom="lg" />

        <Paragraph size="lg">
          I served as the lead designer on a cross-functional product squad alongside product managers, engineers, and analysts. Our mission was to stay one to two quarters ahead of development by proactively shaping the product backlog—evaluating epics, analyzing existing implementations, conducting user research, and delivering mockups that would guide future development.
        </Paragraph>

        <Heading as="h2" size="xl" margin="md">Background: What Is Composer?</Heading>
        <Paragraph size="lg">
          Composer is a core internal tool that enables car dealerships—and internal staff—to manage their websites. Tasks range from basic content updates to configuring complex site preferences. However, the tool had received minimal investment over the years, resulting in a clunky, unintuitive experience heavily reliant on hover states and overlay dialogs. It was ripe for modernization.
        </Paragraph>
        <Figure
          src="img/composer-current.png"
          alt="Current State of Composer Interface"
          caption="The current interface largely relies on hover states and overlays."
          marginTop="lg"
          marginBottom="lg"
        />

        <Heading as="h2" size="xl" margin="md">Strategic Framing</Heading>
        <Paragraph size="lg">
          My initial challenge was to reimagine the future of Composer—not just visually, but behaviorally. Leveraging an existing design system helped eliminate decisions around color, spacing, and iconography, allowing me to focus on UX architecture and product usability. I created a foundational set of UX principles to guide the project and align the team:
        </Paragraph>
        <List as="ol" size="md" marginBottom="lg">
          <ListItem>Provide guidance throughout</ListItem>
          <ListItem>Make good decisions easy</ListItem>
          <ListItem>Aid users with tooling</ListItem>
          <ListItem>Prioritize common decisions</ListItem>
          <ListItem>Be accessible to all users</ListItem>
          <ListItem>Intuitive for basic users, configurable for advanced</ListItem>
          <ListItem>Ensure mobile parity</ListItem>
          <ListItem>Keep users informed</ListItem>
          <ListItem>Design for time-efficiency</ListItem>
          <ListItem>Support tracking and tagging</ListItem>
        </List>
        <Divider space="lg" />

        <Heading as="h3" size="lg" margin="md">User Research</Heading>
        <Paragraph size="lg">
          To deeply understand the current pain points, I led an intensive two-day round of user interviews and observations. This included group interviews with four internal departments, task-specific roundtable discussions, and 1:1 shadow sessions to observe real-time behaviors and friction. These sessions uncovered dozens of opportunities for streamlining workflows. For example, simple preference toggles were implemented with dropdowns—even for binary true/false values. Replacing these with checkboxes reduced the number of clicks and improved scannability.
        </Paragraph>
        <Figure
          src="img/composer-edit.png"
          alt="Composer in Edit Mode"
          marginTop="lg"
          marginBottom="lg"
        />
        <Figure
          src="img/composer-library.png"
          alt="Composer Library"
          marginBottom="lg"
        />

        <Heading as="h3" size="lg" margin="md">Design Execution: Third-Party Tool</Heading>
        <Paragraph size="lg">
          The first high-priority feature we tackled was the Third-Party Integration Manager, used to configure external tools and services supported by the platform.
        </Paragraph>
        <Paragraph size="lg">
          Before: A static dialog with a long, unorganized list of integrations. Users had to click into each item to access preferences, with documentation stored in a separate system.
        </Paragraph>
        <Paragraph size="lg">
          After: I redesigned this as a stand-alone, full-page application with a searchable, categorized list of integrations, activated integrations visually elevated to the top, a contextual panel to the right for editing preferences, and embedded documentation available inline. This architecture preserves context, supports fast scanning and filtering, and dramatically reduces cognitive overhead.
        </Paragraph>
        <Figure
        size="sm"
        align="center"
          src="img/third-party-home.png"
          alt="Current Third Party Integration Home"
          caption='Currently, the "tool" is just a list of integrations.'
          marginTop="lg"
          marginBottom="lg"
        />
        <Figure
          src="img/new-third-party-default.png"
          alt="Proposed Third Party Tool"
          marginBottom="lg"
        />
        <Figure
          src="img/new-third-party-screen.png"
          alt="Proposed Third Party Tool with Documentation"
          marginBottom="lg"
        />

        <Heading as="h2" size="xl" margin="md">Impact</Heading>
        <Paragraph size="lg">
          The Composer overhaul demonstrates the value of aligning research, design, and architecture at the foundation level. My contributions created a scalable UX framework for future work, a human-centered foundation for high-complexity tools, and a tangible improvement in one of the system's most used (and previously painful) features.
        </Paragraph>

      </Section>
    </CaseStudyLayout>
  );
}
