import { Figure } from "./Figure.jsx";

const SAMPLE_IMG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80";
const SAMPLE_PORTRAIT = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80";

const meta = {
  title: "Components/Media/Figure",
  component: Figure,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    caption: { control: "text" },
    alt: { control: "text" },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", undefined],
    },
    captionPosition: {
      control: "inline-radio",
      options: ["start", "center"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", undefined],
    },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
    },
  },
};

export default meta;

export const Default = {
  name: "Figure",
  args: {
    src: SAMPLE_IMG,
    alt: "Mountain landscape at sunset",
    caption: "A scenic mountain landscape photographed at golden hour.",
    radius: undefined,
    captionPosition: "start",
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <Figure {...args} />
    </div>
  ),
};

export const WithoutCaption = {
  name: "Without caption",
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Figure src={SAMPLE_IMG} alt="Mountain landscape" />
    </div>
  ),
};

export const CaptionCentered = {
  name: "Caption — centered",
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Figure
        src={SAMPLE_IMG}
        alt="Mountain landscape"
        caption="Centered captions work well under full-width editorial images."
        captionPosition="center"
      />
    </div>
  ),
};

export const RadiusScale = {
  name: "Radius scale",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 480 }}>
      {["none", "sm", "md", "lg"].map((r) => (
        <Figure
          key={r}
          src={SAMPLE_PORTRAIT}
          alt="Office workspace"
          caption={`radius="${r}"`}
          radius={r}
        />
      ))}
    </div>
  ),
};

export const SizeScale = {
  name: "Size scale",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {["xs", "sm", "md", "lg"].map((s) => (
        <Figure
          key={s}
          src={SAMPLE_IMG}
          alt="Mountain landscape"
          caption={`size="${s}"`}
          size={s}
        />
      ))}
    </div>
  ),
};
