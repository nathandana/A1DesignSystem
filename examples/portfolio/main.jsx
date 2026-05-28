import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bleed,
  Button,
  ButtonContainer,
  Card,
  Grid,
  Heading,
  Icon,
  IconButton,
  Inset,
  LabelsProvider,
  Link,
  MessageBadge,
  PageLayout,
  Paragraph,
  Section,
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "../../packages/react/src/index.js";
import actionLabels from "../../system/labels/action.json";
import "./styles.css";

// ── Data ────────────────────────────────────────────────────────────────────

const caseStudies = [
  {
    id: "transform",
    title: "Transform Design System",
    tags: ["Design Systems", "Enterprise UX"],
    meta: "2020–2023 · Centene Corporation · UX Architect",
    cardImage: "img/transform/Transform-Logo.png",
    cardImageStyle: { backgroundColor: "white" },
    description: "Transform grew from a small design library into a vital internal system used daily by 20,000+ employees at a Fortune 25 enterprise.",
    coverImage: "img/transform/transform_cover.png",
    intro: [
      "I led the creation and evolution of Transform, an internal design system that streamlined TruCare Cloud. TruCare Cloud is an enterprise application that facilitates the insurance authorization process, has extensive work management, creates long term service and support requests and more. Used daily by 20,000 employees at Centene, a Fortune 25 enterprise, it directly impacts the health and well-being of tens of millions of Americans.",
      "Initially developed as a small design library, Transform has grown into the interface backbone of this essential tool. The goal of Transform was to improve user experience, enhance consistency, and reduce development time by offering a centralized, reusable set of design components. Over time, Transform evolved into a full-fledged design system with scalable processes, robust governance, and strong cross-functional collaboration.",
    ],
    sections: [
      {
        heading: "Team Formation & Cross-functional Growth",
        paragraphs: [
          "Transform began as a one-person effort—me. As the sole UX designer, I initially focused on defining core components and patterns using Sketch. These early components established the foundation of the system, which was later migrated to Figma to improve collaboration and scalability. The design system was heavily influenced by Material Design, ensuring a familiar and intuitive user experience for developers and users alike.",
          "Recognizing the need for development support, we onboarded four contract developers who began building components in Angular using Angular Material. I contributed directly to the codebase, created their backlog, and provided direction to ensure alignment with design principles. Additionally, I played a hands-on role in the adoption process by guiding the first sub-application to implement Transform, troubleshooting issues, and ensuring successful integration.",
          "With the growing complexity of Transform, we hired a lead developer to manage technical architecture and lead the development team. This pivotal hire allowed us to expand further into a fully functional scrum team, including additional developers, QA specialists, and a product owner. Together, we implemented agile methodologies, refined processes, and established a collaborative workflow that ensured the design system's long-term sustainability.",
        ],
        image: "img/transform/timeline.png",
        imageAlt: "Timeline of Transform's development",
        imageStyle: { backgroundColor: "white" },
      },
      {
        subHeading: "Pattern Library",
        paragraphs: [
          "We built a dynamic Pattern Library site that served as a showcase, playground, and code resource. Users could configure components, explore usage scenarios, and export code—all through an intuitive interface.",
          "Feedback loops with developers led to continual enhancements. Our vision extended beyond a library: we laid the groundwork for a future page builder capable of drag-and-drop coded layouts, empowering faster prototyping and production.",
          "By designing and building the pattern library in-house, using Transform, we were able to be our own users. This allowed for improvements in designer and developer experiences, and allowed us to better support our customers.",
        ],
        image: "img/transform/pattern-library.png",
        imageAlt: "Image of the Pattern Library Application interface",
        caption: "The Pattern library allows users to explore configurations of components, read release notes, gather and share code snippets, and so much more, built with Transform so as a team we used our own system.",
      },
      {
        heading: "Support Model",
        paragraphs: [
          "As TruCare Cloud grew, so did Transform. When I started, I was able to stay in touch with every designer on the project, supporting, co-designing, gathering feedback, joining forces in research. That became harder as my role expanded, so I worked with leadership and created a liaison process where the designers on Transform were dedicated support for our customer designers. This meant our customers always knew who to talk to, creating professional relationships and trust. This was highly successful in building rapport, just as it was in building better experiences across the product.",
        ],
      },
      {
        heading: "Accessibility",
        paragraphs: [
          "Recognizing the importance of inclusive design, I took the initiative to integrate accessibility into Transform's core by creating detailed reports, conducting internal testing, and developing training programs for designers to ensure compliance with accessibility standards. I worked closely with the accessibility team to improve my personal understanding and empathy for accessibility, which informed our approach to testing and design.",
          "When we started, there was no formal accessibility support team in place. These efforts culminated in passing rigorous accessibility audits, meeting internal benchmarks, and ensuring all components adhered to WCAG guidelines. By embedding accessibility into our design and development processes, we not only improved the overall usability of the system but also set a standard for future enterprise projects.",
        ],
        image: "img/transform-expansion.png",
        imageAlt: "Image of the Transform Design System expansion panel",
        caption: "The expansion panel component utilizes slot features to allow for flexible content and layout, reducing detach rates, while allowing for considerable flexibility and exploration.",
      },
      {
        heading: "Lessons Learned",
        subHeading: "Design Systems Are About Relationships",
        paragraphs: [
          "Throughout the development and scaling of Transform, one of the key takeaways was that design systems are fundamentally about relationships. In areas where I was able to build strong relationships—with developers, product managers, and other stakeholders—we saw significant success in adoption and expansion. Teams that trusted the system were more likely to integrate it into their workflows, which led to consistent, high-quality user experiences.",
        ],
        image: "img/transform/changelog.png",
        imageAlt: "Changelog Example",
        caption: "Mirroring best practices from the development process was one way I ensured we treated even the design library as a product. By creating a changelog, we were able to communicate changes and updates to the system, something I've adopted for other systems.",
      },
      {
        subHeading: "Component-First > App-First",
        paragraphs: [
          "We initially attempted an app-by-app approach to adoption, which required extensive alignment between product, development, design, and leadership—areas where I did not have direct influence. When relationships were strong and priorities aligned, we saw significant progress. However, when those relationships weren't as solid or priorities diverged, it became far more challenging to achieve success and drive adoption effectively.",
          "In hindsight, a more strategic component-by-component approach might have yielded better results. Since most applications had been developed before the design system existed, comprehensive rebuilds were rarely prioritized. Focusing on incrementally replacing key components, such as buttons, across the software would have been a simpler and more efficient way to introduce Transform, ultimately positioning it to drive greater consistency across the enterprise.",
        ],
        image: "img/transform/cards_doc.png",
        imageAlt: "Card Documentation Example",
        caption: "The card component documentation is an example of how we documented the components in a way that was easy to understand and implement. This was a key part of our strategy to drive adoption and ensure consistency across the product.",
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "Looking back, I am proud of the system that we built. Transform is comprehensive and robust, easy to use and implement. Though I've since moved on, Transform continues to be used across the application—despite currently running without dedicated design support. I've used the processes, testing, components and feature set of Transform to help improve the enterprise wide design system, Fondue.",
          "Transform's success was built on a foundation of scalable processes, accessibility, and strong cross-functional relationships. From a single-contributor project to an enterprise-wide solution, it has become a vital tool that enhances productivity, improves user experience, and ensures design consistency across the organization. The lessons learned from this journey continue to inform how we approach design systems and collaboration at scale.",
        ],
        image: "img/transform-expansion-testframe.png",
        imageAlt: "Image of the Transform Design System expansion test frame",
        caption: "Test frames ensured we didn't push out components that were not fully tested. This was a key part of our strategy to ensure quality and consistency across the product.",
      },
    ],
    impact: [
      "20,000+ daily users",
      "16+ apps integrated",
      "40+ reusable components",
      "Passed WCAG accessibility testing",
      "Fully tested and documented",
    ],
  },
  {
    id: "fondue",
    title: "Fondue Design System",
    tags: ["Design Systems", "Enterprise UX"],
    meta: "2023–Present · Centene Corporation · Design Systems Lead",
    cardImage: "img/fondue-logo.png",
    cardImageStyle: { backgroundColor: "white" },
    description: "How I rebuilt Fondue into a structured, accessible, and trusted enterprise design system.",
    coverImage: "img/fondue-logo.png",
    coverImageStyle: { backgroundColor: "white", objectFit: "contain", maxHeight: "200px" },
    intro: [
      "When I joined the Fondue design system, the project was struggling with disorganization, inconsistent components, and a lack of collaboration across teams. The design system had little structure, and its adoption was minimal due to the absence of clear processes and communication. Designers faced delays in support, particularly with accessibility, and the system was not aligned with the development team's needs. My role was to play a critical part in addressing these challenges by improving processes, rebuilding relationships, and integrating accessibility. Through these efforts, Fondue has become a cohesive, well-documented, and inclusive design system that plays a central role in the organization's design and development efforts.",
    ],
    sections: [
      {
        heading: "Improving Processes",
        paragraphs: [
          "The first challenge I tackled was the lack of clear processes within the design system. The Figma library was disorganized, components were incomplete, and documentation was sparse, making it difficult for teams to use the system effectively. I quickly introduced structure by establishing standardized workflows, setting clear expectations, and improving documentation.",
          "To bring order to the Figma library, I reorganized the components to make them easy to find and use. Each component was documented with detailed usage guidelines, customization options, and examples to ensure designers could confidently implement them in their work. I also created resources like video tutorials and live Q&A sessions to support designers in using the system and reducing the wait time for support.",
          "Additionally, I introduced office hours and direct support channels, which allowed designers to get quick assistance and helped eliminate bottlenecks in the adoption process. These changes significantly improved efficiency, allowing the design system to become more usable and accessible to all teams.",
        ],
      },
      {
        subHeading: "Rebuilding Relationships",
        paragraphs: [
          "A critical aspect of my role in Fondue was rebuilding relationships, particularly with key stakeholders such as the new product owner and development lead. When I arrived, there was a lack of alignment between design, development, and product teams, leading to confusion and inefficiencies in how the system was being implemented. There was also significant mistrust between the design and accessibility teams, which hindered collaboration.",
          "I worked closely with the newly appointed product owner and development lead to establish a shared vision for the design system. Together, we held regular meetings to ensure alignment and address concerns from all sides, ultimately leading to stronger collaboration and a clearer sense of purpose.",
          "Additionally, I worked hard to repair the relationship with the accessibility team. This team had previously felt sidelined, and their concerns were not always addressed within the system. I made it a priority to include them early in the decision-making process, ensuring that accessibility was integrated into the design from the start. Through regular check-ins and shared goals, I was able to build trust with the accessibility team, which made it easier to meet WCAG standards and provide designers with the tools they needed to create inclusive designs.",
        ],
      },
      {
        heading: "Integrating Accessibility",
        paragraphs: [
          "When I joined Fondue, accessibility had not been adequately prioritized, which created significant gaps in the system. I knew that for the system to be truly effective and inclusive, accessibility had to be a core focus. I worked closely with the accessibility team to integrate accessibility standards into the system and ensure that all components were tested against WCAG guidelines.",
          "I conducted internal audits, created accessibility checklists, and developed training programs for designers to ensure that accessibility considerations were at the forefront of the design process. These efforts resulted in components that were not only more inclusive but also easier for designers to implement, ensuring that accessibility became an integral part of the system rather than an afterthought.",
        ],
        image: "img/fondue-ally.png",
        imageAlt: "Examples of accessibility theme tests in Fondue",
        caption: "Each component is accompanied by a set of accessibility overlays. These mimic grayscale, low vision and blurry vision. They ensure we pay attention to critical accessibility issues like color contrast and text size, as well as build empathy.",
      },
      {
        heading: "Improving Documentation and Knowledge Sharing",
        paragraphs: [
          "Another area where I made a significant impact was in improving the documentation and knowledge-sharing processes. The previous documentation was disorganized and hard to navigate, which made it difficult for teams to use the system effectively. I overhauled the documentation to create a more structured, comprehensive resource for all teams.",
          "Each component was documented with clear guidelines, usage examples, and customization options. I also created additional resources like video tutorials and live Q&A sessions to help onboard new users and provide ongoing support.",
          "Additionally, by fostering a culture of knowledge sharing, I ensured that designers and developers had the resources they needed to collaborate more effectively. Regular feedback loops and shared learnings helped ensure that the system continued to improve and evolve to meet the needs of the teams using it.",
        ],
        image: "img/fondue-template.png",
        imageAlt: "Examples of page templates in Fondue",
        caption: "The page template component was sorely missing from the system when I joined. Each design was using slightly different spacing, breakpoints etc, despite documentation. Codifying as a component ensured that all teams were using the same template, and that it was easy to implement.",
        extraImages: [
          {
            src: "img/fondont.png",
            alt: "Image of FonDos and FonDon'ts documentation",
            style: { backgroundColor: "white" },
            caption: "Guidelines in Fondue are known as FonDos and FonDon'ts. They showcase examples of what to do and what not to do when using the design system.",
          },
        ],
      },
      {
        heading: "Lessons Learned",
        orderedList: [
          "Clear Processes and Documentation Are Essential: A design system without clear processes and well-organized documentation will struggle to gain adoption. By introducing structure and clarity, I was able to make the system more usable and efficient.",
          "Collaboration and Relationship-Building Are Key: Successful design systems are built on strong relationships. By working closely with the product owner, development lead, and accessibility team, I was able to align all stakeholders around a shared vision and build trust, which led to better outcomes.",
          "Accessibility Must Be Embedded in the Process: Accessibility is not an afterthought—it's a core part of the design process. By integrating accessibility into the system from the beginning, I ensured that the system was inclusive and usable for all users.",
          "Ongoing Improvement Is Crucial: A design system is not a static asset; it needs continuous feedback and improvement. By creating a culture of knowledge sharing and regular feedback, I was able to help Fondue evolve and meet the needs of the organization.",
        ],
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "My involvement in the transformation of the Fondue design system was both challenging and rewarding. By improving processes, rebuilding relationships, and ensuring that accessibility was prioritized, I played a critical role in shaping a design system that is now a central part of the organization's design and development efforts.",
          "Fondue is now a robust, well-supported, and trusted system, thanks to the improvements I made in process, collaboration, and accessibility. By rebuilding relationships with key stakeholders, I was able to align the entire team around a shared vision and create a design system that truly meets the needs of the organization.",
        ],
      },
    ],
  },
  {
    id: "carshopper",
    title: "Car Shopper UX",
    tags: ["UX Design", "Consumer-facing"],
    meta: "2019–2020 · Dealer.com / Cox Automotive · Senior UX Designer",
    cardImage: "img/desktop-vdp.png",
    cardImageStyle: {},
    description: "From concept to deep execution on search and details pages. A look at the process and results.",
    coverImage: "img/desktop-vdp.png",
    intro: [
      "During my tenure at Dealer.com, nothing has been more important than the user experience design of the car shopper. At the core of the company, this is what we do—make it easy for consumers to find a vehicle of interest and communicate that to the dealership.",
    ],
    sections: [
      {
        heading: "The Vehicle Details Page",
        paragraphs: [
          "The Vehicle Details Page is the cornerstone of a car dealer's web site. We spent a little over a year designing and developing a new details page. That might seem excessive until you realize that it had to accommodate upwards of 15,000 different dealerships, be customizable to their needs and desires, support an entirely new development philosophy and a new design system.",
        ],
      },
      {
        subHeading: "Involvement",
        paragraphs: [
          "My role in the project was extensive, from initial design workshops, wireframes and detailed rounds of mockups to prototyping, extensive user testing, refinement, and development support.",
        ],
      },
      {
        subHeading: "The Results",
        paragraphs: [
          "The end page was in large part a matter of creating clear hierarchy for users. The photos are both horizontally and vertically responsive, ensuring users can see the image at high resolution, while still keeping the high level information about the car above the fold. Below the image, we placed information and specifications on the left, with pricing and actions in the right column.",
        ],
        image: "img/vdp.png",
        imageAlt: "Vehicle Details Page",
        imageStyle: { border: "1px solid #ccc", borderRadius: "4px" },
      },
      {
        subHeading: "All Good?",
        paragraphs: [
          "As with most projects, there are always compromises involved. The default visual design of the page makes it feel more like a wireframe than a complete solution. I would lift the visuals with a bit more use of color, iconography and emphasis on critical information. Ultimately the baseline design had to work for everyone and usually that means it has to meet at a low denominator.",
        ],
        image: "img/vdp-mobile.png",
        imageAlt: "Mobile Vehicle Details Page",
      },
      {
        heading: "The Search Results Page",
        paragraphs: [
          "The second part of the overhaul of our system has been the Search Results Page (SRP). Like the details page, it has to be backward compatible with years of dealer preferences, forward-facing to be fully responsive and fully customizable both in function and in look. I've been responsible for overall page layout, overhauling the page heading and functionality and faceting design.",
        ],
        image: "img/srp.png",
        imageAlt: "Search Results Page",
      },
      {
        subHeading: "Research Process",
        paragraphs: [
          "We don't have extensive resources such as dedicated UX Research, so we have to make do as a team. One of the primary tools we use is a service from usertesting.com. It allows us to write a simple interview script and get mockups, prototypes or final working content in front of users quickly. My favorite part of that process is how quickly I can put something out, get feedback and iterate.",
          "Often it can be a matter of a couple of hours for a quick hypothesis to learn if something is spot on or needs some small tweaks. A good example is packages and options on vehicles. This can be a confusing term that we were able to make a little less confusing by adding one word to the heading, \u201cIncluded\u201d—something I was able to verify added a lot of clarity.",
        ],
        image: "img/srp-card-package.gif",
        imageAlt: "Animation showing two instances for user testing of the results page",
        extraImages: [
          { src: "img/srp-mobile-filter.png", alt: "Mobile filtering" },
        ],
      },
      {
        heading: "Early Concepting",
        paragraphs: [
          "Of course, not everything I do makes it to production. Sometimes it is too complex to develop, sometimes it is too complex to support as an organization, or sometimes it just does not work. But those early ideas are usually highly informative to the final deliverable.",
        ],
      },
      {
        subHeading: "Let it Flow",
        paragraphs: [
          "This advanced concept clearly shows users what is happening as they go through the flow of information from searching, comparing and viewing vehicle details. Animations make it clear when a vehicle is added or removed from the listings. A comparison mode makes it easy to add or remove vehicles of interest. And when a user is ready to delve deep into the details, they can quickly switch between similar listings, while progressively getting the information they want, without being overwhelmed.",
        ],
      },
      {
        subHeading: "Panels",
        paragraphs: [
          "Sometimes the best ideas are the ones you repurpose. The above concept spun off of a site I was browsing that utilized a panel-based approach, as opposed to pages. I quickly saw the potential for a more linear flow of information from left to right. This would allow users to move from listings to details and back without having to load singular pages.",
        ],
        image: "img/VLP-Panel.gif",
        imageAlt: "Experimental Vehicle Listing Page with panel-based approach",
        imageStyle: { width: "320px" },
      },
      {
        subHeading: "Lessons Learned",
        paragraphs: [
          "Advanced concepts can be both extremely rewarding and quite frustrating at the same time. I love getting deep into a concept and figuring out how to make the complex concept user-friendly. However, that often means being more than a few steps ahead of an organization. When I first started, I figured (incorrectly) that concepts could see the light of day in the course of a month or two. The longer I have been working in the field, the longer that timeframe has become, and I have learned to appreciate the wins that do make it to a site, while not losing my drive to be ahead, sometimes by years.",
        ],
      },
    ],
  },
  {
    id: "filter",
    title: "Filtering Component",
    tags: ["Design Systems", "UX Architecture"],
    meta: "Centene Corporation · TruCare Cloud · UX Architect",
    cardImage: "img/filter-panel.png",
    cardImageStyle: {},
    description: "A flexible, scalable filtering component designed to unify and simplify complex data workflows across TruCare Cloud.",
    coverImage: "img/filter-group.png",
    intro: [
      "TruCare Cloud is a data-dense platform where nearly every workflow relies on interacting with large datasets—especially through tables. But across teams, filtering had become a pain point. Each group had built their own version of filters, often inconsistent and fragile. As the UX architect on the design system, I recognized the opportunity to create a single, reusable filtering component—one powerful enough to support healthcare data, and flexible enough for widespread use.",
    ],
    sections: [
      {
        paragraphs: [
          "I kicked off discovery workshops to align across teams—product, engineering, and fellow designers. We mapped out the use cases and uncovered just how fragmented filter implementations had become. Some were limited to basic dropdowns, others had no keyboard support, and several required entirely different layouts depending on the context. From these sessions, I defined key requirements: flexible configuration, accessibility-ready markup, performance, and adaptability across UI types (toolbars, panels, modals, and more).",
        ],
        quote: "Design systems should seek to solve business problems. Not design buttons.",
        image: "img/filter-group.png",
        imageAlt: "Image of the Filter Component interface",
        caption: "The current filter group is a bar-oriented interface that allows users to filter data in a table. It is responsive and highly configurable.",
      },
      {
        paragraphs: [
          "Our MVP started small: just a few core filter types—single select, multiselect, and date filters. But I designed the system with modularity in mind. Each filter tile could be dynamically rendered and reordered. Over time, the component evolved into a smart wrapper: teams could define the filter structure via configuration, and the logic and display would adapt accordingly. This allowed developers to implement complex filters without reinventing the wheel—and enabled designers to prototype real-world flows using the exact same logic.",
        ],
        image: "img/filter-panel.png",
        imageAlt: "Image of the Filter Panel Interface",
        caption: "The filter panel shares all of the same logic, but allows for more advanced filtering and flexibility in placement. Additional filters can easily be added with no limits.",
      },
      {
        paragraphs: [
          "I also pushed the filtering component beyond Figma, using live prototyping tools like StackBlitz to test edge cases and explore layout behaviors that were difficult to communicate in static design files. This accelerated decision-making and helped product teams visualize how filters would work in complex table states or in-progress flows. Developers appreciated the clarity, and the hands-on demos helped us tighten requirements without ambiguity.",
          "As adoption grew, the ROI became clear. Dozens of teams implemented the filtering component across their pages. It not only ensured consistency and reduced time spent on filter logic—it also gave users a predictable, scalable experience when working with data. Teams no longer needed to worry about the UI for filters—they could focus on what filters were most meaningful to their workflows.",
          "This project was a turning point for our design system. It proved that the value of a system isn't just in the visual elements—it's in solving shared problems at scale. By investing early in collaboration, shaping the right abstractions, and prototyping in real code, we delivered a component that saved time, reduced confusion, and improved user experience. One filter component, dozens of use cases, and a more cohesive platform as a result.",
        ],
      },
    ],
  },
  {
    id: "member-menu",
    title: "Member Menu",
    tags: ["UX Architecture", "Navigation"],
    meta: "Centene Corporation · TruCare Cloud · UX Architect",
    cardImage: "img/mega-menu-final.png",
    cardImageStyle: {},
    description: "A persistent navigation menu that streamlined access to member-related tasks, reducing multi-page workflows into a single-click experience.",
    coverImage: "img/mega-menu-final.png",
    intro: [
      "TruCare Cloud had grown into a sprawling application, with teams building critical features in isolation—outreaches, assessments, care plans, and more. But with that growth came a big problem: there was no unified way to navigate between member-related tasks. Common workflows spanned three or more pages, with no central hub to guide users. As the system grew more complex, the cost of poor navigation only increased. I began exploring a solution well before the project was officially prioritized.",
    ],
    sections: [
      {
        paragraphs: [
          "As the design systems architect, part of my role is to keep an eye on the product as a whole. I observed that users were frequently forced to re-find the same member across features, duplicate effort, or drop out of context. I ran observation sessions, noting patterns like users repeatedly launching the same assessment manually. These sessions informed early prototypes I created in Figma and StackBlitz to demonstrate how a unified member navigation model might look—one that was persistent, context-aware, and quick to use.",
        ],
        quote: "This wasn't just a menu—it was architectural glue.",
        image: "img/mega-menu-final.png",
        imageAlt: "Image of the Member Menu interface",
        caption: "The final design for Member Menu is a responsive flyout. It gives power users the ability to switch between recent members and navigate directly to in-progress work or critical paths for that member.",
      },
      {
        paragraphs: [
          "Once the project was greenlit, I led working sessions with design, product, and platform architecture to validate the core concept: a top-level Member Menu that allowed users to switch between recent and active members, and quickly access key areas like Assessments, Authorizations, and Care Plans. Importantly, we scoped it carefully for MVP—delivering immediate value without requiring a full redesign of every member page. The navigation lived in the header, persisted across views, and was designed to feel like a native part of the platform.",
          "The Member Menu included a list of recent members (up to 10), highlighting the active one, and offering direct links to high-impact areas. It also surfaced in-progress items so that users could resume unfinished work without needing to navigate through multiple levels of the app. This functionality significantly reduced cognitive overhead and click paths. One user said, \u201cThis is the first time I feel like I can move freely through the system.\u201d",
          "Throughout development, I worked closely with engineering to ensure responsive behavior, state persistence, and future extensibility. I also aligned with accessibility partners and product teams to define what wouldn't be solved in MVP. These conversations kept us focused and allowed us to ship something meaningful quickly while keeping doors open for future improvements.",
          "The Member Menu wasn't just a feature—it was a signal of architectural maturity. It introduced a central navigation model where none had existed, allowing users to stay in flow across member-related tasks. Navigation is one of the most invisible forms of UX, and this project helped make it seamless, scalable, and designed with intent.",
        ],
      },
    ],
  },
  {
    id: "composer",
    title: "Composer Architecture",
    tags: ["UX Design", "CMS"],
    meta: "2019–2020 · Dealer.com / Cox Automotive · Senior UX Designer",
    cardImage: "img/composer-ui-sm.png",
    cardImageStyle: { objectPosition: "top left" },
    description: "Architecture and UX design for users to update and configure their dealership web site.",
    coverImage: "img/composer-main.png",
    intro: [
      "I served as the lead designer on a cross-functional product squad alongside product managers, engineers, and analysts. Our mission was to stay one to two quarters ahead of development by proactively shaping the product backlog—evaluating epics, analyzing existing implementations, conducting user research, and delivering mockups that would guide future development.",
    ],
    sections: [
      {
        heading: "Background: What Is Composer?",
        paragraphs: [
          "Composer is a core internal tool that enables car dealerships—and internal staff—to manage their websites. Tasks range from basic content updates to configuring complex site preferences. However, the tool had received minimal investment over the years, resulting in a clunky, unintuitive experience heavily reliant on hover states and overlay dialogs. It was ripe for modernization.",
        ],
        image: "img/composer-current.png",
        imageAlt: "Current State of Composer Interface",
        caption: "The current interface largely relies on hover states and overlays.",
      },
      {
        heading: "Strategic Framing",
        paragraphs: [
          "My initial challenge was to reimagine the future of Composer—not just visually, but behaviorally. Leveraging an existing design system helped eliminate decisions around color, spacing, and iconography, allowing me to focus on UX architecture and product usability. I created a foundational set of UX principles to guide the project and align the team:",
        ],
        orderedList: [
          "Provide guidance throughout",
          "Make good decisions easy",
          "Aid users with tooling",
          "Prioritize common decisions",
          "Be accessible to all users",
          "Intuitive for basic users, configurable for advanced",
          "Ensure mobile parity",
          "Keep users informed",
          "Design for time-efficiency",
          "Support tracking and tagging",
        ],
      },
      {
        subHeading: "User Research",
        paragraphs: [
          "To deeply understand the current pain points, I led an intensive two-day round of user interviews and observations. This included group interviews with four internal departments, task-specific roundtable discussions, and 1:1 shadow sessions to observe real-time behaviors and friction. These sessions uncovered dozens of opportunities for streamlining workflows. For example, simple preference toggles were implemented with dropdowns—even for binary true/false values. Replacing these with checkboxes reduced the number of clicks and improved scannability.",
        ],
        extraImages: [
          { src: "img/composer-edit.png", alt: "Composer in Edit Mode" },
          { src: "img/compoer-library.png", alt: "Composer Library" },
        ],
      },
      {
        subHeading: "Design Execution: Third-Party Tool",
        paragraphs: [
          "The first high-priority feature we tackled was the Third-Party Integration Manager, used to configure external tools and services supported by the platform.",
          "Before: A static dialog with a long, unorganized list of integrations. Users had to click into each item to access preferences, with documentation stored in a separate system.",
          "After: I redesigned this as a stand-alone, full-page application with a searchable, categorized list of integrations, activated integrations visually elevated to the top, a contextual panel to the right for editing preferences, and embedded documentation available inline. This architecture preserves context, supports fast scanning and filtering, and dramatically reduces cognitive overhead.",
        ],
        image: "img/third-party-home.png",
        imageAlt: "Current Third Party Integration Home",
        caption: "Currently, the \u201ctool\u201d is just a list of integrations.",
        extraImages: [
          { src: "img/new-third-party-default.png", alt: "Proposed Third Party Tool" },
          { src: "img/new-third-party-screen.png", alt: "Proposed Third Party Tool with Documentation" },
        ],
      },
      {
        heading: "Impact",
        paragraphs: [
          "The Composer overhaul demonstrates the value of aligning research, design, and architecture at the foundation level. My contributions created a scalable UX framework for future work, a human-centered foundation for high-complexity tools, and a tangible improvement in one of the system's most used (and previously painful) features.",
        ],
      },
    ],
  },
];

