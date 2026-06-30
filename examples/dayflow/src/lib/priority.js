export const PRIORITY_META = {
  high: {
    label: "High",
    icon: "priority_high",
    status: "error",
    className: "dayflow-priority--high",
    description: "Must happen today — scheduled first",
  },
  medium: {
    label: "Medium",
    icon: "drag_handle",
    status: "warn",
    className: "dayflow-priority--medium",
    description: "Important but flexible timing",
  },
  low: {
    label: "Low",
    icon: "low_priority",
    status: "neutral",
    className: "dayflow-priority--low",
    description: "Fit in when there is room",
  },
};

export const PRIORITY_OPTIONS = Object.entries(PRIORITY_META).map(([value, meta]) => ({
  value,
  label: meta.label,
  icon: meta.icon,
  subtext: meta.description,
}));

export function getPriorityMeta(priority) {
  return PRIORITY_META[priority] ?? PRIORITY_META.medium;
}
