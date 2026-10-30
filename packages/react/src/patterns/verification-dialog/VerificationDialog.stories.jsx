import { useState } from "react";
import { VerificationDialog } from "./VerificationDialog.jsx";
import { Button } from "../../components/button/Button.jsx";
import { Paragraph } from "../../components/paragraph/Paragraph.jsx";

function Example(args) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  return <>
    <Button onClick={() => { setConfirmed(false); setOpen(true); }}>Open verification</Button>
    <VerificationDialog {...args} open={open} onClose={() => setOpen(false)} onConfirm={() => { setConfirmed(true); setOpen(false); }} />
    {confirmed && <Paragraph role="status">Action confirmed.</Paragraph>}
  </>;
}
export default { title: "Patterns/Verification dialog", component: VerificationDialog, tags: ["autodocs"], render: Example, argTypes: { titleKey: { control: "text" }, messageKey: { control: "text" }, confirmLabelKey: { control: "text" }, cancelLabelKey: { control: "text" } }, args: { title: "Delete item?", message: "This will delete the selected item.", confirmLabel: "Delete", destructive: true } };
export const DeleteItem = {};
export const VerifyAnyAction = { args: { title: "Duplicate item?", message: "This will create a copy of the selected item.", confirmLabel: "Duplicate", destructive: false } };
export const WithContent = { args: { children: <Paragraph size="sm">Related records will remain available.</Paragraph> } };
export const ConfirmationDisabled = { args: { disabled: true } };

export const Translated = { globals: { locale: "fr" }, args: { titleKey: "verificationDialog.deleteTitle", messageKey: "verificationDialog.deleteMessage", confirmLabelKey: "verificationDialog.delete", cancelLabelKey: "verificationDialog.cancel" } };
