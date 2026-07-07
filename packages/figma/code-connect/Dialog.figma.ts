// url=https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System?node-id=228-1628
// source=packages/react/src/components/dialog/Dialog.jsx
// component=Dialog
import figma from "figma"

const instance = figma.selectedInstance

const title = instance.getString("Title") || "Dialog title"
const body = instance.getString("Body") || "Dialog body content goes here."
const size = instance.getEnum("Size", {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
})
const status = instance.getEnum("Status", {
  none: "none",
  success: "success",
  error: "error",
  warn: "warn",
  info: "info",
  neutral: "neutral",
})
const showClose = instance.getBoolean("Show close")
const showFooter = instance.getBoolean("Show footer")

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

const titleProp = stringProp("title", title)
const sizeProp = stringProp("size", size, "md")
const statusProp = status && status !== "none" ? stringProp("status", status) : ""
const closeProp = showClose ? " onClose={() => {}}" : ""
const footerProp = showFooter
  ? ` footer={<>
    <Button variant="secondary">Cancel</Button>
    <Button>Save changes</Button>
  </>}`
  : ""

export default {
  id: "a1-dialog",
  imports: ['import { Button, Dialog } from "@gtivr4/a1-design-system-react"'],
  example: figma.code`<Dialog open${titleProp}${sizeProp}${statusProp}${closeProp}${footerProp}>
  ${escapeAttr(body)}
</Dialog>`,
  metadata: {
    nestable: true,
    props: {
      slotModel: "Dialog exposes _body and _footer slot frames in Figma; replace their placeholder content for richer compositions.",
      omittedProps: ["open state management", "icon", "native dialog behavior", "Escape/backdrop dismissal", "focus trap", "className", "style", "aria-*", "id", "ref"],
    },
  },
}
