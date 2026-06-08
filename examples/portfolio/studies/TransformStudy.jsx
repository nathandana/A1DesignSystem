import {
  Card,
  Divider,
  Figure,
  Heading,
  List,
  ListItem,
  Paragraph,
  Section,
} from "../../../packages/react/src/index.js";
import { CaseStudyLayout } from "../pages/CaseStudyLayout.jsx";

export function TransformStudy() {
  return (
    <CaseStudyLayout
      title="Transform Design System"
      tags={["Design Systems", "Enterprise UX"]}
      meta={[
        { label: "Years", value: "2020–2023" },
        { label: "Company", value: "Centene Corporation" },
        { label: "Role", value: "UX Architect" },
      ]}
    >
      <Section as="div" padding="sm" contentWidth="md">

        <Figure src="img/transform/transform_cover.png" alt="Transform Design System" marginBottom="lg" />

        <Paragraph size="lg">
          I led the creation and evolution of Transform, an internal design system that streamlined TruCare Cloud. TruCare Cloud is an enterprise application that facilitates the insurance authorization process, has extensive work management, creates long term service and support requests and more. Used daily by 20,000 employees at Centene, a Fortune 25 enterprise, it directly impacts the health and well-being of tens of millions of Americans.
        </Paragraph>
        <Paragraph size="lg">
          Initially developed as a small design library, Transform has grown into the interface backbone of this essential tool. The goal of Transform was to improve user experience, enhance consistency, and reduce development time by offering a centralized, reusable set of design components. Over time, Transform evolved into a full-fledged design system with scalable processes, robust governance, and strong cross-functional collaboration.
        </Paragraph>
        </Section>
        <Section as="div" padding="sm" surface="raised" contentWidth="md" inverse>

          <Heading as="h2" size="lg" margin="md">Impact</Heading>
          <List variant="unordered" size="lg">
            <ListItem>20,000+ daily users across a Fortune 25 enterprise</ListItem>
            <ListItem>16+ applications integrated</ListItem>
            <ListItem>40+ reusable components built and maintained</ListItem>
            <ListItem>11-person cross-functional team built from a solo effort</ListItem>
            <ListItem>30 designers supported through a dedicated liaison model</ListItem>
            <ListItem>WCAG 2.2 AA compliance achieved across the full component library</ListItem>
          </List>
        </Section>
        <Section as="div" padding="md" contentWidth="md">

        <Heading as="h2" size="xl" margin="md">Team Formation &amp; Cross-functional Growth</Heading>
        <Paragraph size="lg">
          Transform began as a one-person effort—me. As the sole UX designer, I initially focused on defining core components and patterns using Sketch. These early components established the foundation of the system, which was later migrated to Figma to improve collaboration and scalability. The design system was heavily influenced by Material Design, ensuring a familiar and intuitive user experience for developers and users alike.
        </Paragraph>
        <Paragraph size="lg">
          Recognizing the need for development support, we onboarded four contract developers who began building components in Angular using Angular Material. I contributed directly to the codebase, created their backlog, and provided direction to ensure alignment with design principles. Additionally, I played a hands-on role in the adoption process by guiding the first sub-application to implement Transform, troubleshooting issues, and ensuring successful integration.
        </Paragraph>
        <Paragraph size="lg">
          With the growing complexity of Transform, we hired a development lead to manage technical architecture and grow the team. At peak, Transform was supported by an 11-person cross-functional team: myself as lead, two UX designers, a development lead, four developers, a product owner, a business analyst, and a scrum master. Together, we ran full agile sprints, refined our processes, and built the collaborative infrastructure that made the system sustainable at scale.
        </Paragraph>
        <Figure
          src="img/transform/timeline.png"
          alt="Timeline of Transform's development"
          imgStyle={{ backgroundColor: "white" }}
          marginTop="lg"
          marginBottom="lg"
          bleed
          captionSrOnly
          caption={
            <>
              <strong>Transform Timeline</strong>
              <ul>
                <li>2020 – Transform Begins
                  <ul>
                    <li>Build Sketch design library</li>
                    <li>Migrate to Figma</li>
                    <li>Initial Code in Angular</li>
                  </ul>
                </li>
                <li>2021 – Development
                  <ul>
                    <li>Dev team hired</li>
                    <li>Initial Component Library</li>
                    <li>Rebuild of Member Dashboard</li>
                  </ul>
                </li>
                <li>2022 – Expansion
                  <ul>
                    <li>Expanded team, hired designers and lead developer</li>
                    <li>Improved pattern library</li>
                    <li>Built out processes</li>
                  </ul>
                </li>
                <li>2023 – Adoption
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

        <Heading as="h3" size="lg" margin="md">Pattern Library</Heading>
        <Paragraph size="lg">
          We built a dynamic Pattern Library site that served as a showcase, playground, and code resource. Users could configure components, explore usage scenarios, and export code—all through an intuitive interface.
        </Paragraph>
        <Paragraph size="lg">
          Feedback loops with developers led to continual enhancements. Our vision extended beyond a library: we laid the groundwork for a future page builder capable of drag-and-drop coded layouts, empowering faster prototyping and production.
        </Paragraph>
        <Paragraph size="lg">
          By designing and building the pattern library in-house, using Transform, we were able to be our own users. This allowed for improvements in designer and developer experiences, and allowed us to better support our customers.
        </Paragraph>
        <Figure
          src="img/transform/pattern-library.png"
          alt="Image of the Pattern Library Application interface"
          caption="The Pattern library allows users to explore configurations of components, read release notes, gather and share code snippets, and so much more, built with Transform so as a team we used our own system."
          marginTop="lg"
          marginBottom="lg"
        />

        <Heading as="h2" size="xl" margin="md">Support Model</Heading>
        <Paragraph size="lg">
          As TruCare Cloud grew, so did Transform. When I started, I was able to stay in touch with every designer on the project, supporting, co-designing, gathering feedback, joining forces in research. That became harder as my role expanded. To scale that support, I worked with leadership to create a liaison model: each Transform designer was assigned as a dedicated point of contact for a segment of our customer teams. At its largest, this model supported a community of 30 designers and their associated product teams. Customers always knew who to talk to, which built trust and made feedback loops faster and more honest.
        </Paragraph>

        <Heading as="h2" size="xl" margin="md">Accessibility</Heading>
        <Paragraph size="lg">
          Recognizing the importance of inclusive design, I took the initiative to integrate accessibility into Transform's core by creating detailed reports, conducting internal testing, and developing training programs for designers to ensure compliance with accessibility standards. I worked closely with the accessibility team to improve my personal understanding and empathy for accessibility, which informed our approach to testing and design.
        </Paragraph>
        <Paragraph size="lg">
          When we started, there was no formal accessibility support team in place. These efforts culminated in achieving WCAG 2.2 AA compliance across the full component library, passing rigorous internal audits and meeting enterprise benchmarks. By embedding accessibility into our design and development processes from the start, we not only raised the quality bar for Transform but set the standard that would later inform Fondue and other enterprise projects at Centene.
        </Paragraph>
        <Figure
          src="img/transform-expansion.png"
          alt="Image of the Transform Design System expansion panel"
          caption="The expansion panel component utilizes slot features to allow for flexible content and layout, reducing detach rates, while allowing for considerable flexibility and exploration."
          marginTop="lg"
          marginBottom="lg"
        size="lg"
        align="center"
        />
        </Section>
        <Section as="div" padding="sm" surface="raised" contentWidth="md">

        <Heading as="h2" size="xl" margin="md">Lessons Learned</Heading>
        <Heading as="h3" size="lg" margin="md">Design Systems Are About Relationships</Heading>
        <Paragraph size="lg">
          Throughout the development and scaling of Transform, one of the key takeaways was that design systems are fundamentally about relationships. In areas where I was able to build strong relationships—with developers, product managers, and other stakeholders—we saw significant success in adoption and expansion. Teams that trusted the system were more likely to integrate it into their workflows, which led to consistent, high-quality user experiences.
        </Paragraph>
        <Figure
          src="img/transform/changelog.png"
          alt="Changelog Example"
          caption="Mirroring best practices from the development process was one way I ensured we treated even the design library as a product. By creating a changelog, we were able to communicate changes and updates to the system, something I've adopted for other systems."
          marginTop="lg"
          marginBottom="lg"
        size="md"
        align="center"
        />

        <Heading as="h3" size="lg" margin="md">Component-First &gt; App-First</Heading>
        <Paragraph size="lg">
          We initially attempted an app-by-app approach to adoption, which required extensive alignment between product, development, design, and leadership—areas where I did not have direct influence. When relationships were strong and priorities aligned, we saw significant progress. However, when those relationships weren't as solid or priorities diverged, it became far more challenging to achieve success and drive adoption effectively.
        </Paragraph>
        <Paragraph size="lg">
          In hindsight, a more strategic component-by-component approach might have yielded better results. Since most applications had been developed before the design system existed, comprehensive rebuilds were rarely prioritized. Focusing on incrementally replacing key components, such as buttons, across the software would have been a simpler and more efficient way to introduce Transform, ultimately positioning it to drive greater consistency across the enterprise.
        </Paragraph>
        <Figure
        size="md"
        align="center"
          src="img/transform/cards_doc.png"
          alt="Card Documentation Example"
          caption="The card component documentation is an example of how we documented the components in a way that was easy to understand and implement. This was a key part of our strategy to drive adoption and ensure consistency across the product."
          marginTop="lg"
          marginBottom="lg"
        />

        <Heading as="h2" size="xl" margin="md">Conclusion</Heading>
        <Paragraph size="lg">
          Looking back, I am proud of the system that we built. Transform is comprehensive and robust, easy to use and implement. Though I've since moved on, Transform continues to be used across the application—despite currently running without dedicated design support. I've used the processes, testing, components and feature set of Transform to help improve the enterprise-wide design system, Fondue.
        </Paragraph>
        <Paragraph size="lg">
          Transform's success was built on a foundation of scalable processes, accessibility, and strong cross-functional relationships. From a single-contributor project to an enterprise-wide solution, it has become a vital tool that enhances productivity, improves user experience, and ensures design consistency across the organization. The lessons learned from this journey continue to inform how we approach design systems and collaboration at scale.
        </Paragraph>
        <Figure
        size="md"
        align="center"
          src="img/transform-expansion-testframe.png"
          alt="Image of the Transform Design System expansion test frame"
          caption="Test frames ensured we didn't push out components that were not fully tested. This was a key part of our strategy to ensure quality and consistency across the product."
          marginTop="lg"
          marginBottom="lg"
        />

      </Section>
    </CaseStudyLayout>
  );
}
