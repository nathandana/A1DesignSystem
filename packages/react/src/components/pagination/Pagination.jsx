import "./pagination.css";
import { Icon } from "../icon/Icon.jsx";
import { IconButton } from "../icon-button/IconButton.jsx";

function getPageItems(page, totalPages, siblings) {
  const left  = Math.max(2, page - siblings);
  const right = Math.min(totalPages - 1, page + siblings);

  const items = [1];
  if (left > 2)            items.push("start-ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < totalPages - 1) items.push("end-ellipsis");
  if (totalPages > 1)      items.push(totalPages);

  return items;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblings = 1,
  size = "md",
}) {
  const items = getPageItems(page, totalPages, siblings);

  return (
    <nav aria-label="Pagination" className={`a1-pagination a1-pagination--${size}`}>
      <IconButton
        icon="chevron_left"
        label="Previous page"
        onClick={() => onChange?.(page - 1)}
        disabled={page <= 1}
        className="a1-pagination__item"
      />

      {items.map((item) =>
        typeof item === "string" ? (
          <span key={item} className="a1-pagination__ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            className="a1-pagination__item"
            onClick={() => item !== page && onChange?.(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        )
      )}

      <IconButton
        icon="chevron_right"
        label="Next page"
        onClick={() => onChange?.(page + 1)}
        disabled={page >= totalPages}
        className="a1-pagination__item"
      />
    </nav>
  );
}