const processSteps = [
  {
    id: "discovery",
    number: "01",
    label: "Discovery",
    icon: "travel_explore",
    heading: "Asking bold questions",
    keyPoints: [
      { icon: "psychology", text: "Naturally inquisitive, strategic questioner" },
      { icon: "record_voice_over", text: "Build trust early through active listening" },
    ],
    body: "Great solutions require deeply understanding the problem first. I lean into curiosity through design jams and stakeholder workshops — not just asking what, but always why. This phase is about listening, aligning with business goals, understanding user pain points, and uncovering the constraints that actually shape what's possible. I ask the uncomfortable questions across product, design, accessibility, and engineering that others sometimes avoid.",
    quote: "Help me understand the hierarchy here. Is this new feature the most important thing for the user?",
  },
  {
    id: "wireframe",
    number: "02",
    label: "Wireframe",
    icon: "draw",
    heading: "Start ugly and sharp",
    keyPoints: [
      { icon: "edit_note", text: "Post-its and Sharpies are preferred tools" },
      { icon: "format_shapes", text: "Structure and content come first, always" },
    ],
    body: "I'm not a visual artist — and that's a strength, not a limitation. Fat Sharpies, small Post-its, and whiteboards force rapid iteration, clear thinking, and early collaboration. When fidelity is low, feedback is honest. I advocate for content-first design from the start, building around semantic structure and clear hierarchy aligned with accessibility standards. If a screen reader can't navigate it meaningfully, neither can a user.",
    quote: "Can you say that back to me in your own words? I want to make sure I'm not talking about triangles when you are talking about pyramids.",
  },
  {
    id: "design",
    number: "03",
    label: "Design",
    icon: "design_services",
    heading: "Jumping into Figma",
    keyPoints: [
      { icon: "widgets", text: "Expert in components, variables, and auto layout" },
      { icon: "code", text: "Prototype in code when Figma hits its limits" },
    ],
    body: "I leverage deep Figma expertise — components, variables, auto layout, and interactive prototyping — to move quickly without sacrificing scalability or brand consistency. Libraries and systems are the foundation. When a flow is too complex for Figma to communicate accurately, I'll build a quick CodePen or coded prototype instead. AI tools turn repetitive work into minutes, freeing attention for the decisions that actually matter.",
    quote: "Check out this quick CodePen I threw together — it better illustrates how responsive behavior should work here.",
  },
  {
    id: "validate",
    number: "04",
    label: "Validate",
    icon: "fact_check",
    heading: "Feedback is fuel",
    keyPoints: [
      { icon: "diversity_3", text: "Champion inclusive feedback loops with diverse voices" },
      { icon: "bar_chart", text: "Use testing and data to refine and reduce risk" },
    ],
    body: "Research isn't a checkpoint — it's an ongoing rhythm. I test early with paper sketches and teammates, then move into usability testing, stakeholder walkthroughs, and analytics as fidelity increases. Sharing work early and often, with leadership, developers, accessibility experts, and end-users, leads to better outcomes and avoids the expensive surprises that come from late-stage feedback. The best validation finds what's broken before it ships.",
    quote: "Feedback when you think you are done is the absolute worst. Early on, it's no big deal.",
  },
  {
    id: "finalize",
    number: "05",
    label: "Finalize",
    icon: "verified",
    heading: "Obsess the details",
    keyPoints: [
      { icon: "straighten", text: "Sharp eye for spacing, tokens, and accessibility" },
      { icon: "handyman", text: "Partner closely with developers for quality delivery" },
    ],
    body: "As a project nears completion, my focus sharpens on the details that separate good from great: spacing, hierarchy, interaction logic, accessibility labels, and token consistency. I pair closely with developers through ticket review, documentation, and direct collaboration to ensure high-quality delivery. Every intentional pixel and property decision in this phase is also an investment in the next project — making the system smarter, faster, and more consistent over time.",
    quote: "I'm so glad we are past the days of project-final-37.psd.",
  },
];

