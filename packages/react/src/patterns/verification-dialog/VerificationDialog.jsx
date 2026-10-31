"use client";

import { useEffect, useId, useRef } from "react";
import { Dialog } from "../../components/dialog/Dialog.jsx";
import { Button } from "../../components/button/Button.jsx";
import { Paragraph } from "../../components/paragraph/Paragraph.jsx";
import { Stack } from "../../components/stack/Stack.jsx";
import { useLabel } from "../../components/labels/Labels.jsx";
import { getPatternManifest } from "../patternPolicies.js";

const manifest = getPatternManifest("VerificationDialog");

export function VerificationDialog({ open = false, onClose, onConfirm, title, message, confirmLabel, cancelLabel, titleKey, messageKey, confirmLabelKey, cancelLabelKey, destructive = false, disabled = false, children, className = "", ...rest }) {
  const defaultConfirm = useLabel("verificationDialog.confirm", "Confirm");
  const defaultCancel = useLabel("verificationDialog.cancel", "Cancel");
  const resolvedTitle = useLabel(titleKey || "", title);
  const resolvedMessage = useLabel(messageKey || "", message);
  const resolvedConfirm = useLabel(confirmLabelKey || "", confirmLabel || defaultConfirm);
  const resolvedCancel = useLabel(cancelLabelKey || "", cancelLabel || defaultCancel);
  const cancelId = useId();
  const messageId = useId();
  const confirmed = useRef(false);
  // A new open session can confirm once; rapid repeated activation cannot double-submit.
  useEffect(() => { if (!open) confirmed.current = false; }, [open]);
  function confirm() {
    if (!open || disabled || confirmed.current) return;
    confirmed.current = true;
    onConfirm?.();
  }
  return <Dialog {...rest} {...manifest.lockedProps}
    className={["a1-verification-dialog", className].filter(Boolean).join(" ")}
    open={open} onClose={onClose} title={resolvedTitle} initialFocusId={cancelId}
    aria-label={resolvedTitle} aria-describedby={messageId}
    footer={<>
      <Button id={cancelId} variant="secondary" onClick={onClose}>{resolvedCancel}</Button>
      <Button variant={destructive ? "destructive" : "primary"} disabled={disabled} onClick={confirm}>{resolvedConfirm}</Button>
    </>}>
    <Stack gap="sm">
      <Paragraph id={messageId}>{resolvedMessage}</Paragraph>
      {children}
    </Stack>
  </Dialog>;
}
