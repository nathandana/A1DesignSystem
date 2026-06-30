import { Card, Heading, Icon, List, ListItem, Paragraph, Stack } from "../../../../packages/react/src/index.js";

export function PlanSummary({ aiPlan }) {
  if (!aiPlan) return null;

  return (
    <Stack gap="md">
      <Card className="dayflow-ai-summary">
        <Stack gap="sm">
          <div className="dayflow-ai-summary__badge">
            <Icon name="auto_awesome" size="sm" />
            <span>AI day plan</span>
          </div>
          <Heading as="h3" size="md">{aiPlan.summary}</Heading>
        </Stack>
      </Card>

      {aiPlan.insights?.map((insight) => (
        <Card key={insight.title} className={`dayflow-insight dayflow-insight--${insight.type}`}>
          <Stack gap="xs">
            <div className="dayflow-insight__title">
              <Icon name={insight.icon} size="sm" />
              <Heading as="h4" size="sm">{insight.title}</Heading>
            </div>
            <Paragraph size="sm">{insight.body}</Paragraph>
          </Stack>
        </Card>
      ))}

      {aiPlan.tips?.length ? (
        <Card>
          <Stack gap="sm">
            <Heading as="h4" size="sm">Smart tips</Heading>
            <List>
              {aiPlan.tips.map((tip) => (
                <ListItem key={tip}>{tip}</ListItem>
              ))}
            </List>
          </Stack>
        </Card>
      ) : null}
    </Stack>
  );
}
