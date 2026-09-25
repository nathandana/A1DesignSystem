import {
  Card, Cluster, Figure, Grid, GridItem, Heading, HeadingMark,
  Link, Paragraph, Section, Stack,
} from "../../../packages/react/src/index.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function CarShopperStudy() {
  return (
    <article>
      <Section padding="md" surface="raised" contentWidth="xl" gap="sm">
        <Cluster gap="lg"><Link href={getRoutePath("home")}>← Home</Link></Cluster>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo" }}>
          I helped car shoppers move from <HeadingMark>search to decision</HeadingMark>.
        </Heading>
        <Paragraph size="lg">At Dealer.com, I worked across vehicle search and details, using design workshops, prototypes and user testing to help shoppers find a vehicle and connect with a dealership.</Paragraph>
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Card icon="work"><Stack gap="xs"><Paragraph size="md" color="muted">Role</Paragraph><Paragraph size="lg">Senior UX Designer</Paragraph></Stack></Card>
          <Card icon="business"><Stack gap="xs"><Paragraph size="md" color="muted">Company and timeline</Paragraph><Paragraph size="lg">Dealer.com / Cox Automotive</Paragraph><Paragraph color="muted">2019–2020</Paragraph></Stack></Card>
          <Card icon="center_focus_strong"><Stack gap="xs"><Paragraph size="md" color="muted">Focus</Paragraph><Paragraph size="lg">Workshops, user testing and responsive UX</Paragraph></Stack></Card>
        </Grid>
      </Section>

      <Section id="context" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">01 / The context</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Help shoppers find a vehicle and connect with a dealership.</Heading>
              <Paragraph size="lg">During my tenure at Dealer.com, nothing has been more important than the user experience design of the car shopper. At the core of the company, this is what we do—make it easy for consumers to find a vehicle of interest and communicate that to the dealership.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="vehicle-details" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">02 / Vehicle details</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>A shared details page had to work for more than 15,000 dealerships.</Heading>
              <Paragraph size="lg">The Vehicle Details Page is the cornerstone of a car dealer's web site. We spent a little over a year designing and developing a new details page. That might seem excessive until you realize that it had to accommodate upwards of 15,000 different dealerships, be customizable to their needs and desires, support an entirely new development philosophy and a new design system.</Paragraph>
              <Paragraph size="lg">My role in the project was extensive, from initial design workshops, wireframes and detailed rounds of mockups to prototyping, extensive user testing, refinement, and development support.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure src={`${getRouteBase()}/img/desktop-vdp.png`} alt="Desktop vehicle details page for car shoppers." radius="md" size="lg" align="center" />
      </Section>

      <Section id="hierarchy" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">03 / Information hierarchy</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Make the vehicle visible while keeping key information close.</Heading>
              <Paragraph size="lg">The end page was in large part a matter of creating clear hierarchy for users. The photos are both horizontally and vertically responsive, ensuring users can see the image at high resolution, while still keeping the high-level information about the car above the fold. Below the image, we placed information and specifications on the left, with pricing and actions in the right column.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/vdp.png`}
          alt="Vehicle details page with photography, vehicle information, pricing and shopper actions."
          caption="The details page balances responsive photography with vehicle specifications, pricing and actions."
          radius="md"
        size="lg" align="center" />
      </Section>

      <Section id="tradeoffs" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">04 / The tradeoffs</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>A customizable baseline meant compromises in visual expression.</Heading>
              <Paragraph size="lg">As with most projects, there are always compromises involved. The default visual design of the page makes it feel more like a wireframe than a complete solution. I would lift the visuals with a bit more use of color, iconography and emphasis on critical information. Ultimately the baseline design had to work for everyone and usually that means it has to meet at a low denominator.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/vdp-mobile.png`}
          alt="Mobile version of the vehicle details page."
          caption="The vehicle details experience adapted for a smaller screen."
          radius="md"
        size="lg" align="center" />
      </Section>

      <Section id="search-results" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">05 / Search results</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Bring responsive search to years of dealer preferences.</Heading>
              <Paragraph size="lg">The second part of the overhaul of our system has been the Search Results Page (SRP). Like the details page, it has to be backward compatible with years of dealer preferences, forward-facing to be fully responsive and fully customizable both in function and in look. I've been responsible for overall page layout, overhauling the page heading and functionality and faceting design.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/srp.png`}
          alt="Vehicle search results page showing the listing layout and search controls."
          caption="The search redesign covered overall layout, the page heading, functionality and faceting."
          radius="md"
        size="lg" align="center" />
      </Section>

      <Section id="research" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">06 / Research and iteration</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Small rounds of testing helped us clarify the experience.</Heading>
              <Paragraph size="lg">We don't have extensive resources such as dedicated UX Research, so we have to make do as a team. One of the primary tools we use is a service from usertesting.com. It allows us to write a simple interview script and get mockups, prototypes or final working content in front of users quickly. My favorite part of that process is how quickly I can put something out, get feedback and iterate.</Paragraph>
              <Paragraph size="lg">Often it can be a matter of a couple of hours for a quick hypothesis to learn if something is spot on or needs some small tweaks. A good example is packages and options on vehicles. This can be a confusing term that we were able to make a little less confusing by adding one word to the heading, "Included"—something I was able to verify added a lot of clarity.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/srp-card-package.gif`}
          alt="Two vehicle result card variations used to test how packages and options were described."
          caption="Testing the wording of packages and options helped establish the clearer heading “Included.”"
          radius="md"
        size="lg" align="center" />
        <Figure
          src={`${getRouteBase()}/img/srp-mobile-filter.png`}
          alt="Vehicle search filtering interface on mobile."
          caption="Mobile filters support narrowing the vehicle results on smaller screens."
          radius="md"
        size="lg" align="center" />
      </Section>

      <Section id="concepts" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">07 / Early concepts</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Explore a continuous flow from listings to comparison and details.</Heading>
              <Paragraph size="lg">Of course, not everything I do makes it to production. Sometimes it is too complex to develop, sometimes it is too complex to support as an organization, or sometimes it just does not work. But those early ideas are usually highly informative to the final deliverable.</Paragraph>
              <Paragraph size="lg">This advanced concept clearly shows users what is happening as they go through the flow of information from searching, comparing and viewing vehicle details. Animations make it clear when a vehicle is added or removed from the listings. A comparison mode makes it easy to add or remove vehicles of interest. And when a user is ready to delve deep into the details, they can quickly switch between similar listings, while progressively getting the information they want, without being overwhelmed.</Paragraph>
              <Heading as="h4" size="md">A panel-based approach</Heading>
              <Paragraph size="lg">Sometimes the best ideas are the ones you repurpose. The above concept spun off of a site I was browsing that utilized a panel-based approach, as opposed to pages. I quickly saw the potential for a more linear flow of information from left to right. This would allow users to move from listings to details and back without having to load singular pages.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/VLP-Panel.gif`}
          alt="Animated vehicle listing concept using panels to move between listings and details."
          caption="An exploratory panel-based concept for moving through vehicle information without loading separate pages."
          radius="md"
        size="lg" align="center" />
      </Section>

      <Section id="lessons" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">08 / What I learned</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Explore ahead while appreciating what reaches production.</Heading>
              <Paragraph size="lg">Advanced concepts can be both extremely rewarding and quite frustrating at the same time. I love getting deep into a concept and figuring out how to make the complex concept user-friendly. However, that often means being more than a few steps ahead of an organization. When I first started, I figured (incorrectly) that concepts could see the light of day in the course of a month or two. The longer I have been working in the field, the longer that timeframe has become, and I have learned to appreciate the wins that do make it to a site, while not losing my drive to be ahead, sometimes by years.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>
    </article>
  );
}
