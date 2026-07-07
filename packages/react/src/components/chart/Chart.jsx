import { useId } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ComposedChart as RechartsComposedChart,
  Funnel,
  FunnelChart as RechartsFunnelChart,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  ResponsiveContainer,
  Sankey as RechartsSankey,
  Scatter,
  ScatterChart as RechartsScatterChart,
  SunburstChart as RechartsSunburstChart,
  Tooltip as RechartsTooltip,
  Treemap as RechartsTreemap,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import "./chart.css";

const CARTESIAN_TYPES = ["line", "bar", "area", "composed"];
const HEIGHTS = ["sm", "md", "lg"];
const VARIANTS = ["default", "subtle"];
const CURVES = ["linear", "monotone", "natural", "step"];
const SERIES_TYPES = ["line", "bar", "area"];
const SERIES_TONES = ["accent", "info", "success", "warn", "error", "neutral"];

const CARTESIAN_COMPONENTS = {
  line: RechartsLineChart,
  bar: RechartsBarChart,
  area: RechartsAreaChart,
  composed: RechartsComposedChart,
};

function defaultFormatValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat().format(value);
  }
  return value;
}

function defaultFormatLabel(value) {
  return value;
}

function inferSeries(data, xKey) {
  const firstRow = Array.isArray(data) ? data.find((row) => row && typeof row === "object") : null;
  if (!firstRow) return [];
  return Object.keys(firstRow)
    .filter((key) => key !== xKey && typeof firstRow[key] === "number")
    .map((key) => ({ key, label: key }));
}

function normalizeSeries(series, data, xKey) {
  const source = Array.isArray(series) && series.length > 0 ? series : inferSeries(data, xKey);
  return source
    .filter((item) => item && typeof item.key === "string" && item.key.length > 0 && !item.hidden)
    .map((item, index) => {
      const tone = SERIES_TONES.includes(item.tone) ? item.tone : SERIES_TONES[index % SERIES_TONES.length];
      return {
        ...item,
        label: item.label ?? item.key,
        tone,
      };
    });
}

function normalizeScatterSeries(series, data) {
  const source = Array.isArray(series) && series.length > 0
    ? series
    : [{ key: "values", label: "Values", data }];
  return source
    .filter((item) => item && !item.hidden)
    .map((item, index) => {
      const tone = SERIES_TONES.includes(item.tone) ? item.tone : SERIES_TONES[index % SERIES_TONES.length];
      return {
        ...item,
        key: item.key ?? `series-${index}`,
        label: item.label ?? item.key ?? `Series ${index + 1}`,
        data: Array.isArray(item.data) ? item.data : data,
        tone,
      };
    });
}

function resolveSeriesType(chartType, seriesType) {
  if (chartType !== "composed") return chartType;
  return SERIES_TYPES.includes(seriesType) ? seriesType : "line";
}

function seriesColor(tone) {
  return `var(--component-chart-series-${tone})`;
}

function colorForIndex(index) {
  return seriesColor(SERIES_TONES[index % SERIES_TONES.length]);
}

function datumColor(datum, index) {
  return SERIES_TONES.includes(datum?.tone) ? seriesColor(datum.tone) : colorForIndex(index);
}

function withCategoricalFills(data) {
  return Array.isArray(data)
    ? data.map((datum, index) => ({
      ...datum,
      fill: datum?.fill ?? datumColor(datum, index),
    }))
    : [];
}

