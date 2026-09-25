import {
  Blockquote,
  Cluster,
  Code,
  Figure,
  Grid,
  GridItem,
  Heading,
  Link,
  List,
  ListItem,
  Paragraph,
  Section,
  Stack,
} from "../../../packages/react/src/index.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function A1Study() {
  return (
    <article>
      <Section padding="md" surface="raised" contentWidth="xl" gap="sm">
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>← Home</Link>
        </Cluster>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo" }}>
          Training the system
        </Heading>
        <Paragraph size="lg">
          <em>A1 started as a way to understand what AI actually needs from a design system. It grew into a working system for testing components, rules, Figma workflows, accessibility, localization and agent behavior.</em>
        </Paragraph>
      </Section>

      <Section id="i-started-a1-by-trying-to-build-one-component" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            01 / The starting point
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                I started A1 by trying to build one component.
              </Heading>
              <Paragraph size="lg">
                I have always worked in the space between design and engineering. That is a big part of why I was drawn to design systems in the first place. I have contributed to codebases for years, usually as a designer with enough coding knowledge to make things work. Before Figma could handle more complex prototypes, I was building them in HTML and CSS and cobbling together JavaScript when I needed interaction that Sketch, Photoshop or early prototyping tools could not provide.
              </Paragraph>
              <Paragraph size="lg">
                As AI got better, I started leaning on it more heavily. At first, the goal was simple: see how far I could push a prototype. When I had the chance to really dig into AI and design systems, I started even smaller. I wanted to see what it would take to build one component well. Where would the agent create slop? What would it get wrong? What would I need to repeat? What could I document once and stop explaining?
              </Paragraph>
              <Paragraph size="lg">
                One component became three, then twenty. Token work expanded. Documentation became more formal. I started adding tools I had wanted to build for years. <strong>Every prompt became a test.</strong>
              </Paragraph>
              <Blockquote variant="feature">
                <strong>“The more structure I gave the agent, the less I had to correct it.”</strong>
              </Blockquote>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/a1-button.png`}
          alt="A1 Button configuration page showing the Save changes preview, React code and controls for label, variant, size, icon and state."
          caption="The Button configuration page connects a live preview and React code with the component’s supported properties."
          size="lg"
          align="center"
          radius="md"
        />
      </Section>

      <Section id="repeated-mistakes-usually-meant-the-system-was-missing-something" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            02 / Learning from mistakes
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Repeated mistakes usually meant the system was missing something.
              </Heading>
              <Paragraph size="lg">
                Some of the early problems were visual. A spacing decision would drift, or a color would be used inconsistently, and I would fix it at the token level.
              </Paragraph>
              <Paragraph size="lg">
                More often, the issue was in the code. Property names would change between components. Similar patterns would be handled differently. The agent would solve something I had already solved because it did not know there was an existing answer.
              </Paragraph>
              <Paragraph size="lg">
                At first, I corrected those issues directly. That got old quickly. So I started taking side trips. If property names were inconsistent, I created a naming contract. If an implementation pattern kept drifting, I documented it. If accessibility behavior was unclear, I tested it and added the result back into the guidance.
              </Paragraph>
              <Paragraph size="lg">
                A few iterations later, new components started coming out much closer to what I expected on the first pass. That became one of the basic working patterns in A1: <strong>if I keep correcting the same thing, it probably belongs in the system.</strong>
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="i-started-treating-the-agents-like-a-team" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            03 / Working with agents
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                I started treating the agents like a team.
              </Heading>
              <Paragraph size="lg">
                That changed the way I worked. I separated responsibilities and started building skillsets around them. For a front-end engineer, one of the rules is basically: <em>take the laziest reasonable approach.</em> If <Code variant="inline">{'<input type="date">'}</Code> solves the problem, use it. Do not build a giant custom date picker because it feels more impressive.
              </Paragraph>
              <Paragraph size="lg">
                At the same time, I found myself working more like a lead. While an agent was working on one prompt, I was reviewing another piece, writing down what needed to change, deciding what component was next and grouping future work.
              </Paragraph>
              <Paragraph size="lg">
                Eventually I had enough work in flight that I needed a backlog. So I built one. A1 now has a lightweight Jira-style backlog with epics, features, cards that move through swimlanes and Supabase behind it. It started as a tool to help me manage A1, but it also forced me to use my own design system to build something real.
              </Paragraph>
              <Paragraph size="lg">
                That was useful immediately. Components that looked complete in isolation suddenly needed another property. Layout assumptions broke. Gaps became obvious.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/a1-backlog.png`}
          alt="A1 backlog filtered for custom work, with ticket cards grouped into New, Triaged, Accepted, In progress and Released columns."
          caption="Building A1’s backlog put its own components to work, exposing gaps in properties and layout through everyday use."
          size="lg"
          align="center"
          radius="md"
        />
      </Section>

      <Section id="building-real-things-exposed-gaps-faster-than-reviewing-components-ever-did" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            04 / Testing through use
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Building real things exposed gaps faster than reviewing components ever did.
              </Heading>
              <Paragraph size="lg">
                Design-system work makes it easy to be optimistic. You look at a component and think you covered the edge cases. Then you use it in a real workflow and find out you missed three of them.
              </Paragraph>
              <Paragraph size="lg">
                I started using agents to build small applications and prototypes specifically to exercise A1. The pattern became cyclical: <strong>Build something. Find the gap. Expand the system. Repeat.</strong> That was much more useful than trying to predict every possible need from the component library alone.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="machine-readability-was-part-of-a1-from-the-first-component" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            05 / Machine readability
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Machine readability was part of A1 from the first component.
              </Heading>
              <Paragraph size="lg">
                Each component was always meant to <strong>behave like a contract</strong>. The component has known properties. The agent should know what those properties are. The editor should know what they are. Figma should use the same language wherever possible.
              </Paragraph>
              <Paragraph size="lg">
                That idea eventually turned into the A1 project editor. I wanted to drag a real Button onto a canvas and change the properties the system actually supports. I did not want the editor to behave like an open drawing tool where anything could be detached and customized.
              </Paragraph>
              <Paragraph size="lg">
                The model came partly from work I had seen years earlier at Dealer.com. The CMS could describe a page with fairly simple JSON. Big changes to a page could come from small changes to that data. A1 works the same way. The page is stored as structured JSON. Adding a component, changing a variant, replacing an icon, editing a label or removing something all become changes to that file.
              </Paragraph>
              <Paragraph size="lg">
                That gives me history. It gives me something I can lint. It gives the renderer and the component library a shared contract. It also gives AI a much simpler job.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/a1-json-editor.png`}
          alt="A1 page editor showing a landing page with the Get started free Button selected and its properties in the side panel."
          caption="The page editor renders the structured page definition with A1 components. Selecting a Button exposes its label, variant, size, icon, destination and breakpoint visibility."
          size="lg"
          align="center"
          radius="md"
        />
      </Section>

      <Section id="the-agent-works-better-when-it-can-modify-known-properties-instead-of-inventing-ui" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            06 / Known components
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                The agent works better when it can modify known properties instead of inventing UI.
              </Heading>
              <Paragraph size="lg">
                If the agent does not know A1 has a Button, it will make one. Maybe it looks right. Maybe it does not. Either way, it is creating something the system already has. If it knows there is a Button and understands its properties, it can change the variant, size, icon, label or state without touching the underlying design.
              </Paragraph>
              <Paragraph size="lg">
                That changes the focus of the work. The agent is deciding what the Button says and what it should do. It is not deciding what a Button should look like every time.
              </Paragraph>
              <Paragraph size="lg">
                The same model can expand upward. A page can be an assembly of known components. A common business flow can eventually become a known pattern too. The more of that structure exists, the less the agent needs to create.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="rules-became-another-shared-part-of-the-system" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            07 / Shared rules
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Rules became another shared part of the system.
              </Heading>
              <Paragraph size="lg">
                This came directly from my experience at Centene. Rules for the design system came from everywhere: office hours, accessibility reviews, leadership requests, audits, support conversations. Capturing them was hard enough. Getting them in front of the right people was harder. At one point, rules could end up in Airtable and then still need to be manually added to Figma. That meant a branch, a review, publishing and then hoping someone actually read it.
              </Paragraph>
              <Paragraph size="lg">
                In A1, rules are stored in JSON. They are easy to add and change. They can also vary by project, which matters when different applications have different requirements. If the rule is “use sentence case for headings,” the designer and the agent should be reading the same rule.
              </Paragraph>
              <Paragraph size="lg">
                I still want a second layer of validation. The ideal is that the agent follows the rule because it already has the context. I am also planning an audit tool that can check the result afterward.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="figma-needs-more-explicit-training-than-code" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            08 / Figma construction
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Figma needs more explicit training than code.
              </Heading>
              <Paragraph size="lg">
                This has been one of the clearer differences between agent types. Claude Code follows A1 guidance pretty consistently at this point. Design-oriented agents still wander more. Figma also has more implementation details that need to be spelled out. A usable component is not just a set of pixels that looks right. I ended up documenting things like:
              </Paragraph>
              <List variant="unordered" size="lg">
                <ListItem>Keep public components at the root level</ListItem>
                <ListItem>Use flat component names</ListItem>
                <ListItem>Use stable published keys for resolution</ListItem>
                <ListItem>Keep presentation frames separate from the actual asset</ListItem>
                <ListItem>Use attached icons from the library</ListItem>
                <ListItem>Expose instance swaps intentionally</ListItem>
                <ListItem>Match Figma properties to the developed API</ListItem>
                <ListItem>Bind variables correctly</ListItem>
                <ListItem>Use Auto Layout deliberately</ListItem>
                <ListItem>Validate the finished component against the runtime version</ListItem>
              </List>
              <Paragraph size="lg">
                Most of that is normal design-system governance. AI just made the gaps harder to ignore.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/a1-figma-anatomy.png`}
          alt="Figma Button component set with 150 variants and properties for variant, size, icon position, state, label, icon visibility and focus ring."
          caption="The Figma Button component set exposes a controlled API aligned with React, including variants, states, labels and icon properties."
          size="lg"
          align="center"
          radius="md"
        />
      </Section>

      <Section id="the-figma-work-also-exposed-where-agents-are-still-unreliable" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            09 / Agent review
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                The Figma work also exposed where agents are still unreliable.
              </Heading>
              <Paragraph size="lg">
                One small example keeps coming back. A1 has a rule to use sentence case for headings. Claude Design still occasionally adds the familiar all-caps eyebrow above a major headline. It knows the rule. It has the rule in context. It still sometimes falls back to a design trope it has seen a million times elsewhere.
              </Paragraph>
              <Paragraph size="lg">
                That is a useful reminder for me. More guidance helps, but I still need review. Different agents also need different levels of supervision.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="the-token-model-stayed-simple" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            10 / Token approach
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                The token model stayed simple.
              </Heading>
              <Paragraph size="lg">
                AI did not make me invent a new token architecture. Because A1 was greenfield, I was able to start clean with a simple structure:
              </Paragraph>
              <Paragraph size="lg">
                <strong>Primitive → semantic → component</strong>
              </Paragraph>
              <Paragraph size="lg">
                That was enough. The benefit for AI came from <strong>consistency and clear naming</strong>, not from creating a special AI token model.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="accessibility-is-built-into-the-guidance-and-the-release-process" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            11 / Accessibility
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Accessibility is built into the guidance and the release process.
              </Heading>
              <Paragraph size="lg">
                A lot of this came from the accessibility remediation work I did on Fondue. The agent guidance covers semantic HTML, accessible names, heading order, keyboard behavior, focus, contrast, status communication and ARIA relationships. The JSON renderer can map supported accessibility properties directly into DOM attributes.
              </Paragraph>
              <Paragraph size="lg">
                There are also executable checks. Design-rule linting catches things like raw colors, uppercase text and nested interactive content. A1-Web runs axe checks against WCAG A/AA rules. Serious and critical violations fail the release check. Interaction tests cover things like dialog focus containment, keyboard navigation, accordions and menus.
              </Paragraph>
              <Paragraph size="lg">
                It is not complete. Some accessibility commands are still nonblocking. Storybook reporting is not a hard gate yet. Automated coverage is narrower than the written guidance. <strong>Manual testing still matters.</strong> That is fine. I would rather know exactly where the gaps are than claim the system has solved accessibility.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="localization-was-a-chance-to-test-another-problem-teams-often-skip" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            12 / Localization
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Localization was a chance to test another problem teams often skip.
              </Heading>
              <Paragraph size="lg">
                I was exposed to internationalization at Dealer.com. Centene had plans for it, but it never really became part of the regular design workflow. One thing I saw was how easy it was for teams to ignore translation because the effort to test it was so high. One person could end up carrying a huge amount of that responsibility from the content side.
              </Paragraph>
              <Paragraph size="lg">
                And translation is not just longer copy. Dates change. Calendar behavior changes. Labels change. Reading direction can change. In healthcare, those details matter.
              </Paragraph>
              <Paragraph size="lg">
                So I built a proof of concept into A1. The Calendar component can change labels and behavior based on language and location. The A1 web application can generate translations. The project editor can preview translated content so a designer can see what breaks before implementation.
              </Paragraph>
              <Paragraph size="lg">
                RTL support is still early. The useful part for me is that these cases are now cheap enough to exercise that they are harder to ignore.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="a1-has-become-more-expensive-to-build-as-it-gets-better" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            13 / The tradeoff
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                A1 has become more expensive to build as it gets better.
              </Heading>
              <Paragraph size="lg">
                There is an obvious tradeoff here. Every new test, contract and piece of guidance gives the agent more work to do. Building inside the system is slower than it was when there were fewer rules.
              </Paragraph>
              <Paragraph size="lg">
                But the output is much more consistent. The agent creates less from scratch. It uses A1 more. There is less cleanup after the fact.
              </Paragraph>
              <Paragraph size="lg">
                That is where I see the return. The design system itself takes more effort. <strong>Work built with it takes less repeated effort.</strong>
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="ai-changed-how-much-of-an-idea-i-can-prove-on-my-own" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            14 / Proving ideas
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                AI changed how much of an idea I can prove on my own.
              </Heading>
              <Paragraph size="lg">
                This may be the biggest personal shift for me. I have always had ideas that ended up on a backlog because they were not important enough to justify a team. That is normal in a large organization.
              </Paragraph>
              <Paragraph size="lg">
                Now I can build many of those ideas far enough to actually test them. The project editor, backlog, translation work, accessibility tooling, Figma integration and MCP experiments all came out of that.
              </Paragraph>
              <Paragraph size="lg">
                Obviously I can move faster by myself because I am not dealing with approval processes or alignment across multiple teams. The bigger change is that I can communicate an idea with much more fidelity. <em>I can show the thing working.</em> For a designer with a technical bent, AI feels a lot like having an entire team to lead.
              </Paragraph>
              <Blockquote variant="feature">
                <strong>“Train, train, train. Treat AI like a teammate, or even an entire team.”</strong>
              </Blockquote>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="i-would-start-enterprise-ai-work-by-looking-at-design-system-maturity" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            15 / Enterprise maturity
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                I would start enterprise AI work by looking at design-system maturity.
              </Heading>
              <Paragraph size="lg">
                I would care less about how many components exist and more about how much of the organization’s design knowledge is actually captured.
              </Paragraph>
              <Paragraph size="lg">
                What rules are documented? What is unique about the system? What decisions keep getting made over and over? Is there a business-critical flow that exists across five business units and gets solved differently every time? Those are the places I would look first.
              </Paragraph>
              <Paragraph size="lg">
                Design systems can extend well beyond atomic components. They can capture larger patterns, flows and rules that are specific to the business. The clearer those definitions are, the more useful AI becomes.
              </Paragraph>
              <Paragraph size="lg">
                MCP is one of the newer experiments in A1. I added it later as a proof of concept and I am still testing it. The goal is to give multiple agents access to the same design-system knowledge without rebuilding that context for each one. The protocol may change. The need probably will not.
              </Paragraph>
              <Paragraph size="lg">
                AI already knows a lot. The hard part is <strong>teaching it how your organization works.</strong>
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="what-a1-includes-today" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            16 / The system today
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                What A1 includes today.
              </Heading>
              <Paragraph size="lg">
                A1 has grown well beyond the first component:
              </Paragraph>
              <List variant="unordered" size="lg">
                <ListItem><strong>React component library</strong> with documented APIs, states, accessibility guidance and Storybook.</ListItem>
                <ListItem><strong>Primitive, semantic and component tokens</strong> managed through Style Dictionary.</ListItem>
                <ListItem><strong>A1 Projects</strong>, a browser-based editor that stores pages as structured JSON and renders them with real A1 components.</ListItem>
                <ListItem><strong>Project-level rules</strong> that can be read by people and agents.</ListItem>
                <ListItem><strong>Design-rule linting and accessibility tests</strong> across component, interaction and release workflows.</ListItem>
                <ListItem><strong>Figma components and construction guidance</strong> built around the same component contracts used in code.</ListItem>
                <ListItem><strong>Two-way A1/Figma workflows</strong> through a plugin that keeps shared properties aligned.</ListItem>
                <ListItem><strong>Localization support</strong> including locale-aware components, automated translation and previewing.</ListItem>
                <ListItem><strong>Early RTL work</strong> as part of the localization model.</ListItem>
                <ListItem><strong>MCP integration</strong> for testing shared agent access to A1 knowledge.</ListItem>
                <ListItem><strong>Internal tools</strong>, including the backlog, that continuously expose weaknesses in the system.</ListItem>
              </List>
              <Paragraph size="lg">
                A1 is still changing constantly. That is part of why I keep building it. Every new feature gives me another way to test the same question I started with: how much better does AI get when the system around it gets better?
              </Paragraph>
              <Paragraph size="lg">
                For me, the answer keeps coming back to training. Capture the rules. Document the decisions. Give the agent clear contracts. Review what it produces. Feed what you learn back into the system. Then do it again.
              </Paragraph>
              <Cluster gap="lg">
                <Link href={getRoutePath("home")}>Explore more work →</Link>
              </Cluster>
            </Stack>
          </GridItem>
        </Grid>
      </Section>
    </article>
  );
}
