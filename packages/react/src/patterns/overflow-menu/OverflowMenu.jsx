"use client";

import { cloneElement, isValidElement, useRef, useState } from "react";
import { IconButton } from "../../components/icon-button/IconButton.jsx";
import { Menu, MenuItem } from "../../components/menu/Menu.jsx";
import { VerificationDialog } from "../verification-dialog/VerificationDialog.jsx";
import { useLabel } from "../../components/labels/Labels.jsx";
import { getPatternManifest } from "../patternPolicies.js";

const manifest = getPatternManifest("OverflowMenu");
const signature = action => JSON.stringify(action, (_key, value) => isValidElement(value)
  ? { type: typeof value.type === "string" ? value.type : value.type.name, props: value.props } : value);

/** A structured action menu. Verification delays both callbacks and navigation. */
export function OverflowMenu({ label, size = "md", disabled = false, actions = [], onAction, className = "", ...rest }) {
  const defaultLabel = useLabel("overflowMenu.label", "More actions");
  const anchorRef = useRef(null);
  const pendingRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const available = Array.isArray(actions) ? actions : [];
  const inactive = disabled || available.length === 0;

  function closeMenu() {
    setOpen(false);
    anchorRef.current?.focus();
  }
  function dismiss() {
    pendingRef.current = null;
    setPending(null);
  }
  function execute(action) {
    onAction?.(action);
    if (action.href) window.location.assign(action.href);
  }
  function select(action) {
    if (inactive || action.disabled) return;
    closeMenu();
    if (action.verification) {
      pendingRef.current = { action, signature: signature(action) };
      setPending(action);
    } else execute(action);
  }
  function confirm() {
    // Use the current item, and refuse stale/disabled actions or repeated activation.
    if (!pending || pendingRef.current?.action !== pending) return;
    const current = available.find(action => action.id === pending.id);
    const approvedSignature = pendingRef.current.signature;
    dismiss();
    if (disabled || !current || current.disabled || signature(current) !== approvedSignature) return;
    execute(current);
  }
  function openMenu(event) {
    if (inactive) return;
    anchorRef.current = event.currentTarget;
    setOpen(true);
  }

  return (
    <>
      <IconButton
        {...rest}
        {...manifest.lockedProps}
        className={["a1-overflow-menu", className].filter(Boolean).join(" ")}
        label={label || defaultLabel}
        size={size}
        disabled={inactive}
        aria-haspopup="dialog"
        aria-expanded={open && !inactive}
        onClick={rest.onClick ?? (event => open ? closeMenu() : openMenu(event))}
        onKeyDown={event => {
          rest.onKeyDown?.(event);
          // Editor selection boundaries replace activation on the root control.
          if (rest.onClick || event.defaultPrevented) return;
          if (event.key === "ArrowDown") { event.preventDefault(); openMenu(event); }
        }}
      />
      <Menu open={open && !inactive} onClose={closeMenu} anchorRef={anchorRef} aria-label={label || defaultLabel}>
        {available.map(action => (
          <MenuItem key={action.id} icon={action.icon} disabled={action.disabled}
            variant={action.destructive ? "destructive" : "default"} onClick={() => select(action)}>
            {action.label}
          </MenuItem>
        ))}
      </Menu>
      {cloneElement(pending?.verification ?? <VerificationDialog title="" message="" />, {
        key: 'verification', open: !!pending, onClose: dismiss, onConfirm: confirm,
        confirmLabel: pending?.verification?.props.confirmLabel || pending?.label,
        disabled: disabled || pending?.verification?.props.disabled,
      })}
    </>
  );
}
