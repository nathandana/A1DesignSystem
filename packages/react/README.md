# @a1-design-system/react

React components for the A1 token-driven design system.

## Install

```sh
npm install @a1-design-system/react
```

## Usage

Import the global theme CSS once in your app, then import components from the
package.

```jsx
import "@a1-design-system/react/themes.css";
import "@a1-design-system/react/color-scheme.css";
import { Button, Card, Heading, Paragraph } from "@a1-design-system/react";

export function Example() {
  return (
    <Card>
      <Heading as="h2">A1 Design</Heading>
      <Paragraph>A token-driven, component-first design system.</Paragraph>
      <Button>Get started</Button>
    </Card>
  );
}
```

Component styles are imported by each component module.
