import { Card, Heading, MessageBadge, Paragraph } from "../../../packages/react/src/index.js";
import { getRoutePath } from "../utils/routing.js";

export function CaseStudyCard({ study, navigate }) {
  return (
    <Card
      as="a"
      className="pf-study-card"
      href={getRoutePath(study.id)}
      onClick={(event) => navigate(study.id, event)}
    >
      <div className="pf-study-image">
        <img
          src={study.cardImage}
          alt={study.title}
          className="pf-study-image-img"
          style={study.cardImageStyle}
        />
      </div>
      <div className="pf-study-body">
        <div className="pf-tag-row">
          {study.tags.map((tag) => (
            <MessageBadge subtle key={tag}>{tag}</MessageBadge>
          ))}
        </div>
        <Heading as="h3" size="sm">{study.title}</Heading>
        <Paragraph size="sm" color="muted">{study.description}</Paragraph>
      </div>
    </Card>
  );
}
