import React, { useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LibreBaskerville_400Regular, LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { RobotoSlab_300Light } from '@expo-google-fonts/roboto-slab';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {
  A1_THEMES,
  Badge,
  Banner,
  Button,
  ButtonContainer,
  Card,
  DesignSystemProvider,
  EmptyState,
  Heading,
  List,
  ListItem,
  Paragraph,
  Section,
  Snackbar,
  TextList,
  TextListItem,
  useDesignSystem,
} from '@gtivr4/a1-design-system-react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { guides as seedGuides, workflow, type GuideItem, type PriorityGuide } from './data/guides';

type ScreenKey = 'overview' | 'examples' | 'editor';
type Toast = { message: string; action?: string; onAction?: () => void } | null;

const tabs: { key: ScreenKey; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'overview', label: 'Overview', icon: 'home' },
  { key: 'examples', label: 'Examples', icon: 'view-list' },
  { key: 'editor', label: 'Editor', icon: 'edit-note' },
];

const principles: { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string }[] = [
  {
    icon: 'flag',
    title: 'Goals before screens',
    description:
      'Capture the user goal, business goal, and decision the page needs to support before anyone chooses a layout.',
  },
  {
    icon: 'sort',
    title: 'Priority before polish',
    description:
      'Sort content and functionality by relevance from top to bottom, using real words instead of empty boxes.',
  },
  {
    icon: 'forum',
    title: 'Alignment before AI',
    description:
      'Give designers, writers, developers, stakeholders, and AI tools the same content hierarchy to work from.',
  },
];

function flattenItems(items: GuideItem[], parentTitle?: string): (GuideItem & { parentTitle?: string })[] {
  return items.flatMap((item) => {
    const current = { ...item, parentTitle };
    return item.children?.length ? [current, ...flattenItems(item.children, item.title)] : [current];
  });
}

function itemCount(items: GuideItem[]): number {
  return items.reduce((total, item) => total + 1 + (item.children ? itemCount(item.children) : 0), 0);
}

function materialIconName(name: string): keyof typeof MaterialIcons.glyphMap {
  return name.replace(/_/g, '-') as keyof typeof MaterialIcons.glyphMap;
}

function isGuideGroup(item: GuideItem) {
  return item.kind === 'group' || Boolean(item.children?.length);
}

function getItemComponentType(item: GuideItem) {
  return item.componentType || (isGuideGroup(item) ? 'Section' : 'Element');
}

function isGuideLinkComponent(item: GuideItem) {
  return /\b(button|link)\b/i.test(getItemComponentType(item));
}

function getListItems(content: string) {
  return String(content ?? '')
    .split(/\n|;/)
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

function isListComponent(item: GuideItem) {
  return /list|checklist/i.test(getItemComponentType(item));
}

function isHeadingComponent(item: GuideItem) {
  return /heading|headline|title|subheading/i.test(getItemComponentType(item));
}

function isParagraphComponent(item: GuideItem) {
  return /paragraph|body|copy/i.test(getItemComponentType(item));
}

function parseCheckboxLines(text: string) {
  return String(text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^-\s*\[(x|X|\s*)\]\s*(.*)$/);
      if (match) return { checked: match[1].trim().toLowerCase() === 'x', text: match[2] };
      return { checked: false, text: line.replace(/^-\s+/, '') };
    });
}

