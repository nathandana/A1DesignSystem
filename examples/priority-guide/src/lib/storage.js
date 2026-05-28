import { exampleGuides, exampleFlows } from "./data.jsx";

export const STORAGE_KEY = "priority-guide-editor-v1";

export function loadStoredEditor() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredEditor(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function hasLocalGuides() {
  return (loadStoredEditor()?.userGuides ?? []).length > 0;
}

export function getStoredGuide(guideId) {
  const stored = loadStoredEditor();
  const allGuides = [...(stored?.userGuides ?? []), ...exampleGuides];
  const seed = allGuides.find((guide) => guide.id === guideId) ?? exampleGuides[0];
  const draft = stored?.drafts?.[seed.id];

  return { ...seed, ...(draft ?? {}) };
}

export function getStoredGuides() {
  const stored = loadStoredEditor();
  return [...(stored?.userGuides ?? []), ...exampleGuides].map((guide) => ({
    ...guide,
    ...(stored?.drafts?.[guide.id] ?? {}),
  }));
}

export function getStoredFlows() {
  const stored = loadStoredEditor();
  return [...exampleFlows, ...(stored?.userFlows ?? [])];
}

export function saveStoredFlowState(flowId, nodes, edges) {
  const stored = loadStoredEditor() ?? {};
  const flowPositions = {
    ...(stored.flowPositions ?? {}),
    [flowId]: { nodes, edges },
  };
  const userFlows = (stored.userFlows ?? []).map((flow) => (
    flow.id === flowId
      ? {
          ...flow,
          states: nodes.map(({ guideId, state }) => ({ guideId, state: state ?? "" })),
          links: edges.map(({ from, to, label }) => ({ from, to, label: label ?? "" })),
        }
      : flow
  ));

  saveStoredEditor({ ...stored, userFlows, flowPositions });
}

export function makeDraft(source) {
  return {
    pageType: source.pageType ?? "",
    title: source.title,
    problemStatement: source.problemStatement,
    audience: source.audience,
    userGoal: source.userGoal,
    businessGoal: source.businessGoal,
    contextDetails: source.contextDetails.map((d) => ({ ...d })),
    items: source.items.map((item) => ({
      ...item,
      children: item.children?.map((child) => ({ ...child })),
    })),
  };
}

export function storeCreatedGuide(newGuide) {
  const stored = loadStoredEditor() ?? {};
  const userGuides = [...(stored.userGuides ?? []), newGuide];
  const drafts = { ...(stored.drafts ?? {}), [newGuide.id]: makeDraft(newGuide) };
  saveStoredEditor({ ...stored, userGuides, drafts, activeGuideId: newGuide.id });
}

function getTreeItemLabel(item) {
  const text = String(item.content || item.title || getItemComponentType(item) || "Untitled item").trim();
  return text.length > 52 ? `${text.slice(0, 49)}...` : text;
}
