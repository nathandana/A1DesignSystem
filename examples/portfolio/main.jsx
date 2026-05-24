import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  LabelsProvider,
  Link,
  MessageBadge,
  PageLayout,
  Paragraph,
  Section,
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "../../packages/react/src/index.js";
import actionLabels from "../../system/labels/action.json";
import "./styles.css";

const caseStudies = [
  {
    id: "nebula",
    title: "Nebula Wealth Management",
    icon: "account_balance",
    tags: ["Fintech", "UX/UI"],
    year: "2024",
    role: "Lead UX Designer",
    duration: "6 months",
    description:
      "Redesigning the investment experience for high-net-worth individuals, focusing on clarity and complex data simplification.",
    outcome:
      "Increased portfolio comprehension by 62% in usability testing, and reduced support tickets by 34% post-launch.",
    challenge:
      "High-net-worth individuals were struggling to understand the performance of their diversified portfolios. The previous interface prioritized data density over comprehension, leading to frequent support calls and low engagement with the platform's advanced features.",
    approach:
      "We ran contextual inquiry sessions with 14 users across three wealth tiers. From there, we identified key mental models around portfolio health and rebuilt the information architecture around them. Prototypes were tested in three rounds with 6 participants each.",
  },
  {
    id: "aura",
    title: "Aura Home Ecosystem",
    icon: "home_iot_device",
    tags: ["IoT", "Mobile app"],
    year: "2024",
    role: "UX / Product Designer",
    duration: "8 months",
    description:
      "An end-to-end mobile solution for unified smart home control, reducing task completion time by 40% through contextual AI.",
    outcome:
      "Task completion time reduced by 40% vs. the previous app. App store rating rose from 3.1 to 4.7 within 90 days of launch.",
    challenge:
      "Users with multiple smart home devices were managing them across 4+ separate apps. The result was fragmented automations, missed notifications, and high cognitive load — particularly during morning and evening routines.",
    approach:
      "We mapped 23 distinct home routines across 40 households. This revealed a strong pattern of contextual intent — users thought in terms of scenes and moments, not individual device controls. We redesigned the app around these scenes, using machine learning to surface the most relevant controls based on time of day, location, and past behavior.",
  },
  {
    id: "sync",
    title: "Sync Collaborative Engine",
    icon: "hub",
    tags: ["SaaS", "Product design"],
    year: "2023",
    role: "Senior Product Designer",
    duration: "5 months",
    description:
      "Streamlining remote collaboration for design teams by integrating documentation directly into the canvas environment.",
    outcome:
      "Documentation handoff time cut from 3 days to 4 hours. Designer-developer alignment scores increased by 51% in post-launch surveys.",
    challenge:
      "Design teams were constantly context-switching between design tools, documentation platforms, and communication apps. This led to documentation that was out of date by the time developers received it, causing costly rework during engineering sprints.",
    approach:
      "We embedded directly into three design teams for four weeks, observing handoff processes end-to-end. The insight: documentation wasn't a step in the process — it was a byproduct the team was forced to recreate from memory. We designed a live documentation layer that auto-generated spec notes from design states, with threading for developer questions.",
  },
  {
    id: "quantix",
    title: "Quantix Retail Analytics",
    icon: "analytics",
    tags: ["B2B", "Data vis"],
    year: "2023",
    role: "Lead UX Designer",
    duration: "10 months",
    description:
      "A powerful analytics suite that helps retail managers predict stock shortages before they happen using machine learning.",
    outcome:
      "Stock shortage prediction accuracy of 94% in pilot stores. Managers reported saving an average of 6 hours per week on manual inventory checks.",
    challenge:
      "Retail store managers were reacting to stock shortages rather than preventing them. Existing analytics tools provided historical data but no predictive capability, and the interfaces were built for analysts — not floor managers with limited screen time.",
    approach:
      "We spent two weeks in-store with managers across five retail locations, understanding how they actually worked: brief, mobile-first, action-oriented. We redesigned the analytics surface around three key alerts — restock now, restock this week, watch list — backed by ML-powered predictions. The UI was validated through 8 rounds of hallway testing with store staff.",
  },
];

const expertise = [
  { label: "System design", icon: "grid_view" },
  { label: "User research", icon: "manage_search" },
  { label: "Prototyping", icon: "slideshow" },
  { label: "Design systems", icon: "auto_awesome_mosaic" },
];

