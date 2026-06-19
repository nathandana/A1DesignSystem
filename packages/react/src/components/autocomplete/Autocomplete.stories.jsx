import { useState } from "react";
import { Autocomplete } from "./Autocomplete.jsx";

const FRUITS = [
  "Apple", "Apricot", "Banana", "Blackberry", "Blueberry",
  "Cherry", "Grape", "Lemon", "Mango", "Orange", "Peach", "Pear",
].map((f) => ({ value: f.toLowerCase(), label: f }));

const meta = {
  title: "Components/Inputs/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    multiple: { control: "boolean" },
    allowCreate: { control: "boolean" },
    variant: { control: "inline-radio", options: ["default", "color"] },
    size: { control: "inline-radio", options: ["compact", "default", "comfortable"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;

export const Single = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div style={{ width: "320px" }}>
        <Autocomplete
          {...args}
          label="Favorite fruit"
          hint="Type to filter"
          options={FRUITS}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const Multiple = {
  render: (args) => {
    const [value, setValue] = useState(["apple", "mango"]);
    return (
      <div style={{ width: "320px" }}>
        <Autocomplete
          {...args}
          multiple
          label="Fruits"
          hint="Pick as many as you like"
          options={FRUITS}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const AllowCreate = {
  name: "Multi-select + create",
  render: (args) => {
    const [options, setOptions] = useState(FRUITS);
    const [value, setValue] = useState(["apple"]);
    return (
      <div style={{ width: "320px" }}>
        <Autocomplete
          {...args}
          multiple
          allowCreate
          label="Tags"
          hint="Choose existing tags or add your own"
          options={options}
          value={value}
          onChange={setValue}
          onCreate={(v) => setOptions((o) => (o.some((x) => x.value === v) ? o : [...o, { value: v, label: v }]))}
        />
      </div>
    );
  },
};

const SWATCHES = [
  { value: "#7c3aed", label: "Accent 500" },
  { value: "#5b21b6", label: "Accent 700" },
  { value: "#060b14", label: "Neutral 900" },
  { value: "#64748b", label: "Neutral 500" },
  { value: "#0071e3", label: "Info 500" },
  { value: "#1f9d55", label: "Success 500" },
  { value: "#d11720", label: "Error 500" },
];

export const Color = {
  name: "Color variant",
  render: (args) => {
    const [value, setValue] = useState("#7c3aed");
    return (
      <div style={{ width: "320px" }}>
        <Autocomplete
          {...args}
          variant="color"
          label="Accent colour"
          hint="Pick from the palette"
          options={SWATCHES}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const Sizes = {
  parameters: { layout: "padded", controls: { include: [] } },
  render: () => {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [c, setC] = useState("");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--base-spacing-16)", width: "320px" }}>
        <Autocomplete size="compact" label="Compact" options={FRUITS} value={a} onChange={setA} />
        <Autocomplete size="default" label="Default" options={FRUITS} value={b} onChange={setB} />
        <Autocomplete size="comfortable" label="Comfortable" options={FRUITS} value={c} onChange={setC} />
      </div>
    );
  },
};
