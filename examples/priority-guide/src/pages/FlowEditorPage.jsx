import React, { useEffect, useRef, useState } from "react";
import {
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
import { exampleFlows } from "../lib/data.jsx";
import { getRoutePath } from "../lib/routing.js";
import {
  getStoredFlows,
  getStoredGuide,
  getStoredGuides,
  loadStoredEditor,
  saveStoredEditor,
  saveStoredFlowState,
} from "../lib/storage.js";

const FLOW_NODE_W = 220;
const FLOW_NODE_H = 120;
const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 3;

function getEdgeRoute(fromNode, toNode) {
  const fcx = fromNode.x + FLOW_NODE_W / 2;
  const fcy = fromNode.y + FLOW_NODE_H / 2;
  const tcx = toNode.x + FLOW_NODE_W / 2;
  const tcy = toNode.y + FLOW_NODE_H / 2;
  const dx = tcx - fcx;
  const dy = tcy - fcy;
  let x1, y1, x2, y2;
  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx >= 0) {
      x1 = fromNode.x + FLOW_NODE_W; y1 = fcy;
      x2 = toNode.x; y2 = tcy;
    } else {
      x1 = fromNode.x; y1 = fcy;
      x2 = toNode.x + FLOW_NODE_W; y2 = tcy;
    }
    const cx = Math.max(Math.abs(x2 - x1) * 0.5, 60);
    return { x1, y1, x2, y2, d: `M ${x1} ${y1} C ${x1 + Math.sign(x2 - x1) * cx} ${y1}, ${x2 - Math.sign(x2 - x1) * cx} ${y2}, ${x2} ${y2}` };
  } else {
    if (dy >= 0) {
      x1 = fcx; y1 = fromNode.y + FLOW_NODE_H;
      x2 = tcx; y2 = toNode.y;
    } else {
      x1 = fcx; y1 = fromNode.y;
      x2 = tcx; y2 = toNode.y + FLOW_NODE_H;
    }
    const cy = Math.max(Math.abs(y2 - y1) * 0.5, 60);
    return { x1, y1, x2, y2, d: `M ${x1} ${y1} C ${x1} ${y1 + Math.sign(y2 - y1) * cy}, ${x2} ${y2 - Math.sign(y2 - y1) * cy}, ${x2} ${y2}` };
  }
}

function getDefaultFlowPositions(states) {
  return (states ?? []).map((state, index) => ({
    guideId: state.guideId,
    state: state.state,
    x: 60 + (index % 3) * (FLOW_NODE_W + 80),
    y: 60 + Math.floor(index / 3) * (FLOW_NODE_H + 80),
  }));
}

