import { forwardRef } from "react";
import {
  DataGrid as RdgDataGrid,
  SelectColumn,
  renderTextEditor,
} from "react-data-grid";
import "react-data-grid/lib/styles.css";
import "./data-grid.css";

/**
 * DataGrid — A1-themed wrapper around react-data-grid (Comcast).
 *
 * EXPERIMENTAL. This exists to evaluate react-data-grid as the future *data
 * editor* for the page-data / data-binding feature (backlog A1-94: an editable
 * data table for modifying dataset values, plus a JSON importer). It is
 * intentionally:
 *   - NOT exported from the package index (`src/index.js`),
 *   - NOT wired into the a1-web configurator,
 *   - available in Storybook only, so the grid can be test-driven before we
 *     commit to it as the data-feature editor.
 *
 * Theming: react-data-grid scopes all of its own CSS in `@layer rdg`, so the
 * unlayered rules in `data-grid.css` win over the library defaults without a
 * specificity battle. Every `--rdg-*` variable is mapped to an A1 token there,
 * so the grid follows the active A1 theme automatically.
 *
 * The full prop surface is react-data-grid's `DataGridProps` — `columns`,
 * `rows`, `onRowsChange`, `rowKeyGetter`, `selectedRows`,
 * `onSelectedRowsChange`, `defaultColumnOptions`, `sortColumns`, etc. A column
 * becomes editable by giving it a `renderEditCell` (use the re-exported
 * `textEditor` for the default inline text input).
 */
export const DataGrid = forwardRef(function DataGrid({ className, ...props }, ref) {
  return (
    <RdgDataGrid
      ref={ref}
      className={["a1-data-grid", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

/**
 * The library's default inline text editor. Pass as a column's `renderEditCell`
 * to make that column editable:  `{ key: "name", name: "Name", renderEditCell: textEditor }`.
 */
export const textEditor = renderTextEditor;

/** Prebuilt checkbox row-selection column. Place first in the `columns` array. */
export { SelectColumn };
