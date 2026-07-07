import * as React from "react";

export type ChartType = "line" | "bar" | "area" | "composed";
export type ChartHeight = "sm" | "md" | "lg";
export type ChartVariant = "default" | "subtle";
export type ChartCurve = "linear" | "monotone" | "natural" | "step";
export type ChartSeriesType = "line" | "bar" | "area";
export type ChartSeriesTone = "accent" | "info" | "success" | "warn" | "error" | "neutral";

export interface ChartSeries {
  /** Row key for the numeric value this series renders. */
  key: string;
  /** Visible label used in legends and tooltips. Defaults to key. */
  label?: string;
  /** Series renderer used when Chart type is "composed". Default: "line" */
  type?: ChartSeriesType;
  /** A1 tokenized series colour. Defaults by series order. */
  tone?: ChartSeriesTone;
  /** Hide this series without removing it from the data contract. Default: false */
  hidden?: boolean;
  /** Stack id for bar or area series. When Chart stacked is true, a default stack id is used. */
  stackId?: string | number;
}

export interface ScatterChartSeries {
  /** Stable key for this scatter series. */
  key: string;
  /** Visible label used in legends and tooltips. Defaults to key. */
  label?: string;
  /** Per-series scatter data. Defaults to the chart-level data. */
  data?: Array<Record<string, unknown>>;
  /** A1 tokenized series colour. Defaults by series order. */
  tone?: ChartSeriesTone;
  /** Hide this series without removing it from the data contract. Default: false */
  hidden?: boolean;
}

export interface CategoricalChartDatum extends Record<string, unknown> {
  /** Visible item label. */
  name?: string;
  /** Numeric item value. */
  value?: number;
  /** Optional A1 tone for this item. Defaults by item order. */
  tone?: ChartSeriesTone;
}

export interface HierarchicalChartDatum extends Record<string, unknown> {
  /** Visible node label. */
  name?: string;
  /** Numeric node value. */
  value?: number;
  /** Optional nested nodes. */
  children?: HierarchicalChartDatum[];
  /** Optional A1 tone for this node. Defaults by item order where supported. */
  tone?: ChartSeriesTone;
}

export interface SankeyChartData {
  nodes: Array<Record<string, unknown>>;
  links: Array<{ source: number; target: number; value: number } & Record<string, unknown>>;
}

export interface ChartCommonProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Optional visible chart title. Also labels the chart for assistive technology. */
  title?: React.ReactNode;
  /** Optional visible chart description. Also describes the chart for assistive technology. */
  description?: React.ReactNode;
  /** Tokenized chart height. Default: "md" */
  height?: ChartHeight;
  /** Color treatment for series tones. "subtle" softens the same semantic tones. Default: "default" */
  variant?: ChartVariant;
  /** Show hover/focus tooltip content. Default: true */
  showTooltip?: boolean;
  /** Format tooltip values and y-axis ticks. */
  formatValue?: (value: unknown, seriesKey?: string | number, row?: Record<string, unknown>) => React.ReactNode;
  /** Format tooltip labels for the x-axis value. */
  formatLabel?: (value: unknown) => React.ReactNode;
  /** Additional CSS class names applied to the root figure. */
  className?: string;
}

export interface CartesianChartProps extends ChartCommonProps {
  /** Data rows passed to Recharts. */
  data?: Array<Record<string, unknown>>;
  /** Row key used for the x axis. Default: "name" */
  xKey?: string;
  /** Series definitions for y values. If omitted, numeric row keys are inferred from the first data row. */
  series?: ChartSeries[];
  /** Base chart renderer. Use "composed" to mix series-level types. Default: "line" */
  type?: ChartType;
  /** Curve used for line and area series. Default: "monotone" */
  curve?: ChartCurve;
  /** Stack bar and area series together when no per-series stackId is supplied. Default: false */
  stacked?: boolean;
  /** Show Cartesian grid lines. Default: true */
  showGrid?: boolean;
  /** Show the legend. Default: true */
  showLegend?: boolean;
  /** Show the x axis. Default: true */
  showXAxis?: boolean;
  /** Show the y axis. Default: true */
  showYAxis?: boolean;
}

