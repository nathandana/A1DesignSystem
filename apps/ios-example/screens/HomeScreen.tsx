import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Button, Card, Heading, Paragraph, cardTokens, useDesignSystem } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

type NavFn = (screen: string) => void;
type MIName = React.ComponentProps<typeof MaterialIcons>['name'];

function ComponentCard({
  icon, title, description, screen, nav,
}: {
  icon: MIName;
  title: string;
  description: string;
  screen: string;
  nav: NavFn;
}) {
  const { colors } = useDesignSystem();
  const iconNode = <MaterialIcons name={icon} size={18} color={colors.textAccent} />;

  return (
    <Card
      style={{ flex: 1, minWidth: 140 }}
      icon={iconNode}
      onPress={() => nav(screen)}
    >
      <Heading size="sm" style={{ marginBottom: 4 }}>{title}</Heading>
      <Paragraph size="xs" color="muted">{description}</Paragraph>
    </Card>
  );
}

function FeatureRow({
  icon, title, description,
}: {
  icon: MIName;
  title: string;
  description: string;
}) {
  const { colors } = useDesignSystem();

  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
      <Card bare style={{ width: 28, alignItems: 'center', paddingTop: 2 }}>
        <MaterialIcons name={icon} size={20} color={colors.textAccent} />
      </Card>
      <View style={{ flex: 1, gap: 2 }}>
        <Heading size="xs">{title}</Heading>
        <Paragraph size="sm" color="muted">{description}</Paragraph>
      </View>
    </View>
  );
}

function Stat({
  value, label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <Heading type="display" size="sm" color="accent">{value}</Heading>
      <Paragraph size="xs" color="muted">{label}</Paragraph>
    </View>
  );
}

export function HomeScreen({ nav }: { nav: NavFn }) {
  const { colors } = useDesignSystem();

  return (
    <ScreenShell
      title="A1 Design System"
      subtitle="A practical kit for building clear, themeable React Native product screens."
    >
      <Card
        heroColor="action"
        heroIcon="auto-awesome"
      >
        <View style={{ gap: 12 }}>
          <Heading type="display" size="sm">Ship consistent interfaces without rebuilding decisions.</Heading>
          <Paragraph color="muted">
            A1 combines semantic color, typography, motion, navigation, and core controls into a small system that can flex across brands, dark mode, and accessibility settings.
          </Paragraph>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Stat value="16" label="Core components" />
            <Stat value="3" label="Token families" />
            <Stat value="3" label="Theme styles" />
          </View>
        </View>
      </Card>

      <Section title="System map">
        <Card>
          <View style={{ gap: 14 }}>
            <FeatureRow
              icon="style"
              title="Tokens first"
              description="Color, typography, spacing, radius, and motion choices come from the active theme."
            />
            <FeatureRow
              icon="contrast"
              title="Built for modes"
              description="Light, dark, inverse sections, font scaling, and accent switching are handled by context."
            />
            <FeatureRow
              icon="touch-app"
              title="Native interactions"
              description="Press states, haptics, modal patterns, and navigation surfaces feel at home on iOS."
            />
            <FeatureRow
              icon="dashboard-customize"
              title="Composable screens"
              description="Cards, sections, text, actions, and navigation can be combined into complete product flows."
            />
          </View>
        </Card>
      </Section>

      <Section title="Start here">
        <View style={{ gap: 8 }}>
          <Button
            variant="primary"
            fullWidth
            icon="widgets"
            onPress={() => nav('components')}
          >
            Browse Components
          </Button>
          <Button
            variant="secondary"
            fullWidth
            icon="palette"
            onPress={() => nav('colors')}
          >
            Explore Tokens
          </Button>
        </View>
      </Section>

      <Section title="Useful patterns">
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="view-agenda" title="Layout" description="Section and Card surfaces" screen="section" nav={nav} />
            <ComponentCard icon="title" title="Content" description="Heading, Paragraph, Text List" screen="textlist" nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="smart-button" title="Actions" description="Button and IconButton" screen="button" nav={nav} />
            <ComponentCard icon="campaign" title="Feedback" description="Banner and Snackbar" screen="banner" nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="menu" title="Navigation" description="SideNav, List, Pagination" screen="list" nav={nav} />
            <ComponentCard icon="inbox" title="States" description="Empty State and Badge" screen="emptystate" nav={nav} />
          </View>
        </View>
      </Section>

      <Section title="Component library">
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="smart-button" title="Button"     description="Actions"           screen="button"     nav={nav} />
            <ComponentCard icon="label"       title="Badge"       description="Status label"      screen="badge"      nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="campaign"    title="Banner"      description="Inline message"    screen="banner"     nav={nav} />
            <ComponentCard icon="format-quote" title="Blockquote" description="Quoted emphasis"   screen="blockquote" nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="crop-square"  title="Card"       description="Group content"     screen="card"       nav={nav} />
            <ComponentCard icon="inbox"        title="Empty State" description="Blank view"        screen="emptystate" nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="open-in-new"  title="Dialog"     description="Modal overlay"     screen="dialog"     nav={nav} />
            <ComponentCard icon="title"        title="Heading"    description="Type headings"     screen="heading"    nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="radio-button-checked" title="IconButton" description="Icon actions" screen="iconbutton" nav={nav} />
            <ComponentCard icon="link"         title="Link"       description="Inline links"      screen="link"       nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="format-list-bulleted" title="List" description="Grouped rows"     screen="list"       nav={nav} />
            <ComponentCard icon="announcement" title="Snackbar"   description="Toast feedback"    screen="snackbar"   nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="last-page"    title="Pagination" description="Page navigation"  screen="pagination" nav={nav} />
            <ComponentCard icon="notes"        title="Paragraph"  description="Body text"        screen="paragraph"  nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="view-agenda"  title="Section"    description="Layout container" screen="section"    nav={nav} />
            <ComponentCard icon="menu"         title="SideNav"    description="Nav drawer"       screen="sidenav"    nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="format-list-bulleted" title="Text List" description="Prose list" screen="textlist" nav={nav} />
          </View>
        </View>
      </Section>

      <Section title="Design tokens">
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="palette"   title="Colors"     description="Semantic color scale"   screen="colors"     nav={nav} />
            <ComponentCard icon="text-fields" title="Typography" description="Type scale"           screen="typography" nav={nav} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ComponentCard icon="animation" title="Motion"     description="Durations and easings"  screen="motion"     nav={nav} />
          </View>
        </View>
      </Section>
    </ScreenShell>
  );
}