const tools = [
  { label: "Figma / FigJam", icon: "design_services" },
  { label: "Storybook", icon: "library_books" },
  { label: "Principle", icon: "animation" },
  { label: "Framer", icon: "view_quilt" },
];

const processSteps = [
  {
    id: "discovery",
    number: "01",
    label: "Discovery",
    icon: "travel_explore",
    heading: "Asking bold questions",
    keyPoints: [
      { icon: "psychology", text: "Naturally inquisitive, strategic questioner" },
      { icon: "record_voice_over", text: "Build trust early through active listening" },
    ],
    body: "Great solutions require deeply understanding the problem first. I lean into curiosity through design jams and stakeholder workshops — not just asking what, but always why. This phase is about listening, aligning with business goals, understanding user pain points, and uncovering the constraints that actually shape what's possible. I ask the uncomfortable questions across product, design, accessibility, and engineering that others sometimes avoid.",
    quote: "Help me understand the hierarchy here. Is this new feature the most important thing for the user?",
  },
  {
    id: "wireframe",
    number: "02",
    label: "Wireframe",
    icon: "draw",
    heading: "Start ugly and sharp",
    keyPoints: [
      { icon: "edit_note", text: "Post-its and Sharpies are preferred tools" },
      { icon: "format_shapes", text: "Structure and content come first, always" },
    ],
    body: "I'm not a visual artist — and that's a strength, not a limitation. Fat Sharpies, small Post-its, and whiteboards force rapid iteration, clear thinking, and early collaboration. When fidelity is low, feedback is honest. I advocate for content-first design from the start, building around semantic structure and clear hierarchy aligned with accessibility standards. If a screen reader can't navigate it meaningfully, neither can a user.",
    quote: "Can you say that back to me in your own words? I want to make sure I'm not talking about triangles when you are talking about pyramids.",
  },
  {
    id: "design",
    number: "03",
    label: "Design",
    icon: "design_services",
    heading: "Jumping into Figma",
    keyPoints: [
      { icon: "widgets", text: "Expert in components, variables, and auto layout" },
      { icon: "code", text: "Prototype in code when Figma hits its limits" },
    ],
    body: "I leverage deep Figma expertise — components, variables, auto layout, and interactive prototyping — to move quickly without sacrificing scalability or brand consistency. Libraries and systems are the foundation. When a flow is too complex for Figma to communicate accurately, I'll build a quick CodePen or coded prototype instead. AI tools turn repetitive work into minutes, freeing attention for the decisions that actually matter.",
    quote: "Check out this quick CodePen I threw together — it better illustrates how responsive behavior should work here.",
  },
  {
    id: "validate",
    number: "04",
    label: "Validate",
    icon: "fact_check",
    heading: "Feedback is fuel",
    keyPoints: [
      { icon: "diversity_3", text: "Champion inclusive feedback loops with diverse voices" },
      { icon: "bar_chart", text: "Use testing and data to refine and reduce risk" },
    ],
    body: "Research isn't a checkpoint — it's an ongoing rhythm. I test early with paper sketches and teammates, then move into usability testing, stakeholder walkthroughs, and analytics as fidelity increases. Sharing work early and often, with leadership, developers, accessibility experts, and end-users, leads to better outcomes and avoids the expensive surprises that come from late-stage feedback. The best validation finds what's broken before it ships.",
    quote: "Feedback when you think you are done is the absolute worst. Early on, it's no big deal.",
  },
  {
    id: "finalize",
    number: "05",
    label: "Finalize",
    icon: "verified",
    heading: "Obsess the details",
    keyPoints: [
      { icon: "straighten", text: "Sharp eye for spacing, tokens, and accessibility" },
      { icon: "handyman", text: "Partner closely with developers for quality delivery" },
    ],
    body: "As a project nears completion, my focus sharpens on the details that separate good from great: spacing, hierarchy, interaction logic, accessibility labels, and token consistency. I pair closely with developers through ticket review, documentation, and direct collaboration to ensure high-quality delivery. Every intentional pixel and property decision in this phase is also an investment in the next project — making the system smarter, faster, and more consistent over time.",
    quote: "I'm so glad we are past the days of project-final-37.psd.",
  },
];

// ── Shared sub-components ────────────────────────────────────────────────────

function BadgeList({ items }) {
  return (
    <div className="pf-badge-list">
      {items.map((item) => (
        <MessageBadge subtle key={item.label}  icon={item.icon}>
          {item.label}
        </MessageBadge>
      ))}
    </div>
  );
}

