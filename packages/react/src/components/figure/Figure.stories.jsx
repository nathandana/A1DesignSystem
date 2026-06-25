import { Figure } from "./Figure.jsx";
import sampleLandscape from "../../../../../examples/portfolio/img/scenic-large.jpg";
import samplePortrait from "../../../../../examples/portfolio/img/PortraitOfMyFather.jpg";

const SAMPLE_IMG = sampleLandscape;
const SAMPLE_PORTRAIT = samplePortrait;

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
      options: ["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "xxl", undefined],
    },
    align: {
      control: "inline-radio",
      options: ["none", "start", "center", "end"],
    },
    aspectRatio: {
      control: "select",
      options: [undefined, "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "9:16", "21:9"],
    },
    crop: {
      control: "select",
      options: ["center", "top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"],
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
      {["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "xxl"].map((s) => (
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

export const AspectRatios = {
  name: "Aspect ratios",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 640 }}>
      <Figure src={SAMPLE_IMG} alt="Mountain landscape" caption={'aspectRatio="16:9"'} aspectRatio="16:9" radius="md" />
      <Figure src={SAMPLE_PORTRAIT} alt="Office workspace" caption={'aspectRatio="1:1"'} aspectRatio="1:1" radius="md" />
    </div>
  ),
};

export const CropPoints = {
  name: "Crop points",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 640 }}>
      {["top-left", "top", "top-right", "left", "center", "right", "bottom-left", "bottom", "bottom-right"].map((c) => (
        <Figure
          key={c}
          src={SAMPLE_PORTRAIT}
          alt="Office workspace"
          caption={`crop="${c}"`}
          aspectRatio="1:1"
          crop={c}
          radius="sm"
        />
      ))}
    </div>
  ),
};

export const FreeformCrop = {
  name: "Freeform crop (cropRect)",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 640 }}>
      <Figure src={SAMPLE_IMG} alt="Mountain landscape" caption="Full image" radius="md" />
      <Figure
        src={SAMPLE_IMG}
        alt="Mountain landscape, cropped"
        caption="cropRect — centre detail"
        radius="md"
        cropRect={{ x: 0.3, y: 0.25, width: 0.4, height: 0.4 }}
      />
    </div>
  ),
};

/* ── Placeholder (missing / broken image) ─────────────────────────────────── */

export const Placeholder = {
  name: "Placeholder pattern",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: "var(--base-spacing-16)", flexWrap: "wrap" }}>
      <Figure src="" alt="No source" size="xs" aspectRatio="1:1" caption="No src" />
      <Figure src="https://example.com/does-not-exist.jpg" alt="Broken" size="xs" aspectRatio="1:1" caption="Failed to load" />
      <Figure src="" alt="Custom icon" size="xs" aspectRatio="1:1" placeholderIcon="broken_image" caption="Custom icon" />
    </div>
  ),
};
