import { useState } from "react";
import {
  Accordion,
  Banner,
  Breadcrumb,
  Button,
  Card,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanel,
} from "../../../../packages/react/src/index.js";
import { getRelatedVehicles, getVehicleById } from "../data/vehicles.js";
import { getRoutePath } from "../lib/routing.js";

export function DetailsPage({ navigate, route }) {
  const [activeTab, setActiveTab] = useState("wheels");
  const vehicle = getVehicleById(route.car);

  if (!vehicle) {
    return (
      <Section contentWidth="lg" padding="lg" gap="lg">
        <Banner status="warning" title="Vehicle not found">
          We couldn't find a vehicle with ID “{route.car}”. Try searching the registry instead.
        </Banner>
        <Button icon="search" onClick={(event) => navigate("search", event)}>
          Search vehicles
        </Button>
      </Section>
    );
  }

  const related = getRelatedVehicles(vehicle);
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`;

  return (
    <>
      <Section contentWidth="xl" padding="lg" gap="lg" className="ad-detail-hero">
        <Breadcrumb
          items={[
            { label: "Home", href: getRoutePath("home"), onClick: (e) => navigate("home", e) },
            { label: "Search", href: getRoutePath("search"), onClick: (e) => navigate("search", e) },
            { label: title },
          ]}
        />

        <Stack direction={{ xs: "column", lg: "row" }} gap="xl" align="start">
          <div className="ad-detail-visual" style={{ "--car-color": getCarColor(vehicle.id) }}>
            <div className="ad-detail-visual-inner">
              <MessageBadge icon="verified">{vehicle.identifiers.marketCode}</MessageBadge>
              <Heading as="p" type="display" size="xl" className="ad-detail-year">
                {vehicle.year}
              </Heading>
              <Paragraph size="lg" className="ad-detail-make">
                {vehicle.make}
              </Paragraph>
            </div>
          </div>

          <Stack gap="md" className="ad-detail-intro">
            <MessageBadge icon="directions_car">
              {vehicle.bodyStyle} · {vehicle.layout}
            </MessageBadge>
            <Heading as="h1" size={{ xs: "xl", md: "xxl" }}>
              {vehicle.model}{" "}
              <span className="ad-accent">{vehicle.trim}</span>
            </Heading>
            <Paragraph size="lg">{vehicle.tagline}</Paragraph>
            <Paragraph color="muted">{vehicle.summary}</Paragraph>

            <div className="ad-spec-chips ad-spec-chips--hero">
              <SpecChip label="Bolt pattern" value={vehicle.wheels.boltPattern} />
              <SpecChip label="Hub bore" value={vehicle.wheels.hubBore} />
              <SpecChip label="Lug thread" value={vehicle.wheels.lugThread} />
              <SpecChip label="Power" value={vehicle.engine.power.split("@")[0].trim()} />
              <SpecChip label="0–60" value={vehicle.performance.zeroToSixty} />
              <SpecChip label="Weight" value={vehicle.dimensions.curbWeight} />
            </div>
          </Stack>
        </Stack>
      </Section>

      <Section contentWidth="xl" padding="lg" gap="lg">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList aria-label="Specification categories">
            <Tab value="wheels">Wheels & tires</Tab>
            <Tab value="engine">Engine</Tab>
            <Tab value="drivetrain">Drivetrain</Tab>
            <Tab value="dimensions">Dimensions</Tab>
            <Tab value="chassis">Chassis</Tab>
            <Tab value="performance">Performance</Tab>
            <Tab value="production">Production</Tab>
          </TabList>

          <TabPanel value="wheels">
            <SpecSection title="Wheel & tire specifications" highlight>
              <SpecGrid specs={[
                ["Bolt pattern", vehicle.wheels.boltPattern],
                ["Lug thread", vehicle.wheels.lugThread],
                ["Lug torque", vehicle.wheels.lugTorque],
                ["Hub bore", vehicle.wheels.hubBore],
                ["Center bore", vehicle.wheels.centerBore],
                ["Offset", vehicle.wheels.offset],
                ["Front tire", vehicle.wheels.frontSize],
                ["Rear tire", vehicle.wheels.rearSize],
                ["Wheel size", vehicle.wheels.wheelSize],
                ["Spare", vehicle.wheels.spare],
                ["Hub type", vehicle.wheels.hubType],
              ]} />
              {vehicle.wheels.notes && (
                <Card surface="panel" className="ad-notes-card">
                  <Stack gap="xs">
                    <Heading as="h3" size="sm">Notes</Heading>
                    <Paragraph size="sm">{vehicle.wheels.notes}</Paragraph>
                  </Stack>
                </Card>
              )}
            </SpecSection>
          </TabPanel>

          <TabPanel value="engine">
            <SpecSection title="Engine specifications">
              <SpecGrid specs={Object.entries(vehicle.engine).map(([key, value]) => [
                formatLabel(key),
                value,
              ])} />
            </SpecSection>
          </TabPanel>

          <TabPanel value="drivetrain">
            <SpecSection title="Transmission & drivetrain">
              <SpecGrid specs={Object.entries(vehicle.transmission).map(([key, value]) => [
                formatLabel(key),
                value,
              ])} />
              <SpecGrid specs={[
                ["Layout", vehicle.layout],
                ["Doors", String(vehicle.doors)],
                ["Seats", String(vehicle.seats)],
              ]} />
            </SpecSection>
          </TabPanel>

          <TabPanel value="dimensions">
            <SpecSection title="Dimensions & weight">
              <SpecGrid specs={Object.entries(vehicle.dimensions).map(([key, value]) => [
                formatLabel(key),
                value,
              ])} />
            </SpecSection>
          </TabPanel>

          <TabPanel value="chassis">
            <SpecSection title="Chassis & brakes">
              <SpecGrid specs={[
                ["Structure", vehicle.chassis.structure],
                ["Front suspension", vehicle.chassis.frontSuspension],
                ["Rear suspension", vehicle.chassis.rearSuspension],
                ["Steering", vehicle.chassis.steering],
                ["Front brakes", vehicle.chassis.brakes.front],
                ["Rear brakes", vehicle.chassis.brakes.rear],
                ["ABS", vehicle.chassis.brakes.abs],
                ["Master cylinder", vehicle.chassis.brakes.masterCylinder],
              ]} />
            </SpecSection>
          </TabPanel>

          <TabPanel value="performance">
            <SpecSection title="Performance & economy">
              <SpecGrid specs={Object.entries(vehicle.performance).map(([key, value]) => [
                formatLabel(key),
                value,
              ])} />
            </SpecSection>
          </TabPanel>

          <TabPanel value="production">
            <SpecSection title="Production & identifiers">
              <SpecGrid specs={[
                ...Object.entries(vehicle.production).map(([key, value]) => [formatLabel(key), value]),
                ...Object.entries(vehicle.identifiers).map(([key, value]) => [formatLabel(key), value]),
              ]} />
            </SpecSection>
          </TabPanel>
        </Tabs>
      </Section>

      <Section contentWidth="xl" padding="lg" gap="lg">
        <Grid columns={{ xs: 1, md: 2 }} gap="lg">
          <Card surface="panel">
            <Stack gap="md">
              <Heading as="h2" size="md">Factory colors</Heading>
              <ul className="ad-color-list">
                {vehicle.colors.map((color) => (
                  <li key={color.name}>
                    <span className="ad-color-name">{color.name}</span>
                    <span className="ad-color-meta">{color.type}{color.code !== "N/A" ? ` · ${color.code}` : ""}</span>
                  </li>
                ))}
              </ul>
            </Stack>
          </Card>

          <Card surface="panel">
            <Stack gap="md">
              <Heading as="h2" size="md">Highlights</Heading>
              <ul className="ad-highlight-list">
                {vehicle.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Stack>
          </Card>
        </Grid>

        <Accordion label="Factory options">
          <ul className="ad-options-list">
            {vehicle.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        </Accordion>
      </Section>

      {related.length > 0 && (
        <Section surface="panel" contentWidth="xl" padding="lg" gap="lg">
          <Heading as="h2" size="lg">Related vehicles</Heading>
          <Grid columns={{ xs: 1, md: 3 }} gap="md">
            {related.map((rel) => (
              <Card
                key={rel.id}
                surface="panel"
                className="ad-related-card"
                onClick={(event) => navigate("details", event, { car: rel.id })}
                role="link"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate("details", null, { car: rel.id });
                  }
                }}
              >
                <Stack gap="xs">
                  <Paragraph size="sm" color="muted">{rel.year} · {rel.make}</Paragraph>
                  <Heading as="h3" size="sm">{rel.model} {rel.trim}</Heading>
                  <Paragraph size="sm">{rel.wheels.boltPattern} · {rel.engine.power.split("@")[0].trim()}</Paragraph>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Section>
      )}

      <Section contentWidth="xl" padding="md" gap="md">
        <Stack direction="row" gap="md">
          <Button
            variant="secondary"
            icon="arrow_back"
            onClick={(event) => navigate("search", event, { query: vehicle.make })}
          >
            More {vehicle.make}
          </Button>
          <Button
            variant="tertiary"
            onClick={(event) =>
              navigate("search", event, { query: vehicle.wheels.boltPattern })
            }
          >
            Search {vehicle.wheels.boltPattern}
          </Button>
        </Stack>
      </Section>
    </>
  );
}

function SpecSection({ title, highlight, children }) {
  return (
    <Stack gap="md" className={highlight ? "ad-spec-section--highlight" : ""}>
      <Heading as="h2" size="md">{title}</Heading>
      {children}
    </Stack>
  );
}

function SpecGrid({ specs }) {
  return (
    <div className="ad-spec-grid">
      {specs.map(([label, value]) => (
        <div key={label} className="ad-spec-row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </div>
  );
}

function SpecChip({ label, value }) {
  return (
    <span className="ad-spec-chip ad-spec-chip--hero">
      <span className="ad-spec-chip-label">{label}</span>
      <span className="ad-spec-chip-value">{value}</span>
    </span>
  );
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase());
}

function getCarColor(id) {
  const colors = {
    "1990-mazda-miata-se": "#1b4332",
    "1964-ford-mustang-289": "#6a040f",
    "1973-porsche-911-carrera-rs": "#ffffff",
    "1989-toyota-supra-turbo": "#03045e",
    "1995-bmw-m3-e36": "#023e8a",
    "1992-honda-nsx": "#d00000",
    "1967-chevrolet-corvette-427": "#370617",
    "2005-ford-gt": "#ffffff",
    "2016-mazda-miata-club": "#ae2012",
    "2020-tesla-model-3-performance": "#343a40",
    "2019-porsche-911-gt3-rs": "#52b788",
    "2017-honda-civic-type-r": "#ffffff",
    "1983-mercedes-benz-240d": "#495057",
    "2001-subaru-impreza-wrx-sti": "#023047",
    "1957-chevrolet-bel-air": "#0077b6",
  };
  return colors[id] ?? "#343a40";
}