// ── Pages ────────────────────────────────────────────────────────────────────

function CaseStudyCard({ study, navigate }) {
  return (
    <Card shadow="sm" className="pf-study-card">
      <div className="pf-study-image">
        <Icon name={study.icon} className="pf-study-image-icon" />
      </div>
      <div className="pf-study-body">
        <div className="pf-tag-row">
          {study.tags.map((tag) => (
            <MessageBadge subtle key={tag} >
              {tag}
            </MessageBadge>
          ))}
        </div>
        <Heading as="h3" size="lg">
          {study.title}
        </Heading>
        <Paragraph size="md" color="muted">
          {study.description}
        </Paragraph>
        <Button
          variant="tertiary"
          icon="arrow_forward"
          iconPosition="end"
          onClick={() => navigate(study.id)}
        >
          Read case study
        </Button>
      </div>
    </Card>
  );
}

function HomePage({ navigate }) {
  return (
    <>
      {/* ── Hero ── */}
      <Section inverse padding="lg" className="pf-hero">
        <div className="pf-hero-inner">
          <MessageBadge subtle  icon="person">
            Senior UX designer
          </MessageBadge>
          <Heading
            as="h1"
            type="display"
            size={{ xs: "xl", md: "jumbo", lg: "xJumbo" }}
            className="pf-hero-heading"
          >
            Designing digital experiences that{" "}
            <span className="pf-accent">matter</span>
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-hero-sub">
            A Senior UX Designer dedicated to crafting intuitive solutions for
            complex problems. I bridge the gap between user needs and business
            goals through research-driven design and micro-precision.
          </Paragraph>
          <ButtonContainer align="start">
            <Button
              variant="primary"
              icon="arrow_downward"
              iconPosition="end"
              onClick={() =>
                document
                  .getElementById("case-studies")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View work
            </Button>
            <Button variant="secondary" onClick={() => navigate("contact")}>
              Get in touch
            </Button>
          </ButtonContainer>
        </div>
      </Section>

      {/* ── Case studies ── */}
      <Section id="case-studies" padding="lg">
        <div className="pf-section-inner">
          <MessageBadge subtle  icon="work">
            Selected projects
          </MessageBadge>
          <Heading as="h2" size={{ xs: "xl", md: "xxl" }} className="pf-section-title">
            Case studies
          </Heading>
          <Grid columns={{ xs: 1, md: 2 }} gap="lg">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} navigate={navigate} />
            ))}
          </Grid>
        </div>
      </Section>

      {/* ── About teaser ── */}
      <Section surface="panel" padding="lg">
        <div className="pf-section-inner">
          <Grid columns={{ xs: 1, lg: 2 }} gap="lg" className="pf-about-split">
            <div className="pf-about-photo">
              <div className="pf-about-photo-inner">
                <Icon name="person" className="pf-about-photo-icon" />
              </div>
            </div>
            <div className="pf-about-content">
              <MessageBadge subtle  icon="auto_awesome">
                Behind the design
              </MessageBadge>
              <Heading as="h2" size={{ xs: "xl", md: "xxl" }}>
                Intentionality in every pixel
              </Heading>
              <Paragraph size="lg" color="muted">
                I believe that great design isn't just about how it looks, but
                how it works for the people using it. My process is rooted in
                deep empathy and rigorous testing.
              </Paragraph>
              <Paragraph size="md" color="muted">
                With over 8 years of experience working with top-tier tech
                firms, I've developed a philosophy centered on "Functional
                Elegance" — stripping away the noise to let the core purpose of
                a product shine.
              </Paragraph>
              <Grid columns={{ xs: 1, sm: 2 }} gap="lg" className="pf-expertise-grid">
                <div>
                  <Heading as="h3" size="xs">Core expertise</Heading>
                  <BadgeList items={expertise} />
                </div>
                <div>
                  <Heading as="h3" size="xs">Tools</Heading>
                  <BadgeList items={tools} />
                </div>
              </Grid>
              <ButtonContainer align="start">
                <Button
                  variant="secondary"
                  icon="arrow_forward"
                  iconPosition="end"
                  onClick={() => navigate("about")}
                >
                  Learn more
                </Button>
              </ButtonContainer>
            </div>
          </Grid>
        </div>
      </Section>

      {/* ── Contact CTA ── */}
      <Section inverse padding="lg">
        <div className="pf-cta-inner">
          <MessageBadge subtle  icon="mail">
            Get in touch
          </MessageBadge>
          <Heading
            as="h2"
            type="display"
            size={{ xs: "xl", md: "xxl" }}
            className="pf-cta-heading"
          >
            Let's build something exceptional together
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-cta-sub">
            Currently available for new opportunities and collaborations.
            Whether you have a specific project in mind or just want to say hi,
            I'd love to hear from you.
          </Paragraph>
          <Button variant="primary" onClick={() => navigate("contact")}>
            Start a conversation
          </Button>
        </div>
      </Section>
    </>
  );
}

