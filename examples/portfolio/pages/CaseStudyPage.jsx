import {
  Blockquote,
  Card,
  Divider,
  Figure,
  Heading,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from "../../../packages/react/src/index.js";

// Normalize a field that may be a string or an object with a `text` key.
// Returns null if the value is falsy.
function asText(val) {
  if (!val) return null;
  return typeof val === "string" ? { text: val } : val;
}

// Normalize a section's image field. Supports:
//   string:  section.image, section.imageAlt, section.imageStyle, section.caption (legacy)
//   object:  { src, alt, caption, imgStyle, marginTop, marginBottom, radius, ... }
function asImage(section) {
  if (!section.image) return null;
  if (typeof section.image === "object") {
    const { style, ...rest } = section.image;
    return { imgStyle: style, marginTop: "lg", marginBottom: "lg", ...rest };
  }
  return {
    src: section.image,
    alt: section.imageAlt ?? "",
    caption: section.caption,
    imgStyle: section.imageStyle,
    marginTop: "lg",
    marginBottom: "lg",
  };
}

// Normalize an extraImages entry, which may already be an object with any Figure props.
function asExtraImage(img) {
  const { style, ...rest } = img;
  return { imgStyle: style, marginTop: "lg", marginBottom: "lg", ...rest };
}

// Normalize a paragraph entry: string → { text }, object passes through.
function asParagraph(p) {
  return typeof p === "string" ? { text: p } : p;
}

// Normalize a quote field: string or { text, variant, cite }.
function asQuote(val) {
  if (!val) return null;
  return typeof val === "string" ? { text: val } : val;
}

export function CaseStudyPage({ study }) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Section inverse padding="md" contentWidth="lg" gap="md">
        <Stack direction="row" gap="md" wrap>
          {study.tags.map((tag) => (
            <MessageBadge key={tag} size="lg">{tag}</MessageBadge>
          ))}
        </Stack>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "xxl" }}>
          {study.title}
        </Heading>
        {study.meta && (
          <dl className="pf-study-meta">
            {study.meta.map(({ label, value }) => (
              <div key={label} className="pf-study-meta-item">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <Section as="div" padding="lg" contentWidth="md">

        {/* Cover image */}
        {study.coverImage && (
          <Figure
            src={study.coverImage}
            alt={`${study.title} cover`}
            marginBottom="lg"
            {...(typeof study.coverImage === "object" ? study.coverImage : {})}
          />
        )}

        {/* Intro paragraphs */}
        {study.intro?.map((p, i) => {
          const { text, ...rest } = asParagraph(p);
          return <Paragraph key={i} size="lg" {...rest}>{text}</Paragraph>;
        })}

        {/* Impact card */}
        {study.impact && (
          <Card shadow="xs">
            <Heading as="h2" size="md" margin="md">Impact</Heading>
            <List variant="unordered" size="lg">
              {study.impact.map((item, i) => (
                <ListItem key={i}>{item}</ListItem>
              ))}
            </List>
          </Card>
        )}

        {/* Sections */}
        {study.sections?.map((section, i) => {
          const heading    = asText(section.heading);
          const subHeading = asText(section.subHeading);
          const imgBlock   = asImage(section);
          const quote      = asQuote(section.quote);

          return (
            <div key={i}>

              {heading && (() => {
                const { text, ...rest } = heading;
                return <Heading as="h2" size="xl" margin="md" {...rest}>{text}</Heading>;
              })()}

              {subHeading && (() => {
                const { text, ...rest } = subHeading;
                return <Heading as="h3" size="lg" margin="md" {...rest}>{text}</Heading>;
              })()}

              {section.paragraphs?.map((p, j) => {
                const { text, ...rest } = asParagraph(p);
                return <Paragraph key={j} size="lg" {...rest}>{text}</Paragraph>;
              })}

              {section.orderedList && (
                <>
                  <List as="ol" size="md" marginBottom="lg" {...(section.listProps ?? {})}>
                    {section.orderedList.map((item, k) => <ListItem key={k}>{item}</ListItem>)}
                  </List>
                  <Divider space="lg" size="md" />
                </>
              )}

              {quote && (() => {
                const { text, variant = "border", ...rest } = quote;
                return <Blockquote variant={variant} {...rest}>{text}</Blockquote>;
              })()}

              {imgBlock && (() => {
                const { src, alt = "", ...rest } = imgBlock;
                return <Figure src={src} alt={alt} {...rest} />;
              })()}

              {section.extraImages?.map((img, k) => {
                const { src, alt = "", ...rest } = asExtraImage(img);
                return <Figure key={k} src={src} alt={alt} {...rest} />;
              })}

            </div>
          );
        })}

      </Section>
    </>
  );
}