export function FlowEditorPage({ flowId, onNavigate }) {
  const flow = getStoredFlows().find((f) => f.id === flowId);
  const [flowTitle, setFlowTitle] = useState(() => flow?.title ?? "Flow");

  const [nodes, setNodes] = useState(() => {
    if (!flow) return [];
    const saved = loadStoredEditor()?.flowPositions?.[flowId];
    return saved?.nodes ?? getDefaultFlowPositions(flow.states ?? []);
  });

  const [edges, setEdges] = useState(() => {
    if (!flow) return [];
    const saved = loadStoredEditor()?.flowPositions?.[flowId];
    return saved?.edges ?? (flow.links ?? []).map((l) => ({ from: l.from, to: l.to, label: l.label ?? "" }));
  });

  const [dragging, setDragging] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [panning, setPanning] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [nodeForm, setNodeForm] = useState(null);
  const [activeEdgeIndex, setActiveEdgeIndex] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const ctxMenuAnchorRef = useRef(null);
  const dragMoved = useRef(false);
  const panMoved = useRef(false);
  const svgRef = useRef(null);
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  panOffsetRef.current = panOffset;
  zoomRef.current = zoom;

  useEffect(() => {
    setFlowTitle(flow?.title ?? "Flow");
  }, [flowId, flow?.title]);

  useEffect(() => {
    if (!flow) return;
    saveStoredFlowState(flowId, nodes, edges);
  }, [nodes, edges, flowId]);

  // Load guide data when selected node changes
  useEffect(() => {
    if (!activeNodeId) { setNodeForm(null); return; }
    const guide = getStoredGuide(activeNodeId);
    setNodeForm({
      title: guide.title ?? "",
      pageType: guide.pageType ?? "",
      problemStatement: guide.problemStatement ?? "",
    });
  }, [activeNodeId]);

  useEffect(() => {
    if (!activeNodeId || !nodeForm) return;

    function onKeyDown(e) {
      if (e.key !== "Enter" && e.key !== "Escape") return;
      e.preventDefault();
      setActiveNodeId(null);
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [activeNodeId, nodeForm]);

  useEffect(() => {
    if (!dragging) return;
    function onMove(e) {
      dragMoved.current = true;
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pan = panOffsetRef.current;
      const z = zoomRef.current;
      setNodes((prev) => prev.map((n) => n.guideId !== dragging.nodeId ? n : {
        ...n,
        x: (e.clientX - rect.left - pan.x) / z - dragging.offsetX,
        y: (e.clientY - rect.top - pan.y) / z - dragging.offsetY,
      }));
    }
    function onUp() { setDragging(null); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  useEffect(() => {
    if (!connecting) return;
    function onMove(e) {
      updateConnectingFromEvent(e);
    }
    function onUp() { setConnecting(null); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [!!connecting]);

  useEffect(() => {
    if (!panning) return;
    function onMove(e) {
      panMoved.current = true;
      setPanOffset({ x: panning.startPanX + e.clientX - panning.startX, y: panning.startPanY + e.clientY - panning.startY });
    }
    function onUp() { setPanning(null); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [panning]);

  if (!flow) {
    return (
      <main>
        <Section>
          <div className="priority-guide-shell">
            <Paragraph>Flow not found.</Paragraph>
            <Button onClick={() => onNavigate(null, "flows")}>Back to flows</Button>
          </div>
        </Section>
      </main>
    );
  }

  const guides = getStoredGuides();
  const isLocalFlow = (loadStoredEditor()?.userFlows ?? []).some((item) => item.id === flowId);
  const flowJson = JSON.stringify({
    ...(flow ?? {}),
    title: flowTitle,
    states: nodes.map(({ guideId, state }) => ({ guideId, state: state ?? "" })),
    links: edges.map(({ from, to, label }) => ({ from, to, label: label ?? "" })),
    positions: { nodes, edges },
  }, null, 2);

  const connectTarget = connecting
    ? nodes.find((n) =>
        n.guideId !== connecting.fromId &&
        connecting.x >= n.x && connecting.x <= n.x + FLOW_NODE_W &&
        connecting.y >= n.y && connecting.y <= n.y + FLOW_NODE_H
      )?.guideId ?? null
    : null;

  function saveNodeField(key, value) {
    setNodeForm((prev) => ({ ...prev, [key]: value }));
    const stored = loadStoredEditor() ?? {};
    const seed = getStoredGuide(activeNodeId);
    const draft = stored.drafts?.[activeNodeId] ?? makeDraft(seed);
    saveStoredEditor({ ...stored, drafts: { ...(stored.drafts ?? {}), [activeNodeId]: { ...draft, [key]: value } } });
  }

  function saveFlowTitle(value) {
    setFlowTitle(value);
    const stored = loadStoredEditor() ?? {};
    const userFlows = (stored.userFlows ?? []).map((item) => (
      item.id === flowId ? { ...item, title: value } : item
    ));
    saveStoredEditor({ ...stored, userFlows });
  }

  function deleteActiveNode() {
    setNodes((prev) => prev.filter((n) => n.guideId !== activeNodeId));
    setEdges((prev) => prev.filter((e) => e.from !== activeNodeId && e.to !== activeNodeId));
    setActiveNodeId(null);
  }

  function closeNodeEditor() {
    setActiveNodeId(null);
  }

  function handleNodeEditorKeyDown(e) {
    if (e.key !== "Enter" && e.key !== "Escape") return;
    e.preventDefault();
    closeNodeEditor();
  }

  function handleNodeEditorClick(e) {
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const isInsideDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!isInsideDialog) {
      closeNodeEditor();
    }
  }

  function createBlankGuide(x, y) {
    const newGuide = {
      id: `user-${Date.now()}`,
      tab: "New guide",
      icon: "description",
      title: "New guide",
      pageType: "",
      context: "",
      problemStatement: "",
      audience: "",
      userGoal: "",
      businessGoal: "",
      contextDetails: [
        { label: "Decision needed", value: "- [ ] ", checkable: true },
        { label: "Out of scope", value: "" },
        { label: "Contributors", value: "" },
      ],
      items: [],
    };
    storeCreatedGuide(newGuide);
    const newNode = { guideId: newGuide.id, state: "", x, y };
    setNodes((prev) => [...prev, newNode]);
    setActiveNodeId(newGuide.id);
    return newGuide;
  }

  function addBlankGuide() {
    const col = nodes.length % 3;
    const row = Math.floor(nodes.length / 3);
    createBlankGuide(60 + col * (FLOW_NODE_W + 80), 60 + row * (FLOW_NODE_H + 80));
  }

  function duplicateNode(guideId) {
    const originalGuide = getStoredGuide(guideId);
    const originalNode = nodes.find((n) => n.guideId === guideId);
    if (!originalNode) return;
    const newGuide = { ...originalGuide, id: `user-${Date.now()}`, tab: `${originalGuide.tab || originalGuide.title} copy`, title: `${originalGuide.title} copy` };
    storeCreatedGuide(newGuide);
    setNodes((prev) => [...prev, { guideId: newGuide.id, state: "", x: originalNode.x + 40, y: originalNode.y + 40 }]);
    setContextMenu(null);
  }

  function deleteNodeById(guideId) {
    setNodes((prev) => prev.filter((n) => n.guideId !== guideId));
    setEdges((prev) => prev.filter((e) => e.from !== guideId && e.to !== guideId));
    if (activeNodeId === guideId) setActiveNodeId(null);
    setContextMenu(null);
  }

  function handleNodeMouseDown(e, guideId) {
    if (e.button !== 0 || connecting) return;
    e.stopPropagation();
    dragMoved.current = false;
    const node = nodes.find((n) => n.guideId === guideId);
    const rect = svgRef.current?.getBoundingClientRect();
    if (!node || !rect) return;
    const pan = panOffsetRef.current;
    const z = zoomRef.current;
    setDragging({ nodeId: guideId, offsetX: (e.clientX - rect.left - pan.x) / z - node.x, offsetY: (e.clientY - rect.top - pan.y) / z - node.y });
  }

  function handleNodeClick(e, guideId) {
    if (connecting || dragMoved.current) return;
    e.stopPropagation();
    setActiveEdgeIndex(null);
    setActiveNodeId((prev) => prev === guideId ? null : guideId);
  }

  function handleConnectStart(e, fromId) {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pan = panOffsetRef.current;
    const z = zoomRef.current;
    setConnecting({ fromId, x: (e.clientX - rect.left - pan.x) / z, y: (e.clientY - rect.top - pan.y) / z });
  }

  function updateConnectingFromEvent(e) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pan = panOffsetRef.current;
    const z = zoomRef.current;
    const x = (e.clientX - rect.left - pan.x) / z;
    const y = (e.clientY - rect.top - pan.y) / z;
    setConnecting((prev) => prev ? { ...prev, x, y } : null);
  }

  function handleSvgMouseMove(e) {
    if (!connecting) return;
    updateConnectingFromEvent(e);
  }

  function handleCanvasContextMenu(e) {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pan = panOffsetRef.current;
    const z = zoomRef.current;
    const worldX = (e.clientX - rect.left - pan.x) / z;
    const worldY = (e.clientY - rect.top - pan.y) / z;
    setContextMenu({ type: "canvas", worldX, worldY, x: e.clientX, y: e.clientY });
  }

  function handleNodeContextMenu(e, guideId) {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ type: "node", guideId, x: e.clientX, y: e.clientY });
  }

  function handleSvgMouseDown(e) {
    if (e.button !== 0 || dragging || connecting) return;
    const isBg = e.target === svgRef.current || e.target.classList.contains("priority-guide-flow-bg");
    if (!isBg) return;
    panMoved.current = false;
    setPanning({ startX: e.clientX, startY: e.clientY, startPanX: panOffset.x, startPanY: panOffset.y });
  }

  function handleSvgMouseUp(e) {
    if (connecting) {
      if (connectTarget && !edges.some((edge) => edge.from === connecting.fromId && edge.to === connectTarget)) {
        setEdges((prev) => [...prev, { from: connecting.fromId, to: connectTarget, label: "" }]);
      }
      setConnecting(null);
      return;
    }
    const isBg = e.target === svgRef.current || e.target.classList.contains("priority-guide-flow-bg");
    if (isBg && !panMoved.current) {
      setActiveNodeId(null);
      setActiveEdgeIndex(null);
    }
  }

  const activeEdge = activeEdgeIndex !== null ? edges[activeEdgeIndex] : null;

  return (
    <main className="priority-guide-flow-editor-page">
      <SideNav
        defaultCollapsed
        className="priority-guide-flow-inspector"
        header={(collapsed) => collapsed ? null : (
          <Heading as="h2" size="xs">Flow settings</Heading>
        )}
      >
        <div className="priority-guide-flow-inspector__content">
          <TextField
            label="Flow name"
            size="compact"
            value={flowTitle}
            disabled={!isLocalFlow}
            onChange={(e) => saveFlowTitle(e.target.value)}
          />
          <TextareaField
            label="JSON"
            size="compact"
            rows="lg"
            value={flowJson}
            readOnly
            className="priority-guide-flow-inspector__json"
          />
        </div>
      </SideNav>

      <div className="priority-guide-flow-editor-workspace">
        <div className="priority-guide-flow-editor-toolbar">
          <Link href={getRoutePath("flows")} onClick={(e) => onNavigate(e, "flows")} icon="arrow_back" iconPosition="start">
            Flows
          </Link>
          <Heading as="h1" size="sm" className="priority-guide-flow-editor-toolbar__title">{flowTitle}</Heading>
          <Button icon="add" iconPosition="start" onClick={addBlankGuide}>
            Add guide
          </Button>
        </div>

        <div className={`priority-guide-flow-editor-canvas${panning ? " priority-guide-flow-editor-canvas--panning" : ""}`}>
        <svg
          ref={svgRef}
          className={`priority-guide-flow-editor-svg${connecting ? " priority-guide-flow-editor-svg--connecting" : ""}`}
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onContextMenu={handleCanvasContextMenu}
        >
          <defs>
            <marker id="flow-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" className="priority-guide-flow-arrowhead" />
            </marker>
            <marker id="flow-arrow-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" className="priority-guide-flow-arrowhead--active" />
            </marker>
          </defs>

          <rect x="0" y="0" width="100%" height="100%" fill="transparent" className="priority-guide-flow-bg" />

          {nodes.length === 0 && (
            <text x="50%" y="50%" className="priority-guide-flow-empty-text" textAnchor="middle" dominantBaseline="middle">
              Right-click or use "Add guide" to start.
            </text>
          )}

          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
            {edges.map((edge, i) => {
              const from = nodes.find((n) => n.guideId === edge.from);
              const to = nodes.find((n) => n.guideId === edge.to);
              if (!from || !to) return null;
              const { x1, y1, x2, y2, d } = getEdgeRoute(from, to);
              const isActive = activeEdgeIndex === i;
              return (
                <g key={`${edge.from}-${edge.to}-${i}`} onClick={() => { setActiveNodeId(null); setActiveEdgeIndex(isActive ? null : i); }} style={{ cursor: "pointer" }}>
                  <path d={d} fill="none" stroke="transparent" strokeWidth="12" />
                  <path d={d} className={`priority-guide-flow-edge${isActive ? " priority-guide-flow-edge--active" : ""}`} markerEnd={`url(#flow-arrow${isActive ? "-active" : ""})`} />
                  {edge.label && (
                    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} className="priority-guide-flow-edge-label" textAnchor="middle">
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {connecting && (() => {
              const from = nodes.find((n) => n.guideId === connecting.fromId);
              if (!from) return null;
              const { x1, y1 } = getEdgeRoute(from, { x: connecting.x - FLOW_NODE_W / 2, y: connecting.y - FLOW_NODE_H / 2 });
              const toNode = connectTarget ? nodes.find((n) => n.guideId === connectTarget) : null;
              const endX = toNode ? toNode.x + FLOW_NODE_W / 2 : connecting.x;
              const endY = toNode ? toNode.y + FLOW_NODE_H / 2 : connecting.y;
              const dx = Math.max(Math.abs(endX - x1) * 0.5, 60) * Math.sign(endX - x1 || 1);
              return (
                <path
                  d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${endX - dx} ${endY}, ${endX} ${endY}`}
                  className="priority-guide-flow-edge--connecting"
                  markerEnd="url(#flow-arrow-active)"
                />
              );
            })()}

            {nodes.map((node) => {
              const guide = guides.find((g) => g.id === node.guideId);
              const isActive = activeNodeId === node.guideId;
              const isTarget = connectTarget === node.guideId;
              const isSource = connecting?.fromId === node.guideId;
              return (
                <g
                  key={node.guideId}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.guideId)}
                  onClick={(e) => handleNodeClick(e, node.guideId)}
                  onContextMenu={(e) => handleNodeContextMenu(e, node.guideId)}
                  style={{ cursor: connecting ? "default" : dragging?.nodeId === node.guideId ? "grabbing" : "grab" }}
                >
                  <rect
                    width={FLOW_NODE_W}
                    height={FLOW_NODE_H}
                    rx="4"
                    className={[
                      "priority-guide-flow-node__rect",
                      isActive ? "priority-guide-flow-node__rect--active" : "",
                      isTarget ? "priority-guide-flow-node__rect--target" : "",
                      isSource ? "priority-guide-flow-node__rect--source" : "",
                    ].filter(Boolean).join(" ")}
                  />
                  <foreignObject width={FLOW_NODE_W} height={FLOW_NODE_H} style={{ pointerEvents: "none" }}>
                    <div xmlns="http://www.w3.org/1999/xhtml" className="priority-guide-flow-node__content">
                      {guide?.pageType && <span className="priority-guide-flow-node__page-type">{guide.pageType}</span>}
                      <span
                        className="priority-guide-flow-node__title priority-guide-flow-node__title--editable"
                        contentEditable
                        suppressContentEditableWarning
                        style={{ pointerEvents: "all" }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          const val = e.currentTarget.textContent.trim();
                          if (val !== (guide?.title || "")) {
                            const stored = loadStoredEditor() ?? {};
                            const seed = getStoredGuide(node.guideId);
                            const draft = stored.drafts?.[node.guideId] ?? makeDraft(seed);
                            saveStoredEditor({ ...stored, drafts: { ...(stored.drafts ?? {}), [node.guideId]: { ...draft, title: val || "New guide" } } });
                            setNodes((prev) => [...prev]);
                          }
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); } }}
                      >
                        {guide?.title || "New guide"}
                      </span>
                      <span
                        className="priority-guide-flow-node__desc priority-guide-flow-node__desc--editable"
                        contentEditable
                        suppressContentEditableWarning
                        style={{ pointerEvents: "all" }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          const val = e.currentTarget.textContent.trim();
                          if (val !== (guide?.problemStatement || "")) {
                            const stored = loadStoredEditor() ?? {};
                            const seed = getStoredGuide(node.guideId);
                            const draft = stored.drafts?.[node.guideId] ?? makeDraft(seed);
                            saveStoredEditor({ ...stored, drafts: { ...(stored.drafts ?? {}), [node.guideId]: { ...draft, problemStatement: val } } });
                            setNodes((prev) => [...prev]);
                          }
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); } }}
                        data-placeholder="Add description…"
                      >
                        {guide?.problemStatement || ""}
                      </span>
                    </div>
                  </foreignObject>
                  <circle
                    cx={FLOW_NODE_W}
                    cy={FLOW_NODE_H / 2}
                    r={7}
                    className={`priority-guide-flow-node__handle${connecting ? " priority-guide-flow-node__handle--visible" : ""}`}
                    onMouseDown={(e) => handleConnectStart(e, node.guideId)}
                    style={{ cursor: "crosshair" }}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Edge popup */}
        {activeEdge && (() => {
          const from = nodes.find((n) => n.guideId === activeEdge.from);
          const to = nodes.find((n) => n.guideId === activeEdge.to);
          if (!from || !to) return null;
          const { x1, y1, x2, y2 } = getEdgeRoute(from, to);
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          return (
            <div className="priority-guide-flow-edge-popup" style={{ left: midX * zoom + panOffset.x, top: midY * zoom + panOffset.y }}>
              <input
                type="text"
                className="priority-guide-flow-edge-popup__input"
                value={activeEdge.label ?? ""}
                placeholder="Add label…"
                onChange={(e) => setEdges((prev) => prev.map((ed, i) => i === activeEdgeIndex ? { ...ed, label: e.target.value } : ed))}
                onClick={(e) => e.stopPropagation()}
              />
              <IconButton
                icon="delete"
                label="Delete connection"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setEdges((prev) => prev.filter((_, i) => i !== activeEdgeIndex));
                  setActiveEdgeIndex(null);
                }}
              />
            </div>
          );
        })()}

        {/* Zoom controls */}
        <div className="priority-guide-flow-zoom">
          <button className="priority-guide-flow-zoom__reset" onClick={() => { setPanOffset({ x: 0, y: 0 }); setZoom(1); }} title="Reset view">Reset view</button>
          <div className="priority-guide-flow-zoom__divider" />
          <IconButton icon="remove" label="Zoom out" size="sm" onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))} />
          <button className="priority-guide-flow-zoom__value" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
          <IconButton icon="add" label="Zoom in" size="sm" onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))} />
        </div>
      </div>
      </div>

      {/* Phantom anchor for context menu */}
      <div
        ref={ctxMenuAnchorRef}
        style={{ position: "fixed", left: contextMenu?.x ?? -9999, top: contextMenu?.y ?? -9999, width: 0, height: 0, pointerEvents: "none" }}
      />
      <Menu
        open={!!contextMenu}
        onClose={() => setContextMenu(null)}
        anchorRef={ctxMenuAnchorRef}
        aria-label="Canvas options"
      >
        {contextMenu?.type === "node" ? (
          <>
            <MenuSection>
              <MenuItem icon="edit" onClick={() => { setActiveNodeId(contextMenu.guideId); setContextMenu(null); }}>Edit</MenuItem>
              <MenuItem icon="content_copy" onClick={() => duplicateNode(contextMenu.guideId)}>Duplicate</MenuItem>
            </MenuSection>
            <MenuSection>
              <MenuItem icon="delete" variant="destructive" onClick={() => deleteNodeById(contextMenu.guideId)}>Delete</MenuItem>
            </MenuSection>
          </>
        ) : (
          <MenuSection>
            <MenuItem icon="add" onClick={() => { createBlankGuide(contextMenu.worldX - FLOW_NODE_W / 2, contextMenu.worldY - FLOW_NODE_H / 2); setContextMenu(null); }}>Add guide here</MenuItem>
          </MenuSection>
        )}
      </Menu>

      <Dialog
        open={!!activeNodeId && !!nodeForm}
        onClose={closeNodeEditor}
        onClick={handleNodeEditorClick}
        onKeyDown={handleNodeEditorKeyDown}
        title={nodeForm ? (guides.find((g) => g.id === activeNodeId)?.title || "New guide") : "Guide"}
        footer={
          <>
            <Button onClick={closeNodeEditor}>Done</Button>
            <span className="priority-guide-flex-spacer" />
            <Button variant="destructive" icon="delete" iconPosition="start" onClick={deleteActiveNode}>
              Delete
            </Button>
          </>
        }
      >
        {nodeForm && (
          <div className="priority-guide-flow-node-dialog">
            <TextField
              label="Guide name"
              value={nodeForm.title}
              placeholder="Untitled guide"
              onChange={(e) => saveNodeField("title", e.target.value)}
            />
            <SelectField
              label="Page type"
              value={nodeForm.pageType}
              onChange={(e) => saveNodeField("pageType", e.target.value)}
            >
              <option value="">— select —</option>
              {pageTypeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </SelectField>
            <TextareaField
              label="Description"
              rows="sm"
              value={nodeForm.problemStatement}
              placeholder="What problem does this page solve?"
              onChange={(e) => saveNodeField("problemStatement", e.target.value)}
            />
            <Link
              href={getRoutePath("editor", { guide: activeNodeId })}
              icon="open_in_new"
              iconPosition="end"
              onClick={(e) => { setActiveNodeId(null); onNavigate(e, "editor", { guide: activeNodeId }); }}
            >
              Open guide
            </Link>
          </div>
        )}
      </Dialog>
    </main>
  );
}
