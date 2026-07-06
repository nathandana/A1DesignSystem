// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=148-1360
// source=packages/react/src/components/field/TextField.jsx
// component=TextField
import figma from "figma"

const instance = figma.selectedInstance

const label = instance.getString("Label") || "Email address"
const value = instance.getString("Value") || ""
const hint = instance.getString("Hint") || ""
const error = instance.getString("Error") || "Enter a valid email address."
const showLabel = instance.getBoolean("Show label")
const showHint = instance.getBoolean("Show hint")
const size = instance.getEnum("Size", {
  comfortable: "comfortable",
  default: "default",
  compact: "compact",
})
const state = instance.getEnum("State", {
  default: "default",
  hover: "hover",
  focus: "focus",
  required: "required",
  error: "error",
  readOnly: "readOnly",
  disabled: "disabled",
})

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function stringProp(name: string, value: string | undefined, defaultValue = "") {
  return value && value !== defaultValue ? ` ${name}="${escapeAttr(value)}"` : ""
}

function booleanProp(name: string, value: boolean) {
  return value ? ` ${name}` : ""
}

const labelProp = showLabel ? stringProp("label", label) : ""
const valueProp = stringProp("defaultValue", value)
const hintProp = state !== "error" && showHint ? stringProp("hint", hint) : ""
const errorProp = state === "error" ? stringProp("error", error) : ""
const sizeProp = stringProp("size", size, "default")
const requiredProp = booleanProp("required", state === "required")
const disabledProp = booleanProp("disabled", state === "disabled")
const readOnlyProp = booleanProp("readOnly", state === "readOnly")

export default {
  id: "a1-text-field",
  imports: ['import { TextField } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<TextField${labelProp}${valueProp}${hintProp}${errorProp}${sizeProp}${requiredProp}${disabledProp}${readOnlyProp} />`,
  metadata: {
    props: {
      visualStates: ["hover", "focus"],
      omittedProps: ["type", "autoComplete", "inputOverlay", "onChange", "onInput", "className", "style", "aria-*", "id", "ref"],
    },
  },
}
