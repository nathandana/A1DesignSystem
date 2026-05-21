import React from "react";
import { createRoot } from "react-dom/client";
import { Button } from "../../packages/react/src/index.js";

const sourceFiles = [
  "../../system/tokens/color-ramp.json",
  "../../system/tokens/typography.json",
  "../../system/tokens/component-button.json"
];

function pickRelatedJson(file, tokens) {
  if (file.includes("component-button")) {
    return {
      source: file,
      base: {
        radius: tokens.base?.radius,
        space: {
          button: tokens.base?.space?.button
        }
      },
      semantic: {
        radius: tokens.semantic?.radius
      },
      component: {
        button: tokens.component?.button
      },
      theme: {
        a1Light: {
          button: tokens.theme?.a1Light?.button
        }
      }
    };
  }

  if (file.includes("typography")) {
    return {
      source: file,
      semantic: {
        font: {
          size: {
            body: tokens.semantic?.font?.size?.body
          },
          weight: tokens.semantic?.font?.weight,
          lineHeight: tokens.semantic?.font?.lineHeight
        }
      },
      component: {
        button: {
          font: tokens.component?.button?.font
        }
      },
      theme: {
        a1Light: {
          font: {
            family: tokens.theme?.a1Light?.font?.family
          }
        }
      }
    };
  }

  return {
    source: file,
    semantic: {
      color: {
        action: tokens.semantic?.color?.action
      }
    },
    component: {
      button: tokens.component?.button
    },
    brand: {
      a1: {
        button: tokens.brand?.a1?.button
      }
    },
    theme: {
      a1Light: {
        button: tokens.theme?.a1Light?.button
      }
    }
  };
}

function ButtonJsonReference() {
  const [sections, setSections] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    Promise.all(
      sourceFiles.map(async file => {
        const response = await fetch(file);

        if (!response.ok) {
          throw new Error(`Could not load ${file}`);
        }

        return pickRelatedJson(file, await response.json());
      })
    )
      .then(setSections)
      .catch(error => setError(error.message));
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <article className="section">
      <div className="section-heading">
        <h2>Related JSON</h2>
        <span className="path">base {"->"} semantic {"->"} component {"->"} brand {"->"} theme</span>
      </div>
      <div className="json-grid">
        {sections.map(section => (
          <section className="json-panel" key={section.source}>
            <h3>{section.source.replace("../../system/tokens/", "")}</h3>
            <pre>
              <code>{JSON.stringify(section, null, 2)}</code>
            </pre>
          </section>
        ))}
      </div>
    </article>
  );
}

function ButtonDemo() {
  return (
    <section className="stack">
      <article className="section">
        <div className="section-heading">
          <h2>Variants</h2>
          <span className="path">component.button</span>
        </div>
        <div className="button-preview">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
        </div>
      </article>

      <article className="section">
        <div className="section-heading">
          <h2>States</h2>
          <span className="path">hover / active / disabled</span>
        </div>
        <div className="button-preview">
          <Button state="default" variant="primary">Primary</Button>
          <Button state="hover" variant="primary">Primary Hover</Button>
          <Button state="active" variant="primary">Primary Active</Button>
          <Button state="default" variant="secondary">Secondary</Button>
          <Button state="hover" variant="secondary">Secondary Hover</Button>
          <Button state="active" variant="secondary">Secondary Active</Button>
          <Button state="default" variant="tertiary">Tertiary</Button>
          <Button state="hover" variant="tertiary">Tertiary Hover</Button>
          <Button state="active" variant="tertiary">Tertiary Active</Button>
          <Button disabled>Disabled</Button>
        </div>
      </article>

      <ButtonJsonReference />
    </section>
  );
}

createRoot(document.querySelector("#root")).render(<ButtonDemo />);
