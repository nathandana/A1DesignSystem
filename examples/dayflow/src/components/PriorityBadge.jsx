import { Icon, MessageBadge } from "../../../../packages/react/src/index.js";
import { getPriorityMeta } from "../lib/priority.js";

export function PriorityBadge({ priority, size = "md", showIcon = true }) {
  const meta = getPriorityMeta(priority);

  return (
    <MessageBadge status={meta.status} size={size} icon={showIcon ? meta.icon : null}>
      {meta.label} priority
    </MessageBadge>
  );
}

export function PriorityMarker({ priority }) {
  const meta = getPriorityMeta(priority);

  return (
    <span className={`dayflow-priority-marker ${meta.className}`} aria-hidden="true">
      <Icon name={meta.icon} />
    </span>
  );
}
