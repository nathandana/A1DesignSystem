import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Grid,
  Heading,
  Link,
  MessageBadge,
  Paragraph,
  Section,
  SelectField,
  Stack,
  TextField,
} from "../../../../packages/react/src/index.js";
import { eras, makes, vehicles } from "../data/vehicles.js";
import { getRoutePath } from "../lib/routing.js";
import { searchVehicles } from "../lib/search.js";

export function SearchPage({ navigate, route }) {
  const [query, setQuery] = useState(route.query);
  const [makeFilter, setMakeFilter] = useState(route.make);
  const [eraFilter, setEraFilter] = useState(route.era);

  useEffect(() => {
    setQuery(route.query);
    setMakeFilter(route.make);
    setEraFilter(route.era);
  }, [route.query, route.make, route.era]);

  const results = useMemo(
    () => searchVehicles(query, { make: makeFilter, era: eraFilter }),
    [query, makeFilter, eraFilter]
  );

  const applyFilters = (next = {}) => {
    navigate("search", null, {
      query: next.query ?? query,
      make: next.make ?? makeFilter,
      era: next.era ?? eraFilter,
    });
  };

  return (
    <Section contentWidth="xl" padding="lg" gap="lg">
      <Stack gap="md">
        <MessageBadge icon="search">Vehicle search</MessageBadge>
        <Heading as="h1" size={{ xs: "xl", md: "xxl" }}>
          Search the registry
        </Heading>
        <Paragraph color="muted">
          Search by year, make, model, engine code, bolt pattern, hub bore, or any factory spec.
          Try <strong>4×100</strong>, <strong>Miata SE</strong>, or <strong>GT3 RS</strong>.
        </Paragraph>
      </Stack>

      <Card surface="panel" className="ad-search-panel">
        <Stack gap="lg">
          <form
            className="ad-search-form"
            onSubmit={(event) => {
              event.preventDefault();
              applyFilters();
            }}
          >
            <TextField
              label="Search query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. 1990 Miata bolt pattern, 5×114.3, Porsche Carrera…"
              className="ad-search-input"
            />
            <Button type="submit" icon="search">
              Search
            </Button>
          </form>

          <Grid columns={{ xs: 1, md: 2 }} gap="md">
            <SelectField
              label="Manufacturer"
              value={makeFilter}
              onChange={(event) => {
                const value = event.target.value;
                setMakeFilter(value);
                applyFilters({ make: value });
              }}
            >
              <option value="">All manufacturers</option>
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Era"
              value={eraFilter}
              onChange={(event) => {
                const value = event.target.value;
                setEraFilter(value);
                applyFilters({ era: value });
              }}
            >
              <option value="">All eras</option>
              {eras.map((era) => (
                <option key={era.id} value={era.id}>
                  {era.label} ({era.range})
                </option>
              ))}
            </SelectField>
          </Grid>
        </Stack>
      </Card>

      <Stack gap="md">
        <Paragraph size="sm" color="muted">
          {results.length} {results.length === 1 ? "result" : "results"}
          {query ? ` for “${query}”` : ""}
          {makeFilter ? ` · ${makeFilter}` : ""}
          {eraFilter ? ` · ${eras.find((e) => e.id === eraFilter)?.label}` : ""}
        </Paragraph>

        {results.length === 0 ? (
          <Card surface="panel" className="ad-empty-state">
            <Stack gap="sm">
              <Heading as="h2" size="md">
                No vehicles found
              </Heading>
              <Paragraph color="muted">
                Try a broader search — bolt patterns like <strong>4×100</strong> or{" "}
                <strong>5×114.3</strong> work across many vehicles.
              </Paragraph>
              <Button variant="secondary" onClick={() => applyFilters({ query: "", make: "", era: "" })}>
                Clear filters
              </Button>
            </Stack>
          </Card>
        ) : (
          <div className="ad-results-list">
            {results.map((vehicle) => (
              <Card
                key={vehicle.id}
                surface="panel"
                className="ad-result-card"
              >
                <Stack direction={{ xs: "column", md: "row" }} gap="lg" align={{ md: "center" }} justify="space-between">
                  <Stack gap="xs" className="ad-result-main">
                    <MessageBadge icon="directions_car">
                      {vehicle.year} · {vehicle.make}
                    </MessageBadge>
                    <Link
                      href={getRoutePath("details", { car: vehicle.id })}
                      onClick={(event) => navigate("details", event, { car: vehicle.id })}
                    >
                      <Heading as="h2" size="lg">
                        {vehicle.model} {vehicle.trim}
                      </Heading>
                    </Link>
                    <Paragraph size="sm" color="muted">
                      {vehicle.tagline}
                    </Paragraph>
                    <div className="ad-spec-chips">
                      <SpecChip label="Bolt" value={vehicle.wheels.boltPattern} highlight={query.toLowerCase().includes("bolt") || query.includes("×")} />
                      <SpecChip label="Hub" value={vehicle.wheels.hubBore} />
                      <SpecChip label="Lug" value={vehicle.wheels.lugThread} />
                      <SpecChip label="Engine" value={vehicle.engine.designation} />
                    </div>
                  </Stack>
                  <Button
                    variant="secondary"
                    icon="arrow_right"
                    iconPosition="end"
                    onClick={(event) => navigate("details", event, { car: vehicle.id })}
                  >
                    Full specs
                  </Button>
                </Stack>
              </Card>
            ))}
          </div>
        )}
      </Stack>

      {!query && !makeFilter && !eraFilter && (
        <Stack gap="sm">
          <Heading as="h2" size="md">
            All vehicles ({vehicles.length})
          </Heading>
          <Paragraph size="sm" color="muted">
            Showing the complete seed registry. Add a search term to filter.
          </Paragraph>
        </Stack>
      )}
    </Section>
  );
}

function SpecChip({ label, value, highlight }) {
  return (
    <span className={`ad-spec-chip${highlight ? " ad-spec-chip--highlight" : ""}`}>
      <span className="ad-spec-chip-label">{label}</span>
      <span className="ad-spec-chip-value">{value}</span>
    </span>
  );
}
