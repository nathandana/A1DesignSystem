import { useEffect, useId, useState } from "react";
import {
  Banner,
  Button,
  ButtonContainer,
  ChoiceGroup,
  NumberField,
  Stack,
  TextField,
} from "../../../../packages/react/src/index.js";
import { lookupPlace } from "../lib/locations.js";
import { PRIORITY_OPTIONS } from "../lib/priority.js";

const EMPTY_FORM = {
  name: "",
  address: "",
  duration: "15",
  priority: "medium",
  earliest: "",
  latest: "",
  notes: "",
};

export function ErrandForm({ onAdd, onCancel, formKey }) {
  const formId = useId();
  const [fields, setFields] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    setFields(EMPTY_FORM);
    setError("");
  }, [formKey]);

  function updateField(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = fields.name.trim();
    const address = fields.address.trim();
    if (!name || !address) {
      setError("Enter an errand name and destination.");
      return;
    }

    const durationMinutes = Number(fields.duration);
    if (!Number.isFinite(durationMinutes) || durationMinutes < 5) {
      setError("Duration must be at least 5 minutes.");
      return;
    }

    if (fields.earliest && fields.latest && fields.earliest >= fields.latest) {
      setError("Latest time must be after earliest time.");
      return;
    }

    onAdd({
      id: `err-${Date.now()}`,
      name,
      location: lookupPlace(address),
      durationMinutes,
      priority: fields.priority,
      timeWindow: fields.earliest && fields.latest
        ? { earliest: fields.earliest, latest: fields.latest }
        : null,
      notes: fields.notes.trim(),
    });

    setFields(EMPTY_FORM);
    setError("");
  }

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        {error ? <Banner status="error">{error}</Banner> : null}

        <TextField
          id={`${formId}-name`}
          name="name"
          label="Errand name"
          value={fields.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
        <TextField
          id={`${formId}-address`}
          name="address"
          label="Destination"
          hint="Try Whole Foods, USPS Mission, Target…"
          value={fields.address}
          onChange={(e) => updateField("address", e.target.value)}
          required
        />

        <div className="dayflow-form-grid">
          <NumberField
            id={`${formId}-duration`}
            name="duration"
            label="Duration (min)"
            min={5}
            max={180}
            value={fields.duration}
            onChange={(e) => updateField("duration", e.target.value)}
            required
          />
        </div>

        <ChoiceGroup
          label="Priority"
          name="priority"
          options={PRIORITY_OPTIONS}
          value={fields.priority}
          onChange={(value) => updateField("priority", value)}
          columns={1}
          inlineIcon
          required
        />

        <div className="dayflow-form-grid">
          <TextField
            id={`${formId}-earliest`}
            name="earliest"
            label="Earliest"
            hint="Optional time window"
            type="time"
            value={fields.earliest}
            onChange={(e) => updateField("earliest", e.target.value)}
          />
          <TextField
            id={`${formId}-latest`}
            name="latest"
            label="Latest"
            type="time"
            value={fields.latest}
            onChange={(e) => updateField("latest", e.target.value)}
          />
        </div>

        <TextField
          id={`${formId}-notes`}
          name="notes"
          label="Notes"
          value={fields.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />

        <ButtonContainer>
          <Button type="submit" icon="add">Add errand</Button>
          {onCancel ? (
            <Button type="button" variant="tertiary" onClick={onCancel}>Cancel</Button>
          ) : null}
        </ButtonContainer>
      </Stack>
    </form>
  );
}
