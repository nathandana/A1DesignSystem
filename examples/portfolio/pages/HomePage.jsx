import { contentFocus } from "../data/portfolioFocus.js";
import { focusAttributes } from "../utils/focus.js";
import {
  Button, ButtonContainer, Card, Divider, Figure, Grid, Heading,
  HeadingMark, Paragraph, Section, Spacer, Stack,
} from "../../../packages/react/src/index.js";
import { caseStudies } from "../data/caseStudies.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

const demoIds = ["member-menu", "carshopper"];
const projectStudies = caseStudies.filter((study) => !demoIds.includes(study.id));
const productDemos = caseStudies.filter((study) => demoIds.includes(study.id));

export function HomePage({ navigate }) {
  const asset = (path) => `${getRouteBase()}${path}`;

  return (
    <>
      <Section padding="md" contentWidth="xl" gap="lg">
        <Grid columns={{ xs: 1, md: 2 }} gap="xl" alignItems="center">
          <Stack gap="lg" align="start" {...focusAttributes(contentFocus["alternate-introduction"])}>
            <Heading size={{ xs: "sm", md: "md" }}><b>Nathan Dana</b> · Design Systems</Heading>
            <Heading as="h1" type="display" size={{ xs: "lg", md: "xl", lg: "xxl", xl: "xJumbo" }}>
              <HeadingMark>Bridging AI</HeadingMark> and  Systems.
            </Heading>
            <Paragraph size="xl">Enterprise design systems shaped by product strategy, UX, Figma, and emerging AI workflows.</Paragraph>
            <ButtonContainer size="lg" gap="md">
              <Button as="a" href="#selected-work" icon="arrow_downward" iconPosition="end">View work</Button>
              <Button as="a" href={getRoutePath("resume")} variant="secondary" onClick={(event) => navigate("resume", event)}>View résumé</Button>
            </ButtonContainer>
          </Stack>
          <Figure src={asset("/img/nathan-dana-tranxsparent-portrait.png")} alt="Illustrated portrait of Nathan Dana" />
        </Grid>
        <Divider size="lg" />
        <Grid columns={{ xs: 1, lg: 3 }} gap="lg">
          <Card icon="history" {...focusAttributes(contentFocus["alternate-ai-workflows"])}>
            <Stack gap="sm">
              <Heading as="h2" size="sm">AI-assisted workflows</Heading>
              <Paragraph color="muted">Defining how AI can create, document, test, and consume design systems—bringing design and code closer to a shared source of truth.</Paragraph>
            </Stack>
          </Card>
          <Card icon="groups" {...focusAttributes(contentFocus["alternate-enterprise-scale"])}>
            <Stack gap="sm">
              <Heading as="h2" size="sm">Complexity at scale</Heading>
              <Paragraph color="muted">UX and design systems supporting enterprise healthcare products, large internal platforms, and thousands of users across multiple teams and technologies.</Paragraph>
            </Stack>
          </Card>
          <Card icon="route" {...focusAttributes(contentFocus["alternate-ai-system"])}>
            <Stack gap="sm">
              <Heading as="h2" size="sm">AI in the system</Heading>
              <Paragraph color="muted">Structuring tokens, components, documentation, and rules so AI produces more consistent outputs with less rework, fewer tokens, and lower operating cost.</Paragraph>
            </Stack>
          </Card>
        </Grid>
      </Section>

      <Section id="selected-work" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Heading as="h2" type="display" size="xl">Case studies</Heading>
        {projectStudies.map((study, index) => (
          <Card
            key={study.id}
            {...focusAttributes(study)}
            variant="navigation"
            href={getRoutePath(study.id)}
            aria-label={`Read ${study.title} case study`}
            onClick={(event) => navigate(study.id, event)}
          >
            <Grid columns={{ xs: 1, md: 2 }} gap="xl" alignItems="center">
              <Stack gap="md" align="start">
                <Paragraph size="sm" color="muted">0{index + 1} · {study.tags.join(" / ")}</Paragraph>
                <Heading as="h3" size="xl">{study.title}</Heading>
                <Paragraph size="lg">{study.description}</Paragraph>
                <Paragraph>Read case study →</Paragraph>
              </Stack>
              <Figure src={asset(study.cardImage)} alt={`${study.title} project artwork`} radius="md" />
            </Grid>
          </Card>
        ))}
      </Section>

      <Section id="demos" padding="lg" contentWidth="xl" gap="xs">
        <Heading as="h2" type="display" size="xl">Product demos</Heading>
        <Paragraph size="lg" color="muted">A closer look at the interactions behind the case studies.</Paragraph>
        <Spacer size="md" />
        <Grid columns={{ xs: 1, md: 2 }} gap="lg">
          {productDemos.map((study) => (
            <Card
              key={study.id}
            {...focusAttributes(study)}
              variant="navigation"
              href={getRoutePath(study.id)}
              aria-label={`Read ${study.title} case study`}
              onClick={(event) => navigate(study.id, event)}
            >
              <Stack gap="md" align="start">
                <Figure src={asset(study.cardImage)} alt={`${study.title} interface`} aspectRatio="16:9" radius="sm" />
                <Heading as="h3" size="md">{study.title}</Heading>
                <Paragraph>{study.description}</Paragraph>
                <Paragraph>Read case study →</Paragraph>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Section>

    </>
  );
}
