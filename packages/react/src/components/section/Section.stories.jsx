import { Section } from "./Section.jsx";
import { Heading } from "../heading/Heading.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Button } from "../button/Button.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { MessageBadge } from "../message/Message.jsx";

const meta = {
  title: "Components/Containers/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    padding: {
      control: "select",
      options: ["lg", "md", "sm", "none"],
    },
    surface: {
      control: "select",
      options: ["page", "panel", "raised", undefined],
    },
    inverse: { control: "boolean" },
    as: { control: "text" },
  },
};

export default meta;

// ─── Demo helper ───────────────────────────────────────────────────────────────

function SampleContent({ badge, heading, body, actions = true }) {
  return (
    <>
      {badge && (
        <MessageBadge subtleicon={badge.icon}>{badge.label}</MessageBadge>
      )}
      <Heading as="h2" size={{ xs: "xl", md: "xxl" }}>
        {heading}
      </Heading>
      <Paragraph size="lg" color="muted">
        {body}
      </Paragraph>
      {actions && (
        <ButtonContainer align="start">
          <Button variant="primary">Get started</Button>
          <Button variant="secondary">Learn more</Button>
        </ButtonContainer>
      )}
    </>
  );
}

// ─── Stories ───────────────────────────────────────────────────────────────────

export const Default = {
  name: "Section",
  args: {
    padding: "lg",
    surface: "page",
    inverse: false,
  },
  render: (args) => (
    <Section {...args}>
      <SampleContent
        badge={{ icon: "crop_free", label: "Section component" }}
        heading="Configurable section"
        body="Use the controls panel to change padding (lg / md / sm / none), surface (page / panel / raised / inverse), and toggle inverse mode. All values come from design tokens — no hard-coded colors or spacing."
      />
    </Section>
  ),
};

export const PaddingScale = {
  name: "Padding — lg / md / sm",
  render: () => (
    <>
      <Section padding="lg" surface="panel">
        <MessageBadge subtleicon="zoom_out_map">lg — large</MessageBadge>
        <Heading as="h2" size="xl">Large padding</Heading>
        <Paragraph size="lg" color="muted">
          96px block / 64px inline at desktop, 64/40 at tablet, 40/24 on mobile.
          Use for hero sections, prominent CTAs, and full-bleed highlights.
        </Paragraph>
      </Section>

      <Section padding="md">
        <MessageBadge subtleicon="crop_free">md — medium</MessageBadge>
        <Heading as="h2" size="xl">Medium padding</Heading>
        <Paragraph size="lg" color="muted">
          64px block / 40px inline at desktop, 40/24 at tablet, 24/16 on mobile.
          Use for standard content bands and repeating page sections.
        </Paragraph>
      </Section>

      <Section padding="sm" surface="raised">
        <MessageBadge subtleicon="compress">sm — small</MessageBadge>
        <Heading as="h2" size="xl">Small padding</Heading>
        <Paragraph size="lg" color="muted">
          32px block / 24px inline at desktop, scales to 24/16 at tablet and 16/12 on mobile.
          Use for compact bands, banners, or dense product-UI sections.
        </Paragraph>
      </Section>
    </>
  ),
};

export const SurfaceVariants = {
  name: "Surface variants",
  render: () => (
    <>
      <Section padding="md" surface="page">
        <MessageBadge subtle>page</MessageBadge>
        <Heading as="h2" size="xl">Page surface</Heading>
        <Paragraph size="lg" color="muted">
          The default page background. Use as a neutral baseline between elevated or panel sections.
        </Paragraph>
      </Section>

      <Section padding="md" surface="panel">
        <MessageBadge subtle>panel</MessageBadge>
        <Heading as="h2" size="xl">Panel surface</Heading>
        <Paragraph size="lg" color="muted">
          A subtle lift from the page. Use for alternating bands, sidebars-as-sections, or grouped content areas.
        </Paragraph>
      </Section>

      <Section padding="md" surface="raised">
        <MessageBadge subtle>raised</MessageBadge>
        <Heading as="h2" size="xl">Raised surface</Heading>
        <Paragraph size="lg" color="muted">
          The most elevated neutral surface. Use sparingly for featured content rows.
        </Paragraph>
      </Section>

      <Section padding="md" inverse>
        <MessageBadge subtle>inverse</MessageBadge>
        <Heading as="h2" size="xl">Inverse surface</Heading>
        <Paragraph size="lg" color="muted">
          High-contrast dark band. Use the inverse prop to flip the full color scheme — surface tokens (page, panel, raised) resolve to their dark equivalents inside.
        </Paragraph>
      </Section>
    </>
  ),
};

