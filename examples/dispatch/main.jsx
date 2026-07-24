import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  ButtonContainer,
  Heading,
  Link,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from "../../packages/react/src/index.js";

// The Dispatch theme is applied by adding the class to <html>. Every A1 component
// re-themes from the token layer — no per-component styling here.
function App() {
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add("a1-theme-dispatch");
    return () => el.classList.remove("a1-theme-dispatch");
  }, []);

  return (
    <Section surface="page" contentWidth="sm" padding="lg">
      <Stack direction="column" gap="lg">
        <Heading as="h1" type="display" size="xxl">
          Nathan Dana
        </Heading>

        <Stack direction="row" gap="sm">
          <MessageBadge subtle icon={null}>Badge example</MessageBadge>
          <MessageBadge status="warn" icon={null}>Important badge example</MessageBadge>
        </Stack>

        <Stack direction="column" gap="sm">
          <Heading as="h2" size="lg">
            Heading
          </Heading>
          <Paragraph>
            Everyone has the right to freedom of thought, conscience and religion; this right
            includes freedom to change his religion or belief, and freedom, either alone or in
            community with others and in public or private, to manifest his religion or belief in
            teaching, practice, worship and observance.
          </Paragraph>
          <Paragraph>
            No one shall be subjected to arbitrary interference with his privacy, family,{" "}
            <Link href="#">home or correspondence</Link>, nor to attacks upon his honour and
            reputation. Everyone has the right to the protection of the law against such
            interference or attacks.
          </Paragraph>
        </Stack>

        <ButtonContainer align="start">
          <Button variant="primary">Primary button</Button>
          <Button variant="secondary">Secondary button</Button>
        </ButtonContainer>
      </Stack>
    </Section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
