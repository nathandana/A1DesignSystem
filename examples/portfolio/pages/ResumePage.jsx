import {
  Stack,
  Divider,
  Grid,
  Heading,
  Link,
  List,
  ListItem,
  Paragraph,
  Section,
} from "../../../packages/react/src/index.js";
import { getRoutePath } from "../utils/routing.js";

export function ResumePage() {
  return (
    <>
      <Section padding="md" gap="xs" surface="raised" contentWidth="md">
        <Heading as="h1" type="display" size={{ xs: "lg", md: "xxl" }}>
          Nathan Dana
        </Heading>
        <Heading as="h2" size={{ xs: "sm", md: "xl" }}>
          Principal AI Designer
        </Heading>
        <Stack direction={{ xs: "column", sm: "row" }} wrap gap="xs" align="start" justify="start">
          <Paragraph><strong>Fort Mill, SC</strong></Paragraph>
          <Divider orientation={{ xs: "horizontal", sm: "vertical" }} decorative size="sm"  />
          <Link href="mailto:nathan.dana@gmail.com">nathan.dana@gmail.com</Link>
          <Divider orientation={{ xs: "horizontal", sm: "vertical" }} decorative size="sm"  />
          <Link href="http://linkedin.com/in/midbrain" target="_blank" rel="noopener noreferrer">linkedin.com/in/midbrain</Link>
        </Stack>
      </Section>

      <Section padding="md" gap="md" surface="panel" contentWidth="md">
        <Heading as="h2" size={{ xs: "lg", md: "xxl" }}>Professional Summary</Heading>
        <Paragraph size={{ xs: "md", md: "lg" }}>
          As a trusted design systems leader, I specialize in wildly predictable, accessible, rules-driven systems that help enterprise teams move faster with greater consistency and clarity. I combine UX architecture, design systems strategy, accessibility, and hands-on implementation with <strong>AI-enabled workflows</strong> to turn defined standards into scalable product outcomes. My strength is creating the structure AI needs to be useful: clear rules, reusable patterns, quality checks, and human judgment. I help product, design, and engineering teams translate complexity into systems that are usable, governable, and ready to scale.

        </Paragraph>
        <Paragraph size={{ xs: "md", md: "lg" }}>
          As a trusted design systems leader, I specialize in building predictable, accessible systems that drive strategy, consistency, and scalability across enterprise products. I combine creative vision with hands-on execution to deliver high-performing user experiences. With strong cross-functional leadership, I unite product, design, and engineering teams to translate complexity into clarity. I thrive in collaborative, fast-paced environments, I lead with empathy, design with precision, and deliver with impact.
        </Paragraph>
      </Section>

      <Section as="div" padding="md" gap="md" contentWidth="md">
        <Heading as="h2" size={{ xs: "lg", md: "xxl" }}>Professional Experience</Heading>

        <div>
          <Heading as="h3" size={{ xs: "md", md: "lg" }} margin="sm">
            Centene
          </Heading>
          <Heading as="h4" color="muted" size={{ xs: "xs", md: "sm" }} margin="md">
            UX Architect - Design Systems Lead | 2020 – Present
          </Heading>
          <List size={{ xs: "md", md: "lg" }}>
            <ListItem>Spearheaded the 0-1 creation and evolution of the <Link href={getRoutePath("transform")}><strong>Transform Design System</strong></Link>, enabling design and development for internal healthcare applications serving 20,000+ users.</ListItem>
            <ListItem>Founded and scaled a dedicated design systems team, defining intake workflows, governance models, sprint planning, and documentation processes to streamline support and feature development.</ListItem>
            <ListItem>Reimagined the enterprise-wide <Link href={getRoutePath("fondue")}><strong>Fondue Design System</strong></Link>, implementing cross-team processes for contribution, accessibility reviews, and naming conventions—driving adoption across multiple business units.</ListItem>
            <ListItem>Led accessibility remediation efforts (WCAG 2.3 AA), collaborated with accessibility teams, and embedded accessibility checks into design workflows.</ListItem>
            <ListItem>Established component lifecycle governance, integrating Figma libraries with Storybook and front-end frameworks like Angular, React, and HTML/CSS to ensure fidelity between design and code.</ListItem>
            <ListItem>Partnered with engineering leads to resolve technical debt, enforce token-based theming, and enable flexible multi-brand theming.</ListItem>
            <ListItem>Provided system office hours, stakeholder workshops, and Figma training to empower designers and developers across the organization.</ListItem>
            <ListItem>Collaborated with product design to revamp the <Link href={getRoutePath("member-menu")}><strong>TruCare Cloud navigation system</strong></Link> through design sprints, research, planning and leadership review.</ListItem>
          </List>
        </div>

        <Divider decorative orientation="horizontal" size="md" space="md" variant="accent" />

        <div>
          <Heading as="h3" size={{ xs: "md", md: "lg" }} margin="sm">
            Dealer.com / Cox Automotive
          </Heading>

          <Heading as="h4" color="muted" size={{ xs: "xs", md: "sm" }} margin="md">Senior User Experience Designer – Interactive | 2011 – 2020</Heading>
          <List size={{ xs: "md", md: "lg" }}>
            <ListItem>Drove UX strategy and design for high-impact projects including the <Link href={getRoutePath("composer")}><strong>Composer CMS</strong></Link> overhaul, empowering dealers to manage site content with a modern, flexible UI.</ListItem>
            <ListItem>Created modular, scalable patterns across key <Link href={getRoutePath("carshopper")}><strong>car shopping journeys</strong></Link> such as Search Results Pages (SRP) and Vehicle Details Pages (VDP)—supporting ~15,000 dealership websites across multiple OEMs.</ListItem>
            <ListItem>Introduced UX research and validation workflows, leading heuristic evaluations, shadowing sessions, and remote usability tests to shape roadmap decisions.</ListItem>
            <ListItem>Championed responsive design standards, accessibility best practices, and robust design QA workflows to ensure production readiness.</ListItem>
            <ListItem>Created fully interactive HTML/CSS/JavaScript prototypes to bridge communication between design and engineering and accelerate handoff.</ListItem>
            <ListItem>Facilitated design sprints, stakeholder alignment sessions, and cross-functional workshops to explore innovation opportunities and product vision.</ListItem>
          </List>
        </div>

        <Divider decorative orientation="horizontal" size="md" space="md" variant="accent" />

        <div>
          <Heading as="h3" size={{ xs: "md", md: "lg" }} margin="sm">
            hmc² Advertising
          </Heading>
          <Heading as="h4" color="muted" size={{ xs: "xs", md: "sm" }} margin="md">
            Art Director | 2007 – 2011
          </Heading>
          <List size={{ xs: "md", md: "lg" }}>
            <ListItem>Led digital design and brand strategy for public and private sector clients, including large-scale work for the State of Vermont.</ListItem>
            <ListItem>Delivered full-cycle creative solutions—from discovery and ideation through interface design and development—across web, identity, and print.</ListItem>
            <ListItem>Designed and coded responsive websites, HTML5 campaigns, and content management system templates to support agency clients across multiple industries.</ListItem>
            <ListItem>Balanced creative direction with hands-on execution in a high-velocity agency environment.</ListItem>
          </List>
        </div>
      </Section>

      <Section as="div" padding="md" gap="md" surface="raised" contentWidth="md">
        <Heading as="h2" size="xxl" margin="md">Education</Heading>

        <div>
          <Heading as="h3" size="md" margin="sm">
            University of Otago, New Zealand
          </Heading>
          <Paragraph size="md">Bachelor of Arts, Design Studies</Paragraph>
        </div>

        <Divider decorative orientation="horizontal" size="xs" space="sm" variant="strong" />

        <div>
          <Heading as="h3" size="md" margin="sm">
            Rochester Institute of Technology
          </Heading>
          <Paragraph size="md">Associate of Arts, New Media</Paragraph>
        </div>
      </Section>

      <Section as="div" surface="panel" padding="md" gap="md" contentWidth="md">
        <Heading as="h2" size="lg">Core Competencies</Heading>
        <List variant="divider" size="md">
          {[
            "Design Systems Leadership",
            "AI driven Design and Development",
            "UX Strategy & Architecture",
            "Agile & Cross-Functional Collaboration",
            "Component Libraries & Documentation",
            "Accessibility (WCAG, Governance)",
            "Advanced Prototyping",
            "User Research & Data-Driven Design",
            "Front-End Collaboration (HTML/CSS, JS)",
            "Mentorship & Design Reviews",
          ].map((s) => <ListItem key={s}>{s}</ListItem>)}
        </List>
      </Section>

      <Section as="div" surface="raised" padding="md" gap="md" contentWidth="md">
        <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
          <div>
            <Heading as="h2" size="lg" margin="md">Software</Heading>
            <List variant="divider" size="md">
              {[
                "Figma",
                "Storybook",
                "Jira, Confluence",
                "SCSS, Pug, jQuery",
                "VSCode",
                "HTML / JS / CSS",
                "Adobe Creative Cloud",
              ].map((s) => <ListItem key={s}>{s}</ListItem>)}
            </List>
          </div>
          <div>
            <Heading as="h2" size="lg" margin="md">AI Agents</Heading>
            <List variant="divider" size="md">
              {[
                "ChatGPT",
                "Codex",
                "Claude Code",
                "Co-pilot",
              ].map((s) => <ListItem key={s}>{s}</ListItem>)}
            </List>
          </div>
        </Grid>
      </Section>
    </>
  );
}