function numericValue(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeSunburstNode(node, valueKey, index, inheritedFill, colorIndex = index) {
  const source = node && typeof node === "object" ? node : { name: `Item ${index + 1}` };
  const fill = source.fill ?? (SERIES_TONES.includes(source.tone) ? datumColor(source, colorIndex) : colorForIndex(colorIndex)) ?? inheritedFill;
  const children = Array.isArray(source.children)
    ? source.children.map((child, childIndex) => normalizeSunburstNode(child, valueKey, childIndex, fill, colorIndex + childIndex + 1))
    : undefined;
  const childTotal = children?.reduce((total, child) => total + numericValue(child?.[valueKey]), 0) ?? 0;
  const value = numericValue(source[valueKey]) || childTotal;

  return {
    ...source,
    [valueKey]: value,
    fill,
    ...(children ? { children } : {}),
  };
}

function normalizeHierarchyNode(node, valueKey, index) {
  const source = node && typeof node === "object" ? node : { name: `Item ${index + 1}` };
  const children = Array.isArray(source.children)
    ? source.children.map((child, childIndex) => normalizeHierarchyNode(child, valueKey, childIndex))
    : undefined;
  const childTotal = children?.reduce((total, child) => total + numericValue(child?.[valueKey]), 0) ?? 0;
  const value = numericValue(source[valueKey]) || childTotal;

  return {
    ...source,
    [valueKey]: value,
    fill: source.fill ?? datumColor(source, index),
    ...(children ? { children } : {}),
  };
}

function normalizeHierarchyData(data, valueKey) {
  return Array.isArray(data)
    ? data.map((node, index) => normalizeHierarchyNode(node, valueKey, index))
    : [];
}

function normalizeSunburstData(data, valueKey) {
  const source = data && typeof data === "object" ? data : { name: "Root", children: [] };
  const children = Array.isArray(source.children)
    ? source.children.map((child, index) => normalizeSunburstNode(child, valueKey, index))
    : [];
  const childTotal = children.reduce((total, child) => total + numericValue(child?.[valueKey]), 0);
  const value = numericValue(source[valueKey]) || childTotal;

  return {
    ...source,
    [valueKey]: value,
    children,
  };
}

function normalizeSankeyData(data) {
  const nodes = Array.isArray(data?.nodes)
    ? data.nodes.map((node, index) => ({
      ...node,
      fill: node?.fill ?? colorForIndex(index),
    }))
    : [];
  const links = Array.isArray(data?.links)
    ? data.links.map((link, index) => ({
      ...link,
      stroke: link?.stroke ?? colorForIndex(index),
    }))
    : [];

  return { nodes, links };
}

function TreemapContent({ x, y, width, height, name, fill, stroke = "var(--component-chart-tooltip-background)" }) {
  if (width <= 0 || height <= 0) return null;
  const label = name == null ? "" : String(name);
  const labelWidth = label.length * 7.5;
  const showLabel = label.length > 0 && width > labelWidth + 20 && height > 28;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
      />
      {showLabel && (
        <text className="a1-chart__treemap-label" x={x + 8} y={y + 18}>
          {label}
        </text>
      )}
    </g>
  );
}

