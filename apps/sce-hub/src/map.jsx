import React, { useState, useMemo } from "react";
import {
  Stack,
  Grid,
  GridItem,
  Card,
  Heading,
  Paragraph,
  Button,
  Link,
  Canvas,
  Node,
  NodeConnector,
  DataTable,
  MessageBadge,
} from "@gtivr4/a1-design-system-react";
import {
  useWorkspace,
  api,
  PageTitle,
  Page,
  Field,
  Select,
  ActionDialog,
  Confirm,
  LinkedPicker,
  RecordLinks,
  SourceLink,
  Empty,
  Notice,
} from "./ui.jsx";
import { nodeTypes, relationships, reachable } from "./model.mjs";

export function DependencyMap() {
  const { records, dataset, canEdit, run, refresh, announce, setDataset } =
    useWorkspace();
  const nodes = records.filter((r) => r.kind === "node"),
    edges = records.filter((r) => r.kind === "edge");
  const [mode, setMode] = useState("Canvas"),
    [q, setQ] = useState(""),
    [type, setType] = useState(""),
    [selected, setSelected] = useState(null),
    [edit, setEdit] = useState(null),
    [remove, setRemove] = useState(null),
    [positions, setPositions] = useState({}),
    [direction, setDirection] = useState("downstream"),
    [impact, setImpact] = useState(false),
    [saveView, setSaveView] = useState(false),
    [viewName, setViewName] = useState(""),
    [saving, setSaving] = useState(false);
  const node = nodes.find((n) => n.id === selected),
    affected = reachable(selected, edges, direction);
  const visible = nodes.filter(
    (n) =>
      (!q ||
        `${n.title} ${n.owner || ""}`
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (!type || n.type === type) &&
      (!impact || n.id === selected || affected.includes(n.id)),
  );
  const ids = new Set(visible.map((n) => n.id)),
    viewEdges = edges.filter((e) => ids.has(e.from) && ids.has(e.to));
  const views = records.filter(
    (r) => r.kind === "view" && r.filters?.page === "map",
  );
  const updatePosition = (id, x, y) =>
    setPositions((s) => ({ ...s, [id]: { x, y } }));
  async function savePositions() {
    setSaving(true);
    const result = await run(async () => {
      for (const [id, p] of Object.entries(positions)) {
        const current = await api(`/records/${id}`);
        await api(
          `/records/${id}`,
          {
            ...p,
            revision: current.revision,
            reason: "Saved dependency map position.",
          },
          "PATCH",
        );
      }
      return true;
    }, "Layout saved.");
    if (result) setPositions({});
    setSaving(false);
  }
  return (
    <Page
      gap="lg"
      title={
        <PageTitle
          title="Dependency canvas"
          description="Explore how assets, teams and products connect. Relationships express what is known, proposed or uncertain."
          actions={
            canEdit && (
              <>
                <Button
                  variant="secondary"
                  icon="add_link"
                  disabled={nodes.length < 2}
                  onClick={() =>
                    setEdit({
                      kind: "edge",
                      title: "",
                      from: nodes[0]?.id,
                      to: nodes[1]?.id,
                      relation: "feeds",
                      confidence: "Proposed",
                      links: [],
                    })
                  }
                >
                  Add connection
                </Button>
                <Button
                  icon="add"
                  onClick={() =>
                    setEdit({
                      kind: "node",
                      title: "",
                      type: nodeTypes[0],
                      x: 160,
                      y: 160,
                      owner: "",
                      links: [],
                    })
                  }
                >
                  Add node
                </Button>
              </>
            )
          }
        />
      }
    >
      <Card>
        <Stack gap="md">
          <Grid columns={{ xs: 1, md: 3 }} gap="md">
            <Field label="Find an asset or owner" value={q} onChange={setQ} />
            <Select
              label="Node type"
              value={type}
              onChange={setType}
              options={[{ value: "", label: "All types" }, ...nodeTypes]}
            />
            <Select
              label="Presentation"
              value={mode}
              onChange={setMode}
              options={["Canvas", "Accessible list"]}
            />
          </Grid>
          <Stack direction="row" gap="sm" wrap>
            {canEdit && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!nodes.length}
                  onClick={() =>
                    setPositions(
                      Object.fromEntries(
                        nodes.map((n, i) => [
                          n.id,
                          {
                            x: 140 + (i % 4) * 240,
                            y: 120 + Math.floor(i / 4) * 180,
                          },
                        ]),
                      ),
                    )
                  }
                >
                  Arrange in a grid
                </Button>
                <Button
                  size="sm"
                  loading={saving}
                  disabled={!Object.keys(positions).length}
                  onClick={savePositions}
                >
                  Save layout
                </Button>
                <Button
                  size="sm"
                  variant="tertiary"
                  disabled={!Object.keys(positions).length}
                  onClick={() => setPositions({})}
                >
                  Discard layout changes
                </Button>
                <Button
                  size="sm"
                  variant="tertiary"
                  onClick={() => setSaveView(true)}
                >
                  Save map view
                </Button>
              </>
            )}
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => {
                setQ("");
                setType("");
                setImpact(false);
              }}
            >
              Show all nodes
            </Button>
          </Stack>
          {views.length > 0 && (
            <Select
              label="Saved map views"
              value=""
              onChange={(id) => {
                const f = views.find((v) => v.id === id)?.filters;
                if (f) {
                  setQ(f.q);
                  setType(f.type);
                  setMode(f.mode);
                  setSelected(f.selected);
                  setDirection(f.direction);
                  setImpact(f.impact);
                }
              }}
              options={[
                { value: "", label: "Choose a view" },
                ...views.map((v) => ({ value: v.id, label: v.title })),
              ]}
            />
          )}
        </Stack>
      </Card>
      {!nodes.length ? (
        <Empty
          title="Start with the connections you know"
          action={
            <Button variant="secondary" onClick={() => setDataset("demo")}>
              Explore the fictional example map
            </Button>
          }
        >
          Add assets and source references, then record directional
          relationships. The supplied documentation does not establish SCE’s
          complete implementation architecture.
        </Empty>
      ) : (
        <Grid columns={{ xs: 1, lg: 3 }} gap="lg">
          <GridItem span={{ xs: 1, lg: 2 }}>
            <Stack gap="md">
              {mode === "Canvas" ? (
                <Canvas
                  className="a1-sce-canvas"
                  aria-label="Dependency map; use the accessible list for equivalent editing"
                  gridType="dots"
                  edgeStyle="curved"
                  defaultZoom={0.7}
                  draggableNodes={canEdit}
                  highlightConnections
                  traceConnections
                  onNodeMove={updatePosition}
                  onSelectionChange={setSelected}
                  focusNodeId={selected}
                  onEdgeSelect={(id) => {
                    const e = edges.find((e) => e.id === id);
                    if (e && canEdit) setEdit(e);
                  }}
                >
                  {visible.map((n) => (
                    <Node
                      key={n.id}
                      id={n.id}
                      label={n.title}
                      sublabel={n.type}
                      shape="rectangle"
                      size="lg"
                      subtle
                      color={
                        n.id === selected
                          ? "accent"
                          : affected.includes(n.id) && impact
                            ? "warn"
                            : n.type.includes("Figma")
                              ? "info"
                              : n.type.includes("React")
                                ? "success"
                                : "neutral"
                      }
                      x={positions[n.id]?.x ?? n.x}
                      y={positions[n.id]?.y ?? n.y}
                    />
                  ))}
                  {viewEdges.map((e) => (
                    <NodeConnector
                      key={e.id}
                      id={e.id}
                      from={e.from}
                      to={e.to}
                      direction="to"
                      label={`${e.relation} · ${e.confidence.toLowerCase()}`}
                      variant={
                        e.confidence === "Confirmed"
                          ? "solid"
                          : e.confidence === "Proposed"
                            ? "dashed"
                            : "dotted"
                      }
                    />
                  ))}
                </Canvas>
              ) : (
                <DataTable
                  caption="Dependency nodes"
                  rows={visible}
                  columns={[
                    {
                      key: "title",
                      label: "Node",
                      renderCell: ({ row }) => (
                        <Button
                          size="sm"
                          variant="tertiary"
                          onClick={() => setSelected(row.id)}
                        >
                          {row.title}
                        </Button>
                      ),
                    },
                    { key: "type", label: "Type" },
                    {
                      key: "owner",
                      label: "Owner",
                      renderCell: ({ value }) => value || "Unassigned",
                    },
                  ]}
                />
              )}
              <Paragraph size="xs" color="muted">
                Solid: confirmed · Dashed: proposed · Dotted: uncertain. Select
                a node to inspect it. Drag or use the position controls to move
                it, then save the layout.
              </Paragraph>
              <Card>
                <Stack gap="md">
                  <Heading as="h2" size="sm">
                    Directional relationships
                  </Heading>
                  {viewEdges.length ? (
                    viewEdges.map((e) => (
                      <Stack
                        key={e.id}
                        direction="row"
                        justify="between"
                        wrap
                        gap="sm"
                      >
                        <Paragraph size="sm">
                          {nodes.find((n) => n.id === e.from)?.title} →{" "}
                          {e.relation} →{" "}
                          {nodes.find((n) => n.id === e.to)?.title} ·{" "}
                          {e.confidence}
                        </Paragraph>
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="tertiary"
                            onClick={() => setEdit(e)}
                            aria-label={`Edit connection ${nodes.find((n) => n.id === e.from)?.title} ${e.relation} ${nodes.find((n) => n.id === e.to)?.title}`}
                          >
                            Edit connection
                          </Button>
                        )}
                      </Stack>
                    ))
                  ) : (
                    <Paragraph size="sm" color="muted">
                      No connections in this view.
                    </Paragraph>
                  )}
                </Stack>
              </Card>
            </Stack>
          </GridItem>
          <Card>
            <Stack gap="md">
              <Heading as="h2" size="sm">
                Inspector
              </Heading>
              <Select
                label="Inspect a node"
                value={selected || ""}
                onChange={(v) => {
                  setSelected(v || null);
                  setImpact(false);
                }}
                options={[
                  { value: "", label: "Choose a node" },
                  ...nodes.map((n) => ({ value: n.id, label: n.title })),
                ]}
              />
              {node ? (
                <>
                  <Heading as="h3" size="sm">
                    {node.title}
                  </Heading>
                  <MessageBadge subtle size="sm">
                    {node.type}
                  </MessageBadge>
                  <Paragraph size="sm">
                    {node.summary || "No description added."}
                  </Paragraph>
                  <Paragraph size="sm">
                    Owner: {node.owner || "Unassigned"}
                  </Paragraph>
                  <SourceLink url={node.sourceUrl} />
                  <RecordLinks ids={node.links} />
                  {canEdit && (
                    <>
                      <Button variant="secondary" onClick={() => setEdit(node)}>
                        Edit node
                      </Button>
                      <Grid columns={2} gap="sm">
                        <Field
                          label="Horizontal position"
                          type="number"
                          value={positions[node.id]?.x ?? node.x}
                          onChange={(v) =>
                            updatePosition(
                              node.id,
                              Number(v),
                              positions[node.id]?.y ?? node.y,
                            )
                          }
                        />
                        <Field
                          label="Vertical position"
                          type="number"
                          value={positions[node.id]?.y ?? node.y}
                          onChange={(v) =>
                            updatePosition(
                              node.id,
                              positions[node.id]?.x ?? node.x,
                              Number(v),
                            )
                          }
                        />
                      </Grid>
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => setRemove(node)}
                      >
                        Delete node and connections
                      </Button>
                    </>
                  )}
                  <Heading as="h3" size="sm">
                    Explore possible impact
                  </Heading>
                  <Select
                    label="Trace direction"
                    value={direction}
                    onChange={setDirection}
                    options={["downstream", "upstream"]}
                  />
                  <Button
                    variant={impact ? "primary" : "secondary"}
                    onClick={() => setImpact(!impact)}
                  >
                    {impact
                      ? "Exit impact view"
                      : "Highlight related dependencies"}
                  </Button>
                  <Paragraph size="sm">
                    {affected.length} reachable assets through recorded
                    relationships. Impact follows feeds/affects forward and
                    consumers, implementations, documentation and owners in
                    reverse. Proposed and uncertain connections are included.
                    This is not proof that every impact is known.
                  </Paragraph>
                  <Stack gap="xs">
                    {affected.map((id) => (
                      <Button
                        key={id}
                        size="sm"
                        variant="tertiary"
                        onClick={() => setSelected(id)}
                      >
                        {nodes.find((n) => n.id === id)?.title ||
                          "Unavailable node"}
                      </Button>
                    ))}
                  </Stack>
                </>
              ) : (
                <Paragraph color="muted" size="sm">
                  Choose a node to see its owner, source, linked evidence and
                  dependencies.
                </Paragraph>
              )}
            </Stack>
          </Card>
        </Grid>
      )}
      {edit && (
        <MapEditor
          record={edit}
          nodes={nodes}
          onClose={() => setEdit(null)}
          onDelete={
            edit.id
              ? () => {
                  setRemove(edit);
                  setEdit(null);
                }
              : undefined
          }
        />
      )}
      {remove && (
        <Confirm
          title={`Delete ${remove.kind === "node" ? "node and its connections" : "connection"}?`}
          label="Delete"
          onClose={() => setRemove(null)}
          onSubmit={async (reason) => {
            await api(
              `/records/${remove.id}`,
              { revision: remove.revision, reason },
              "DELETE",
            );
            await refresh();
            setSelected(null);
            announce("Removed from active views; history retained.");
          }}
        >
          <Paragraph>{remove.title}</Paragraph>
        </Confirm>
      )}
      {saveView && (
        <ActionDialog
          title="Save map view"
          onClose={() => setSaveView(false)}
          onSubmit={async () => {
            await api("/records", {
              kind: "view",
              dataset,
              title: viewName,
              filters: {
                page: "map",
                q,
                type,
                mode,
                selected,
                direction,
                impact,
              },
            });
            await refresh();
            announce("Map view saved.");
          }}
        >
          <Field
            label="View name"
            value={viewName}
            onChange={setViewName}
            required
          />
        </ActionDialog>
      )}
    </Page>
  );
}
function MapEditor({ record, nodes, onClose, onDelete }) {
  const { dataset, refresh, announce } = useWorkspace();
  const [draft, setDraft] = useState({ ...record }),
    [reason, setReason] = useState("");
  const set = (k, v) => setDraft((s) => ({ ...s, [k]: v }));
  return (
    <ActionDialog
      title={`${record.id ? "Edit" : "Add"} ${record.kind}`}
      onClose={onClose}
      onSubmit={async () => {
        await api(
          record.id ? `/records/${record.id}` : "/records",
          {
            ...draft,
            title:
              draft.kind === "edge"
                ? `${nodes.find((n) => n.id === draft.from)?.title} ${draft.relation} ${nodes.find((n) => n.id === draft.to)?.title}`
                : draft.title,
            dataset,
            revision: record.revision,
            reason,
          },
          record.id ? "PATCH" : "POST",
        );
        await refresh();
        announce("Dependency record saved.");
      }}
    >
      {draft.kind === "node" ? (
        <>
          <Field
            label="Node name"
            value={draft.title}
            onChange={(v) => set("title", v)}
            required
          />
          <Select
            label="Node type"
            value={draft.type}
            onChange={(v) => set("type", v)}
            options={nodeTypes}
          />
          <Field
            label="Owner"
            value={draft.owner}
            onChange={(v) => set("owner", v)}
          />
          <Field
            label="Description"
            value={draft.summary}
            onChange={(v) => set("summary", v)}
            multiline
          />
        </>
      ) : (
        <>
          <Select
            label="From node"
            value={draft.from}
            onChange={(v) => set("from", v)}
            options={nodes.map((n) => ({ value: n.id, label: n.title }))}
          />
          <Select
            label="Relationship"
            value={draft.relation}
            onChange={(v) => set("relation", v)}
            options={relationships}
          />
          <Select
            label="To node"
            value={draft.to}
            onChange={(v) => set("to", v)}
            options={nodes.map((n) => ({ value: n.id, label: n.title }))}
          />
          <Select
            label="Confidence"
            value={draft.confidence}
            onChange={(v) => set("confidence", v)}
            options={["Confirmed", "Proposed", "Uncertain"]}
          />
        </>
      )}
      <Field
        label="Source URL"
        value={draft.sourceUrl}
        onChange={(v) => set("sourceUrl", v)}
      />
      <LinkedPicker
        exclude={draft.id}
        value={draft.links || []}
        onChange={(v) => set("links", v)}
      />
      {record.id && (
        <Field
          label="Reason for change"
          value={reason}
          onChange={setReason}
          required
        />
      )}
      {onDelete && (
        <Button variant="tertiary" onClick={onDelete}>
          Delete this connection
        </Button>
      )}
    </ActionDialog>
  );
}
