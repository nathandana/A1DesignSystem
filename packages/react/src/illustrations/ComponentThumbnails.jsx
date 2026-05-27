import React from "react";

const svgProps = {
  viewBox: "0 0 80 56",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": "true",
  focusable: "false",
};

export function AlertThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="8" width="72" height="40" rx="3" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
      <rect x="4" y="8" width="5" height="40" fill="#94A3B8" rx="1" />
      <circle cx="20" cy="28" r="4" fill="#94A3B8" />
      <rect x="30" y="21" width="42" height="4" rx="2" fill="#CBD5E1" />
      <rect x="30" y="29" width="34" height="4" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function BannerThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="0" y="0" width="80" height="16" fill="#94A3B8" />
      <rect x="8" y="5" width="36" height="5" rx="2" fill="white" opacity="0.6" />
      <rect x="4" y="26" width="72" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="34" width="60" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="42" width="48" height="4" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function ButtonThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="16" y="18" width="48" height="20" rx="3" fill="#94A3B8" />
      <rect x="22" y="24" width="36" height="5" rx="2" fill="white" opacity="0.65" />
    </svg>
  );
}

export function CardThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="4" width="72" height="48" rx="3" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
      <rect x="10" y="12" width="44" height="6" rx="2" fill="#94A3B8" />
      <rect x="10" y="24" width="60" height="4" rx="2" fill="#CBD5E1" />
      <rect x="10" y="32" width="52" height="4" rx="2" fill="#CBD5E1" />
      <rect x="10" y="40" width="40" height="4" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function ChecklistThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="8" width="10" height="10" rx="2" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
      <path d="M6 13 L9 16 L14 10" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20" y="11" width="52" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="24" width="10" height="10" rx="2" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
      <path d="M6 29 L9 32 L14 26" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20" y="27" width="44" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="40" width="10" height="10" rx="2" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
      <rect x="20" y="43" width="56" height="4" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function DetailsThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <path d="M4 14 L12 18 L4 22 Z" fill="#94A3B8" />
      <rect x="16" y="13" width="48" height="6" rx="2" fill="#94A3B8" opacity="0.7" />
      <line x1="14" y1="26" x2="76" y2="26" stroke="#CBD5E1" strokeWidth="1" />
      <rect x="14" y="30" width="58" height="4" rx="2" fill="#CBD5E1" />
      <rect x="14" y="38" width="52" height="4" rx="2" fill="#CBD5E1" />
      <rect x="14" y="46" width="44" height="4" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function FormThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="4" width="28" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="4" y="10" width="72" height="10" rx="2" stroke="#94A3B8" strokeWidth="1" fill="none" />
      <rect x="4" y="26" width="24" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="4" y="32" width="72" height="10" rx="2" stroke="#94A3B8" strokeWidth="1" fill="none" />
      <rect x="52" y="46" width="24" height="8" rx="2" fill="#94A3B8" />
      <rect x="56" y="48" width="16" height="4" rx="2" fill="white" opacity="0.65" />
    </svg>
  );
}

export function HeadingThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="8" width="52" height="9" rx="2" fill="#94A3B8" />
      <rect x="4" y="24" width="72" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="32" width="64" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="40" width="52" height="4" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function ImageThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="4" width="72" height="48" rx="3" stroke="#CBD5E1" strokeWidth="1.5" fill="#F8FAFC" />
      <circle cx="22" cy="18" r="6" fill="#CBD5E1" />
      <path d="M4 48 L24 30 L40 40 L56 24 L76 40 L76 52 L4 52 Z" fill="#E2E8F0" />
    </svg>
  );
}

