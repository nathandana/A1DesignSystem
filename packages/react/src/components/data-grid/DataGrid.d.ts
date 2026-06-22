import type { ComponentType } from "react";
import type {
  DataGridProps,
  Column,
  RenderEditCellProps,
} from "react-data-grid";

/**
 * A1-themed wrapper around react-data-grid (experimental — Storybook-only).
 * Accepts the full react-data-grid `DataGridProps` surface plus `className`.
 */
export declare const DataGrid: ComponentType<DataGridProps<any, any, any> & { className?: string }>;

/** The library's default inline text editor — use as a column `renderEditCell`. */
export declare const textEditor: (props: RenderEditCellProps<any, any>) => JSX.Element;

/** Prebuilt checkbox row-selection column. */
export declare const SelectColumn: Column<any, any>;
