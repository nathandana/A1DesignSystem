import {
  Blockquote,
  Button,
  ButtonContainer,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
} from "../../../packages/react/src/index.js";
import { caseStudies } from "../data/caseStudies.js";
import { getRoutePath } from "../utils/routing.js";
import { CaseStudyCard } from "../components/CaseStudyCard.jsx";

export function HomePage({ navigate }) {
  return (
    <>
      <Section inverse padding="lg" gap="md" contentWidth="lg">
          <MessageBadge size="lg" status="info" icon="person">
            Principal Designer
          </MessageBadge>
          <Heading
            as="h1"
            type="display"
            size={{ xs: "xl", md: "jumbo", lg: "xJumbo" }}
            className="pf-hero-heading"
          >
            Nathan{" "}
            <span className="pf-accent">Dana</span>
          </Heading>
          <Heading>I design complex products and the systems behind them.</Heading>
          <Paragraph size="lg">Design leader focused on turning complex enterprise problems into clear, scalable experiences. I work across product strategy, UX, interaction design, Figma, design systems, and emerging AI workflows—connecting the big picture to the details required to ship.</Paragraph>

          <ButtonContainer>
            <Button
              variant="primary"
              icon="arrow_downward"
              onClick={() =>
                document
                  .getElementById("case-studies")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View work
            </Button>
            <Button as="a" href={getRoutePath("process")} variant="secondary"               icon="arrow_right"               iconPosition="end"

onClick={(event) => navigate("process", event)}>
              My process
            </Button>
          </ButtonContainer>
      </Section>

      <Section contentWidth="lg" padding="md" id="case-studies">
        <div className="pf-section-inner">
          <Heading as="h2" type="display" size={{ xs: "xl", md: "xxl" }}>
            Case studies
          </Heading>
          <Grid columns={{ xs: 1, md: 2, xl: 3 }} gap="lg">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} navigate={navigate} />
            ))}
          </Grid>
        </div>
      </Section>

      <Section surface="panel" gap="lg" padding="md" contentWidth="lg">
              <Heading as="h2" size={{ xs: "xl", md: "xxl" }}>
                Designing at enterprise scale
              </Heading>
              <div>
              <Paragraph size="lg">
                As a trusted design leader, I specialize in building
                predictable, accessible products and systems that drive strategy,
                consistency, and scalability across enterprise products.
              </Paragraph>
              <Paragraph size="lg">
                I combine creative vision with hands-on execution to deliver
                high-performing user experiences. With strong cross-functional
                leadership, I unite product, design, and engineering teams to
                translate complexity into clarity.
              </Paragraph></div>
              <ButtonContainer align="start" size="lg">
                <Button
                  as="a"
                  href={getRoutePath("resume")}
                  variant="secondary"
                  icon="description"
                  iconPosition="start"
                  onClick={(event) => navigate("resume", event)}
                >
                  View resume
                </Button>
              </ButtonContainer>
</Section>  
<Section inverse padding="md" contentWidth="lg">
        <div className="pf-section-inner">
            
            <Blockquote variant="feature" cite="Leon">
              Nathan has a remarkable talent for translating conceptual design needs into scalable, architecturally sound components. I've seen firsthand his unique ability to bridge the gap between complex design strategy and technical execution.
            </Blockquote>
              <ButtonContainer size="lg">
                <Button
                  as="a"
                  href={getRoutePath("testimonials")}
                  variant="secondary"
                  icon="format_quote"
                  iconPosition="start"
                  onClick={(event) => navigate("testimonials", event)}
                >
                  Read testimonials
                </Button>
              </ButtonContainer>
</div></Section>  
    </>
  );
}