function CaseStudyPage({ study, navigate }) {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <div className="pf-tag-row">
            {study.tags.map((tag) => (
              <MessageBadge subtle key={tag} >
                {tag}
              </MessageBadge>
            ))}
          </div>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            {study.title}
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-detail-hero-sub">
            {study.description}
          </Paragraph>
        </div>
      </Section>

      <Section as="div" padding="lg" className="pf-detail-content">
        <div className="pf-detail-image">
          <Icon name={study.icon} className="pf-detail-image-icon" />
        </div>

        {/* dl is a semantically correct description list — no DS equivalent */}
        <dl className="pf-detail-meta">
          <div className="pf-detail-meta-item">
            <dt>Year</dt>
            <dd>{study.year}</dd>
          </div>
          <div className="pf-detail-meta-item">
            <dt>Role</dt>
            <dd>{study.role}</dd>
          </div>
          <div className="pf-detail-meta-item">
            <dt>Duration</dt>
            <dd>{study.duration}</dd>
          </div>
        </dl>

        <div className="pf-detail-sections">
          <Card shadow="none" className="pf-detail-card">
            <MessageBadge subtle  icon="help">
              The challenge
            </MessageBadge>
            <Heading as="h2" size="lg">
              What we were solving
            </Heading>
            <Paragraph size="lg" color="muted">
              {study.challenge}
            </Paragraph>
          </Card>

          <Card shadow="none" className="pf-detail-card">
            <MessageBadge subtle  icon="route">
              The approach
            </MessageBadge>
            <Heading as="h2" size="lg">
              How we got there
            </Heading>
            <Paragraph size="lg" color="muted">
              {study.approach}
            </Paragraph>
          </Card>

          <Card shadow="none" className="pf-detail-card pf-detail-card--outcome">
            <MessageBadge subtle  icon="check_circle" status="success">
              The outcome
            </MessageBadge>
            <Heading as="h2" size="lg">
              What we achieved
            </Heading>
            <Paragraph size="lg" color="muted">
              {study.outcome}
            </Paragraph>
          </Card>
        </div>

        <div className="pf-detail-nav">
          <Button
            variant="secondary"
            icon="arrow_back"
            onClick={() => navigate("home")}
          >
            Back to overview
          </Button>
        </div>
      </Section>
    </>
  );
}

