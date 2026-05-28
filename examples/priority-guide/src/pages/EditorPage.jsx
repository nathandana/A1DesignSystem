import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  ButtonContainer,
  Card,
  Dialog,
  Grid,
  Heading,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuItem,
  MenuSection,
  MessageBadge,
  PageLayout,
  Paragraph,
  Section,
  SegmentedControl,
  SelectField,
  SideNav,
  SideNavItem,
  Snackbar,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextareaField,
  TextField,
} from "../../../../packages/react/src/index.js";
import { exampleGuides, containerComponentOptions, itemComponentOptions } from "../lib/data.jsx";
import { getRoutePath } from "../lib/routing.js";
import { loadStoredEditor, saveStoredEditor, makeDraft } from "../lib/storage.js";
import {
  EditorOverviewFields,
  EditorOverviewList,
  GuideItemTree,
  GuideLinkSelect,
  ItemDetailCanvas,
  JsonPanel,
  NewGuideCanvas,
  PriorityGuideDocument,
  isGuideGroup,
} from "../components/index.js";

export function EditorPage({ onNavigate, activeGuide, startNew = false }) {
  const [userGuides, setUserGuides] = useState(() => loadStoredEditor()?.userGuides ?? []);
  const [drafts, setDrafts] = useState(() => loadStoredEditor()?.drafts ?? {});
  const [isCreatingNew, setIsCreatingNew] = useState(startNew);
  const [activeGuideId, setActiveGuideId] = useState(() => {
    const stored = loadStoredEditor();
    const allStored = [...(stored?.userGuides ?? []), ...exampleGuides];
    if (activeGuide && allStored.some((g) => g.id === activeGuide)) return activeGuide;
    const id = stored?.activeGuideId;
    if (!id) return exampleGuides[0].id;
    return allStored.some((g) => g.id === id) ? id : exampleGuides[0].id;
  });
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [activeChildIndex, setActiveChildIndex] = useState(null);
  const [selectedItemIndexes, setSelectedItemIndexes] = useState([]);
  const [expandedTreeGroups, setExpandedTreeGroups] = useState([]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState("overview");
  const [centerPanelTab, setCenterPanelTab] = useState("guide");
  const [deletedGuide, setDeletedGuide] = useState(null);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [sideNavDefaultCollapsed] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1440px)").matches
  );

  const allGuides = [...userGuides, ...exampleGuides];
  const seed = allGuides.find((g) => g.id === activeGuideId) ?? exampleGuides[0];
  const draft = drafts[activeGuideId] ?? makeDraft(seed);

  useEffect(() => {
    if (startNew) {
      setIsCreatingNew(true);
      setActiveItemIndex(null);
      setActiveChildIndex(null);
      setSelectedItemIndexes([]);
      setExpandedTreeGroups([]);
    }
  }, [startNew]);

  useEffect(() => {
    if (!startNew && activeGuide && allGuides.some((g) => g.id === activeGuide) && activeGuide !== activeGuideId) {
      setActiveGuideId(activeGuide);
      setActiveItemIndex(null);
      setActiveChildIndex(null);
      setSelectedItemIndexes([]);
      setExpandedTreeGroups([]);
      setIsCreatingNew(false);
    }
  }, [activeGuide, activeGuideId, allGuides, startNew]);

  useEffect(() => {
    saveStoredEditor({ userGuides, drafts, activeGuideId });
  }, [userGuides, drafts, activeGuideId]);

  function updateDraft(updater) {
    setDrafts((prev) => ({
      ...prev,
      [activeGuideId]: updater(prev[activeGuideId] ?? makeDraft(seed)),
    }));
  }

  function switchToGuide(guideId) {
    const found = allGuides.find((g) => g.id === guideId) ?? exampleGuides[0];
    setActiveGuideId(found.id);
    setActiveItemIndex(null);
    setActiveChildIndex(null);
    setSelectedItemIndexes([]);
    setExpandedTreeGroups([]);
    setIsCreatingNew(false);
  }

  function clearActiveItem() {
    setActiveItemIndex(null);
    setActiveChildIndex(null);
  }

  function selectTopItem(index) {
    setActiveItemIndex(index);
    setActiveChildIndex(null);
  }

  function selectChildItem(groupIndex, childIndex) {
    setActiveItemIndex(groupIndex);
    setActiveChildIndex(childIndex);
  }

  function changeGuide(guideId) {
    switchToGuide(guideId);
    onNavigate(null, "editor", { guide: guideId });
  }

  function toggleTreeGroup(index) {
    setExpandedTreeGroups((prev) => (
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index].sort((a, b) => a - b)
    ));
  }

  function toggleAllTreeGroups() {
    setExpandedTreeGroups(allTreeGroupsExpanded ? [] : groupIndexes);
  }

  function handleCreateGuide(newGuide) {
    setUserGuides((prev) => [...prev, newGuide]);
    setDrafts((prev) => ({ ...prev, [newGuide.id]: makeDraft(newGuide) }));
    setActiveGuideId(newGuide.id);
    setActiveItemIndex(null);
    setActiveChildIndex(null);
    setSelectedItemIndexes([]);
    setExpandedTreeGroups([]);
    setIsCreatingNew(false);
    onNavigate(null, "editor", { guide: newGuide.id });
  }

  function setField(key, value) {
    updateDraft((d) => ({ ...d, [key]: value }));
  }

  function setContextDetail(index, value) {
    updateDraft((d) => ({
      ...d,
      contextDetails: d.contextDetails.map((item, i) => (i === index ? { ...item, value } : item)),
    }));
  }

  function setItemField(itemIndex, key, value) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) => (i === itemIndex ? { ...item, [key]: value } : item)),
    }));
  }

  function setItemAnnotations(itemIndex, rawText) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) =>
        i === itemIndex ? { ...item, annotations: rawText.split("\n") } : item
      ),
    }));
  }

  function setActiveItemField(key, value) {
    if (activeItemIndex === null) return;
    if (activeChildIndex !== null) {
      setGroupChildField(activeItemIndex, activeChildIndex, key, value);
      return;
    }
    setItemField(activeItemIndex, key, value);
  }

  function setActiveItemAnnotations(rawText) {
    setActiveItemField("annotations", rawText.split("\n"));
  }

  function setGroupChildField(groupIndex, childIndex, key, value) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) => (
        i === groupIndex
          ? {
              ...item,
              children: (item.children ?? []).map((child, c) => (
                c === childIndex ? { ...child, [key]: value } : child
              )),
            }
          : item
      )),
    }));
  }

  function addChildToGroup(groupIndex) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) => (
        i === groupIndex
          ? {
              ...item,
              children: [
                ...(item.children ?? []),
                { type: "", componentType: "Paragraph", title: "New child item", content: "", annotations: [] },
              ],
            }
          : item
      )),
    }));
  }

  function moveItem(fromIndex, toIndex) {
    updateDraft((d) => {
      const items = [...d.items];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...d, items };
    });
  }

  function addItem() {
    const newIndex = draft.items.length;
    updateDraft((d) => ({
      ...d,
      items: [
        ...d.items,
        { type: "", componentType: "", title: "New item", content: "", annotations: [] },
      ],
    }));
    setActiveItemIndex(newIndex);
    setActiveChildIndex(null);
    setSelectedItemIndexes([]);
  }

  function toggleItemSelected(index, checked) {
    setSelectedItemIndexes((prev) => {
      const current = new Set(prev);
      if (checked) current.add(index);
      else current.delete(index);
      return [...current].sort((a, b) => a - b);
    });
  }

  function groupSelectedItems() {
    const groupable = selectedItemIndexes
      .filter((index) => guide.items[index] && !isGuideGroup(guide.items[index]))
      .sort((a, b) => a - b);

    if (groupable.length < 2) return;

    const firstIndex = groupable[0];
    updateDraft((d) => {
      const selected = new Set(groupable);
      const children = groupable.map((index) => ({ ...d.items[index] }));
      const group = {
        kind: "group",
        componentType: "Section",
        title: "New group",
        content: "Grouped priority items",
        annotations: [],
        children,
      };
      const items = d.items.filter((_, index) => !selected.has(index));
      items.splice(firstIndex, 0, group);
      return { ...d, items };
    });
    setSelectedItemIndexes([]);
    setActiveItemIndex(firstIndex);
    setActiveChildIndex(null);
  }

  const guide = { ...seed, ...draft };
  const activeParentItem = activeItemIndex !== null ? guide.items[activeItemIndex] : null;
  const activeItem = activeChildIndex !== null && isGuideGroup(activeParentItem)
    ? activeParentItem.children?.[activeChildIndex] ?? null
    : activeParentItem;
  const isUserGuide = userGuides.some((g) => g.id === activeGuideId);
  const groupIndexes = guide.items.map((item, index) => isGuideGroup(item) ? index : null).filter((index) => index !== null);
  const allTreeGroupsExpanded = groupIndexes.length > 0 && expandedTreeGroups.length === groupIndexes.length;

  function deleteGuide() {
    const removedGuide = userGuides.find((g) => g.id === activeGuideId);
    if (!removedGuide) return;

    const removedDraft = drafts[activeGuideId] ?? makeDraft(removedGuide);
    const nextGuide =
      [...userGuides.filter((g) => g.id !== activeGuideId), ...exampleGuides][0] ?? exampleGuides[0];
    setUserGuides((prev) => prev.filter((g) => g.id !== activeGuideId));
    setDrafts((prev) => { const d = { ...prev }; delete d[activeGuideId]; return d; });
    setActiveGuideId(nextGuide.id);
    setActiveItemIndex(null);
    setActiveChildIndex(null);
    setDeletedGuide({ guide: removedGuide, draft: removedDraft, previousActiveGuideId: activeGuideId });
    onNavigate(null, "editor", { guide: nextGuide.id });
  }

  function undoDeleteGuide() {
    if (!deletedGuide) return;

    setUserGuides((prev) => {
      if (prev.some((guide) => guide.id === deletedGuide.guide.id)) return prev;
      return [...prev, deletedGuide.guide];
    });
    setDrafts((prev) => ({ ...prev, [deletedGuide.guide.id]: deletedGuide.draft }));
    setActiveGuideId(deletedGuide.previousActiveGuideId);
    setActiveItemIndex(null);
    setActiveChildIndex(null);
    setDeletedGuide(null);
    onNavigate(null, "editor", { guide: deletedGuide.previousActiveGuideId });
  }

  function resetGuide() {
    setDrafts((prev) => { const d = { ...prev }; delete d[activeGuideId]; return d; });
  }

  function loadFromJson(parsed) {
    setDrafts((prev) => ({
      ...prev,
      [activeGuideId]: makeDraft({
        title: parsed.title ?? "",
        problemStatement: parsed.problemStatement ?? "",
        audience: parsed.audience ?? "",
        userGoal: parsed.userGoal ?? "",
        businessGoal: parsed.businessGoal ?? "",
        contextDetails: parsed.contextDetails ?? [],
        items: parsed.items ?? [],
      }),
    }));
  }

  function duplicateGuide() {
    const newGuide = {
      ...seed,
      id: `user-${Date.now()}`,
      tab: `${draft.title} (copy)`,
      title: `${draft.title} (copy)`,
      icon: "description",
    };
    setUserGuides((prev) => [...prev, newGuide]);
    setDrafts((prev) => ({ ...prev, [newGuide.id]: makeDraft({ ...draft, title: newGuide.title }) }));
    setActiveGuideId(newGuide.id);
    setActiveItemIndex(null);
    setActiveChildIndex(null);
    setSelectedItemIndexes([]);
    onNavigate(null, "editor", { guide: newGuide.id });
  }

  function duplicateItem(itemIndex) {
    const newIndex = itemIndex + 1;
    updateDraft((d) => {
      const items = [...d.items];
      const source = d.items[itemIndex];
      items.splice(newIndex, 0, {
        ...source,
        children: source.children?.map((child) => ({ ...child })),
      });
      return { ...d, items };
    });
    setActiveItemIndex(newIndex);
    setActiveChildIndex(null);
    setSelectedItemIndexes([]);
  }

  function duplicateGroupChild(groupIndex, childIndex) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) => (
        i === groupIndex
          ? {
              ...item,
              children: [
                ...(item.children ?? []).slice(0, childIndex + 1),
                { ...(item.children ?? [])[childIndex] },
                ...(item.children ?? []).slice(childIndex + 1),
              ],
            }
          : item
      )),
    }));
    setActiveItemIndex(groupIndex);
    setActiveChildIndex(childIndex + 1);
  }

  function deleteItem(itemIndex) {
    updateDraft((d) => ({
      ...d,
      items: d.items.filter((_, i) => i !== itemIndex),
    }));
    setActiveItemIndex(null);
    setActiveChildIndex(null);
    setSelectedItemIndexes([]);
  }

  function deleteGroupChild(groupIndex, childIndex) {
    updateDraft((d) => ({
      ...d,
      items: d.items.map((item, i) => (
        i === groupIndex
          ? {
              ...item,
              children: (item.children ?? []).filter((_, childI) => childI !== childIndex),
            }
          : item
      )),
    }));
    setActiveItemIndex(groupIndex);
    setActiveChildIndex(null);
  }

  function duplicateActiveItem() {
    if (activeItemIndex === null) return;
    if (activeChildIndex !== null) duplicateGroupChild(activeItemIndex, activeChildIndex);
    else duplicateItem(activeItemIndex);
  }

  function deleteActiveItem() {
    if (activeItemIndex === null) return;
    if (activeChildIndex !== null) deleteGroupChild(activeItemIndex, activeChildIndex);
    else deleteItem(activeItemIndex);
  }

  return (
    <main className="priority-guide-editor">
      <SideNav
        collapseButtonPlacement="footer"
        open={sideNavOpen}
        onClose={() => setSideNavOpen(false)}
        defaultCollapsed={sideNavDefaultCollapsed}
        header={
          <div className="priority-guide-editor-nav-header">
            <SelectField
              label="Guide"
              size="compact"
              value={activeGuideId}
              onChange={(e) => changeGuide(e.target.value)}
            >
              {allGuides.map((item) => (
                <option key={item.id} value={item.id}>{item.tab || item.title}</option>
              ))}
            </SelectField>
            <IconButton
              icon={allTreeGroupsExpanded ? "unfold_less" : "unfold_more"}
              label={allTreeGroupsExpanded ? "Collapse all groups" : "Expand all groups"}
              onClick={toggleAllTreeGroups}
              disabled={groupIndexes.length === 0 || isCreatingNew}
            />
          </div>
        }
        footer={() =>
          isCreatingNew ? undefined : (
            <div className="priority-guide-editor-nav-actions">
              <IconButton
                icon="add"
                label="New Guide"
                variant="secondary"
                onClick={() => {
                  onNavigate(null, "new");
                  setIsCreatingNew(true);
                  setActiveItemIndex(null);
                  setActiveChildIndex(null);
                }}
              />
              <IconButton
                icon="content_copy"
                label="Duplicate guide"
                variant="secondary"
                onClick={duplicateGuide}
              />
              <IconButton
                icon={isUserGuide ? "delete" : "refresh"}
                label={isUserGuide ? "Delete guide" : "Reset guide"}
                variant="destructive"
                onClick={isUserGuide ? deleteGuide : resetGuide}
              />
            </div>
          )
        }
      >
        {isCreatingNew && (
          <SideNavItem
            as="button"
            icon="edit_note"
            label="New guide"
            active={true}
          />
        )}
        {!isCreatingNew && (
          <GuideItemTree
            items={guide.items}
            activeIndex={activeItemIndex}
            activeChildIndex={activeChildIndex}
            expandedGroups={expandedTreeGroups}
            onToggleGroup={toggleTreeGroup}
            onSelectItem={selectTopItem}
            onSelectChild={selectChildItem}
          />
        )}
      </SideNav>

      <section className="priority-guide-editor-canvas" aria-label={isCreatingNew ? "New guide" : activeItem ? "Item preview" : "Guide preview"}>
        <div className="priority-guide-editor-canvas__toolbar">
          <div className="priority-guide-editor-canvas__title">
            <IconButton
              icon="menu"
              label="Open navigation"
              className="priority-guide-editor-nav-toggle"
              onClick={() => setSideNavOpen(true)}
            />
            {isCreatingNew ? (
              <Heading as="h1" size="md">New guide</Heading>
            ) : activeItem ? (
              <Breadcrumb
                items={
                  activeChildIndex !== null && activeParentItem
                    ? [
                        { label: guide.title, onClick: clearActiveItem },
                        { label: activeParentItem.title, onClick: () => selectTopItem(activeItemIndex) },
                        { label: activeItem.title },
                      ]
                    : [
                        { label: guide.title, onClick: clearActiveItem },
                        { label: activeItem.title },
                      ]
                }
              />
            ) : (
              <Heading as="h1" size="md">{guide.title}</Heading>
            )}
          </div>
        </div>
        <div className="priority-guide-editor-canvas__guide">
          {isCreatingNew ? (
            <NewGuideCanvas
              onCreateGuide={handleCreateGuide}
              onCancel={() => {
                switchToGuide(activeGuideId);
                onNavigate(null, "editor", { guide: activeGuideId });
              }}
            />
          ) : activeItem ? (
            <ItemDetailCanvas
              item={activeItem}
              index={activeChildIndex ?? activeItemIndex}
              guides={allGuides}
              onFieldChange={setActiveItemField}
              showAnnotations={showAnnotations}
            />
          ) : (
            <Tabs
              value={centerPanelTab}
              onChange={setCenterPanelTab}
              variant="line"
              className="priority-guide-editor-center-tabs"
            >
              <TabList>
                <Tab value="guide">Guide</Tab>
                <Tab value="overview">Overview</Tab>
              </TabList>
              <TabPanel value="guide">
                <PriorityGuideDocument
                  guide={guide}
                  guides={allGuides}
                  onFieldChange={setField}
                  onContextChange={setContextDetail}
                  onItemSelect={selectTopItem}
                  onChildItemSelect={selectChildItem}
                  onItemMove={moveItem}
                  onAddItem={addItem}
                  showAnnotations={showAnnotations}
                  selectedIndexes={selectedItemIndexes}
                  onToggleItemSelected={toggleItemSelected}
                  hideOverview
                />
              </TabPanel>
              <TabPanel value="overview">
                <EditorOverviewList
                  draft={draft}
                  onFieldChange={setField}
                  onContextChange={setContextDetail}
                />
              </TabPanel>
            </Tabs>
          )}
        </div>
        {!isCreatingNew && (
          <div className="priority-guide-editor-canvas__footer">
            <Button
              size="sm"
              variant="secondary"
              icon="inventory_2"
              iconPosition="start"
              onClick={groupSelectedItems}
              disabled={selectedItemIndexes.filter((index) => guide.items[index] && !isGuideGroup(guide.items[index])).length < 2}
            >
              Group selected
            </Button>
            <Button
              as="a"
              size="sm"
              variant="secondary"
              href={getRoutePath("presentation", { guide: activeGuideId })}
              onClick={(event) => onNavigate(event, "presentation", { guide: activeGuideId })}
            >
              Presentation view
            </Button>
            <Switch
              size="compact"
              label="Annotations"
              checked={showAnnotations}
              onChange={setShowAnnotations}
            />
          </div>
        )}
      </section>

      <aside className="priority-guide-editor-panel" aria-label={isCreatingNew ? "New guide info" : activeItem ? "Item controls" : "Guide controls"}>
        {isCreatingNew ? (
          <div className="priority-guide-editor-panel__empty">
            <Paragraph size="sm" color="muted">Name your guide and add a problem statement, then click <strong>Create guide</strong> to start editing.</Paragraph>
          </div>
        ) : activeItem ? (
          <>
            <div className="priority-guide-editor-panel__header">
              <Heading as="h2" size="sm">{isGuideGroup(activeItem) ? "Group brief" : "Item brief"}</Heading>
            </div>
            <div className="priority-guide-editor-fields">
              <SelectField
                label={isGuideGroup(activeItem) ? "Container type" : "Component type"}
                size="compact"
                value={activeItem.componentType ?? ""}
                onChange={(e) => setActiveItemField("componentType", e.target.value)}
              >
                <option value="">— select —</option>
                {(isGuideGroup(activeItem) ? containerComponentOptions : itemComponentOptions).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
                {activeItem.componentType && !(isGuideGroup(activeItem) ? containerComponentOptions : itemComponentOptions).includes(activeItem.componentType) && (
                  <option value={activeItem.componentType}>{activeItem.componentType}</option>
                )}
              </SelectField>
              <GuideLinkSelect
                item={activeItem}
                guides={allGuides.filter((guide) => guide.id !== activeGuideId)}
                onChange={(value) => setActiveItemField("linkedGuideId", value)}
              />
              <TextareaField
                label="Content"
                size="compact"
                rows="sm"
                value={activeItem.content}
                onChange={(e) => setActiveItemField("content", e.target.value)}
              />
              <TextareaField
                label="Annotations"
                size="compact"
                rows="sm"
                value={(activeItem.annotations ?? []).join("\n")}
                onChange={(e) => setActiveItemAnnotations(e.target.value)}
              />
              {isGuideGroup(activeItem) && (
                <div className="priority-guide-group-children-editor">
                  <div className="priority-guide-editor-panel__header">
                    <Heading as="h3" size="xs">Children</Heading>
                  </div>
                  {(activeItem.children ?? []).map((child, childIndex) => (
                    <div key={childIndex} className="priority-guide-group-child-editor">
                      <TextField
                        label={`Child ${childIndex + 1} title`}
                        size="compact"
                        value={child.title ?? ""}
                        onChange={(e) => setGroupChildField(activeItemIndex, childIndex, "title", e.target.value)}
                      />
                      <TextareaField
                        label="Content"
                        size="compact"
                        rows="sm"
                        value={child.content ?? ""}
                        onChange={(e) => setGroupChildField(activeItemIndex, childIndex, "content", e.target.value)}
                      />
                      <SelectField
                        label="Component type"
                        size="compact"
                        value={child.componentType ?? ""}
                        onChange={(e) => setGroupChildField(activeItemIndex, childIndex, "componentType", e.target.value)}
                      >
                        <option value="">— select —</option>
                        {itemComponentOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </SelectField>
                      <GuideLinkSelect
                        item={child}
                        guides={allGuides.filter((guide) => guide.id !== activeGuideId)}
                        onChange={(value) => setGroupChildField(activeItemIndex, childIndex, "linkedGuideId", value)}
                      />
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="secondary"
                    icon="add"
                    iconPosition="start"
                    onClick={() => addChildToGroup(activeItemIndex)}
                  >
                    Add child item
                  </Button>
                </div>
              )}
            </div>
            <div className="priority-guide-editor-panel__footer">
              <Button
                size="sm"
                icon="check"
                iconPosition="start"
                onClick={clearActiveItem}
              >
                Done
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon="content_copy"
                iconPosition="start"
                onClick={duplicateActiveItem}
              >
                Duplicate item
              </Button>
              <Button
                size="sm"
                variant="destructive"
                icon="delete"
                iconPosition="start"
                onClick={deleteActiveItem}
              >
                Delete item
              </Button>
            </div>
          </>
        ) : (
          <Tabs
            value={rightPanelTab}
            onChange={setRightPanelTab}
            variant="line"
            className="priority-guide-panel-tabs"
          >
            <TabList>
              <Tab value="overview">Overview</Tab>
              <Tab value="json">JSON</Tab>
            </TabList>
            <TabPanel value="overview">
              <EditorOverviewFields
                draft={draft}
                onFieldChange={setField}
                onContextChange={setContextDetail}
              />
            </TabPanel>
            <TabPanel value="json">
              <JsonPanel key={activeGuideId} guide={guide} onLoad={loadFromJson} />
            </TabPanel>
          </Tabs>
        )}
      </aside>
      <Snackbar
        open={!!deletedGuide}
        actionLabel="Undo"
        onAction={undoDeleteGuide}
        onClose={() => setDeletedGuide(null)}
      >
        Guide deleted.
      </Snackbar>
    </main>
  );
}
