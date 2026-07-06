// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=123-701
// source=packages/react/src/components/button/Button.jsx
// component=Button
import figma from "figma"

const instance = figma.selectedInstance

const label = instance.getString("Label") || "Save changes"
const variant = instance.getEnum("Variant", {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  destructive: "destructive",
  success: "success",
})
const size = instance.getEnum("Size", {
  sm: "sm",
  md: "md",
  lg: "lg",
})
const state = instance.getEnum("State", {
  default: "default",
  hover: "hover",
  focus: "focus",
  pressed: "pressed",
  disabled: "disabled",
  loading: "loading",
})
const iconPosition = instance.getEnum("IconPosition", {
  start: "start",
  end: "end",
})
const showIcon = instance.getBoolean("Show icon")
const icon = instance.getInstanceSwap("Icon")
const iconName = showIcon && icon ? "smart_button" : undefined

function stringProp(name: string, value: string | undefined, defaultValue: string) {
  return value && value !== defaultValue ? ` ${name}="${value}"` : ""
}

function booleanProp(name: string, value: boolean) {
  return value ? ` ${name}` : ""
}

const variantProp = stringProp("variant", variant, "primary")
const sizeProp = stringProp("size", size, "md")
const iconProp = iconName ? ` icon="${iconName}"` : ""
const iconPositionProp = iconName ? stringProp("iconPosition", iconPosition, "start") : ""
const disabledProp = booleanProp("disabled", state === "disabled")
const loadingProp = booleanProp("loading", state === "loading")

export default {
  id: "a1-button",
  imports: ['import { Button } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Button${variantProp}${sizeProp}${iconProp}${iconPositionProp}${disabledProp}${loadingProp}>${label}</Button>`,
  metadata: {
    nestable: true,
    props: {
      visualStates: ["hover", "focus", "pressed"],
      omittedProps: ["as", "type", "fullWidth", "onClick", "className", "style", "aria-*", "ref"],
    },
  },
}