/**
 * `inverse={true}` applies the `a1-inverse` class, switching ALL semantic color tokens
 * (text, borders, buttons, badges) to the dark scheme. Background is automatically set
 * via the base theme rule. Pair with `surface="page"` (or panel/raised) to explicitly set the background within the dark scheme.
 */
export const InverseSection = {
  name: "Inverse — dark band",
  render: () => (
    <>
      <Section padding="lg" surface="page">
        <SampleContent
          badge={{ icon: "light_mode", label: "Light section" }}
          heading="Leading section on a light page"
          body="Standard light-mode section. The inverse band below demonstrates strong visual contrast for a hero or CTA use case."
        />
      </Section>

      <Section padding="lg" inverse>
        <SampleContent
          badge={{ icon: "dark_mode", label: "Dark section" }}
          heading="Inverse section — all tokens switch"
          body="Text, buttons, badges, and borders all adapt to the dark color scheme. No hard-coded colors needed."
        />
      </Section>

      <Section padding="lg" surface="page">
        <SampleContent
          badge={{ icon: "light_mode", label: "Back to light" }}
          heading="Page resumes normal scheme"
          body="Nested inverse sections flip back to light. Chain as many bands as needed."
          actions={false}
        />
      </Section>
    </>
  ),
};

/**
 * Pass a breakpoint object to `padding` for per-breakpoint control without built-in auto-scaling.
 * Useful when the default scaling doesn't match your layout at a specific breakpoint.
 */
export const ResponsivePadding = {
  name: "Responsive padding — object prop",
  render: () => (
    <Section padding={{ xs: "sm", md: "md", lg: "lg" }} surface="panel">
      <SampleContent
        badge={{ icon: "devices", label: "Responsive" }}
        heading="Per-breakpoint padding"
        body="This section uses padding={{ xs: 'sm', md: 'md', lg: 'lg' }} — sm on mobile, md at tablet, lg at desktop. Resize to see the padding change."
      />
    </Section>
  ),
};

export const StackedBands = {
  name: "Stacked bands — full page",
  render: () => (
    <>
      <Section padding="lg" inverse>
        <SampleContent
          badge={{ icon: "rocket_launch", label: "New" }}
          heading="Ship faster with A1 Section"
          body="Section handles padding, surface color, and inverse theming in a single prop API. No more juggling className utilities for page bands."
        />
      </Section>

      <Section padding="lg" surface="page">
        <SampleContent
          badge={{ icon: "check_circle", label: "Features" }}
          heading="Everything a page band needs"
          body="Three padding tiers, four surface tokens, and inverse color-scheme switching. All values come from design tokens — no magic numbers."
        />
      </Section>

      <Section padding="md" surface="panel">
        <SampleContent
          badge={{ icon: "palette", label: "Theming" }}
          heading="Survives every theme"
          body="Light, dark, accessible, heritage, and inverse contexts all work without overrides. Surface and inverse props resolve against whichever token set is active."
          actions={false}
        />
      </Section>

      <Section padding="lg" inverse>
        <SampleContent
          badge={{ icon: "mail", label: "Ready" }}
          heading="Start building today"
          body="Drop Section anywhere in your layout and let the token system handle the rest."
        />
      </Section>
    </>
  ),
};
