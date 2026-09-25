import {
  Card, Cluster, Figure, Grid, GridItem, Heading, HeadingMark,
  Link, List, ListItem, Paragraph, Section, Stack,
} from "../../../packages/react/src/index.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function MemberMenuStudy() {
  return (
    <article>
      <Section padding="md" surface="raised" contentWidth="xl" gap="sm">
        <Cluster gap="lg"><Link href={getRoutePath("home")}>← Home</Link></Cluster>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo" }}>
          I designed Member Menu to keep people <HeadingMark>in context</HeadingMark>.
        </Heading>
        <Paragraph size="lg">A navigation brief became a shared model for moving between member information and unfinished work across TruCare Cloud. I led the final solution, visual design and prototyping, bringing application teams together around the member journey.</Paragraph>
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Card icon="work"><Stack gap="xs"><Paragraph size="md" color="muted">Role</Paragraph><Paragraph size="lg">Design system consultant → solution lead</Paragraph></Stack></Card>
          <Card icon="business"><Stack gap="xs"><Paragraph size="md" color="muted">Company and product</Paragraph><Paragraph size="lg">Centene · TruCare Cloud</Paragraph></Stack></Card>
          <Card icon="center_focus_strong"><Stack gap="xs"><Paragraph size="md" color="muted">Focus</Paragraph><Paragraph size="lg">Research, alignment and workshopping</Paragraph></Stack></Card>
        </Grid>
      </Section>

      <Section id="context" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">01 / The context</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>I found the problem by using the system I was responsible for designing.</Heading>
              <Paragraph size="lg">I started Transform as its only designer and grew it into a team of eleven across design, development and product. As UX Architect and Design Systems Lead, I led its evolution from a component library into the shared foundation for care management, utilization, the member dashboard and outreach.</Paragraph>
              <Paragraph size="lg">TruCare Cloud brought those applications together for about <strong>20,000 employees</strong> working in a platform that supported care decisions for <strong>20 million Americans</strong>. At that scale, an inconsistent dropdown could become a hesitation in the middle of an authorization. Using Transform every day helped me see a problem the library alone could not reveal: users were losing their place as they moved between member-related tasks.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/member-menu/transform-platform-context.png`}
          alt="Transform grew from its 2020 beginnings through development, expansion and adoption in 2023, supporting care management, utilization, the member dashboard and outreach."
          caption="Transform’s evolution and the shared foundation beneath the applications Member Menu needed to connect."
          radius="md"
        />
      </Section>

      <Section id="brief" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">02 / The brief</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>A request for a menu became a question about the whole member journey.</Heading>
              <Paragraph size="lg">The brief was straightforward: <strong>add a menu that lets users navigate without going back to the member dashboard.</strong> I was brought in as a design system consultant and quickly became the lead on the final solution, visual design and prototyping. Repeated questions about where people entered, what they needed and how they returned to their work expanded our understanding of the problem.</Paragraph>
              <Paragraph size="lg">Four designers represented the applications the menu needed to serve. Senior product leadership joined because the work crossed application boundaries, and technical leadership brought architecture and implementation constraints into the conversation from the start. We gathered input and buy-in from the individual application teams, team by team.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="user-needs" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">03 / The people</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Different roles needed different paths through the same member context.</Heading>
              <Paragraph size="lg">The presentation frames the work through three personas. Each needed to move across the platform, but the information and return paths they depended on were different.</Paragraph>
              <Stack gap="lg">
              <Stack gap="sm"><Heading as="h4" size="md">Dana, care manager</Heading><Paragraph size="lg">Dana worked across assessments, outreach and care plans for sixty members. She needed to finish one member’s work without losing the thread of the last one: the active member, unsaved work and the last ten members she had touched.</Paragraph></Stack>
              <Stack gap="sm"><Heading as="h4" size="md">Marcus, utilization reviewer</Heading><Paragraph size="lg">Marcus arrived with an authorization case, often from another application. He needed the right entry point for that authorization so he could make a decision without rebuilding the member’s context.</Paragraph></Stack>
              <Stack gap="sm"><Heading as="h4" size="md">Priya, supervisor</Heading><Paragraph size="lg">Priya sampled work across people and cases rather than completing a single workflow. She needed to see the current state quickly, hand the work back and find her way to where she started.</Paragraph></Stack>
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="original-journey" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">04 / Where context breaks</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>The original journey made the user remember where they had been.</Heading>
              <Paragraph size="lg">In the illustrated authorization journey, a missing piece of allergy information interrupted the task. Finding it meant leaving the authorization, finding the same member again and reconstructing the path back. The user carried the context through every transition.</Paragraph>
              <List as="ol" size="lg">
              <ListItem><strong>Start the authorization.</strong> Begin entering the information needed to authorize John Smith’s care.</ListItem>
              <ListItem><strong>Stop for missing information.</strong> Manually save the authorization and remember where work paused.</ListItem>
              <ListItem><strong>Search for the member again.</strong> Confirm that the search result is the same person.</ListItem>
              <ListItem><strong>Open the member dashboard.</strong> Rebuild context and look for the information.</ListItem>
              <ListItem><strong>Find the allergy details.</strong> Locate and expand the allergy card, then open the details page.</ListItem>
              <ListItem><strong>Return to the work page.</strong> Leave the member record without returning directly to the authorization.</ListItem>
              <ListItem><strong>Find the paused work.</strong> Locate John again, open authorizations and identify the right one.</ListItem>
              <ListItem><strong>Resume the authorization.</strong> Reorient and enter the allergy information.</ListItem>
              </List>
              <Paragraph size="lg">The journey moved from confidence to interruption, uncertainty and frustration. Even the return required caution: users had to recover their place before they could continue.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/member-menu/original-journey-interruption.png`}
          alt="Original journey, step two of eight: the user manually saves an authorization and leaves to find missing allergy information, remembering where work stopped."
          caption="Before: finding missing information interrupts the authorization and leaves the user responsible for remembering their place."
          radius="md"
        />
      </Section>

      <Section id="alignment" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">05 / Building alignment</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>We needed a shared definition of the problem before a shared solution.</Heading>
              <Paragraph size="lg">The work depended on relationships within the design team and with leadership, development and subject matter experts. <strong>Nine parties had to hold one problem definition</strong> before the design could move forward. Listening and asking questions repeatedly helped us build that alignment and earn trust across the application boundaries.</Paragraph>
              <Paragraph size="lg">The initial solution also exposed an important constraint: each application had its own codebase, and none could be overhauled within the timeline. The menu needed to work across those applications without rewriting the systems underneath it. That constraint shaped the final approach.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="final-solution" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">06 / The final solution</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Keep the member fixed and hold the work while people move.</Heading>
              <Paragraph size="lg">Member Menu brought the active member, recent members, paused work and member-related destinations into one persistent navigation model. People could move to the information they needed while keeping a clear route back to their unfinished task.</Paragraph>
              <List size="lg">
              <ListItem><strong>Keep the active member visible.</strong> Make it clear whose information the user is working with.</ListItem>
              <ListItem><strong>Make recent members accessible.</strong> Support people who move between multiple members throughout the day.</ListItem>
              <ListItem><strong>Surface paused work.</strong> Give unfinished tasks a visible place to return to.</ListItem>
              <ListItem><strong>Group member destinations.</strong> Bring authorizations, member details and medical information together.</ListItem>
              </List>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/member-menu/member-menu-final.png`}
          alt="TruCare Cloud Member Menu showing the active and recent members, paused work, and grouped links to authorizations, member details and medical information."
          caption="The final Member Menu design. Member context stays visible beside paused work and destinations across the application. The pictured design also reminds users to save before logout or timeout."
          radius="md"
        />
      </Section>

      <Section id="revised-journey" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">07 / The revised journey</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>The system remembers the context.</Heading>
              <Paragraph size="lg">The revised example keeps the authorization and member connected while the user checks the missing information. The same illustrated task moves from <strong>eight steps to four</strong>.</Paragraph>
              <List as="ol" size="lg">
              <ListItem><strong>Start the authorization.</strong> Begin John Smith’s authorization as before.</ListItem>
              <ListItem><strong>Open Member Menu and select allergies.</strong> The authorization is automatically saved and added to paused work in the revised flow.</ListItem>
              <ListItem><strong>Review the allergy information.</strong> The system preserves the member and authorization context.</ListItem>
              <ListItem><strong>Resume from the menu.</strong> Select the paused authorization and enter the information where work left off.</ListItem>
              </List>
              <Paragraph size="lg">This comparison describes the journey illustrated in the presentation. The design shifts the responsibility for remembering context from the user to the system, so returning to work becomes an explicit action.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/member-menu/revised-journey-context.png`}
          alt="Revised journey, step two of four: the user opens allergies from Member Menu while the authorization is saved and added to paused work."
          caption="After: Member Menu provides a path to related information while preserving the member and paused authorization."
          radius="md"
        />
      </Section>

      <Section id="configuration" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">08 / Making it configurable</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>One model could adapt to the next application.</Heading>
              <Paragraph size="lg">The menu needed to serve different roles and applications without becoming a separate design problem each time. The model resolved by <strong>role, permission and application</strong>, giving teams a common structure that could adapt to their context.</Paragraph>
              <Paragraph size="lg">Configuration was part of the solution from the beginning. It made room for different entry points and destinations while preserving a shared way to move between member information and paused work. The next product could become a setting instead of another project.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="reflection" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">09 / What I took forward</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Using the system, asking questions and building trust shaped the result.</Heading>
              <Paragraph size="lg">Member Menu brought together four habits that guide my work: <strong>use what I design, ask the challenging questions, build relationships and make it configurable.</strong> Using Transform surfaced the problem. Questions uncovered the member journey behind the navigation brief. Relationships created a shared direction across teams, and configuration gave the solution a way to scale.</Paragraph>
              <Paragraph size="lg">The result was a navigation model grounded in the way people worked and the architecture the teams could support: a stable member context, visible paused work and a direct path back to the task.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>
    </article>
  );
}
