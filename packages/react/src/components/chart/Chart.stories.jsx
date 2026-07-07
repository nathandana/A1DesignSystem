import { Chart } from "./Chart.jsx";
import { Card } from "../card/Card.jsx";
import { Grid } from "../grid/Grid.jsx";
import { Stack } from "../stack/Stack.jsx";

const monthlyData = [
  { month: "Jan", revenue: 32, expenses: 18, forecast: 26 },
  { month: "Feb", revenue: 40, expenses: 22, forecast: 30 },
  { month: "Mar", revenue: 36, expenses: 24, forecast: 34 },
  { month: "Apr", revenue: 48, expenses: 28, forecast: 39 },
  { month: "May", revenue: 56, expenses: 32, forecast: 45 },
  { month: "Jun", revenue: 64, expenses: 36, forecast: 52 },
];

const sampleSeries = [
  { key: "revenue", label: "Revenue", tone: "accent" },
  { key: "expenses", label: "Expenses", tone: "warn" },
  { key: "forecast", label: "Forecast", tone: "info" },
];

const meta = {
  title: "Components/Recharts/Chart",
  component: Chart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: monthlyData,
    xKey: "month",
    series: sampleSeries,
    type: "line",
    title: "Monthly performance",
    description: "Revenue, expenses, and forecast for the first half of the year.",
    height: "md",
    curve: "monotone",
    stacked: false,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    showXAxis: true,
    showYAxis: true,
  },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["line", "bar", "area", "composed"],
    },
    height: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
    },
    curve: {
      control: "inline-radio",
      options: ["linear", "monotone", "natural", "step"],
    },
    stacked: { control: "boolean" },
    showGrid: { control: "boolean" },
    showLegend: { control: "boolean" },
    showTooltip: { control: "boolean" },
    showXAxis: { control: "boolean" },
    showYAxis: { control: "boolean" },
  },
};

export default meta;

export const Default = {};

export const Bar = {
  args: {
    type: "bar",
    title: "Quarterly pipeline",
    description: "Open and committed pipeline by month.",
  },
};

export const Area = {
  args: {
    type: "area",
    stacked: true,
    title: "Capacity allocation",
    description: "Stacked area chart using A1 semantic series tones.",
  },
};

export const Composed = {
  args: {
    type: "composed",
    title: "Plan against actuals",
    description: "Bars show revenue and expenses; the line shows forecast.",
    series: [
      { key: "revenue", label: "Revenue", type: "bar", tone: "accent" },
      { key: "expenses", label: "Expenses", type: "bar", tone: "warn" },
      { key: "forecast", label: "Forecast", type: "line", tone: "info" },
    ],
  },
};

export const InCards = {
  render: () => (
    <Grid columns={{ xs: 1, lg: 2 }} gap="md">
      <Card>
        <Chart
          data={monthlyData}
          xKey="month"
          series={sampleSeries.slice(0, 2)}
          type="bar"
          title="Revenue mix"
          description="Two-series bar chart in a card."
          height="sm"
        />
      </Card>
      <Card>
        <Chart
          data={monthlyData}
          xKey="month"
          series={[
            { key: "forecast", label: "Forecast", tone: "info" },
            { key: "revenue", label: "Revenue", tone: "success" },
          ]}
          type="line"
          title="Forecast trend"
          description="Line chart with compact height."
          height="sm"
        />
      </Card>
    </Grid>
  ),
};

export const Heights = {
  render: () => (
    <Stack gap="lg">
      <Chart data={monthlyData} xKey="month" series={sampleSeries.slice(0, 1)} title="Extra small" height="xs" />
      <Chart data={monthlyData} xKey="month" series={sampleSeries.slice(0, 1)} title="Small" height="sm" />
      <Chart data={monthlyData} xKey="month" series={sampleSeries.slice(0, 1)} title="Medium" height="md" />
      <Chart data={monthlyData} xKey="month" series={sampleSeries.slice(0, 1)} title="Large" height="lg" />
    </Stack>
  ),
};
