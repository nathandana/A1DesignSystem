// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=882-7620
// source=packages/react/src/components/autocomplete/Autocomplete.jsx
// component=Autocomplete
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("Label") || "Fruits";
const value = instance.getString("Value") || "Mango";
const hint = instance.getString("Hint") || "";
const error =
  instance.getString("Error message") || "Pick a fruit from the list.";
const required = instance.getBoolean("Required");
const size = instance.getEnum("Size", {
  compact: "compact",
  default: "default",
  comfortable: "comfortable",
});
const state = instance.getEnum("State", {
  default: "default",
  error: "error",
  disabled: "disabled",
});

const attr = (name: string, val: string | undefined, defaultValue = "") =>
  val && val !== defaultValue ? ` ${name}="${val}"` : "";
const sizeProp = attr("size", size, "default");
const hintProp = state !== "error" ? attr("hint", hint) : "";
const errorProp = state === "error" ? attr("error", error) : "";
const requiredProp = required ? " required" : "";
const disabledProp = state === "disabled" ? " disabled" : "";

export default {
  id: "a1-autocomplete",
  imports: ['import { Autocomplete } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Autocomplete${attr("label", label)}${sizeProp}${requiredProp}${hintProp}${errorProp}${disabledProp}
  options={[
    { value: "mango", label: "Mango" },
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ]}
  value="${value.toLowerCase()}"
  onChange={setValue}
/>`,
  metadata: {
    props: {
      visualStates: ["error", "disabled"],
      omittedProps: [
        "options",
        "value",
        "onChange",
        "multiple",
        "allowCreate",
        "onCreate",
        "variant",
        "emptyText",
        "createLabel",
        "maxVisible",
        "moreText",
        "name",
        "className",
        "aria-*",
      ],
      figmaGaps: [
        "The single-select control set (Size × State) mirrors the Select field family; the open listbox is the separate `Autocomplete Menu` composition (plain / active / selected+check / colour-swatch / multi-checkbox rows, a group heading, and the create row).",
        "`multiple` (removable chips) and `variant=\"color\"` (leading swatch) are shown as example frames on the page, not variant axes — option data, selection state, create behaviour, grouping, portal positioning, keyboard, and ARIA are runtime-owned.",
      ],
    },
  },
};