function ProcessPage({ navigate }) {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge subtle  icon="psychology">
            Design process
          </MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            From curiosity to craft
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-detail-hero-sub">
            Design is problem-solving through discovery, structure, and
            iteration — combining empathy with execution. My process balances
            inquisitiveness, collaboration, and precision with speed and
            strategic thinking.
          </Paragraph>
        </div>
      </Section>

      <div className="pf-process-content">
        {processSteps.map((step) => (
          <div key={step.id} className="pf-process-step">
            <div className="pf-process-step-aside">
              <span className="pf-process-number">{step.number}</span>
              <div className="pf-process-step-icon-wrap">
                <Icon name={step.icon} className="pf-process-step-icon" />
              </div>
              <span className="pf-process-label">{step.label}</span>
            </div>

            <div className="pf-process-step-main">
              <Heading as="h2" size={{ xs: "lg", md: "xl" }}>
                {step.heading}
              </Heading>

              <div className="pf-process-key-points">
                {step.keyPoints.map((point) => (
                  <MessageBadge subtle
                    key={point.text}
                    
                    icon={point.icon}
                  >
                    {point.text}
                  </MessageBadge>
                ))}
              </div>

              <Paragraph size="lg" color="muted">
                {step.body}
              </Paragraph>

              <blockquote className="pf-process-quote">
                <Icon name="format_quote" className="pf-process-quote-icon" />
                <Paragraph size="lg" className="pf-process-quote-text">
                  {step.quote}
                </Paragraph>
              </blockquote>
            </div>
          </div>
        ))}

        <Section inverse padding="none" className="pf-process-postscript">
          <div className="pf-process-postscript-inner">
            <MessageBadge subtle  icon="handshake">
              Building relationships
            </MessageBadge>
            <Heading as="h2" size={{ xs: "xl", md: "xxl" }}>
              Capital in, capital out
            </Heading>
            <Paragraph size="lg" color="muted">
              Design requires trust — and trust is built through relationships.
              Relationships are capital: earned by listening, supporting,
              documenting, and delivering, and sometimes spent to get a favor or
              move a timeline forward. The best partnerships aren't transactional
              — they're built on mutual respect earned by showing up across every
              discipline and understanding how design can help each person
              succeed.
            </Paragraph>
            <Paragraph size="md" color="muted">
              I invest time understanding product managers, engineers,
              researchers, and accessibility specialists — not just as
              stakeholders, but as collaborators with their own goals, pressures,
              and expertise. That investment pays dividends on every project.
            </Paragraph>
            <blockquote className="pf-process-quote pf-process-quote--inverse">
              <Icon name="format_quote" className="pf-process-quote-icon" />
              <Paragraph size="lg" className="pf-process-quote-text">
                Relationships are all about capital. You build it by showing up,
                and sometimes you spend it to move things forward.
              </Paragraph>
            </blockquote>
          </div>
        </Section>

        <div className="pf-process-nav">
          <ButtonContainer align="start">
            <Button
              variant="secondary"
              icon="work"
              iconPosition="end"
              onClick={() => navigate("home")}
            >
              View case studies
            </Button>
            <Button
              variant="primary"
              icon="mail"
              iconPosition="end"
              onClick={() => navigate("contact")}
            >
              Get in touch
            </Button>
          </ButtonContainer>
        </div>
      </div>
    </>
  );
}

function AboutPage({ navigate }) {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge subtle  icon="person">
            About me
          </MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            Jordan Ellis
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-detail-hero-sub">
            Senior UX Designer with 8+ years bridging the gap between complex
            systems and the humans who use them.
          </Paragraph>
        </div>
      </Section>

      <Section as="div" padding="lg" className="pf-about-page-content">
        <Grid columns={{ xs: 1, lg: 2 }} gap="lg" className="pf-about-split">
          <div className="pf-about-photo">
            <div className="pf-about-photo-inner">
              <Icon name="person" className="pf-about-photo-icon" />
            </div>
          </div>
          <div className="pf-about-content">
            <Heading as="h2" size="xl">
              Functional elegance in every project
            </Heading>
            <Paragraph size="lg" color="muted">
              I believe that great design isn't just about how it looks, but how
              it works for the people using it. My process is rooted in deep
              empathy and rigorous testing — I don't ship assumptions, I ship
              validated decisions.
            </Paragraph>
            <Paragraph size="md" color="muted">
              With over 8 years of experience working with top-tier tech firms,
              I've developed a philosophy centered on "Functional Elegance" —
              stripping away the noise to let the core purpose of a product
              shine. Whether I'm designing a fintech dashboard or a smart home
              app, I bring the same obsessive attention to the moments that
              matter most to users.
            </Paragraph>
            <Paragraph size="md" color="muted">
              I've led cross-functional teams, run research programs, built
              design systems from scratch, and shipped products used by millions
              of people. I work best in environments that value craft, move with
              intention, and care deeply about the end user.
            </Paragraph>
          </div>
        </Grid>

        <div className="pf-about-skills">
          <Grid columns={{ xs: 1, md: 3 }} gap="lg">
            <div>
              <Heading as="h3" size="sm">Core expertise</Heading>
              <BadgeList items={expertise} />
            </div>
            <div>
              <Heading as="h3" size="sm">Tools</Heading>
              <BadgeList items={tools} />
            </div>
            <div>
              <Heading as="h3" size="sm">Industries</Heading>
              <BadgeList items={[
                { label: "Fintech", icon: "payments" },
                { label: "IoT / hardware", icon: "devices" },
                { label: "SaaS / enterprise", icon: "business" },
                { label: "Retail & ecommerce", icon: "shopping_bag" },
              ]} />
            </div>
          </Grid>
        </div>

        <ButtonContainer align="start">
          <Button
            variant="primary"
            icon="mail"
            iconPosition="end"
            onClick={() => navigate("contact")}
          >
            Get in touch
          </Button>
        </ButtonContainer>
      </Section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge subtle  icon="mail">
            Contact
          </MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            Let's work together
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-detail-hero-sub">
            I'm currently available for freelance projects, contract work, and
            full-time opportunities. Reach out and let's talk about what you're
            building.
          </Paragraph>
        </div>
      </Section>

      <Section as="div" padding="lg" className="pf-contact-page">
        <Grid columns={{ xs: 1, lg: 2 }} gap="lg">
          <div className="pf-contact-info">
            <Heading as="h2" size="xl">Get in touch</Heading>
            <Paragraph size="lg" color="muted">
              The best way to reach me is by email. I typically respond within
              one business day and I'd love to hear about what you're working on.
            </Paragraph>
            <div className="pf-contact-items">
              <div className="pf-contact-item">
                <Icon name="mail" className="pf-contact-item-icon" />
                <span>hello@jordanellis.design</span>
              </div>
              <div className="pf-contact-item">
                <Icon name="language" className="pf-contact-item-icon" />
                <span>jordanellis.design</span>
              </div>
              <div className="pf-contact-item">
                <Icon name="location_on" className="pf-contact-item-icon" />
                <span>San Francisco, CA — open to remote</span>
              </div>
            </div>
          </div>

          <Card shadow="xs" className="pf-contact-card">
            <Heading as="h3" size="md">What I'm looking for</Heading>
            <BadgeList items={[
              { icon: "work", label: "Full-time roles at product-led companies" },
              { icon: "timer", label: "Short-term contracts and consulting" },
              { icon: "group", label: "Design system partnerships" },
              { icon: "lightbulb", label: "Early-stage startups with real problems" },
            ]} />
          </Card>
        </Grid>
      </Section>
    </>
  );
}