const testimonials = [
  {
    quote: "When I think about design systems, I think about Nathan. He consistently raised the bar for our team, always bringing new ideas and thoughtful improvements.",
    author: "Jessica",
  },
  {
    quote: "His expertise and commitment to thoughtful, user-centered design set a standard the rest of us aspired to. His depth of knowledge across design, development, and accessibility made him the person we turned to.",
    author: "Kristina",
  },
  {
    quote: "He is one of the most professional, knowledgeable, and cross-skill thinkers I’ve ever come across in his craft. He is genuinely passionate about looking at design systems holistically.",
    author: "Jordan Lynne",
  },
  {
    quote: "Design systems, accessibility, and UX strategy truly seem like second nature to him. Nathan cares deeply about creating meaningful, high-quality experiences.",
    author: "Christine",
  },
  {
    quote: "Nathan has a remarkable talent for translating conceptual design needs into scalable, architecturally sound components. I’ve seen firsthand his unique ability to bridge the gap between complex design strategy and technical execution.",
    author: "Leon",
  },
  {
    quote: "Nathan was always helpful, resourceful, and thoughtful in solving problems and creating consistency. He made complex design system decisions easier to understand and apply.",
    author: "Hannah",
  },
  {
    quote: "Nathan combined strategic vision with hands-on leadership. He consistently balanced user experience, business goals, and technical feasibility with clarity and confidence.",
    author: "Jose",
  },
  {
    quote: "He’s an incredibly thoughtful and knowledgeable design systems lead who consistently brings new ideas and strategic thinking. He has a strong ability to connect teams, improve processes, and elevate the quality of the work.",
    author: "Suzanne",
  },
  {
    quote: "Nathan brought a thoughtful leadership style, deep design systems expertise, and a genuine passion for helping others. He was always approachable, collaborative, and patient.",
    author: "Alexis",
  },
  {
    quote: "His insights, thoroughness, and foresight have contributed to our advancement in consistency and thoughtful design. His calm and steady leadership is greatly appreciated.",
    author: "Tracy",
  },
  {
    quote: "Nathan built a smart, unified design system by thoughtfully merging several distinct systems into one cohesive framework. He is a systems thinker, a highly skilled trainer, and an all-around great human to work with.",
    author: "Tami",
  },
  {
    quote: "Nathan has an incredible knack for UX Design. He translates business problems into innovative UI solutions while balancing corporate standards with modern design.",
    author: "Zachary",
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function getRouteBase(pathname = window.location.pathname) {
  return pathname.startsWith("/examples/portfolio") ? "/examples/portfolio" : "";
}

function getRoutePath(page = "home") {
  const base = getRouteBase();
  const prefix = base || "";
  if (page === "home") return `${prefix}/`;
  if (page === "process") return `${prefix}/process`;
  if (page === "resume") return `${prefix}/resume`;
  if (page === "testimonials") return `${prefix}/testimonials`;
  if (page === "contact") return `${prefix}/contact`;
  if (caseStudies.some((study) => study.id === page)) return `${prefix}/case-studies/${page}`;
  return `${prefix}/`;
}

function getPageFromLocation(pathname = window.location.pathname) {
  const base = getRouteBase(pathname);
  const path = (base ? pathname.slice(base.length) : pathname).replace(/\/+$/, "") || "/";
  if (path === "/") return "home";
  if (path === "/process") return "process";
  if (path === "/resume") return "resume";
  if (path === "/testimonials") return "testimonials";
  if (path === "/contact") return "contact";
  const caseMatch = path.match(/^\/case-studies\/([^/]+)$/);
  if (caseMatch && caseStudies.some((study) => study.id === caseMatch[1])) {
    return caseMatch[1];
  }
  return "home";
}

function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.altKey && !event.ctrlKey && !event.shiftKey;
}

function CaseStudyCard({ study, navigate }) {
  return (
    <Card shadow="sm" className="pf-study-card">
      <div className="pf-study-image">
        <img
          src={study.cardImage}
          alt={study.title}
          className="pf-study-image-img"
          style={study.cardImageStyle}
        />
      </div>
      <div className="pf-study-body">
        <div className="pf-tag-row">
          {study.tags.map((tag) => (
            <MessageBadge subtle key={tag}>{tag}</MessageBadge>
          ))}
        </div>
        <Heading as="h3" size="lg">{study.title}</Heading>
        <Paragraph size="md" color="muted">{study.description}</Paragraph>
        <Button
          as="a"
          href={getRoutePath(study.id)}
          variant="tertiary"
          icon="arrow_forward"
          iconPosition="end"
          onClick={(event) => navigate(study.id, event)}
        >
          Read case study
        </Button>
      </div>
    </Card>
  );
}

// ── Pages ────────────────────────────────────────────────────────────────────

function HomePage({ navigate }) {
  return (
    <>
      <Section inverse padding="lg" className="pf-hero">
        <div className="pf-hero-inner">
          <MessageBadge status="info" icon="person">
            Principle AI Designer
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

          <ButtonContainer align="start">
            <Button
              variant="primary"
              icon="arrow_downward"
              iconPosition="end"
              onClick={() =>
                document
                  .getElementById("case-studies")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View work
            </Button>
            <Button as="a" href={getRoutePath("process")} variant="secondary" onClick={(event) => navigate("process", event)}>
              My process
            </Button>
          </ButtonContainer>
        </div>
      </Section>

      <Section id="case-studies" padding="lg">
        <div className="pf-section-inner">
          <MessageBadge subtle icon="work">Selected projects</MessageBadge>
          <Heading as="h2" size={{ xs: "xl", md: "xxl" }} className="pf-section-title">
            Case studies
          </Heading>
          <Grid columns={{ xs: 1, md: 2, lg: 3 }} gap="lg">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.id} study={study} navigate={navigate} />
            ))}
          </Grid>
        </div>
      </Section>

      <Section surface="panel" padding="lg">
        <div className="pf-section-inner">
          <Grid columns={{ xs: 1, lg: 2 }} gap="lg" className="pf-about-split">
            <div className="pf-about-content">
              <MessageBadge subtle icon="auto_awesome">Design systems leadership</MessageBadge>
              <Heading as="h2" size={{ xs: "xl", md: "xxl" }}>
                Trusted design systems leader
              </Heading>
              <Paragraph size="lg" color="muted">
                As a trusted design systems leader, I specialize in building
                predictable, accessible systems that drive strategy,
                consistency, and scalability across enterprise products.
              </Paragraph>
              <Paragraph size="md" color="muted">
                I combine creative vision with hands-on execution to deliver
                high-performing user experiences. With strong cross-functional
                leadership, I unite product, design, and engineering teams to
                translate complexity into clarity.
              </Paragraph>
              <ButtonContainer align="start">
                <Button
                  as="a"
                  href={getRoutePath("resume")}
                  variant="secondary"
                  icon="description"
                  iconPosition="end"
                  onClick={(event) => navigate("resume", event)}
                >
                  View resume
                </Button>
              </ButtonContainer>
            </div>
            <div className="pf-skills-grid">
              <div>
                <Heading as="h3" size="xs" className="pf-skills-label">Core competencies</Heading>
                <ul className="pf-skill-list">
                  {["Design Systems Leadership", "UX Strategy & Architecture", "Component Libraries & Documentation", "Accessibility (WCAG, Governance)", "Advanced Prototyping", "User Research & Data-Driven Design", "Front-End Collaboration (HTML/CSS, JS)", "Mentorship & Design Reviews"].map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Heading as="h3" size="xs" className="pf-skills-label">Tools</Heading>
                <ul className="pf-skill-list">
                  {["Figma", "Sketch", "Storybook", "Zeroheight", "Miro", "Jira, Confluence", "HTML / CSS / JS", "Adobe Creative Cloud"].map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Grid>
        </div>
      </Section>

      <Section inverse padding="lg">
        <div className="pf-cta-inner">
          <MessageBadge subtle icon="mail">Get in touch</MessageBadge>
          <Heading as="h2" type="display" size={{ xs: "xl", md: "xxl" }} className="pf-cta-heading">
            Let's work together
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-cta-sub">
            Open to new opportunities and collaborations. Feel free to reach out.
          </Paragraph>
          <Button as="a" href={getRoutePath("contact")} variant="primary" onClick={(event) => navigate("contact", event)}>
            Get in touch
          </Button>
        </div>
      </Section>
    </>
  );
}

