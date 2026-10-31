import React, { useState, useEffect, useCallback } from "react";
import {
  PageLayout,
  SideNav,
  SideNavItem,
  SideNavGroup,
  Stack,
  Section,
  Heading,
  Paragraph,
  Button,
  Icon,
  Link,
  MessageBadge,
  SelectField,
} from "@gtivr4/a1-design-system-react";
import {
  Workspace,
  api,
  Notice,
  Feedback,
  Field,
  ActionDialog,
  PageTitle,
  Page,
  go,
} from "./ui.jsx";
import {
  Overview,
  Notes,
  RecordDetail,
  Search,
  Settings,
  Ask,
  Visitor,
  Audit,
} from "./pages.jsx";
import { Guidelines, GuidelineDialog, ImportDialog } from "./guidelines.jsx";
import { DependencyMap } from "./map.jsx";

const navigation = [
  ["overview", "Overview", "space_dashboard"],
  ["guidelines", "Guidelines", "rule"],
  ["map", "Dependency canvas", "account_tree"],
  ["audit", "Website audit", "fact_check"],
  ["weekly", "Weekly summaries", "calendar_view_week"],
];
const recordSections = {
  guideline: "guidelines",
  source: "search",
  node: "map",
  edge: "map",
  report: "audit",
  finding: "audit",
  weekly: "weekly",
  initiative: "overview",
  view: "settings",
};
function SignIn({ session, reload }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState("Nathan Dana"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const setup = session.setupRequired && session.setupAllowed;
  return (
    <main>
      <Page
        gap="xl"
        contentWidth="sm"
        title={
          <PageTitle
            eyebrow="SCE workspace"
            meta={{ label: "Private", icon: "lock" }}
            contentWidth="sm"
            title={
              setup
                ? "A space for the work ahead."
                : "Welcome to your workspace."
            }
            description={
              session.authProvider === "supabase"
                ? "Sign in with your existing A1 account to access the SCE workspace."
                : "Nathan Dana’s SCE design-system project. Source material, decisions and evidence stay behind server-side sign-in."
            }
          />
        }
      >
        {session.setupRequired && !setup ? (
          <Notice error>
            Set up the owner on the server before enabling production. See the
            project setup guide.
          </Notice>
        ) : (
          <Stack
            as="form"
            gap="md"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                await api(setup ? "/setup" : "/login", {
                  email,
                  password,
                  name,
                });
                await reload();
              } catch (e) {
                setError(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {setup && (
              <Field
                label="Your name"
                value={name}
                onChange={setName}
                required
                autoComplete="name"
              />
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
              autoComplete="username"
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              required
              minLength={setup ? 14 : undefined}
              autoComplete={setup ? "new-password" : "current-password"}
              hint={
                setup
                  ? "Use at least 14 characters. You will use this password to sign in."
                  : undefined
              }
            />
            <Feedback message={error} onClose={() => setError("")} persistent />
            <Button type="submit" loading={busy}>
              {setup ? "Create private workspace access" : "Sign in"}
            </Button>
          </Stack>
        )}
        <Paragraph size="sm" color="muted">
          Private is the starting visibility. An optional public demonstration
          can include only explicitly cleared fictional records. This is an
          independent project workspace, not an official SCE product.
        </Paragraph>
      </Page>
    </main>
  );
}
export function App() {
  const [session, setSession] = useState(null),
    [fatal, setFatal] = useState(""),
    [route, setRoute] = useState(location.hash.slice(1) || "overview"),
    [dataset, setDataset] = useState(
      new URLSearchParams(location.search).get("collection") === "demo"
        ? "demo"
        : "sce",
    ),
    [data, setData] = useState({ records: [], attachments: [] }),
    [loading, setLoading] = useState(false),
    [notice, setNotice] = useState(null),
    [error, setError] = useState(""),
    [navOpen, setNavOpen] = useState(false),
    [importOpen, setImportOpen] = useState(false),
    [guidelineId, setGuidelineId] = useState(null);
  const reloadSession = useCallback(async () => {
    const s = await api("/session");
    setSession(s);
    return s;
  }, []);
  const refresh = useCallback(async () => {
    const d = await api(`/workspace?dataset=${dataset}`);
    setData(d);
  }, [dataset]);
  useEffect(() => {
    reloadSession().catch((e) => setFatal(e.message));
  }, [reloadSession]);
  useEffect(() => {
    function changed() {
      setGuidelineId(null);
      setRoute(location.hash.slice(1) || "overview");
      setNavOpen(false);
      setError("");
    }
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);
  useEffect(() => {
    if (!session?.user) return;
    let alive = true;
    setLoading(true);
    api(`/workspace?dataset=${dataset}`)
      .then((d) => {
        if (alive) setData(d);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [session?.user?.id, dataset]);
  useEffect(() => {
    if (["releases", "activity"].includes(route)) go("overview");
  }, [route]);
  useEffect(() => {
    document.title = `${navigation.find((n) => n[0] === route)?.[1] || "Workspace"} · SCE`;
    document.getElementById("page-title")?.focus({ preventScroll: true });
  }, [route, loading]);
  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.set("collection", dataset);
    history.replaceState(null, "", url);
  }, [dataset]);
  useEffect(() => {
    const expired = () => {
      setData({ records: [], attachments: [] });
      setSession((s) => ({ ...s, user: null }));
    };
    window.addEventListener("sce-session-expired", expired);
    return () => {
      window.removeEventListener("sce-session-expired", expired);
    };
  }, []);
  const announce = (text) => {
    setNotice({ id: crypto.randomUUID(), text });
    setError("");
  };
  const dismissFeedback = useCallback(() => {
    setNotice(null);
    setError("");
  }, []);
  const run = async (work, success) => {
    try {
      setError("");
      const result = await work();
      await refresh();
      if (success) announce(success);
      return result;
    } catch (e) {
      setError(e.message);
      return undefined;
    }
  };
  if (fatal)
    return (
      <main>
        <Section>
          <Notice error>
            {fatal} Start the workspace server, then reload.
          </Notice>
        </Section>
      </main>
    );
  if (!session)
    return (
      <main>
        <Section>
          <Paragraph role="status">Opening the workspace…</Paragraph>
        </Section>
      </main>
    );
  if (route === "visitor" && !session.user) return <Visitor publicView />;
  if (!session.user) return <SignIn session={session} reload={reloadSession} />;
  const canEdit = ["owner", "editor"].includes(session.user.role),
    canReview = canEdit || session.user.role === "reviewer";
  const context = {
    ...data,
    dataset,
    setDataset,
    user: session.user,
    canEdit,
    canReview,
    refresh,
    run,
    announce,
    openImport: () => setImportOpen(true),
    openGuideline: setGuidelineId,
    session,
    reloadSession,
  };
  let page;
  const routeRecord =
    route.startsWith("record/") &&
    data.records.find((r) => r.id === route.slice(7));
  const routeGuideline = routeRecord?.kind === "guideline" && routeRecord;
  const activeGuideline =
    routeGuideline ||
    data.records.find((r) => r.id === guidelineId && r.kind === "guideline");
  const activeSection = activeGuideline
    ? "guidelines"
    : recordSections[routeRecord?.kind] || route;
  const sectionLabel =
    navigation.find(([id]) => id === activeSection)?.[1] ||
    {
      search: "Search",
      settings: "Settings and access",
      ask: "Ask the workspace",
      visitor: "Visitor preview",
    }[activeSection];
  const breadcrumb = [{ label: "Overview", href: "#overview" }];
  if (sectionLabel && activeSection !== "overview")
    breadcrumb.push({ label: sectionLabel, href: `#${activeSection}` });
  if (routeRecord && !routeGuideline)
    breadcrumb.push({ label: routeRecord.title });
  if (routeGuideline) page = <Guidelines key={dataset} />;
  else if (routeRecord?.kind === "report")
    page = <Audit recordId={routeRecord.id} />;
  else if (route.startsWith("record/"))
    page = <RecordDetail key={`${dataset}/${route}`} id={route.slice(7)} />;
  else
    page = {
      overview: <Overview />,
      guidelines: <Guidelines key={dataset} />,
      map: <DependencyMap key={dataset} />,
      audit: <Audit />,
      weekly: <Notes />,
      search: <Search key={dataset} />,
      settings: <Settings />,
      ask: <Ask />,
      visitor: <Visitor />,
    }[route] || <Overview />;
  return (
    <Workspace.Provider
      value={{
        ...context,
        breadcrumb: breadcrumb.length > 1 ? breadcrumb : undefined,
      }}
    >
      <Link
        href="#page-title"
        className="a1-sce-skip"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("page-title")?.focus();
        }}
      >
        Skip to content
      </Link>
      <PageLayout
        viewportHeight
        header={
          <Section
            as="div"
            padding="xs"
            surface="page"
            borderSize="xs"
            borderSides={["bottom"]}
          >
            <Stack
              direction="row"
              justify="between"
              align="center"
              wrap
              gap="sm"
            >
              <Stack direction="row" align="center" gap="sm">
                <Button
                  variant="tertiary"
                  icon="menu"
                  onClick={() => setNavOpen(!navOpen)}
                  aria-expanded={navOpen}
                >
                  Menu
                </Button>
                <Icon name="workspaces" color="accent" />
                <Link href="#overview" weight="bold">
                  SCE workspace
                </Link>
                <MessageBadge
                  subtle
                  size="sm"
                  icon={session.localAccess ? "computer" : "lock"}
                >
                  {session.localAccess ? "Local · no sign-in" : "Private"}
                </MessageBadge>
              </Stack>
              <Stack direction="row" align="center" gap="sm" wrap>
                <Button
                  variant="secondary"
                  icon="search"
                  onClick={() => go("search")}
                >
                  Search workspace
                </Button>
                <Paragraph size="sm" color="muted">
                  {session.user.name}
                </Paragraph>
              </Stack>
            </Stack>
          </Section>
        }
        sidebar={
          <SideNav
            open={navOpen}
            onClose={() => setNavOpen(false)}
            collapseButtonPlacement="none"
            header={
              <Stack gap="sm">
                <Paragraph size="xs" color="muted">
                  Project workspace
                </Paragraph>
                <Heading as="p" size="sm">
                  From guidance
                  <br />
                  to implementation.
                </Heading>
              </Stack>
            }
            footer={
              <Stack gap="md">
                <SelectField
                  label="Collection"
                  size="compact"
                  value={dataset}
                  onChange={(e) => {
                    setDataset(e.target.value);
                    go("overview");
                  }}
                >
                  <option value="sce">SCE source material</option>
                  <option value="demo">Fictional demonstration</option>
                </SelectField>
                <Paragraph size="xs" color="muted">
                  Built with A1.
                  <br />
                  Independent work by Nathan Dana.
                </Paragraph>
                {!session.localAccess && (
                  <Button
                    size="sm"
                    variant="tertiary"
                    icon="logout"
                    onClick={() =>
                      run(async () => {
                        await api("/logout", {});
                        setData({ records: [], attachments: [] });
                        await reloadSession();
                      })
                    }
                  >
                    Sign out
                  </Button>
                )}
              </Stack>
            }
          >
            {navigation.map(([id, label, icon]) => (
              <SideNavItem
                key={id}
                label={label}
                icon={icon}
                href={`#${id}`}
                active={activeSection === id}
              />
            ))}
            <SideNavGroup label="Workspace tools" icon="tune" defaultOpen>
              <SideNavItem
                label="Ask the workspace"
                icon="forum"
                href="#ask"
                active={activeSection === "ask"}
              />
              <SideNavItem
                label="Settings and access"
                icon="settings"
                href="#settings"
                active={activeSection === "settings"}
              />
            </SideNavGroup>
          </SideNav>
        }
      >
        {loading ? (
          <Section padding="md">
            <Paragraph role="status">Loading saved work…</Paragraph>
          </Section>
        ) : (
          page
        )}
      </PageLayout>
      <Feedback
        key={error || notice?.id || "feedback"}
        message={error || notice?.text}
        persistent={Boolean(error)}
        onClose={dismissFeedback}
        actionLabel={error ? "Reload workspace" : undefined}
        onAction={error ? () => run(refresh) : undefined}
      />
      {importOpen && <ImportDialog onClose={() => setImportOpen(false)} />}
      {activeGuideline && !loading && (
        <GuidelineDialog
          key={activeGuideline.id}
          record={activeGuideline}
          onClose={() => {
            setGuidelineId(null);
            if (routeGuideline) go("guidelines");
          }}
        />
      )}
    </Workspace.Provider>
  );
}
