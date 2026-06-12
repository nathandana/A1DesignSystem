import { useState } from "react";
import { Button } from "../button/Button.jsx";
import { ButtonContainer } from "../button-container/ButtonContainer.jsx";
import { Heading } from "../heading/Heading.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";
import { Paragraph } from "../paragraph/Paragraph.jsx";
import { Section } from "../section/Section.jsx";
import { StepTracker } from "../step-tracker/StepTracker.jsx";
import { StickyActions } from "./StickyActions.jsx";

export default {
  title: "Components/Actions/StickyActions",
  component: StickyActions,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    contentWidth: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      description: "Constrains inner content to match Section contentWidth. Set to the same value as the Section above for visual alignment.",
    },
  },
};

// ── Default ────────────────────────────────────────────────────────────────────

export const Default = {
  name: "Default",
  render: () => (
    <>
      <Section padding="md" contentWidth="sm" gap="lg" surface="page">
        <Heading as="h1" type="heading" size="xl">Review your changes</Heading>
        <Paragraph color="muted">
          Check everything below before saving. You can go back to make corrections at any point.
        </Paragraph>
      </Section>
      <StickyActions contentWidth="sm">
        <ButtonContainer align="end">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </ButtonContainer>
      </StickyActions>
    </>
  ),
};

// ── With step tracker ──────────────────────────────────────────────────────────

const STEPS = 4;

export const WithStepTracker = {
  name: "With step tracker",
  render: () => {
    const [step, setStep] = useState(1);

    return (
      <>
        <Section padding="md" contentWidth="xs" align="center" gap="lg" surface="page">
          <Heading as="h1" type="display" size="lg" align="center">
            {step === 1 && "Welcome"}
            {step === 2 && "Your details"}
            {step === 3 && "Your preferences"}
            {step === 4 && "All done"}
          </Heading>
          <Paragraph color="muted" align="center">
            {step === 1 && "Let's get you set up. This will only take a minute."}
            {step === 2 && "Tell us a bit about yourself."}
            {step === 3 && "Choose what matters most to you."}
            {step === 4 && "You're ready to go. Review and confirm below."}
          </Paragraph>
        </Section>
        <StickyActions contentWidth="xs">
          <StepTracker steps={STEPS} currentStep={step} align="center" />
          <ButtonContainer fillButtons size="lg">
            {step > 1 && (
              <IconButton
                icon="arrow_back"
                label="Back"
                variant="secondary"
                size="lg"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
              />
            )}
            <Button
              variant="primary"
              onClick={() => setStep((s) => Math.min(STEPS, s + 1))}
            >
              {step < STEPS ? "Continue" : "Finish"}
            </Button>
          </ButtonContainer>
        </StickyActions>
      </>
    );
  },
};

// ── Content width alignment ────────────────────────────────────────────────────

export const ContentWidthAlignment = {
  name: "Content width alignment",
  render: () => (
    <>
      <Section padding="md" contentWidth="md" gap="lg" surface="page">
        <Heading as="h1" type="heading" size="xl">Project settings</Heading>
        <Paragraph color="muted">
          The StickyActions below uses contentWidth="md" to match this Section's
          contentWidth. The buttons align with the content above regardless of
          viewport width.
        </Paragraph>
        <Paragraph color="muted">
          Always match contentWidth between StickyActions and the page Section so
          the action bar feels anchored to the content, not the viewport edge.
        </Paragraph>
      </Section>
      <StickyActions contentWidth="md">
        <ButtonContainer align="end">
          <Button variant="secondary">Discard</Button>
          <Button variant="primary">Save settings</Button>
        </ButtonContainer>
      </StickyActions>
    </>
  ),
};
