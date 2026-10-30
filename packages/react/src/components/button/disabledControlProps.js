"use client";

/** Native buttons handle disabled themselves; anchor controls need navigation suppression too. */
export function disabledControlProps(disabled, props) {
  if (!disabled) return props;
  const block = event => { event.preventDefault(); event.stopPropagation(); };
  return {
    ...props,
    href: undefined,
    tabIndex: -1,
    'aria-disabled': 'true',
    role: props.role ?? (props.href ? 'link' : undefined),
    onClick: block,
    onClickCapture: block,
    onAuxClick: block,
    onKeyDown: event => {
      if (event.key === 'Enter' || event.key === ' ') block(event);
      else props.onKeyDown?.(event);
    },
  };
}
