import {
  Heading,
  MessageBadge,
  Section,
  Stack,
} from "../../../packages/react/src/index.js";

export function CaseStudyLayout({ title, tags = [], meta, children }) {
  return (
    <>
      <Section inverse padding="md" contentWidth="lg" gap="md">
        <Stack direction="row" gap="md" wrap>
          {tags.map((tag) => (
            <MessageBadge key={tag} size="lg">{tag}</MessageBadge>
          ))}
        </Stack>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "xxl" }}>
          {title}
        </Heading>
        {meta && (
          <dl className="pf-study-meta">
            {meta.map(({ label, value }) => (
              <div key={label} className="pf-study-meta-item">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Section>
      {children}
    </>
  );
}