function CaseStudyPage({ study, navigate }) {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <div className="pf-tag-row">
            {study.tags.map((tag) => (
              <MessageBadge subtle key={tag}>{tag}</MessageBadge>
            ))}
          </div>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            {study.title}
          </Heading>
          <Paragraph size="md" color="muted" className="pf-detail-meta-text">
            {study.meta}
          </Paragraph>
        </div>
      </Section>

      <Section as="div" padding="lg" className="pf-detail-content">
        {study.coverImage && (
          <img
            src={study.coverImage}
            alt={`${study.title} cover`}
            className="pf-detail-cover"
            style={study.coverImageStyle}
          />
        )}

        {study.intro?.map((p, i) => (
          <Paragraph key={i} size="lg" color="muted" className={i === 0 ? "pf-detail-lead" : ""}>
            {p}
          </Paragraph>
        ))}

        {study.sections?.map((section, i) => (
          <div key={i} className="pf-detail-section">
            {section.heading && (
              <Heading as="h2" size="xl">{section.heading}</Heading>
            )}
            {section.subHeading && (
              <Heading as="h3" size="lg">{section.subHeading}</Heading>
            )}
            {section.paragraphs?.map((p, j) => (
              <Paragraph key={j} size="md" color="muted">{p}</Paragraph>
            ))}
            {section.orderedList && (
              <ol className="pf-detail-list">
                {section.orderedList.map((item, k) => <li key={k}>{item}</li>)}
              </ol>
            )}
            {section.quote && (
              <blockquote className="pf-process-quote">
                <Icon name="format_quote" className="pf-process-quote-icon" />
                <Paragraph size="lg" className="pf-process-quote-text">{section.quote}</Paragraph>
              </blockquote>
            )}
            {section.image && (
              <figure className="pf-detail-figure">
                <img
                  src={section.image}
                  alt={section.imageAlt || ""}
                  className="pf-detail-figure-img"
                  style={section.imageStyle}
                />
                {section.caption && (
                  <figcaption className="pf-detail-caption">{section.caption}</figcaption>
                )}
              </figure>
            )}
            {section.extraImages?.map((img, k) => (
              <figure key={k} className="pf-detail-figure">
                <img
                  src={img.src}
                  alt={img.alt || ""}
                  className="pf-detail-figure-img"
                  style={img.style}
                />
                {img.caption && (
                  <figcaption className="pf-detail-caption">{img.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        ))}

        {study.impact && (
          <Card shadow="xs" className="pf-detail-impact">
            <Heading as="h2" size="lg">Impact Summary</Heading>
            <ul className="pf-detail-impact-list">
              {study.impact.map((item, i) => (
                <li key={i}>
                  <Icon name="check_circle" className="pf-impact-icon" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div className="pf-detail-nav">
          <Button as="a" href={getRoutePath("home")} variant="secondary" icon="arrow_back" onClick={(event) => navigate("home", event)}>
            Back to overview
          </Button>
        </div>
      </Section>
    </>
  );
}

function ProcessPage({ navigate }) {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge subtle icon="psychology">Design process</MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            From curiosity to craft
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-detail-hero-sub">
            Design is problem-solving through discovery, structure, and
            iteration — combining empathy with execution. My process balances
            inquisitiveness, collaboration, and precision with speed and
            strategic thinking.
          </Paragraph>
        </div>
      </Section>

      <div className="pf-process-content">
        {processSteps.map((step) => (
          <div key={step.id} className="pf-process-step">
            <div className="pf-process-step-aside">
              <span className="pf-process-number">{step.number}</span>
              <div className="pf-process-step-icon-wrap">
                <Icon name={step.icon} className="pf-process-step-icon" />
              </div>
              <span className="pf-process-label">{step.label}</span>
            </div>

            <div className="pf-process-step-main">
              <Heading as="h2" size={{ xs: "lg", md: "xl" }}>{step.heading}</Heading>
              <div className="pf-process-key-points">
                {step.keyPoints.map((point) => (
                  <MessageBadge subtle key={point.text} icon={point.icon}>
                    {point.text}
                  </MessageBadge>
                ))}
              </div>
              <Paragraph size="lg" color="muted">{step.body}</Paragraph>
              <blockquote className="pf-process-quote">
                <Icon name="format_quote" className="pf-process-quote-icon" />
                <Paragraph size="lg" className="pf-process-quote-text">{step.quote}</Paragraph>
              </blockquote>
            </div>
          </div>
        ))}

      </div>

      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge subtle icon="handshake">Building relationships</MessageBadge>
          <Heading as="h2" size={{ xs: "xl", md: "xxl" }}>Capital in, capital out</Heading>
          <Paragraph size="lg" color="muted">
            Design requires trust — and trust is built through relationships.
            Relationships are capital: earned by listening, supporting,
            documenting, and delivering, and sometimes spent to get a favor or
            move a timeline forward. The best partnerships aren't transactional
            — they're built on mutual respect earned by showing up across every
            discipline and understanding how design can help each person succeed.
          </Paragraph>
          <Paragraph size="md" color="muted">
            I invest time understanding product managers, engineers,
            researchers, and accessibility specialists — not just as
            stakeholders, but as collaborators with their own goals, pressures,
            and expertise. That investment pays dividends on every project.
          </Paragraph>
          <blockquote className="pf-process-quote pf-process-quote--inverse">
            <Icon name="format_quote" className="pf-process-quote-icon" />
            <Paragraph size="lg" className="pf-process-quote-text">
              Relationships are all about capital. You build it by showing up,
              and sometimes you spend it to move things forward.
            </Paragraph>
          </blockquote>
        </div>
      </Section>

      <div className="pf-process-content">
        <div className="pf-process-nav">
          <ButtonContainer align="start">
            <Button as="a" href={getRoutePath("home")} variant="secondary" icon="work" iconPosition="end" onClick={(event) => navigate("home", event)}>
              View case studies
            </Button>
            <Button as="a" href={getRoutePath("contact")} variant="primary" icon="mail" iconPosition="end" onClick={(event) => navigate("contact", event)}>
              Get in touch
            </Button>
          </ButtonContainer>
        </div>
      </div>
    </>
  );
}

function ResumePage({ navigate }) {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge subtle icon="description">Resume</MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
                    Nathan <span className="pf-mobile-logo-accent">Dana</span>

          </Heading>
          <Heading as="h2" size={{ xs: "sm", md: "xl" }}>
Principle AI Designer
          </Heading>
          <div className="pf-resume-contact">
            <span>Fort Mill, SC</span>
            <span aria-hidden="true">·</span>
            <a href="mailto:nathan.dana@gmail.com" className="pf-resume-link">nathan.dana@gmail.com</a>
            <span aria-hidden="true">·</span>
            <a href="http://linkedin.com/in/midbrain" className="pf-resume-link" target="_blank" rel="noopener noreferrer">linkedin.com/in/midbrain</a>
          </div>
        </div>
      </Section>

      <Section as="div" padding="lg" className="pf-resume-content">
        <div className="pf-resume-section">
          <Heading as="h2" size="lg" className="pf-resume-section-heading">Professional Summary</Heading>
          <Paragraph size="lg" color="muted">
            As a trusted design systems leader, I specialize in building predictable, accessible systems that drive strategy, consistency, and scalability across enterprise products. I combine creative vision with hands-on execution to deliver high-performing user experiences. With strong cross-functional leadership, I unite product, design, and engineering teams to translate complexity into clarity. I thrive in collaborative, fast paced environments, I lead with empathy, design with precision, and deliver with impact.
          </Paragraph>
        </div>

        <div className="pf-resume-section">
          <Heading as="h2" size="lg" className="pf-resume-section-heading">Professional Experience</Heading>

          <div className="pf-resume-role">
            <div className="pf-resume-role-header">
              <div>
                <Heading as="h3" size="md">Centene</Heading>
                <Paragraph size="sm" color="muted">Design Systems Lead</Paragraph>
              </div>
              <span className="pf-resume-dates">2020 – Present</span>
            </div>
            <ul className="pf-resume-bullets">
              <li>Spearheaded the 0-1 creation and evolution of the Transform Design System, enabling consistent and efficient design and development for internal healthcare applications serving 30,000+ users.</li>
              <li>Founded and scaled a dedicated design systems team, defining intake workflows, governance models, sprint planning, and documentation processes to streamline support and feature development.</li>
              <li>Reimagined the enterprise-wide Fondue Design System, implementing cross-team processes for contribution, accessibility reviews, and naming conventions—driving adoption across multiple business units.</li>
              <li>Led accessibility remediation efforts (WCAG 2.2 AA), collaborated with accessibility teams, and embedded accessibility checks into design workflows.</li>
              <li>Established component lifecycle governance, integrating Figma libraries with Storybook and front-end frameworks like Angular, React, and HTML/CSS to ensure fidelity between design and code.</li>
              <li>Partnered with engineering leads to resolve technical debt, enforce token-based theming, and enable flexible multi-brand theming.</li>
              <li>Provided system office hours, stakeholder workshops, and Figma training to empower designers and developers across the organization.</li>
            </ul>
          </div>

          <div className="pf-resume-role">
            <div className="pf-resume-role-header">
              <div>
                <Heading as="h3" size="md">Dealer.com / Cox Automotive</Heading>
                <Paragraph size="sm" color="muted">Senior User Experience Designer – Interactive</Paragraph>
              </div>
              <span className="pf-resume-dates">2011 – 2020</span>
            </div>
            <ul className="pf-resume-bullets">
              <li>Drove UX strategy and design for high-impact projects including the Composer CMS overhaul, empowering dealers to manage site content with a modern, flexible UI.</li>
              <li>Created modular, scalable patterns across key car shopping journeys such as Search Results Pages (SRP) and Vehicle Details Pages (VDP)—supporting ~15,000 dealership websites across multiple OEMs.</li>
              <li>Introduced UX research and validation workflows, leading heuristic evaluations, shadowing sessions, and remote usability tests to shape roadmap decisions.</li>
              <li>Championed responsive design standards, accessibility best practices, and robust design QA workflows to ensure production readiness.</li>
              <li>Created fully interactive HTML/CSS/JavaScript prototypes to bridge communication between design and engineering and accelerate handoff.</li>
              <li>Facilitated design sprints, stakeholder alignment sessions, and cross-functional workshops to explore innovation opportunities and product vision.</li>
            </ul>
          </div>

          <div className="pf-resume-role">
            <div className="pf-resume-role-header">
              <div>
                <Heading as="h3" size="md">hmc² Advertising</Heading>
                <Paragraph size="sm" color="muted">Art Director</Paragraph>
              </div>
              <span className="pf-resume-dates">2007 – 2011</span>
            </div>
            <ul className="pf-resume-bullets">
              <li>Led digital design and brand strategy for public and private sector clients, including large-scale work for the State of Vermont.</li>
              <li>Delivered full-cycle creative solutions—from discovery and ideation through interface design and development—across web, identity, and print.</li>
              <li>Designed and coded responsive websites, HTML5 campaigns, and content management system templates to support agency clients across multiple industries.</li>
              <li>Balanced creative direction with hands-on execution in a high-velocity agency environment.</li>
            </ul>
          </div>
        </div>

        <Grid columns={{ xs: 1, md: 3 }} gap="lg" className="pf-resume-lower">
          <div className="pf-resume-section">
            <Heading as="h2" size="lg" className="pf-resume-section-heading">Education</Heading>
            <div className="pf-resume-edu">
              <Paragraph size="md"><strong>University of Otago, New Zealand</strong></Paragraph>
              <Paragraph size="sm" color="muted">Bachelor of Arts, Design Studies</Paragraph>
            </div>
            <div className="pf-resume-edu">
              <Paragraph size="md"><strong>Rochester Institute of Technology</strong></Paragraph>
              <Paragraph size="sm" color="muted">Associate of Arts, New Media</Paragraph>
            </div>
          </div>

          <div className="pf-resume-section">
            <Heading as="h2" size="lg" className="pf-resume-section-heading">Core Competencies</Heading>
            <ul className="pf-skill-list">
              {[
                "Design Systems Leadership",
                "UX Strategy & Architecture",
                "Agile & Cross-Functional Collaboration",
                "Component Libraries & Documentation",
                "Accessibility (WCAG, Governance)",
                "Advanced Prototyping",
                "User Research & Data-Driven Design",
                "Front-End Collaboration (HTML/CSS, JS)",
                "Mentorship & Design Reviews",
              ].map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>

          <div className="pf-resume-section">
            <Heading as="h2" size="lg" className="pf-resume-section-heading">Software</Heading>
            <ul className="pf-skill-list">
              {[
                "Figma",
                "Sketch",
                "Storybook",
                "Zeroheight",
                "Miro",
                "Jira, Confluence",
                "SCSS, Pug, jQuery",
                "VSCode",
                "HTML / JS / CSS",
                "Codepen, Stackblitz",
                "Adobe Creative Cloud",
              ].map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </Grid>
      </Section>
    </>
  );
}

function TestimonialsPage() {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge subtle icon="forum">Testimonials</MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            Recommendations and testimonials
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-detail-hero-sub">
            A sampling of recommendations shared by colleagues and collaborators.
            Quotes are pulled from my{" "}
            <a href="https://www.linkedin.com/in/midbrain" target="_blank" rel="noopener noreferrer" className="pf-inverse-link">
              LinkedIn profile
            </a>.
          </Paragraph>
        </div>
      </Section>

      <Section as="div" padding="lg" className="pf-testimonials-page">
        <Grid columns={{ xs: 1, md: 2 }} gap="lg">
          {testimonials.map((item) => (
            <Card key={item.author} as="figure" shadow="xs" className="pf-testimonial-card">
              <Icon name="format_quote" className="pf-testimonial-icon" />
              <blockquote>
                <Paragraph size="lg" className="pf-testimonial-quote">
                  {item.quote}
                </Paragraph>
              </blockquote>
              <figcaption>— {item.author}</figcaption>
            </Card>
          ))}
        </Grid>
      </Section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <Section inverse padding="lg">
        <div className="pf-detail-hero-inner">
          <MessageBadge subtle icon="mail">Contact</MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
            Let's work together
          </Heading>
          <Paragraph size="lg" color="muted" className="pf-detail-hero-sub">
            Open to new opportunities and collaborations. The best way to reach
            me is by email.
          </Paragraph>
        </div>
      </Section>

      <Section as="div" padding="lg" className="pf-contact-page">
        <div className="pf-contact-items">
          <div className="pf-contact-item">
            <Icon name="mail" className="pf-contact-item-icon" />
            <a href="mailto:nathan.dana@gmail.com" className="pf-contact-link">nathan.dana@gmail.com</a>
          </div>
          <div className="pf-contact-item">
            <Icon name="link" className="pf-contact-item-icon" />
            <a href="http://linkedin.com/in/midbrain" target="_blank" rel="noopener noreferrer" className="pf-contact-link">
              linkedin.com/in/midbrain
            </a>
          </div>
          <div className="pf-contact-item">
            <Icon name="location_on" className="pf-contact-item-icon" />
            <span>Fort Mill, SC</span>
          </div>
        </div>
      </Section>
    </>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [activePage, setActivePage] = useState(() => getPageFromLocation());
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    window.history.replaceState({ page: activePage }, "", window.location.href);
    const onPopState = () => {
      setActivePage(getPageFromLocation());
      setNavOpen(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const activeStudy = caseStudies.find((study) => study.id === activePage);
    const titles = {
      home: "Nathan Dana — Principle AI Designer",
      process: "Process — Nathan Dana",
      resume: "Resume — Nathan Dana",
      testimonials: "Testimonials — Nathan Dana",
      contact: "Contact — Nathan Dana",
    };
    document.title = activeStudy ? `${activeStudy.title} — Nathan Dana` : titles[activePage] ?? titles.home;
  }, [activePage]);

  const navigate = (page, event) => {
    if (event) {
      if (!isPlainLeftClick(event)) return;
      event.preventDefault();
    }
    const nextPath = getRoutePath(page);
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextPath !== currentPath) {
      window.history.pushState({ page }, "", nextPath);
    }
    setActivePage(page);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const activeStudy = caseStudies.find((s) => s.id === activePage);

  const sidebar = (
    <SideNav
      open={navOpen}
      onClose={() => setNavOpen(false)}
      header={(collapsed) =>
        !collapsed ? (
          <div className="pf-nav-brand">
            <span className="pf-nav-brand-name">        Nathan <span className="pf-mobile-logo-accent">Dana</span>
</span>
            <span className="pf-nav-brand-title">Lead UX Designer</span>
          </div>
        ) : null
      }
    >
      <SideNavItem
        href={getRoutePath("home")}
        icon="home"
        label="Overview"
        active={activePage === "home"}
        onClick={(event) => navigate("home", event)}
      />
      <SideNavItem
        href={getRoutePath("process")}
        icon="psychology"
        label="Process"
        active={activePage === "process"}
        onClick={(event) => navigate("process", event)}
      />
      <SideNavGroup icon="work" label="Case studies" defaultOpen>
        {caseStudies.map((study) => (
          <SideNavItem
            key={study.id}
            href={getRoutePath(study.id)}
            label={study.title}
            active={activePage === study.id}
            onClick={(event) => navigate(study.id, event)}
          />
        ))}
      </SideNavGroup>
      <SideNavItem
        href={getRoutePath("resume")}
        icon="description"
        label="Resume"
        active={activePage === "resume"}
        onClick={(event) => navigate("resume", event)}
      />
      <SideNavItem
        href={getRoutePath("testimonials")}
        icon="forum"
        label="Testimonials"
        active={activePage === "testimonials"}
        onClick={(event) => navigate("testimonials", event)}
      />
      <SideNavItem
        href={getRoutePath("contact")}
        icon="mail"
        label="Contact"
        active={activePage === "contact"}
        onClick={(event) => navigate("contact", event)}
      />
    </SideNav>
  );

  const mobileHeader = (
    <div className="pf-mobile-header">
      <Link
        href={getRoutePath("home")}
        className="pf-mobile-logo"
        onClick={(event) => navigate("home", event)}
      >
        Nathan <span className="pf-mobile-logo-accent">Dana</span>
      </Link>
      <IconButton
        icon="menu"
        label="Open navigation"
        onClick={() => setNavOpen(true)}
      />
    </div>
  );

  return (
    <LabelsProvider locale="en" labels={actionLabels}>
      <PageLayout stickyHeader sidebar={sidebar} header={mobileHeader}>
        {activePage === "home" && <HomePage navigate={navigate} />}
        {activePage === "process" && <ProcessPage navigate={navigate} />}
        {activeStudy && <CaseStudyPage study={activeStudy} navigate={navigate} />}
        {activePage === "resume" && <ResumePage navigate={navigate} />}
        {activePage === "testimonials" && <TestimonialsPage />}
        {activePage === "contact" && <ContactPage />}
      </PageLayout>
    </LabelsProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