function SankeyNode({ x, y, width, height, payload }) {
  const fill = payload?.fill ?? "var(--component-chart-series-accent)";
  const label = payload?.name;

  return (
    <g>
      <rect
        className="recharts-sankey-node"
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity={1}
        stroke="var(--component-chart-tooltip-background)"
      />
      {label && (
        <text
          className="a1-chart__sankey-label"
          x={x + width + 8}
          y={y + Math.max(12, height / 2)}
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function getStackId(series, stacked) {
  if (series.stackId != null) return series.stackId;
  return stacked ? "a1-chart-stack" : undefined;
}

function getChartLabelProps(title, titleId, ariaLabel) {
  return title
    ? { "aria-labelledby": titleId }
    : (ariaLabel ? { "aria-label": ariaLabel } : {});
}

function ChartTooltip({ active, payload, label, formatLabel, formatValue }) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;

  const labelContent = (formatLabel ?? defaultFormatLabel)(label);

  return (
    <div className="a1-chart__tooltip" role="status">
      {labelContent != null && labelContent !== "" && (
        <div className="a1-chart__tooltip-label">{labelContent}</div>
      )}
      <ul className="a1-chart__tooltip-list">
        {payload.map((entry, index) => {
          const key = entry.dataKey ?? entry.name ?? index;
          const formatted = (formatValue ?? defaultFormatValue)(entry.value, key, entry.payload);
          const color = entry.color ?? entry.stroke ?? entry.fill ?? datumColor(entry.payload, index);
          return (
            <li className="a1-chart__tooltip-item" key={`${String(key)}-${index}`}>
              <span
                className="a1-chart__tooltip-swatch"
                style={color ? { "--a1-chart-tooltip-swatch-color": color } : undefined}
                aria-hidden="true"
              />
              <span className="a1-chart__tooltip-name">{entry.name ?? entry.payload?.name ?? key}</span>
              <span className="a1-chart__tooltip-value">{formatted}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LegendLabel(value) {
  return <span className="a1-chart__legend-label">{value}</span>;
}

function ChartFrame({
  title,
  description,
  height = "md",
  variant = "default",
  className = "",
  ariaLabel,
  ariaDescribedBy,
  children,
  ...props
}) {
  const titleId = useId();
  const descriptionId = useId();
  const resolvedHeight = HEIGHTS.includes(height) ? height : "md";
  const resolvedVariant = VARIANTS.includes(variant) ? variant : "default";
  const describedBy = [description ? descriptionId : null, ariaDescribedBy].filter(Boolean).join(" ") || undefined;
  const chartLabelProps = getChartLabelProps(title, titleId, ariaLabel);

  const classes = [
    "a1-chart",
    resolvedHeight !== "md" && `a1-chart--height-${resolvedHeight}`,
    resolvedVariant !== "default" && `a1-chart--variant-${resolvedVariant}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <figure className={classes} {...props}>
      {(title || description) && (
        <figcaption className="a1-chart__caption">
          {title && <div className="a1-chart__title" id={titleId}>{title}</div>}
          {description && <div className="a1-chart__description" id={descriptionId}>{description}</div>}
        </figcaption>
      )}
      <div className="a1-chart__plot">
        {children({ chartLabelProps, describedBy })}
      </div>
    </figure>
  );
}

function ChartResponsive({ children }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  );
}

function renderSeries(series, index, chartType, curve, stacked) {
  const renderedType = resolveSeriesType(chartType, series.type);
  const color = seriesColor(series.tone);
  const commonProps = {
    dataKey: series.key,
    name: series.label,
    isAnimationActive: false,
  };

  if (renderedType === "bar") {
    return (
      <Bar
        key={`${series.key}-${index}`}
        {...commonProps}
        fill={color}
        stackId={getStackId(series, stacked)}
      />
    );
  }

  if (renderedType === "area") {
    return (
      <Area
        key={`${series.key}-${index}`}
        {...commonProps}
        type={curve}
        stroke={color}
        fill={color}
        stackId={getStackId(series, stacked)}
        dot={false}
      />
    );
  }

  return (
    <Line
      key={`${series.key}-${index}`}
      {...commonProps}
      type={curve}
      stroke={color}
      dot={false}
    />
  );
}

function ChartTooltipElement({ formatLabel, formatValue }) {
  return (
    <RechartsTooltip
      cursor={{ stroke: "var(--component-chart-cursor-color)" }}
      content={(
        <ChartTooltip
          formatLabel={formatLabel}
          formatValue={formatValue}
        />
      )}
    />
  );
}

function CartesianChart({
  data = [],
  xKey = "name",
  series = [],
  type = "line",
  curve = "monotone",
  stacked = false,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const resolvedType = CARTESIAN_TYPES.includes(type) ? type : "line";
  const resolvedCurve = CURVES.includes(curve) ? curve : "monotone";
  const resolvedXKey = typeof xKey === "string" && xKey.length > 0 ? xKey : "name";
  const resolvedSeries = normalizeSeries(series, data, resolvedXKey);
  const ChartComponent = CARTESIAN_COMPONENTS[resolvedType];

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      {...props}
    >
      {({ chartLabelProps, describedBy }) => (
        <ChartResponsive>
          <ChartComponent
            data={data}
            accessibilityLayer
            {...chartLabelProps}
            aria-describedby={describedBy}
          >
            {showGrid && <CartesianGrid vertical={false} stroke="var(--component-chart-grid-color)" />}
            {showXAxis && (
              <XAxis
                dataKey={resolvedXKey}
                tickLine={false}
                axisLine={{ stroke: "var(--component-chart-axis-line-color)" }}
                tick={{ fill: "var(--component-chart-axis-tick-color)" }}
              />
            )}
            {showYAxis && (
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--component-chart-axis-line-color)" }}
                tick={{ fill: "var(--component-chart-axis-tick-color)" }}
                tickFormatter={(value) => {
                  const formatted = (formatValue ?? defaultFormatValue)(value);
                  return typeof formatted === "string" || typeof formatted === "number" ? formatted : value;
                }}
              />
            )}
            {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
            {showLegend && <Legend iconType="circle" formatter={LegendLabel} />}
            {resolvedSeries.map((item, index) => renderSeries(item, index, resolvedType, resolvedCurve, stacked))}
          </ChartComponent>
        </ChartResponsive>
      )}
    </ChartFrame>
  );
}

function CategoricalCells({ data }) {
  return data.map((datum, index) => (
    <Cell key={`${datum?.name ?? "item"}-${index}`} fill={datumColor(datum, index)} />
  ));
}

function PieLikeChart({
  data = [],
  nameKey = "name",
  valueKey = "value",
  showLegend = true,
  showTooltip = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const chartData = withCategoricalFills(data);

  return (
    <ChartFrame title={title} description={description} height={height} className={className} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} {...props}>
      {({ chartLabelProps, describedBy }) => (
        <ChartResponsive>
          <RechartsPieChart accessibilityLayer {...chartLabelProps} aria-describedby={describedBy}>
            {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
            {showLegend && <Legend iconType="circle" formatter={LegendLabel} />}
            <Pie
              data={chartData}
              dataKey={valueKey}
              nameKey={nameKey}
              isAnimationActive={false}
            >
              <CategoricalCells data={chartData} />
            </Pie>
          </RechartsPieChart>
        </ChartResponsive>
      )}
    </ChartFrame>
  );
}

function ScatterLikeChart({
  data = [],
  xKey = "x",
  yKey = "y",
  zKey,
  series = [],
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const resolvedSeries = normalizeScatterSeries(series, data);

  return (
    <ChartFrame title={title} description={description} height={height} className={className} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} {...props}>
      {({ chartLabelProps, describedBy }) => (
        <ChartResponsive>
          <RechartsScatterChart accessibilityLayer {...chartLabelProps} aria-describedby={describedBy}>
            {showGrid && <CartesianGrid stroke="var(--component-chart-grid-color)" />}
            {showXAxis && (
              <XAxis
                type="number"
                dataKey={xKey}
                tickLine={false}
                axisLine={{ stroke: "var(--component-chart-axis-line-color)" }}
                tick={{ fill: "var(--component-chart-axis-tick-color)" }}
              />
            )}
            {showYAxis && (
              <YAxis
                type="number"
                dataKey={yKey}
                tickLine={false}
                axisLine={{ stroke: "var(--component-chart-axis-line-color)" }}
                tick={{ fill: "var(--component-chart-axis-tick-color)" }}
              />
            )}
            {zKey && <ZAxis dataKey={zKey} />}
            {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
            {showLegend && <Legend iconType="circle" formatter={LegendLabel} />}
            {resolvedSeries.map((item) => (
              <Scatter
                key={item.key}
                name={item.label}
                data={item.data}
                fill={seriesColor(item.tone)}
                isAnimationActive={false}
              />
            ))}
          </RechartsScatterChart>
        </ChartResponsive>
      )}
    </ChartFrame>
  );
}

function RadarLikeChart({
  data = [],
  axisKey = "name",
  series = [],
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showAngleAxis = true,
  showRadiusAxis = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const resolvedSeries = normalizeSeries(series, data, axisKey);

  return (
    <ChartFrame title={title} description={description} height={height} className={className} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} {...props}>
      {({ chartLabelProps, describedBy }) => (
        <ChartResponsive>
          <RechartsRadarChart data={data} outerRadius="88%" accessibilityLayer {...chartLabelProps} aria-describedby={describedBy}>
            {showGrid && <PolarGrid stroke="var(--component-chart-grid-color)" />}
            {showAngleAxis && <PolarAngleAxis dataKey={axisKey} tick={{ fill: "var(--component-chart-axis-tick-color)" }} />}
            {showRadiusAxis && <PolarRadiusAxis tick={{ fill: "var(--component-chart-axis-tick-color)" }} axisLine={false} tickLine={false} />}
            {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
            {showLegend && <Legend iconType="circle" formatter={LegendLabel} />}
            {resolvedSeries.map((item) => (
              <Radar
                key={item.key}
                name={item.label}
                dataKey={item.key}
                stroke={seriesColor(item.tone)}
                fill={seriesColor(item.tone)}
                fillOpacity="var(--component-chart-area-fill-opacity)"
                isAnimationActive={false}
              />
            ))}
          </RechartsRadarChart>
        </ChartResponsive>
      )}
    </ChartFrame>
  );
}

function RadialBarLikeChart({
  data = [],
  nameKey = "name",
  valueKey = "value",
  showLegend = true,
  showTooltip = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const chartData = withCategoricalFills(data);

  return (
    <ChartFrame title={title} description={description} height={height} className={className} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} {...props}>
      {({ chartLabelProps, describedBy }) => (
        <ChartResponsive>
          <RechartsRadialBarChart data={chartData} accessibilityLayer {...chartLabelProps} aria-describedby={describedBy}>
            {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
            {showLegend && <Legend iconType="circle" formatter={LegendLabel} />}
            <RadialBar
              dataKey={valueKey}
              nameKey={nameKey}
              background={{ fill: "var(--component-chart-grid-color)" }}
              isAnimationActive={false}
            >
              <CategoricalCells data={chartData} />
            </RadialBar>
          </RechartsRadialBarChart>
        </ChartResponsive>
      )}
    </ChartFrame>
  );
}

function FunnelLikeChart({
  data = [],
  nameKey = "name",
  valueKey = "value",
  showLegend = true,
  showTooltip = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const chartData = withCategoricalFills(data);

  return (
    <ChartFrame title={title} description={description} height={height} className={className} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} {...props}>
      {({ chartLabelProps, describedBy }) => (
        <ChartResponsive>
          <RechartsFunnelChart accessibilityLayer {...chartLabelProps} aria-describedby={describedBy}>
            {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
            {showLegend && <Legend iconType="circle" formatter={LegendLabel} />}
            <Funnel
              data={chartData}
              dataKey={valueKey}
              nameKey={nameKey}
              fillOpacity={1}
              isAnimationActive={false}
            >
              <CategoricalCells data={chartData} />
            </Funnel>
          </RechartsFunnelChart>
        </ChartResponsive>
      )}
    </ChartFrame>
  );
}

function TreemapLikeChart({
  data = [],
  nameKey = "name",
  valueKey = "value",
  showTooltip = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const chartData = normalizeHierarchyData(data, valueKey);

  return (
    <ChartFrame title={title} description={description} height={height} className={className} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} {...props}>
      {({ chartLabelProps, describedBy }) => (
        <ChartResponsive>
          <RechartsTreemap
            data={chartData}
            dataKey={valueKey}
            nameKey={nameKey}
            colorPanel={SERIES_TONES.map(seriesColor)}
            fill="var(--component-chart-series-accent)"
            stroke="var(--component-chart-tooltip-background)"
            content={TreemapContent}
            isAnimationActive={false}
            {...chartLabelProps}
            aria-describedby={describedBy}
          >
            {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
          </RechartsTreemap>
        </ChartResponsive>
      )}
    </ChartFrame>
  );
}

function SankeyLikeChart({
  data = { nodes: [], links: [] },
  showTooltip = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const chartData = normalizeSankeyData(data);

  return (
    <ChartFrame title={title} description={description} height={height} className={className} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} {...props}>
      {({ chartLabelProps, describedBy }) => (
        <ChartResponsive>
          <RechartsSankey
            data={chartData}
            node={{ fill: "var(--component-chart-series-accent)", stroke: "var(--component-chart-tooltip-background)" }}
            link={{ stroke: "var(--component-chart-series-info)", strokeOpacity: 0.24 }}
            nodePadding={24}
            nodeWidth={16}
            node={<SankeyNode />}
            {...chartLabelProps}
            aria-describedby={describedBy}
          >
            {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
          </RechartsSankey>
        </ChartResponsive>
      )}
    </ChartFrame>
  );
}

function SunburstLikeChart({
  data = { name: "Root", children: [] },
  nameKey = "name",
  valueKey = "value",
  showTooltip = true,
  formatValue,
  formatLabel,
  title,
  description,
  height,
  className,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) {
  const chartData = normalizeSunburstData(data, valueKey);

  return (
    <ChartFrame title={title} description={description} height={height} className={className} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} {...props}>
      {({ chartLabelProps, describedBy }) => (
        <RechartsSunburstChart
          className="a1-chart__sunburst"
          data={chartData}
          dataKey={valueKey}
          nameKey={nameKey}
          responsive
          fill="var(--component-chart-series-accent)"
          stroke="var(--component-chart-tooltip-background)"
          textOptions={{
            fill: "var(--component-chart-fill-label-color)",
            fontSize: "var(--component-chart-legend-font-size)",
            fontWeight: "var(--base-font-weight-semibold)",
            pointerEvents: "none",
          }}
          {...chartLabelProps}
          aria-describedby={describedBy}
        >
          {showTooltip && <ChartTooltipElement formatLabel={formatLabel} formatValue={formatValue} />}
        </RechartsSunburstChart>
      )}
    </ChartFrame>
  );
}

export function Chart({ type = "line", "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return (
    <CartesianChart
      {...props}
      type={type}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
    />
  );
}

export function LineChart({ type: _type, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <CartesianChart {...props} type="line" ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function BarChart({ type: _type, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <CartesianChart {...props} type="bar" ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function AreaChart({ type: _type, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <CartesianChart {...props} type="area" ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function ComposedChart({ type: _type, "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <CartesianChart {...props} type="composed" ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function PieChart({ "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <PieLikeChart {...props} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function ScatterChart({ "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <ScatterLikeChart {...props} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function RadarChart({ "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <RadarLikeChart {...props} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function RadialBarChart({ "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <RadialBarLikeChart {...props} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function FunnelChart({ "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <FunnelLikeChart {...props} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function TreemapChart({ "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <TreemapLikeChart {...props} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function SankeyChart({ "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <SankeyLikeChart {...props} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}

export function SunburstChart({ "aria-label": ariaLabel, "aria-describedby": ariaDescribedBy, ...props }) {
  return <SunburstLikeChart {...props} ariaLabel={ariaLabel} ariaDescribedBy={ariaDescribedBy} />;
}
