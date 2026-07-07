import { BarChart } from "./Chart.jsx";

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
];

const meta = {
  title: "Components/Recharts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: monthlyData,
    xKey: "month",
    series: sampleSeries,
    title: "Quarterly pipeline",
    description: "Open and committed pipeline by month.",
    height: "md",
    stacked: false,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    showXAxis: true,
    showYAxis: true,
  },
  argTypes: {
    height: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
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

export const Stacked = {
  args: {
    stacked: true,
    series: [
      { key: "revenue", label: "Revenue", tone: "accent" },
      { key: "expenses", label: "Expenses", tone: "warn" },
      { key: "forecast", label: "Forecast", tone: "info" },
    ],
    title: "Capacity by segment",
    description: "Stacked bars keep related totals comparable.",
  },
};
