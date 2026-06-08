import {
  Button,
  ButtonContainer,
  NumberField,
  SelectField,
  Stack,
  TextField,
} from "../../../../packages/react/src/index.js";
import { lookupPlace } from "../lib/locations.js";

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function ErrandForm({ onAdd, onCancel }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name")?.toString().trim();
    const address = data.get("address")?.toString().trim();
    if (!name || !address) return;

    const location = lookupPlace(address);
    onAdd({
      id: `err-${Date.now()}`,
      name,
      location,
      durationMinutes: Number(data.get("duration")) || 15,
      priority: data.get("priority")?.toString() || "medium",
      timeWindow: data.get("earliest") && data.get("latest")
        ? { earliest: data.get("earliest").toString(), latest: data.get("latest").toString() }
        : null,
      notes: data.get("notes")?.toString() ?? "",
    });
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextField id="errand-name" name="name" label="Errand name" placeholder="Grocery run" required />
        <TextField
          id="errand-address"
          name="address"
          label="Destination"
          hint="Try Whole Foods, USPS Mission, Target…"
          placeholder="Address or place name"
          required
        />
        <div className="dayflow-form-grid">
          <NumberField id="errand-duration" name="duration" label="Duration (min)" defaultValue={15} min={5} max={180} />
          <SelectField id="errand-priority" name="priority" label="Priority" defaultValue="medium">
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </SelectField>
        </div>
        <div className="dayflow-form-grid">
          <TextField id="errand-earliest" name="earliest" label="Earliest" hint="Optional time window" type="time" />
          <TextField id="errand-latest" name="latest" label="Latest" type="time" />
        </div>
        <TextField id="errand-notes" name="notes" label="Notes" placeholder="Optional details" />
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
