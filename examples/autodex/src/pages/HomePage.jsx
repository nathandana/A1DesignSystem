import {
  Button,
  ButtonContainer,
  Card,
  Grid,
  Heading,
  Link,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from "../../../../packages/react/src/index.js";
import { eras, getFeaturedVehicles, getVehiclesByEra, registryStats } from "../data/vehicles.js";
import { popularSearches } from "../lib/search.js";
import { getRoutePath } from "../lib/routing.js";

export function HomePage({ navigate }) {
  const featured = getFeaturedVehicles();

  return (
    <>
      <Section inverse padding="lg" gap="lg" contentWidth="xl" className="ad-hero">
        <Stack gap="md">
          <MessageBadge size="lg" status="info" icon="garage">
            {registryStats.totalVehicles.toLocaleString()} vehicles · {registryStats.totalMakes} makes · {registryStats.yearRange}
          </MessageBadge>
          <Heading as="h1" type="display" size={{ xs: "xl", md: "xxl", lg: "jumbo" }} className="ad-hero-title">
            Every car. Every spec.{" "}
            <span className="ad-accent">Down to the bolt.</span>
          </Heading>
          <Paragraph size="lg" className="ad-hero-lead">
            AutoDex is the definitive vehicle registry — factory specs, bolt patterns, lug torque,
            hub bore, engine codes, production numbers, and the kind of detail you need when
            you're sourcing wheels for a 1990 Miata SE at midnight.
          </Paragraph>
          <ButtonContainer size="lg">
            <Button
              icon="search"
              onClick={(event) => navigate("search", event, { query: "miata bolt pattern" })}
            >
              Search the registry
            </Button>
            <Button
              variant="secondary"
              icon="arrow_right"
              iconPosition="end"
              onClick={(event) =>
                navigate("details", event, { car: "1990-mazda-miata-se" })
              }
            >
              1990 Miata SE
            </Button>
          </ButtonContainer>
        </Stack>

        <Grid columns={{ xs: 2, md: 4 }} gap="md" className="ad-stat-grid">
          {[
            { value: registryStats.totalVehicles, label: "Vehicles catalogued" },
            { value: registryStats.specFields, label: "Spec fields per vehicle" },
            { value: registryStats.totalMakes, label: "Manufacturers" },
            { value: registryStats.yearRange, label: "Year span" },
          ].map((stat) => (
            <Card key={stat.label} surface="panel" className="ad-stat-card">
              <Stack gap="xs">
                <Heading as="p" size="xl" className="ad-stat-value">
                  {stat.value}
                </Heading>
                <Paragraph size="sm" color="muted">
                  {stat.label}
                </Paragraph>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section contentWidth="xl" padding="lg" gap="lg">
        <Stack gap="sm">
          <Heading as="h2" size={{ xs: "lg", md: "xl" }}>
            Featured vehicles
          </Heading>
          <Paragraph color="muted">
            Hand-picked entries showcasing the depth of AutoDex data.
          </Paragraph>
        </Stack>
        <Grid columns={{ xs: 1, md: 2 }} gap="lg">
          {featured.map((vehicle) => (
            <Card
              key={vehicle.id}
              surface="panel"
              className="ad-feature-card"
              onClick={(event) => navigate("details", event, { car: vehicle.id })}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate("details", null, { car: vehicle.id });
                }
              }}
            >
              <Stack gap="md">
                <div
                  className="ad-feature-swatch"
                  style={{ "--car-color": getCarColor(vehicle.id) }}
                  aria-hidden="true"
                />
                <Stack gap="xs">
                  <MessageBadge icon="directions_car">
                    {vehicle.year} · {vehicle.make}
                  </MessageBadge>
                  <Heading as="h3" size="lg">
                    {vehicle.model} {vehicle.trim}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {vehicle.tagline}
                  </Paragraph>
                </Stack>
                <div className="ad-spec-chips">
                  <SpecChip label="Bolt" value={vehicle.wheels.boltPattern} />
                  <SpecChip label="Power" value={vehicle.engine.power.split("@")[0].trim()} />
                  <SpecChip label="Weight" value={vehicle.dimensions.curbWeight} />
                </div>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section surface="panel" contentWidth="xl" padding="lg" gap="lg">
        <Stack gap="sm">
          <Heading as="h2" size={{ xs: "lg", md: "xl" }}>
            Browse by era
          </Heading>
          <Paragraph color="muted">
            From tail-fin classics to dual-motor EVs.
          </Paragraph>
        </Stack>
        <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
          {eras.map((era) => {
            const count = getVehiclesByEra(era.id).length;
            return (
              <Card
                key={era.id}
                surface="panel"
                className="ad-era-card"
                onClick={(event) => navigate("search", event, { era: era.id })}
                role="link"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate("search", null, { era: era.id });
                  }
                }}
              >
                <Stack gap="xs">
                  <Heading as="h3" size="md">
                    {era.label}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {era.range}
                  </Paragraph>
                  <Paragraph size="sm">
                    {count} {count === 1 ? "vehicle" : "vehicles"}
                  </Paragraph>
                </Stack>
              </Card>
            );
          })}
        </Grid>
      </Section>

      <Section contentWidth="xl" padding="lg" gap="md">
        <Heading as="h2" size="lg">
          Popular searches
        </Heading>
        <div className="ad-tag-cloud">
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={getRoutePath("search", { query: term })}
              className="ad-tag"
              onClick={(event) => navigate("search", event, { query: term })}
            >
              {term}
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

function SpecChip({ label, value }) {
  return (
    <span className="ad-spec-chip">
      <span className="ad-spec-chip-label">{label}</span>
      <span className="ad-spec-chip-value">{value}</span>
    </span>
  );
}

function getCarColor(id) {
  const colors = {
    "1990-mazda-miata-se": "#1b4332",
    "1973-porsche-911-carrera-rs": "#c1121c",
    "2020-tesla-model-3-performance": "#343a40",
    "2019-porsche-911-gt3-rs": "#52b788",
  };
  return colors[id] ?? "#495057";
}