function AppContent() {
  const { colors, theme, isDark } = useDesignSystem();
  const insets = useSafeAreaInsets();
  const [guides, setGuides] = useState<PriorityGuide[]>(seedGuides);
  const [screen, setScreen] = useState<ScreenKey>('overview');
  const [activeGuideId, setActiveGuideId] = useState(seedGuides[0]?.id ?? '');
  const [selectedItemTitle, setSelectedItemTitle] = useState<string | null>(
    seedGuides[0]?.items[0]?.title ?? null,
  );
  const [showBanner, setShowBanner] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  const activeGuide = guides.find((guide) => guide.id === activeGuideId) ?? guides[0];
  const allItems = useMemo(() => flattenItems(activeGuide?.items ?? []), [activeGuide]);
  const selectedItem = allItems.find((item) => item.title === selectedItemTitle) ?? allItems[0];

  const openGuide = (guide: PriorityGuide) => {
    setActiveGuideId(guide.id);
    setSelectedItemTitle(guide.items[0]?.title ?? null);
    setScreen('editor');
    setToast({ message: `${guide.tab} opened in Editor.` });
  };

  const createDraft = () => {
    const nextId = `draft-${Date.now()}`;
    const nextGuide: PriorityGuide = {
      ...seedGuides[0],
      id: nextId,
      tab: 'Draft guide',
      icon: 'auto-awesome',
      title: 'Untitled priority guide',
      pageType: 'Product page',
      context: 'New experience',
      problemStatement: 'The team needs a shared content hierarchy before design details multiply.',
      audience: 'People making a high-value decision with limited time.',
      userGoal: 'See the most important information first and act with confidence.',
      businessGoal: 'Reduce ambiguity before implementation begins.',
      contextDetails: [
        { label: 'Decision needed', value: 'Agree the first-screen priority and supporting evidence.', checkable: true },
        { label: 'Out of scope', value: 'Final production copy, analytics taxonomy, and visual design polish.' },
        { label: 'Contributors', value: 'Product, design, engineering, content.' },
      ],
      items: [
        {
          kind: 'group',
          type: 'Core decision',
          componentType: 'Section',
          title: 'Decision before decoration',
          content: 'Capture what the page must help someone decide before choosing layout patterns.',
          annotations: ['Replace this with the first real decision your audience needs to make.'],
          children: [
            {
              type: 'Evidence',
              componentType: 'Heading',
              title: 'Primary proof point',
              content: 'State the most useful fact, constraint, or reassurance.',
              annotations: ['Put proof close to the action it supports.'],
            },
          ],
        },
      ],
    };

    setGuides((current) => [nextGuide, ...current]);
    setActiveGuideId(nextId);
    setSelectedItemTitle(nextGuide.items[0].title);
    setScreen('editor');
    setToast({
      message: 'Draft guide created.',
      action: 'Undo',
      onAction: () => {
        setGuides((current) => current.filter((guide) => guide.id !== nextId));
        setActiveGuideId(seedGuides[0].id);
        setSelectedItemTitle(seedGuides[0].items[0]?.title ?? null);
        setToast({ message: 'Draft removed.' });
      },
    });
  };

  const addSupportingItem = () => {
    if (!activeGuide) return;
    const itemTitle = `Supporting point ${itemCount(activeGuide.items) + 1}`;
    const nextItem: GuideItem = {
      type: 'Supporting content',
      componentType: 'Note',
      title: itemTitle,
      content: 'Describe the next piece of content that helps the user make the page decision.',
      annotations: ['Clarify whether this belongs above or below the primary action.'],
    };
    setGuides((current) => current.map((guide) => guide.id === activeGuide.id
      ? { ...guide, items: [...guide.items, nextItem] }
      : guide));
    setSelectedItemTitle(itemTitle);
    setToast({ message: 'Supporting item added.' });
  };

  if (!activeGuide) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.pageBg }]}>
        <EmptyState
          title="No guides yet"
          description="Create a guide to start shaping page priorities."
          actions={<Button onPress={createDraft}>New guide</Button>}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.pageBg }]} edges={['top', 'left', 'right']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.appHeader, { borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerTitle}>
          <Heading type="display" size="sm">Priority Guide: Align before AI</Heading>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          screen === 'overview' ? styles.contentFlush : styles.content,
          { paddingBottom: insets.bottom + 104 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {screen === 'overview' && (
          <OverviewScreen
            onViewExamples={() => setScreen('examples')}
            onStartGuide={createDraft}
          />
        )}
        {screen === 'examples' && (
          <ExamplesScreen
            guides={guides}
            activeGuideId={activeGuide.id}
            onOpenGuide={openGuide}
          />
        )}
        {screen === 'editor' && (
          <EditorScreen
            activeGuide={activeGuide}
            allItems={allItems}
            selectedItem={selectedItem}
            selectedItemTitle={selectedItemTitle}
            showBanner={showBanner}
            onDismissBanner={() => setShowBanner(false)}
            onSelectItem={(title) => setSelectedItemTitle(title)}
            onAddItem={addSupportingItem}
            onCreateDraft={createDraft}
          />
        )}
      </ScrollView>

      <View style={[styles.tabBar, { backgroundColor: colors.surfaceBg, borderTopColor: colors.borderSubtle }]}>
        {tabs.map((tab) => {
          const active = screen === tab.key;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setScreen(tab.key)}
              style={[
                styles.tabButton,
                {
                  backgroundColor: active ? colors.accentSurface : 'transparent',
                  borderRadius: theme.navItemRadius,
                },
              ]}
            >
              <MaterialIcons
                name={tab.icon}
                size={22}
                color={active ? colors.textAccent : colors.textMuted}
              />
              <Text style={[styles.tabLabel, { color: active ? colors.textAccent : colors.textMuted }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Snackbar
        visible={Boolean(toast)}
        message={toast?.message ?? ''}
        actionLabel={toast?.action}
        onAction={() => {
          toast?.onAction?.();
        }}
        onDismiss={() => setToast(null)}
      />
    </SafeAreaView>
  );
}

function EditorScreen({
  activeGuide,
  allItems,
  selectedItem,
  selectedItemTitle,
  showBanner,
  onDismissBanner,
  onSelectItem,
  onAddItem,
  onCreateDraft,
}: {
  activeGuide: PriorityGuide;
  allItems: (GuideItem & { parentTitle?: string })[];
  selectedItem?: GuideItem & { parentTitle?: string };
  selectedItemTitle: string | null;
  showBanner: boolean;
  onDismissBanner: () => void;
  onSelectItem: (title: string) => void;
  onAddItem: () => void;
  onCreateDraft: () => void;
}) {
  const { colors } = useDesignSystem();
  const [overviewOpen, setOverviewOpen] = useState(true);

  return (
    <View style={styles.stackLg}>
      {showBanner && (
        <Banner
          title="Start with priority"
          status="info"
          icon="tips-and-updates"
          onDismiss={onDismissBanner}
        >
          Use the editor to make page intent, audience, hierarchy, and behavior explicit before a mockup locks the team into a weak order.
        </Banner>
      )}

      <View style={styles.heroBlock}>
        <Heading type="display" size="md">{activeGuide.title}</Heading>
        <Paragraph size="sm" color="muted">{activeGuide.context}</Paragraph>
      </View>

      <GuideDocument
        guide={activeGuide}
        guides={seedGuides}
        overviewOpen={overviewOpen}
        onOverviewToggle={() => setOverviewOpen((open) => !open)}
        selectedItemTitle={selectedItemTitle}
        onSelectItem={onSelectItem}
        onAddItem={onAddItem}
      />

    </View>
  );
}

function GuideDocument({
  guide,
  guides,
  overviewOpen,
  onOverviewToggle,
  selectedItemTitle,
  onSelectItem,
  onAddItem,
}: {
  guide: PriorityGuide;
  guides: PriorityGuide[];
  overviewOpen: boolean;
  onOverviewToggle: () => void;
  selectedItemTitle: string | null;
  onSelectItem: (title: string) => void;
  onAddItem: () => void;
}) {
  const { colors, theme } = useDesignSystem();

  return (
    <View
      style={[
        styles.document,
        {
          backgroundColor: colors.panelBg,
          borderColor: colors.borderSubtle,
          borderRadius: theme.cardRadius,
        },
      ]}
    >
      <View style={[styles.documentPageType, { backgroundColor: colors.surfaceBg, borderBottomColor: colors.borderSubtle }]}>
        <Text style={[styles.kicker, { color: colors.textMuted }]}>Page type</Text>
        <Badge tone="neutral">{guide.pageType}</Badge>
      </View>

      <View style={[styles.documentOverview, { backgroundColor: colors.surfaceBg, borderBottomColor: colors.pageBg }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: overviewOpen }}
          onPress={onOverviewToggle}
          style={({ pressed }) => [
            styles.documentOverviewHeader,
            {
              backgroundColor: pressed ? colors.pressedBg : 'transparent',
              borderBottomColor: colors.borderSubtle,
            },
          ]}
        >
          <MaterialIcons
            name={overviewOpen ? 'expand-less' : 'expand-more'}
            size={20}
            color={colors.textMuted}
          />
          <Text style={[styles.kicker, { color: colors.textDefault }]}>Overview</Text>
        </Pressable>

        {overviewOpen && (
          <View style={styles.documentBrief}>
            <View style={[styles.documentProblem, { borderBottomColor: colors.borderSubtle }]}>
              <Text style={[styles.kicker, { color: colors.textMuted }]}>Problem statement</Text>
              <Paragraph size="md" style={styles.documentText}>{guide.problemStatement}</Paragraph>
            </View>

            <View style={[styles.documentContext, { borderBottomColor: colors.borderSubtle }]}>
              {guide.contextDetails.map((detail, index) => (
                <GuideContextDetail key={`${detail.label}-${index}`} detail={detail} />
              ))}
            </View>

            <View style={styles.documentMeta}>
              <GuideMeta label="Audience" value={guide.audience} />
              <GuideMeta label="User goal" value={guide.userGoal} />
              <GuideMeta label="Business goal" value={guide.businessGoal} />
            </View>
          </View>
        )}
      </View>

      <View>
        {guide.items.map((item, index) => (
          <GuideDocumentItem
            key={`${item.title}-${index}`}
            item={item}
            index={index}
            guides={guides}
            selected={item.title === selectedItemTitle}
            onSelect={() => onSelectItem(item.title)}
            showAnnotations
            isFirst={index === 0}
          />
        ))}
      </View>

      <View style={[styles.documentAdd, { borderTopColor: colors.borderSubtle }]}>
        <Button
          variant="secondary"
          fullWidth
          onPress={onAddItem}
          icon="add"
        >
          Add item
        </Button>
      </View>
    </View>
  );
}

function GuideMeta({ label, value }: { label: string; value: string }) {
  const { colors } = useDesignSystem();
  return (
    <View style={styles.guideMeta}>
      <Text style={[styles.kicker, { color: colors.textMuted }]}>{label}</Text>
      <Paragraph size="sm">{value}</Paragraph>
    </View>
  );
}

function GuideContextDetail({
  detail,
}: {
  detail: { label: string; value: string; checkable?: boolean; checked?: boolean };
}) {
  const { colors } = useDesignSystem();
  const lines = detail.checkable ? parseCheckboxLines(detail.value) : [];

  return (
    <View style={[styles.contextDetail, { borderTopColor: colors.borderSubtle }]}>
      <Text style={[styles.kicker, { color: colors.textMuted }]}>{detail.label}</Text>
      {detail.checkable ? (
        <View style={styles.contextChecklist}>
          {lines.map((line, index) => (
            <View key={`${line.text}-${index}`} style={styles.contextChecklistItem}>
              <MaterialIcons
                name={line.checked ? 'check-box' : 'check-box-outline-blank'}
                size={16}
                color={line.checked ? colors.textMuted : colors.textAccent}
              />
              <Paragraph
                size="sm"
                color={line.checked ? 'muted' : 'default'}
                style={line.checked ? styles.checkedText : null}
              >
                {line.text}
              </Paragraph>
            </View>
          ))}
        </View>
      ) : (
        <Paragraph size="sm">{detail.value}</Paragraph>
      )}
    </View>
  );
}

function GuideDocumentItem({
  item,
  index,
  guides,
  selected,
  onSelect,
  showAnnotations,
  isFirst = false,
  child = false,
}: {
  item: GuideItem;
  index: number;
  guides: PriorityGuide[];
  selected?: boolean;
  onSelect?: () => void;
  showAnnotations?: boolean;
  isFirst?: boolean;
  child?: boolean;
}) {
  const { colors, theme } = useDesignSystem();
  const [groupOpen, setGroupOpen] = useState(true);
  const isGroup = isGuideGroup(item);
  const annotations = item.annotations?.filter(Boolean) ?? [];
  const linkedGuide = isGuideLinkComponent(item) && item.linkedGuideId
    ? guides.find((guide) => guide.id === item.linkedGuideId)
    : null;

  return (
    <Pressable
      accessibilityRole={onSelect ? 'button' : undefined}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.documentItem,
        child ? styles.documentChildItem : null,
        {
          backgroundColor: selected || isGroup ? colors.surfaceBg : colors.panelBg,
          borderTopColor: isFirst ? 'transparent' : colors.borderSubtle,
          gap: child ? 8 : 12,
          padding: child ? 12 : 16,
        },
        pressed && { backgroundColor: colors.pressedBg },
      ]}
    >
      <View
        style={[
          styles.documentRank,
          child ? styles.documentChildRank : null,
          { borderColor: colors.borderSubtle },
        ]}
      >
        <Text style={[styles.documentRankText, { color: colors.textMuted }]}>{index + 1}</Text>
      </View>

      <View style={styles.documentItemBody}>
        <View style={styles.elementMetaLabels}>
          <Badge tone="accent" icon="edit-note">
            {getItemComponentType(item)}
          </Badge>
          {isGroup && (
            <Button
              size="sm"
              variant="secondary"
              onPress={() => setGroupOpen((open) => !open)}
              icon={groupOpen ? 'expand-less' : 'expand-more'}
            >
              {groupOpen ? 'Collapse' : 'Expand'}
            </Button>
          )}
        </View>

        <GuideItemContent item={item} />

        {isGroup && groupOpen && (
          <View style={[styles.groupChildren, { backgroundColor: colors.panelBg, borderColor: colors.borderSubtle }]}>
            {(item.children ?? []).map((childItem, childIndex) => (
              <GuideDocumentItem
                key={`${childItem.title}-${childIndex}`}
                item={childItem}
                index={childIndex}
                guides={guides}
                showAnnotations={false}
                isFirst={childIndex === 0}
                child
              />
            ))}
          </View>
        )}

        {linkedGuide && (
          <View style={styles.linkedGuide}>
            <MaterialIcons name="call-split" size={16} color={colors.textAccent} />
            <Text style={[styles.linkedGuideText, { color: colors.textAccent }]}>
              Linked guide: {linkedGuide.title}
            </Text>
          </View>
        )}

        {showAnnotations && annotations.length > 0 && (
          <View style={[styles.documentAnnotations, { backgroundColor: colors.surfaceBg, borderColor: colors.borderSubtle, borderRadius: theme.cardRadius }]}>
            <Text style={[styles.kicker, { color: colors.textMuted }]}>Annotations</Text>
            <TextList size="xs" color="muted" icon="notes" variant="icon">
              {annotations.map((annotation) => (
                <TextListItem key={annotation}>{annotation}</TextListItem>
              ))}
            </TextList>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function GuideItemContent({ item }: { item: GuideItem }) {
  if (isListComponent(item)) {
    const listItems = getListItems(item.content);
    return (
      <TextList size="sm">
        {listItems.map((line) => (
          <TextListItem key={line}>{line}</TextListItem>
        ))}
      </TextList>
    );
  }

  if (isHeadingComponent(item)) {
    return <Heading size="sm">{item.content}</Heading>;
  }

  if (isParagraphComponent(item)) {
    return <Paragraph size="sm">{item.content}</Paragraph>;
  }

  return <Paragraph style={styles.componentText}>{item.content}</Paragraph>;
}

function OverviewScreen({
  onViewExamples,
  onStartGuide,
}: {
  onViewExamples: () => void;
  onStartGuide: () => void;
}) {
  const { colors } = useDesignSystem();

  return (
    <View style={styles.stackLg}>
      <Section inverse padding="md" gap="md">
        <View style={styles.stackMd}>
          <Badge status="info" icon="auto-awesome">
            Align before AI
          </Badge>
          <Heading type="display" size="lg">The Priority Guide</Heading>
          <Paragraph size="md">
            When you align together on content, the interface gets clearer. Use this tool to create and manage priority guides for your application.
          </Paragraph>
        </View>
        <ButtonContainer align="center" size="lg">
          <Button
            variant="secondary"
            onPress={onViewExamples}
            icon="view-list"
          >
            View examples
          </Button>
          <Button
            onPress={onStartGuide}
            icon="arrow-forward"
            iconPosition="end"
          >
            Start your guide
          </Button>
        </ButtonContainer>
      </Section>

      <View style={[styles.stackLg, styles.screenInset]}>
        <View style={styles.heroBlock}>
          <Badge status="success" icon="hub">
            Why it matters
          </Badge>
          <Heading type="display" size="md">A shared brief for collaboration.</Heading>
          <Paragraph size="lg" color="muted">
            Priority guides keep the conversation on what the screen must communicate and how it should behave. They make the first artifact useful to writers, product partners, designers, developers, testers, and the AI tools that increasingly help teams move from intent to interface.
          </Paragraph>
        </View>

        <View style={styles.stackMd}>
          {principles.map((principle) => (
            <Card key={principle.title}>
              <View style={styles.principleCard}>
                <View style={[styles.libraryIcon, { backgroundColor: colors.accentSurface }]}>
                  <MaterialIcons name={principle.icon} size={24} color={colors.textAccent} />
                </View>
                <View style={styles.cardTitle}>
                  <Heading size="xs">{principle.title}</Heading>
                  <Paragraph size="sm" color="muted">{principle.description}</Paragraph>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <Section surface="raised" padding="md">
        <View style={styles.futureBlock}>
          <MaterialIcons name="auto-awesome" size={28} color={colors.textAccent} />
          <View style={styles.cardTitle}>
            <Heading size="md">Next: guide components, an editor, and AI-assisted drafts.</Heading>
            <Paragraph size="md" color="muted">
              Future pages can turn this landing page into a working content system: reusable guide blocks, collaborative editing, AI-generated first drafts, and critique prompts that improve the guide before design work begins.
            </Paragraph>
            <Button variant="secondary" onPress={onViewExamples}>Explore example guides</Button>
          </View>
        </View>
      </Section>
    </View>
  );
}

function ExamplesScreen({
  guides,
  activeGuideId,
  onOpenGuide,
}: {
  guides: PriorityGuide[];
  activeGuideId: string;
  onOpenGuide: (guide: PriorityGuide) => void;
}) {
  const { colors } = useDesignSystem();

  return (
    <View style={styles.stackLg}>
      <View style={styles.heroBlock}>
        <Badge status="neutral" subtle icon="view-list">
          Example guides
        </Badge>
        <Heading type="display" size="md">Same structure, very different content problems.</Heading>
        <Paragraph size="lg" color="muted">
          A priority guide should flex across domains while preserving the same useful questions: who is this for, what do they need, what does the organization need, and what content or behavior earns its place?
        </Paragraph>
      </View>

      <View style={styles.stackMd}>
        {guides.map((guide) => (
          <Card key={guide.id} onPress={() => onOpenGuide(guide)}>
            <View style={styles.libraryItem}>
              <View style={[styles.libraryIcon, { backgroundColor: colors.accentSurface }]}>
                <MaterialIcons
                  name={materialIconName(guide.icon)}
                  size={24}
                  color={colors.textAccent}
                />
              </View>
              <View style={styles.cardTitle}>
                <View style={styles.badgeRow}>
                  <Badge tone={guide.id === activeGuideId ? 'accent' : 'neutral'}>{guide.tab}</Badge>
                  <Badge tone="neutral">{itemCount(guide.items)} items</Badge>
                </View>
                <Heading size="md">{guide.title}</Heading>
                <Paragraph size="sm" color="muted" numberOfLines={2}>{guide.problemStatement}</Paragraph>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textMuted} />
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

function PreviewScreen({ guide }: { guide: PriorityGuide }) {
  const { colors } = useDesignSystem();

  return (
    <View style={styles.stackLg}>
      <View style={styles.previewHeader}>
        <Badge tone="accent">Preview</Badge>
        <Heading type="display" size="md">{guide.title}</Heading>
        <Paragraph color="muted">{guide.context}</Paragraph>
      </View>

      <Card>
        <View style={styles.stackMd}>
          <Heading size="lg">Context</Heading>
          <TextList variant="divider" size="sm">
            {guide.contextDetails.map((detail) => (
              <TextListItem key={detail.label}>
                {`${detail.label}: ${detail.value}`}
              </TextListItem>
            ))}
          </TextList>
        </View>
      </Card>

      <Card>
        <View style={styles.stackMd}>
          <Heading size="lg">Guide outline</Heading>
          {guide.items.map((item, index) => (
            <PreviewItem key={`${item.title}-${index}`} item={item} depth={0} index={index + 1} />
          ))}
        </View>
      </Card>

      <EmptyState
        title="Ready for critique"
        description="This preview is structured for stakeholder review before detailed UI design."
        compact
        icon="rate-review"
      />
    </View>
  );
}

function PreviewItem({ item, depth, index }: { item: GuideItem; depth: number; index: number }) {
  const { colors } = useDesignSystem();

  return (
    <View style={[styles.previewItem, depth > 0 && { borderLeftColor: colors.borderSubtle, borderLeftWidth: 1, paddingLeft: 14 }]}>
      <View style={styles.badgeRow}>
        <Badge tone={depth === 0 ? 'accent' : 'neutral'}>{String(index).padStart(2, '0')}</Badge>
        {item.componentType && <Badge tone="neutral">{item.componentType}</Badge>}
      </View>
      <Heading size={depth === 0 ? 'md' : 'sm'}>{item.title}</Heading>
      <Paragraph size="sm" color="muted">{item.content}</Paragraph>
      {item.children?.map((child, childIndex) => (
        <PreviewItem
          key={`${child.title}-${childIndex}`}
          item={child}
          depth={depth + 1}
          index={childIndex + 1}
        />
      ))}
    </View>
  );
}

function IntentCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
}) {
  const { colors } = useDesignSystem();
  return (
    <Card>
      <View style={styles.intentCard}>
        <MaterialIcons name={icon} size={22} color={colors.textAccent} />
        <Badge tone="neutral">{label}</Badge>
        <Paragraph size="sm">{value}</Paragraph>
      </View>
    </Card>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
    RobotoSlab_300Light,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={A1_THEMES.heritage.accent} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <DesignSystemProvider value={{ theme: A1_THEMES.heritage, isDark }}>
        <AppContent />
      </DesignSystemProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    backgroundColor: '#f8f3ea',
    flex: 1,
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  appHeader: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  headerTitle: {
    flex: 1,
    gap: 2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  contentFlush: {
    paddingTop: 0,
  },
  screenInset: {
    paddingHorizontal: 20,
  },
  stackLg: {
    gap: 20,
  },
  stackMd: {
    gap: 14,
  },
  heroBlock: {
    gap: 10,
  },
  heroKicker: {
    flexDirection: 'row',
  },
  summaryGrid: {
    gap: 12,
  },
  collapseHeader: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: -6,
    marginVertical: -4,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  overviewBrief: {
    gap: 8,
  },
  document: {
    alignSelf: 'center',
    borderWidth: 2,
    maxWidth: 440,
    overflow: 'hidden',
    width: '100%',
  },
  documentPageType: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  documentOverview: {
    borderBottomWidth: 8,
  },
  documentOverviewHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  documentBrief: {
    gap: 0,
    padding: 16,
  },
  documentProblem: {
    borderBottomWidth: 1,
    gap: 8,
    paddingBottom: 16,
  },
  documentText: {
    marginTop: 2,
  },
  documentContext: {
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  contextDetail: {
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 8,
    marginTop: 8,
  },
  contextChecklist: {
    gap: 4,
    marginTop: 4,
  },
  contextChecklistItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 6,
  },
  checkedText: {
    textDecorationLine: 'line-through',
  },
  documentMeta: {
    gap: 12,
    paddingTop: 16,
  },
  guideMeta: {
    gap: 4,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'none',
  },
  documentItem: {
    alignItems: 'flex-start',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  documentChildItem: {
    borderTopWidth: 1,
  },
  documentRank: {
    alignItems: 'center',
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  documentChildRank: {
    height: 24,
    width: 24,
  },
  documentRankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  documentItemBody: {
    flex: 1,
    gap: 8,
    minWidth: 0,
  },
  elementMetaLabels: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  componentText: {
    fontWeight: '600',
  },
  groupChildren: {
    borderWidth: 1,
    marginTop: 8,
  },
  linkedGuide: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 4,
  },
  linkedGuideText: {
    fontSize: 12,
    fontWeight: '800',
  },
  documentAnnotations: {
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  documentAdd: {
    borderTopWidth: 1,
    padding: 16,
  },
  principleCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  futureBlock: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
  },
  intentCard: {
    gap: 10,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    gap: 6,
  },
  listMargin: {
    marginTop: 16,
  },
  rankPill: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '800',
  },
  detailHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  annotationBox: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  libraryItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  libraryIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  previewHeader: {
    gap: 10,
  },
  previewItem: {
    gap: 8,
    paddingVertical: 8,
  },
  tabBar: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    flexDirection: 'row',
    gap: 8,
    left: 0,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
    position: 'absolute',
    right: 0,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    minHeight: 58,
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