export interface ScatterChartProps extends ChartCommonProps {
  /** Chart-level scatter data. Used when a series does not provide its own data. */
  data?: Array<Record<string, unknown>>;
  /** Row key used for x values. Default: "x" */
  xKey?: string;
  /** Row key used for y values. Default: "y" */
  yKey?: string;
  /** Optional row key used for z values. */
  zKey?: string;
  /** Scatter series definitions. If omitted, the chart-level data renders as one series. */
  series?: ScatterChartSeries[];
  /** Show Cartesian grid lines. Default: true */
  showGrid?: boolean;
  /** Show the legend. Default: true */
  showLegend?: boolean;
  /** Show the x axis. Default: true */
  showXAxis?: boolean;
  /** Show the y axis. Default: true */
  showYAxis?: boolean;
}

export interface RadarChartProps extends ChartCommonProps {
  /** Data rows passed to Recharts. */
  data?: Array<Record<string, unknown>>;
  /** Row key used for the polar angle axis. Default: "name" */
  axisKey?: string;
  /** Series definitions for radar values. If omitted, numeric row keys are inferred from the first data row. */
  series?: ChartSeries[];
  /** Show polar grid rings. Default: true */
  showGrid?: boolean;
  /** Show the legend. Default: true */
  showLegend?: boolean;
  /** Show the angle axis. Default: true */
  showAngleAxis?: boolean;
  /** Show the radius axis. Default: true */
  showRadiusAxis?: boolean;
}

export interface CategoricalChartProps extends ChartCommonProps {
  /** Data items passed to Recharts. */
  data?: CategoricalChartDatum[];
  /** Row key used for item labels. Default: "name" */
  nameKey?: string;
  /** Row key used for item values. Default: "value" */
  valueKey?: string;
  /** Show the legend. Default: true */
  showLegend?: boolean;
}

export interface HierarchicalChartProps extends ChartCommonProps {
  /** Hierarchical data items passed to Recharts. */
  data?: HierarchicalChartDatum[] | HierarchicalChartDatum;
  /** Row key used for node labels. Default: "name" */
  nameKey?: string;
  /** Row key used for node values. Default: "value" */
  valueKey?: string;
}

export interface SankeyChartProps extends ChartCommonProps {
  /** Sankey nodes and links. Links reference node indexes. */
  data?: SankeyChartData;
}

export type ChartProps = CartesianChartProps;
export type LineChartProps = Omit<CartesianChartProps, "type">;
export type BarChartProps = Omit<CartesianChartProps, "type" | "curve">;
export type AreaChartProps = Omit<CartesianChartProps, "type">;
export type ComposedChartProps = Omit<CartesianChartProps, "type">;
export type PieChartProps = CategoricalChartProps;
export type RadialBarChartProps = CategoricalChartProps;
export type FunnelChartProps = CategoricalChartProps;
export type TreemapChartProps = HierarchicalChartProps & { data?: HierarchicalChartDatum[] };
export type SunburstChartProps = HierarchicalChartProps & { data?: HierarchicalChartDatum };

export declare function Chart(props: ChartProps): React.ReactElement;
export declare function LineChart(props: LineChartProps): React.ReactElement;
export declare function BarChart(props: BarChartProps): React.ReactElement;
export declare function AreaChart(props: AreaChartProps): React.ReactElement;
export declare function ComposedChart(props: ComposedChartProps): React.ReactElement;
export declare function PieChart(props: PieChartProps): React.ReactElement;
export declare function ScatterChart(props: ScatterChartProps): React.ReactElement;
export declare function RadarChart(props: RadarChartProps): React.ReactElement;
export declare function RadialBarChart(props: RadialBarChartProps): React.ReactElement;
export declare function FunnelChart(props: FunnelChartProps): React.ReactElement;
export declare function TreemapChart(props: TreemapChartProps): React.ReactElement;
export declare function SankeyChart(props: SankeyChartProps): React.ReactElement;
export declare function SunburstChart(props: SunburstChartProps): React.ReactElement;