function App() {
  const [activePage, setActivePage] = useState("home");
  const [navOpen, setNavOpen] = useState(false);

  const navigate = (page) => {
    setActivePage(page);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeStudy = caseStudies.find((s) => s.id === activePage);

  const sidebar = (
    <SideNav
      open={navOpen}
      onClose={() => setNavOpen(false)}
      header={(collapsed) =>
        !collapsed ? (
          <div className="pf-nav-brand">
            <span className="pf-nav-brand-name">Jordan Ellis</span>
            <span className="pf-nav-brand-title">Senior UX Designer</span>
          </div>
        ) : null
      }
    >
      <SideNavItem
        as="button"
        icon="home"
        label="Overview"
        active={activePage === "home"}
        onClick={() => navigate("home")}
      />
      <SideNavItem
        as="button"
        icon="psychology"
        label="Process"
        active={activePage === "process"}
        onClick={() => navigate("process")}
      />
      <SideNavGroup icon="work" label="Case studies" defaultOpen>
        {caseStudies.map((study) => (
          <SideNavItem
            key={study.id}
            as="button"
            label={study.title}
            active={activePage === study.id}
            onClick={() => navigate(study.id)}
          />
        ))}
      </SideNavGroup>
      <SideNavItem
        as="button"
        icon="person"
        label="About"
        active={activePage === "about"}
        onClick={() => navigate("about")}
      />
      <SideNavItem
        as="button"
        icon="mail"
        label="Contact"
        active={activePage === "contact"}
        onClick={() => navigate("contact")}
      />
    </SideNav>
  );

  // PageLayout wraps header slot in <header> — use div here to avoid nesting
  const mobileHeader = (
    <div className="pf-mobile-header">
      <Link
        as="button"
        className="pf-mobile-logo"
        onClick={() => navigate("home")}
      >
        Jordan <span className="pf-mobile-logo-accent">Ellis</span>
      </Link>
      <IconButton
        icon="menu"
        label="Open navigation"
        onClick={() => setNavOpen(true)}
      />
    </div>
  );

  return (
    <LabelsProvider locale="en" labels={actionLabels}>
      <PageLayout stickyHeader sidebar={sidebar} header={mobileHeader}>
        {activePage === "home" && <HomePage navigate={navigate} />}
        {activePage === "process" && <ProcessPage navigate={navigate} />}
        {activeStudy && <CaseStudyPage study={activeStudy} navigate={navigate} />}
        {activePage === "about" && <AboutPage navigate={navigate} />}
        {activePage === "contact" && <ContactPage />}
      </PageLayout>
    </LabelsProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