export function LinkThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="22" width="52" height="5" rx="2" fill="#94A3B8" />
      <line x1="4" y1="29" x2="56" y2="29" stroke="#94A3B8" strokeWidth="1" />
      <path d="M62 24 L74 28 L62 32" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="62" y1="28" x2="74" y2="28" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ListThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="10" cy="14" r="3" fill="#CBD5E1" />
      <rect x="18" y="11" width="54" height="5" rx="2" fill="#CBD5E1" />
      <circle cx="10" cy="28" r="3" fill="#CBD5E1" />
      <rect x="18" y="25" width="48" height="5" rx="2" fill="#CBD5E1" />
      <circle cx="10" cy="42" r="3" fill="#CBD5E1" />
      <rect x="18" y="39" width="56" height="5" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function ParagraphThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="6" width="72" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="14" width="68" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="22" width="72" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="30" width="56" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="42" width="72" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="50" width="44" height="4" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function StatusThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="20" y="20" width="40" height="16" rx="8" fill="#94A3B8" />
      <rect x="26" y="25" width="28" height="5" rx="2" fill="white" opacity="0.65" />
    </svg>
  );
}

export function TableThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="6" width="72" height="44" rx="2" stroke="#CBD5E1" strokeWidth="1" fill="none" />
      <rect x="4" y="6" width="72" height="12" fill="#E2E8F0" rx="1" />
      <line x1="30" y1="6" x2="30" y2="50" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="56" y1="6" x2="56" y2="50" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="4" y1="28" x2="76" y2="28" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="4" y1="39" x2="76" y2="39" stroke="#CBD5E1" strokeWidth="1" />
      <rect x="8" y="9" width="18" height="5" rx="1" fill="#94A3B8" opacity="0.5" />
      <rect x="34" y="9" width="16" height="5" rx="1" fill="#94A3B8" opacity="0.5" />
      <rect x="60" y="9" width="12" height="5" rx="1" fill="#94A3B8" opacity="0.5" />
    </svg>
  );
}

export function TabsThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <rect x="4" y="8" width="22" height="12" rx="2" fill="#94A3B8" />
      <rect x="4" y="20" width="22" height="2" fill="#94A3B8" />
      <rect x="28" y="8" width="20" height="12" rx="2" stroke="#CBD5E1" strokeWidth="1" fill="none" />
      <rect x="50" y="8" width="20" height="12" rx="2" stroke="#CBD5E1" strokeWidth="1" fill="none" />
      <rect x="4" y="28" width="72" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="36" width="60" height="4" rx="2" fill="#CBD5E1" />
      <rect x="4" y="44" width="48" height="4" rx="2" fill="#CBD5E1" />
    </svg>
  );
}

export function TimelineThumbnail(props) {
  return (
    <svg {...svgProps} {...props}>
      <line x1="18" y1="6" x2="18" y2="50" stroke="#E2E8F0" strokeWidth="2" />
      <circle cx="18" cy="14" r="5" fill="#94A3B8" />
      <rect x="28" y="11" width="44" height="4" rx="2" fill="#CBD5E1" />
      <rect x="28" y="18" width="32" height="3" rx="1.5" fill="#E2E8F0" />
      <circle cx="18" cy="30" r="5" fill="#94A3B8" />
      <rect x="28" y="27" width="40" height="4" rx="2" fill="#CBD5E1" />
      <rect x="28" y="34" width="28" height="3" rx="1.5" fill="#E2E8F0" />
      <circle cx="18" cy="46" r="5" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
      <rect x="28" y="43" width="36" height="4" rx="2" fill="#E2E8F0" />
    </svg>
  );
}

export const componentThumbnailMap = {
  Alert: AlertThumbnail,
  Banner: BannerThumbnail,
  Button: ButtonThumbnail,
  Card: CardThumbnail,
  Checklist: ChecklistThumbnail,
  Details: DetailsThumbnail,
  Form: FormThumbnail,
  Heading: HeadingThumbnail,
  Image: ImageThumbnail,
  Link: LinkThumbnail,
  List: ListThumbnail,
  Paragraph: ParagraphThumbnail,
  Status: StatusThumbnail,
  "Status summary": StatusThumbnail,
  Table: TableThumbnail,
  Tabs: TabsThumbnail,
  Timeline: TimelineThumbnail,
};
