import {
  Divider,
  Figure,
  Heading,
  Paragraph,
  Section,
} from "../../../packages/react/src/index.js";
import { CaseStudyLayout } from "../pages/CaseStudyLayout.jsx";

export function CarShopperStudy() {
  return (
    <CaseStudyLayout
      title="Car Shopper UX"
      tags={["UX Design", "Consumer-facing"]}
      meta={[
        { label: "Years", value: "2019–2020" },
        { label: "Company", value: "Dealer.com / Cox Automotive" },
        { label: "Role", value: "Senior UX Designer" },
      ]}
    >
      <Section as="div" padding="lg" contentWidth="md" gap="md">

        <Figure src="/img/desktop-vdp.png" alt="Car Shopper UX" marginBottom="lg" />

        <Paragraph size="lg">
          During my tenure at Dealer.com, nothing has been more important than the user experience design of the car shopper. At the core of the company, this is what we do—make it easy for consumers to find a vehicle of interest and communicate that to the dealership.
        </Paragraph>

        <Divider size="md" />

        <Heading as="h2" size="xl" margin="md">The Vehicle Details Page</Heading>
        <Paragraph size="lg">
          The Vehicle Details Page is the cornerstone of a car dealer's web site. We spent a little over a year designing and developing a new details page. That might seem excessive until you realize that it had to accommodate upwards of 15,000 different dealerships, be customizable to their needs and desires, support an entirely new development philosophy and a new design system.
        </Paragraph>

        <Heading as="h3" size="lg" margin="md">Involvement</Heading>
        <Paragraph size="lg">
          My role in the project was extensive, from initial design workshops, wireframes and detailed rounds of mockups to prototyping, extensive user testing, refinement, and development support.
        </Paragraph>

        <Heading as="h3" size="lg" margin="md">The Results</Heading>
        <Paragraph size="lg">
          The end page was in large part a matter of creating clear hierarchy for users. The photos are both horizontally and vertically responsive, ensuring users can see the image at high resolution, while still keeping the high-level information about the car above the fold. Below the image, we placed information and specifications on the left, with pricing and actions in the right column.
        </Paragraph>
        <Figure
        size="sm"
          src="/img/vdp.png"
          alt="Vehicle Details Page"
          imgStyle={{ border: "1px solid #ccc", borderRadius: "4px" }}
          marginTop="lg"
          marginBottom="lg"
        />

        <Heading as="h3" size="lg" margin="md">All Good?</Heading>
        <Paragraph size="lg">
          As with most projects, there are always compromises involved. The default visual design of the page makes it feel more like a wireframe than a complete solution. I would lift the visuals with a bit more use of color, iconography and emphasis on critical information. Ultimately the baseline design had to work for everyone and usually that means it has to meet at a low denominator.
        </Paragraph>
        <Figure
        size="md"
          src="/img/vdp-mobile.png"
          alt="Mobile Vehicle Details Page"
          marginTop="lg"
          marginBottom="lg"
        />

        <Heading as="h2" size="xl" margin="md">The Search Results Page</Heading>
        <Paragraph size="lg">
          The second part of the overhaul of our system has been the Search Results Page (SRP). Like the details page, it has to be backward compatible with years of dealer preferences, forward-facing to be fully responsive and fully customizable both in function and in look. I've been responsible for overall page layout, overhauling the page heading and functionality and faceting design.
        </Paragraph>
        <Figure
        size="md"
        align="center"
          src="/img/srp.png"
          alt="Search Results Page"
          marginTop="lg"
          marginBottom="lg"
        />

        <Heading as="h3" size="lg" margin="md">Research Process</Heading>
        <Paragraph size="lg">
          We don't have extensive resources such as dedicated UX Research, so we have to make do as a team. One of the primary tools we use is a service from usertesting.com. It allows us to write a simple interview script and get mockups, prototypes or final working content in front of users quickly. My favorite part of that process is how quickly I can put something out, get feedback and iterate.
        </Paragraph>
        <Paragraph size="lg">
          Often it can be a matter of a couple of hours for a quick hypothesis to learn if something is spot on or needs some small tweaks. A good example is packages and options on vehicles. This can be a confusing term that we were able to make a little less confusing by adding one word to the heading, "Included"—something I was able to verify added a lot of clarity.
        </Paragraph>
        <Figure
        size="md"
        align="center"
          src="/img/srp-card-package.gif"
          alt="Animation showing two instances for user testing of the results page"
          marginTop="lg"
          marginBottom="lg"
        />
        <Figure
        size="md"
        align="center"
          src="/img/srp-mobile-filter.png"
          alt="Mobile filtering"
          marginBottom="lg"
        />

        <Heading as="h2" size="xl" margin="md">Early Concepting</Heading>
        <Paragraph size="lg">
          Of course, not everything I do makes it to production. Sometimes it is too complex to develop, sometimes it is too complex to support as an organization, or sometimes it just does not work. But those early ideas are usually highly informative to the final deliverable.
        </Paragraph>

        <Heading as="h3" size="lg" margin="md">Let it Flow</Heading>
        <Paragraph size="lg">
          This advanced concept clearly shows users what is happening as they go through the flow of information from searching, comparing and viewing vehicle details. Animations make it clear when a vehicle is added or removed from the listings. A comparison mode makes it easy to add or remove vehicles of interest. And when a user is ready to delve deep into the details, they can quickly switch between similar listings, while progressively getting the information they want, without being overwhelmed.
        </Paragraph>

        <Heading as="h3" size="lg" margin="md">Panels</Heading>
        <Paragraph size="lg">
          Sometimes the best ideas are the ones you repurpose. The above concept spun off of a site I was browsing that utilized a panel-based approach, as opposed to pages. I quickly saw the potential for a more linear flow of information from left to right. This would allow users to move from listings to details and back without having to load singular pages.
        </Paragraph>
        <Figure
          src="/img/VLP-Panel.gif"
          alt="Experimental Vehicle Listing Page with panel-based approach"
          imgStyle={{ width: "320px" }}
          marginTop="lg"
          marginBottom="lg"
        />

        <Heading as="h3" size="lg" margin="md">Lessons Learned</Heading>
        <Paragraph size="lg">
          Advanced concepts can be both extremely rewarding and quite frustrating at the same time. I love getting deep into a concept and figuring out how to make the complex concept user-friendly. However, that often means being more than a few steps ahead of an organization. When I first started, I figured (incorrectly) that concepts could see the light of day in the course of a month or two. The longer I have been working in the field, the longer that timeframe has become, and I have learned to appreciate the wins that do make it to a site, while not losing my drive to be ahead, sometimes by years.
        </Paragraph>

      </Section>
    </CaseStudyLayout>
  );
}
