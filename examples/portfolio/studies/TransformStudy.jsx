import {
  Card,
  Cluster,
  Figure,
  Grid,
  GridItem,
  Heading,
  HeadingMark,
  Link,
  List,
  ListItem,
  Paragraph,
  Section,
  Stack,
  Stat,
} from "../../../packages/react/src/index.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function TransformStudy() {
  return (
    <article>
      <Section padding="md" surface="raised" contentWidth="xl" gap="sm">
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>← Home</Link>
        </Cluster>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo" }}>
          I grew Transform into a system built for <HeadingMark>enterprise scale</HeadingMark>.
        </Heading>
        <Paragraph size="lg">
          A shared design system for TruCare Cloud, connecting reusable components, accessible patterns and
          the teams building everyday healthcare workflows.
        </Paragraph>
        <Grid columns={{ xs: 1, md: 3 }} gap="lg" alignItems="center">
          <GridItem>
            <Figure
              src={`${getRouteBase()}/img/transform/transform_cover.png`}
              alt="Transform Design System"
            />
          </GridItem>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Grid columns={{ xs: 1, sm: 2 }} gap="lg">
              <Card icon="work">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Role
                  </Paragraph>
                  <Paragraph size="lg">UX Architect</Paragraph>
                </Stack>
              </Card>
              <Card icon="calendar_month">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Timeline
                  </Paragraph>
                  <Paragraph size="lg">2020–2023</Paragraph>
                </Stack>
              </Card>
              <Card icon="center_focus_strong">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Focus
                  </Paragraph>
                  <Paragraph size="lg">Components, accessibility and adoption</Paragraph>
                </Stack>
              </Card>
              <Card>
                <Stat size="lg" value={20000} description="Daily users of TruCare Cloud" />
              </Card>
              <Card>
                <Stat size="lg" value={16} suffix="+" description="Applications integrated" />
              </Card>
              <Card>
                <Stat
                  size="lg"
                  value={40}
                  suffix="+"
                  description="Reusable components built and maintained"
                />
              </Card>
            </Grid>
          </GridItem>
        </Grid>
      </Section>

      <Section id="the-organization" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            01 / The organization
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                TruCare Cloud brings complex healthcare workflows into one application.
              </Heading>
              <Paragraph size="lg">
                I led the creation and evolution of Transform, an internal design system that streamlined
                TruCare Cloud. TruCare Cloud is an enterprise application that facilitates the insurance
                authorization process, has extensive work management, creates long term service and support
                requests and more. Used daily by 20,000 employees at Centene, a Fortune 25 enterprise, it
                directly impacts the health and well-being of tens of millions of Americans.
              </Paragraph>
              <Paragraph size="lg">
                Initially developed as a small design library, Transform has grown into the interface backbone
                of this essential tool. The goal of Transform was to improve user experience, enhance
                consistency, and reduce development time by offering a centralized, reusable set of design
                components. Over time, Transform evolved into a full-fledged design system with scalable
                processes, robust governance, and strong cross-functional collaboration.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="impact" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            02 / Impact
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Transform supported a growing community of users and product teams.
              </Heading>
              <List variant="unordered" size="lg">
                <ListItem>20,000+ daily users across a Fortune 25 enterprise</ListItem>
                <ListItem>16+ applications integrated</ListItem>
                <ListItem>40+ reusable components built and maintained</ListItem>
                <ListItem>11-person cross-functional team built from a solo effort</ListItem>
                <ListItem>30 designers supported through a dedicated liaison model</ListItem>
                <ListItem>WCAG 2.2 AA compliance achieved across the full component library</ListItem>
              </List>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="team-formation" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            03 / Team formation
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                I grew a solo effort into an 11-person cross-functional team.
              </Heading>
              <Paragraph size="lg">
                Transform began as a one-person effort—me. As the sole UX designer, I initially focused on
                defining core components and patterns using Sketch. These early components established the
                foundation of the system, which was later migrated to Figma to improve collaboration and
                scalability. The design system was heavily influenced by Material Design, ensuring a familiar
                and intuitive user experience for developers and users alike.
              </Paragraph>
              <Paragraph size="lg">
                Recognizing the need for development support, we onboarded four contract developers who began
                building components in Angular using Angular Material. I contributed directly to the codebase,
                created their backlog, and provided direction to ensure alignment with design principles.
                Additionally, I played a hands-on role in the adoption process by guiding the first
                sub-application to implement Transform, troubleshooting issues, and ensuring successful
                integration.
              </Paragraph>
              <Paragraph size="lg">
                With the growing complexity of Transform, we hired a development lead to manage technical
                architecture and grow the team. At peak, Transform was supported by an 11-person
                cross-functional team: myself as lead, two UX designers, a development lead, four developers,
                a product owner, a business analyst, and a scrum master. Together, we ran full agile sprints,
                refined our processes, and built the collaborative infrastructure that made the system
                sustainable at scale.
              </Paragraph>
              <Heading as="h3" size="lg">
                Pattern library
              </Heading>
              <Paragraph size="lg">
                We built a dynamic Pattern Library site that served as a showcase, playground, and code
                resource. Users could configure components, explore usage scenarios, and export code—all
                through an intuitive interface.
              </Paragraph>
              <Paragraph size="lg">
                Feedback loops with developers led to continual enhancements. Our vision extended beyond a
                library: we laid the groundwork for a future page builder capable of drag-and-drop coded
                layouts, empowering faster prototyping and production.
              </Paragraph>
              <Paragraph size="lg">
                By designing and building the pattern library in-house, using Transform, we were able to be
                our own users. This allowed for improvements in designer and developer experiences, and
                allowed us to better support our customers.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform/timeline.png`}
          alt="Timeline of Transform's development"
          captionSrOnly
          caption={
            <>
              <strong>Transform Timeline</strong>
              <ul>
                <li>
                  2020 – Transform Begins
                  <ul>
                    <li>Build Sketch design library</li>
                    <li>Migrate to Figma</li>
                    <li>Initial Code in Angular</li>
                  </ul>
                </li>
                <li>
                  2021 – Development
                  <ul>
                    <li>Dev team hired</li>
                    <li>Initial Component Library</li>
                    <li>Rebuild of Member Dashboard</li>
                  </ul>
                </li>
                <li>
                  2022 – Expansion
                  <ul>
                    <li>Expanded team, hired designers and lead developer</li>
                    <li>Improved pattern library</li>
                    <li>Built out processes</li>
                  </ul>
                </li>
                <li>
                  2023 – Adoption
                  <ul>
                    <li>Enhanced multiple applications</li>
                    <li>Expanded and improved pattern library</li>
                    <li>V2 release</li>
                  </ul>
                </li>
              </ul>
            </>
          }
        />
        <Figure
          src={`${getRouteBase()}/img/transform/pattern-library.png`}
          alt="Image of the Pattern Library Application interface"
          caption="The Pattern library allows users to explore configurations of components, read release notes, gather and share code snippets, and so much more, built with Transform so as a team we used our own system."
        />
      </Section>

      <Section id="support-model" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            04 / Support model
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                A dedicated liaison gave every team a clear point of contact.
              </Heading>
              <Paragraph size="lg">
                As TruCare Cloud grew, so did Transform. When I started, I was able to stay in touch with
                every designer on the project, supporting, co-designing, gathering feedback, joining forces in
                research. That became harder as my role expanded. To scale that support, I worked with
                leadership to create a liaison model: each Transform designer was assigned as a dedicated
                point of contact for a segment of our customer teams. At its largest, this model supported a
                community of 30 designers and their associated product teams. Customers always knew who to
                talk to, which built trust and made feedback loops faster and more honest.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="accessibility" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            05 / Accessibility
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Accessibility became part of how we designed, tested and supported components.
              </Heading>
              <Paragraph size="lg">
                Recognizing the importance of inclusive design, I took the initiative to integrate
                accessibility into Transform's core by creating detailed reports, conducting internal testing,
                and developing training programs for designers to ensure compliance with accessibility
                standards. I worked closely with the accessibility team to improve my personal understanding
                and empathy for accessibility, which informed our approach to testing and design.
              </Paragraph>
              <Paragraph size="lg">
                When we started, there was no formal accessibility support team in place. These efforts
                culminated in achieving WCAG 2.2 AA compliance across the full component library, passing
                rigorous internal audits and meeting enterprise benchmarks. By embedding accessibility into
                our design and development processes from the start, we not only raised the quality bar for
                Transform but set the standard that would later inform Fondue and other enterprise projects at
                Centene.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform-expansion.png`}
          alt="Image of the Transform Design System expansion panel"
          caption="The expansion panel component utilizes slot features to allow for flexible content and layout, reducing detach rates, while allowing for considerable flexibility and exploration."
        />
      </Section>

      <Section id="lessons-learned" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            06 / Lessons learned
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Strong relationships and incremental adoption make a system easier to sustain.
              </Heading>
              <Heading as="h3" size="lg">
                Design systems are about relationships
              </Heading>
              <Paragraph size="lg">
                Throughout the development and scaling of Transform, one of the key takeaways was that design
                systems are fundamentally about relationships. In areas where I was able to build strong
                relationships—with developers, product managers, and other stakeholders—we saw significant
                success in adoption and expansion. Teams that trusted the system were more likely to integrate
                it into their workflows, which led to consistent, high-quality user experiences.
              </Paragraph>
              <Heading as="h3" size="lg">
                Component-first &gt; app-first
              </Heading>
              <Paragraph size="lg">
                We initially attempted an app-by-app approach to adoption, which required extensive alignment
                between product, development, design, and leadership—areas where I did not have direct
                influence. When relationships were strong and priorities aligned, we saw significant progress.
                However, when those relationships weren't as solid or priorities diverged, it became far more
                challenging to achieve success and drive adoption effectively.
              </Paragraph>
              <Paragraph size="lg">
                In hindsight, a more strategic component-by-component approach might have yielded better
                results. Since most applications had been developed before the design system existed,
                comprehensive rebuilds were rarely prioritized. Focusing on incrementally replacing key
                components, such as buttons, across the software would have been a simpler and more efficient
                way to introduce Transform, ultimately positioning it to drive greater consistency across the
                enterprise.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform/changelog.png`}
          alt="Changelog Example"
          caption="Mirroring best practices from the development process was one way I ensured we treated even the design library as a product. By creating a changelog, we were able to communicate changes and updates to the system, something I've adopted for other systems."
        />
        <Figure
          src={`${getRouteBase()}/img/transform/cards_doc.png`}
          alt="Card Documentation Example"
          caption="The card component documentation is an example of how we documented the components in a way that was easy to understand and implement. This was a key part of our strategy to drive adoption and ensure consistency across the product."
        />
      </Section>

      <Section id="example-app" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            07 / Real-world example
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Transform brings complex authorization workflows into one consistent experience.
              </Heading>
              <Paragraph>
                This TruCare Cloud determinations screen brings together authorization history,
                attachments, review line items and an activity feed. Shared navigation, status cards,
                filters, expandable tables and pagination help organize a dense workflow using
                Transform’s reusable components and patterns.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform/trucare-determinations.png`}
          alt="TruCare Cloud determinations screen with authorization history cards, an attachments table with an expanded row, review-needed and no-review-needed line item tables, section navigation and an activity feed."
          caption="Transform in practice: TruCare Cloud combines shared components and patterns to support an authorization workflow, from reviewing history and attachments to tracking line items and activity."
        />
      </Section>

      <Section id="outcome" padding="lg" contentWidth="sm" gap="sm" inverse>
        <Heading as="h2" size="xl">
          Transform established a foundation that carried forward into Fondue.
        </Heading>
        <Paragraph size="lg">
          Looking back, I am proud of the system that we built. Transform is comprehensive and robust, easy to
          use and implement. Though I've since moved on, Transform continues to be used across the
          application—despite currently running without dedicated design support. I've used the processes,
          testing, components and feature set of Transform to help improve the enterprise-wide design system,
          Fondue.
        </Paragraph>
        <Paragraph size="lg">
          Transform's success was built on a foundation of scalable processes, accessibility, and strong
          cross-functional relationships. From a single-contributor project to an enterprise-wide solution, it
          has become a vital tool that enhances productivity, improves user experience, and ensures design
          consistency across the organization. The lessons learned from this journey continue to inform how we
          approach design systems and collaboration at scale.
        </Paragraph>
        <Figure
          src={`${getRouteBase()}/img/transform-expansion-testframe.png`}
          alt="Image of the Transform Design System expansion test frame"
          caption="Test frames ensured we didn't push out components that were not fully tested. This was a key part of our strategy to ensure quality and consistency across the product."
        />
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>Explore more work →</Link>
        </Cluster>
      </Section>
    </article>
  );
}
