import { audienceStudies, portfolioAudiences } from "../data/portfolioAudiences.js";
import { focusAttributes } from "../utils/focus.js";
import {
  Button, ButtonContainer, Card, Divider, Figure, Grid, Heading,
  HeadingMark, Paragraph, Section, Stack,
} from "../../../packages/react/src/index.js";
import { caseStudies } from "../data/caseStudies.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function HomePage({ navigate, audience = "general" }) {
  const config = portfolioAudiences[audience];
  const [before, after] = config.headline.split(config.emphasis);
  const asset = (path) => `${getRouteBase()}${path}`;

  return (
    <>
      <Section padding="md" contentWidth="xl" gap="lg">
        <Grid columns={{ xs: 1, md: 2 }} gap="xl" alignItems="center">
          <Stack gap="lg" align="start" >
            <Heading size={{ xs: "sm", md: "md" }}><b>Nathan Dana</b> · {config.title}</Heading>
            <Heading as="h1" type="display" size={{ xs: "lg", md: "xl", lg: "xxl", xl: "xJumbo" }}>
              {before}<HeadingMark>{config.emphasis}</HeadingMark>{after}
            </Heading>
            <Paragraph size="xl">{config.introduction}</Paragraph>
            <ButtonContainer size="lg" gap="md">
              <Button as="a" href="#selected-work" icon="arrow_downward" iconPosition="end">View work</Button>
              <Button as="a" href={getRoutePath("resume")} variant="secondary" onClick={(event) => navigate("resume", event)}>View résumé</Button>
            </ButtonContainer>
          </Stack>
          <Figure src={asset("/img/nathan-dana-transparent-portrait.png")} alt="Illustrated portrait of Nathan Dana" />
        </Grid>
        <Divider size="lg" />
        <Grid columns={{ xs: 1, lg: 3 }} gap="lg">
          {config.cards.map((card) => (
            <Card key={card.title} icon={card.icon}>
              <Stack gap="sm">
                <Heading as="h2" size="sm">{card.title}</Heading>
                <Paragraph color="muted">{card.body}</Paragraph>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section id="selected-work" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Heading as="h2" type="display" size="xl">Case studies</Heading>
        {audienceStudies(caseStudies, audience).map((study, index) => (
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
              {study.id === "a1" ? (
                <Figure placeholder aspectRatio="16:9" alt="A1 case study figure placeholder" radius="md" />
              ) : (
                <Figure src={asset(study.cardImage)} alt={`${study.title} project artwork`} radius="md" />
              )}
            </Grid>
          </Card>
        ))}
      </Section>



    </>
  );
}
