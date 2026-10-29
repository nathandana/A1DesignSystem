import { useState } from "react";
import { VerificationDialog } from "../verification-dialog/VerificationDialog.jsx";
import { OverflowMenu } from "./OverflowMenu.jsx";
import { Paragraph } from "../../components/paragraph/Paragraph.jsx";
import { Stack } from "../../components/stack/Stack.jsx";
import { getPatternManifest } from "../patternPolicies.js";

const manifest = getPatternManifest("OverflowMenu");
const actions = manifest.examples[0].props.actions;
function Example(args) {
  const [selected, setSelected] = useState("");
  return <Stack gap="sm" align="start">
    <OverflowMenu {...args} actions={args.actions?.map(action => ({ ...action, ...(action.verification ? { verification: <VerificationDialog {...action.verification.props} /> } : {}) }))} onAction={action => setSelected(`${action.label} selected.`)} />
    {selected && <Paragraph role="status">{selected}</Paragraph>}
  </Stack>;
}
export default { title: "Patterns/Overflow menu", component: OverflowMenu, tags: ["autodocs"], render: Example, args: { label: "More item actions", actions } };
export const EditDuplicateDelete = {};
export const VerifyAnyAction = { args: { actions: manifest.examples[1].props.actions } };
export const NoVerification = { args: { actions: actions.map(({ verification: _verification, ...action }) => action) } };
export const Empty = { args: { actions: [] } };
export const Disabled = { args: { disabled: true } };
export const DisabledAction = { args: { actions: actions.map(action => ({ ...action, disabled: action.id === "delete" })) } };
export const Small = { args: { size: "sm" } };
export const Large = { args: { size: "lg" } };
