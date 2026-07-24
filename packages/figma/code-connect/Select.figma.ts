// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=490-1062
// source=packages/react/src/components/field/SelectField.jsx
// component=SelectField
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("Label") || "Select label";
const value = instance.getString("Value") || "Choose an option";
const hint = instance.getString("Hint") || "";
const error =
  instance.getString("Error message") || "Choose an option to continue.";
const size = instance.getEnum("Size", {
  comfortable: "comfortable",
  default: "default",
  compact: "compact",
});
const state = instance.getEnum("State", {
  default: "default",
  focus: "focus",
  error: "error",
  disabled: "disabled",
});
const attr = (name: string, value: string | undefined, defaultValue = "") =>
  value && value !== defaultValue ? ` ${name}="${value}"` : "";
const hintProp = state !== "error" ? attr("hint", hint) : "";
const errorProp = state === "error" ? attr("error", error) : "";
const disabledProp = state === "disabled" ? " disabled" : "";

export default {
  id: "a1-select",
  imports: ['import { SelectField } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<SelectField${attr("label", label)}${attr("size", size, "default")}${hintProp}${errorProp}${disabledProp}><option>${value}</option></SelectField>`,
  metadata: {
    props: {
      visualStates: ["focus"],
      omittedProps: [
        "labelPosition",
        "required",
        "children/options",
        "onChange",
        "className",
        "style",
        "aria-*",
        "ref",
      ],
    },
  },
};
