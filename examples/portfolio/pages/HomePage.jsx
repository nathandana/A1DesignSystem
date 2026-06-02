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
      <Section inverse padding="lg" gap="lg" contentWidth="lg">
          <MessageBadge size="lg" status="info" icon="person">
            Principal AI Designer
          </MessageBadge>
          <Heading
            as="h1"
            type="display"
            size={{ xs: "xl", md: "jumbo", lg: "xJumbo" }}
            className="pf-hero-heading"
          >
            I Speak{" "}
            <span className="pf-accent">AI.</span>
          </Heading>
          <Paragraph size="lg">Design has been centered on creating representations of an experience: wireframes, mockups, prototypes, and polished files that describe what a product <em>should</em> be. It gets passed to developers, becomes something real, and then if we are lucky, we have time to iterate. <strong>AI has changed that</strong>. It closes the gap between imagining an experience and actually building, testing, and improving it in real time.</Paragraph>
          <Paragraph size="lg">My strength is leading that process. I combine UX architecture, design systems, accessibility, visual design, product strategy, and technical implementation to direct AI toward better outcomes. I know how to prompt it, challenge it, refine it, and recognize when the output is impressive but wrong. My focus is helping teams use AI to create clearer, stronger, more scalable products without lowering the bar for quality.</Paragraph>

          <ButtonContainer size="lg">
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

      <Section contentWidth="lg" padding="md">
        <div className="pf-section-inner">
          <MessageBadge subtle icon="work">Selected projects</MessageBadge>
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
                Trusted design systems leader
              </Heading>
              <div>
              <Paragraph size="lg">
                As a trusted design systems leader, I specialize in building
                predictable, accessible systems that drive strategy,
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
