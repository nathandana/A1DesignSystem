import { focusAttributes } from "../utils/focus.js";
import {
  Cluster,
  Stack,
  Divider,
  Grid,
  Heading,
  Link,
  List,
  ListItem,
  Paragraph,
  Section,
} from "../../../packages/react/src/index.js";
import { getRoutePath } from "../utils/routing.js";
import { resumeVersions } from "../data/resumeVersions.js";

export function ResumePage({ audience = "general" }) {
  const version = audience === "ux" ? "ux" : "systems";
  const resume = resumeVersions[version];
  const website = version === "ux" ? "nathan.a1design.app" : "nathandana.a1design.app";

  return (
    <>
      <Section padding="md" gap="xs" surface="raised" contentWidth="md">
        <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo" }}>
          Nathan Dana
        </Heading>
        <Heading as="h2" size={{ xs: "sm", md: "lg" }}>
          {version === "ux" ? "Senior UX Designer" : "Design Systems Leader"}
        </Heading>
        <Stack direction={{ xs: "column", sm: "row" }} wrap gap="xs" align="start" justify="start">
          <Paragraph>Fort Mill, SC</Paragraph>
          <Divider orientation={{ xs: "horizontal", sm: "vertical" }} decorative size="sm" />
          <Link href="mailto:nathan.dana@gmail.com">nathan.dana@gmail.com</Link>
          <Divider orientation={{ xs: "horizontal", sm: "vertical" }} decorative size="sm" />
          <Link href="http://linkedin.com/in/midbrain" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/midbrain
          </Link>
          <Divider orientation={{ xs: "horizontal", sm: "vertical" }} decorative size="sm" />
          <Link href={`https://${website}`} target="_blank" rel="noopener noreferrer">
            {website}
          </Link>
        </Stack>
      </Section>

      <Section padding="md" gap="md" surface="panel" contentWidth="md" {...focusAttributes(resume)}>
        <Heading as="h2" size={{ xs: "lg", md: "xxl" }}>
          Professional summary
        </Heading>
        <Paragraph size={{ xs: "md", md: "lg" }}>{resume.summary}</Paragraph>
      </Section>
      {[
        { title: "Professional experience", jobs: resume.experience, surface: "page" },
        { title: "Independent work", jobs: resume.independentWork, surface: "panel" },
      ].map((group) => (
        <Section key={group.title} padding="md" gap="lg" contentWidth="md" surface={group.surface}>
          <Heading as="h2" size={{ xs: "lg", md: "xxl" }}>
            {group.title}
          </Heading>
          {group.jobs.map((job, index) => (
            <Stack key={job.company} gap="sm" {...focusAttributes(job, resume.focus)}>
              {index > 0 && <Divider decorative size="md" space="md" variant="accent" />}
              <Heading as="h3" size={{ xs: "md", md: "xl" }}>
                {job.role}
              </Heading>
              <Heading size="sm" as="h4" color="muted">
                {[job.dates, job.company, job.location].filter(Boolean).join(" • ")}
              </Heading>
              <List size={{ xs: "md", md: "lg" }}>
                {job.bullets.map((bullet) => (
                  <ListItem key={bullet}>{bullet}</ListItem>
                ))}
              </List>
              {job.links.length > 0 && (
                <Cluster gap="md">
                  {job.links.map((link) => (
                    <Link key={link.page} href={getRoutePath(link.page)}>
                      {link.label}
                    </Link>
                  ))}
                </Cluster>
              )}
            </Stack>
          ))}
        </Section>
      ))}
      <Section as="div" padding="md" gap="md" surface="raised" contentWidth="md">
        <Heading as="h2" size="xxl" margin="md">
          Education
        </Heading>

        <div>
          <Heading as="h3" size="md" margin="sm">
            University of Otago, New Zealand
          </Heading>
          <Paragraph size="md">Bachelor of Arts, Design Studies</Paragraph>
        </div>

        <Divider decorative orientation="horizontal" size="xs" space="sm" variant="strong" />

        <div>
          <Heading as="h3" size="md" margin="sm">
            Rochester Institute of Technology
          </Heading>
          <Paragraph size="md">Associate of Arts, New Media</Paragraph>
        </div>
      </Section>

      <Section surface="panel" padding="md" gap="lg" contentWidth="xl" inverse>
        <Heading as="h2" size={{ xs: "lg", md: "xxl" }}>
          Skills
        </Heading>
        <Grid columns={{ xs: 1, md: 2, xl: 3 }} gap="xl">
          {resume.skills.map((skill) => (
            <Stack key={skill.label} gap="sm" {...focusAttributes(skill, resume.focus)}>
              <Heading as="h3" size="md">
                {skill.label}
              </Heading>
              <List variant="unordered" size="md">
                {skill.items.map((item) => (
                  <ListItem key={item}>{item}</ListItem>
                ))}
              </List>
            </Stack>
          ))}
        </Grid>
      </Section>
    </>
  );
}
