import { useState } from "react";
import { Chip, ChipGroup } from "./Chip.jsx";
import { MenuItem } from "../menu/Menu.jsx";

export default {
  title: "Actions/Chip",
  component: ChipGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    selectionMode: {
      control: "inline-radio",
      options: ["none", "single", "multiple"],
    },
    wrap: { control: "boolean" },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    selectionMode: "multiple",
    wrap: true,
    size: "md",
  },
};

export function Selectable(args) {
  const [value, setValue] = useState(["patterns"]);
  return (
    <ChipGroup {...args} value={value} onChange={setValue} label="Filters">
      <Chip value="patterns" icon="palette">Patterns</Chip>
      <Chip value="tokens" icon="token">Tokens</Chip>
      <Chip value="components" icon="widgets">Components</Chip>
      <Chip value="docs" icon="article">Docs</Chip>
    </ChipGroup>
  );
}

export function SingleSelect() {
  const [value, setValue] = useState("all");
  return (
    <ChipGroup selectionMode="single" value={value} onChange={setValue} label="Status">
      <Chip value="all">All</Chip>
      <Chip value="open">Open</Chip>
      <Chip value="review">Review</Chip>
      <Chip value="done">Done</Chip>
    </ChipGroup>
  );
}

export function MenuFilters() {
  const [status, setStatus] = useState("accepted");
  return (
    <ChipGroup selectionMode="none" label="Filters">
      <Chip
        icon="filter_list"
        selected={Boolean(status)}
        menuLabel="Status"
        menu={({ close }) => (
          <>
            {[
              ["", "All"],
              ["accepted", "Accepted"],
              ["triaged", "Triaged"],
              ["done", "Done"],
            ].map(([value, label]) => (
              <MenuItem
                key={value || "all"}
                icon={status === value ? "radio_button_checked" : "radio_button_unchecked"}
                onClick={() => { setStatus(value); close(); }}
              >
                {label}
              </MenuItem>
            ))}
          </>
        )}
      >
        {status ? `Status: ${status}` : "Status"}
      </Chip>
      <Chip icon="person">Owner</Chip>
      <Chip icon="schedule">Due date</Chip>
    </ChipGroup>
  );
}

export function Navigation() {
  return (
    <ChipGroup selectionMode="none" wrap={false} label="Places">
      <Chip as="a" href="#components" icon="widgets">Components</Chip>
      <Chip as="a" href="#patterns" icon="palette">Patterns</Chip>
      <Chip as="a" href="#rules" icon="rule">Rules</Chip>
      <Chip as="a" href="#labels" icon="translate">Labels</Chip>
    </ChipGroup>
  );
}
