import samplePortrait from "../../../../../examples/portfolio/img/PortraitOfMyFather.jpg";
import { Avatar } from "./Avatar.jsx";
import { Stack } from "../stack/Stack.jsx";

const meta = {
  title: "Components/Media/Avatar",
  component: Avatar,
  tags: ["autodocs", "avatar"],
  parameters: { layout: "padded" },
  args: {
    name: "Morgan Lee",
    size: "md",
  },
  argTypes: {
    name: { control: "text" },
    src: { control: "text" },
    alt: { control: "text" },
    initials: { control: "text" },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
};

export default meta;

export const Initials = {};

export const Image = {
  args: {
    name: "Morgan Lee",
    src: samplePortrait,
    alt: "Morgan Lee",
  },
};

export const Sizes = {
  render: () => (
    <Stack direction="row" gap="md" align="center" wrap>
      {(["xs", "sm", "md", "lg", "xl"]).map((size) => (
        <Avatar key={size} name="Morgan Lee" size={size} />
      ))}
    </Stack>
  ),
};

export const ImageFallback = {
  name: "Image fallback",
  args: {
    name: "Morgan Lee",
    src: "/missing-avatar-image.jpg",
  },
};
