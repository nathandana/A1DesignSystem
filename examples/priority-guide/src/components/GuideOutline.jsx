import React from "react";
import { Divider } from "../../../../packages/react/src/index.js";

export function GuideOutlineItem({ item, depth = 0 }) {
  const prefix = depth === 0 ? null : "—";
  return (
    <li className={`priority-guide-outline__item priority-guide-outline__item--depth-${depth}`}>
      <div className="priority-guide-outline__item-header">
        {prefix && <span className="priority-guide-outline__dash">{prefix}</span>}
        <span className="priority-guide-outline__type">{item.type}</span>
        <span className="priority-guide-outline__title">{item.title}</span>
      </div>
      {item.content && (
        <p className="priority-guide-outline__content">{item.content}</p>
      )}
      {item.children?.length > 0 && (
        <ul className="priority-guide-outline__children">
          {item.children.map((child, i) => (
            <GuideOutlineItem key={i} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function GuideOutline({ guide }) {
  return (
    <div className="priority-guide-outline">
      <div className="priority-guide-outline__meta">
        {guide.pageType && <span className="priority-guide-outline__page-type">{guide.pageType}</span>}
      </div>

      {guide.problemStatement && (
        <div className="priority-guide-outline__section">
          <p className="priority-guide-outline__section-label">Problem statement</p>
          <p className="priority-guide-outline__section-value">{guide.problemStatement}</p>
        </div>
      )}

      <dl className="priority-guide-outline__fields">
        {guide.audience && (
          <>
            <dt>Audience</dt>
            <dd>{guide.audience}</dd>
          </>
        )}
        {guide.userGoal && (
          <>
            <dt>User goal</dt>
            <dd>{guide.userGoal}</dd>
          </>
        )}
        {guide.businessGoal && (
          <>
            <dt>Business goal</dt>
            <dd>{guide.businessGoal}</dd>
          </>
        )}
      </dl>

      <Divider />

      <p className="priority-guide-outline__section-label">Content hierarchy</p>
      <ol className="priority-guide-outline__list">
        {guide.items.map((item, i) => (
          <GuideOutlineItem key={i} item={item} depth={0} />
        ))}
      </ol>
    </div>
  );
}
