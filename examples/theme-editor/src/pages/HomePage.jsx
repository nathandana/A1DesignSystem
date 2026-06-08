import React from "react";
import {
  Button,
  Heading,
  Paragraph,
  Section,
} from "../../../../packages/react/src/index.js";
import { AppHeader } from "../components/AppHeader.jsx";

export function HomePage({ onNavigate }) {
  return (
    <div className="theme-home">
      <AppHeader page="home" onNavigate={onNavigate} />

      <main>
        <section className="theme-home__hero">
          <div className="theme-home__hero-content">
            <Heading as="h1" size="xl">Build your theme.</Heading>
            <Paragraph size="lg" color="muted">
              Pick a color for each palette ramp and the full scale generates automatically —
              every component in the design system updates live.
            </Paragraph>
            <Button
              size="lg"
              icon="arrow_forward"
              iconPosition="end"
              onClick={(e) => onNavigate("editor", e)}
              as="a"
              href="?page=editor"
            >
              Open editor
            </Button>
          </div>

          <div className="theme-home__hero-swatches" aria-hidden="true">
            {[
              ["#7c3aed", "#5916b5", "#3d0082"],
              ["#2563eb", "#0b3fb2", "#002582"],
              ["#16a34a", "#005e26", "#003f17"],
              ["#d97706", "#743d00", "#4f2700"],
              ["#dc2626", "#94000b", "#660005"],
              ["#64748b", "#414e61", "#293343"],
            ].map((row, ri) => (
              <div key={ri} className="theme-home__swatch-row">
                {row.map((hex, i) => (
                  <div
                    key={i}
                    className="theme-home__swatch"
                    style={{ background: hex }}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="theme-home__steps">
          <div className="theme-home__steps-inner">
            <div className="theme-home__step">
              <div className="theme-home__step-number">1</div>
              <Heading as="h3" size="sm">Pick a -500 color</Heading>
              <Paragraph size="sm" color="muted">
                Choose one mid-range value for each of the six palette ramps — neutral,
                accent, info, error, warning, and success.
              </Paragraph>
            </div>
            <div className="theme-home__step">
              <div className="theme-home__step-number">2</div>
              <Heading as="h3" size="sm">Ramps generate automatically</Heading>
              <Paragraph size="sm" color="muted">
                The full 12-stop scale (0 → 1000) is derived in perceptual OKLCH color space,
                keeping hue consistent from near-white to near-black.
              </Paragraph>
            </div>
            <div className="theme-home__step">
              <div className="theme-home__step-number">3</div>
              <Heading as="h3" size="sm">Preview live, then export</Heading>
              <Paragraph size="sm" color="muted">
                Every design system component updates instantly. When you're happy,
                copy the CSS custom property overrides to use in your project.
              </Paragraph>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
