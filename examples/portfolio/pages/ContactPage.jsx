import {
  Divider,
  Heading,
  Link,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
} from "../../../packages/react/src/index.js";

export function ContactPage() {
  return (
    <>
      <Section inverse padding="lg" gap="md" contentWidth="lg" height="screen">
        <MessageBadge size="lg" icon="mail">Get in touch</MessageBadge>
        <Heading as="h1" type="display" size={{ xs: "xl", md: "jumbo" }}>
          Contact me
        </Heading>
        <Paragraph size="lg" color="muted">
          Open to new opportunities and collaborations. The best way to reach
          me is by email.
        </Paragraph>
        <Divider space="xl" size="md" variant="accent" />
        <List variant="icon" size="xl">
          <ListItem icon="mail">
            <Link href="mailto:nathan.dana@gmail.com">nathan.dana@gmail.com</Link>
          </ListItem>
          <ListItem icon="link">
            <Link href="http://linkedin.com/in/midbrain" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/midbrain
            </Link>
          </ListItem>
          <ListItem icon="phone">
            <Link href="tel:+18028467679">802-846-7679</Link>
          </ListItem>
          <ListItem icon="location_on">
            Fort Mill, SC
          </ListItem>
        </List>
      </Section>

    </>
  );
}
