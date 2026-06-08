import { useState } from "react";
import {
  Button,
  Card,
  Dialog,
  Heading,
  IconButton,
  Paragraph,
  Section,
  Stack,
} from "../../../../packages/react/src/index.js";
import { ErrandForm } from "../components/ErrandForm.jsx";
import { formatDuration } from "../lib/format.js";

const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };

export function ErrandsPage({ errands, onAdd, onRemove }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Stack gap="lg">
      <Section>
        <div className="dayflow-page-header">
          <Stack gap="sm">
            <Heading as="h1" size="lg">Errands & destinations</Heading>
            <Paragraph color="muted">
              Add stops to visit today. Dayflow will order them efficiently and schedule around traffic and calendar events.
            </Paragraph>
          </Stack>
          <Button icon="add" onClick={() => setDialogOpen(true)}>Add errand</Button>
        </div>
      </Section>

      <Stack gap="md">
        {errands.map((errand) => (
          <Card key={errand.id} className="dayflow-errand-card">
            <div className="dayflow-errand-card__row">
              <div>
                <Heading as="h4" size="sm">{errand.name}</Heading>
                <Paragraph size="sm" color="muted">{errand.location?.address}</Paragraph>
                <Paragraph size="sm">
                  {formatDuration(errand.durationMinutes)} · {PRIORITY_LABELS[errand.priority]} priority
                  {errand.timeWindow ? ` · ${errand.timeWindow.earliest}–${errand.timeWindow.latest}` : ""}
                </Paragraph>
                {errand.notes ? <Paragraph size="sm" color="muted">{errand.notes}</Paragraph> : null}
              </div>
              <IconButton icon="delete" label={`Remove ${errand.name}`} onClick={() => onRemove(errand.id)} />
            </div>
          </Card>
        ))}
      </Stack>

      {!errands.length ? (
        <Card>
          <Paragraph color="muted">No errands yet. Add grocery runs, pickups, or any stop you need to make today.</Paragraph>
        </Card>
      ) : null}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add errand"
        aria-label="Add errand"
      >
        <ErrandForm
          onAdd={(errand) => {
            onAdd(errand);
            setDialogOpen(false);
          }}
          onCancel={() => setDialogOpen(false)}
        />
      </Dialog>
    </Stack>
  );
}
