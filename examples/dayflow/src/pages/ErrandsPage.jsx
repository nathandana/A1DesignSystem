import { useState } from "react";
import {
  Button,
  Card,
  Heading,
  IconButton,
  Paragraph,
  Section,
  Stack,
} from "../../../../packages/react/src/index.js";
import { ErrandForm } from "../components/ErrandForm.jsx";
import { ErrandOverlay } from "../components/ErrandOverlay.jsx";
import { PriorityBadge } from "../components/PriorityBadge.jsx";
import { formatDuration } from "../lib/format.js";
import { getPriorityMeta } from "../lib/priority.js";

export function ErrandsPage({ errands, onAdd, onRemove }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function openDialog() {
    setFormKey((k) => k + 1);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  function handleAdd(errand) {
    onAdd(errand);
    closeDialog();
  }

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
          <Button icon="add" onClick={openDialog}>Add errand</Button>
        </div>
      </Section>

      <Stack gap="md">
        {errands.map((errand) => {
          const priorityMeta = getPriorityMeta(errand.priority);
          return (
            <Card key={errand.id} className={`dayflow-errand-card ${priorityMeta.className}`}>
              <div className="dayflow-errand-card__row">
                <div className="dayflow-errand-card__content">
                  <div className="dayflow-errand-card__title-row">
                    <Heading as="h4" size="sm">{errand.name}</Heading>
                    <PriorityBadge priority={errand.priority} size="sm" />
                  </div>
                  <Paragraph size="sm" color="muted">{errand.location?.address}</Paragraph>
                  <Paragraph size="sm">
                    {formatDuration(errand.durationMinutes)}
                    {errand.timeWindow ? ` · ${errand.timeWindow.earliest}–${errand.timeWindow.latest}` : ""}
                  </Paragraph>
                  {errand.notes ? <Paragraph size="sm" color="muted">{errand.notes}</Paragraph> : null}
                </div>
                <IconButton icon="delete" label={`Remove ${errand.name}`} onClick={() => onRemove(errand.id)} />
              </div>
            </Card>
          );
        })}
      </Stack>

      {!errands.length ? (
        <Card>
          <Paragraph color="muted">No errands yet. Add grocery runs, pickups, or any stop you need to make today.</Paragraph>
        </Card>
      ) : null}

      <ErrandOverlay
        open={dialogOpen}
        onClose={closeDialog}
        title="Add errand"
        aria-label="Add errand"
      >
        <ErrandForm
          key={formKey}
          formKey={formKey}
          onAdd={handleAdd}
          onCancel={closeDialog}
        />
      </ErrandOverlay>
    </Stack>
  );
}
