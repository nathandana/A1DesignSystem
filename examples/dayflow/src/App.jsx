import React, { useCallback, useEffect, useState } from "react";
import {
  IconButton,
  PageLayout,
  SegmentedControl,
  Tabs,
  TabPanel,
} from "../../../packages/react/src/index.js";
import { connectCalendar, disconnectCalendar, syncCalendars } from "./lib/calendars.js";
import { saveState, loadState, resetDemoData } from "./lib/storage.js";
import { CalendarsPage } from "./pages/CalendarsPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ErrandsPage } from "./pages/ErrandsPage.jsx";

const TAB_OPTIONS = [
  { value: "dashboard", icon: "today", label: "Plan" },
  { value: "calendars", icon: "event", label: "Calendars" },
  { value: "errands", icon: "place", label: "Errands" },
];

export function App() {
  const [state, setState] = useState(() => loadState());
  const [tab, setTab] = useState("dashboard");
  const [syncing, setSyncing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    document.documentElement.classList.add("a1-theme-heritage");
    document.title = "Dayflow — AI Day Planner";
    return () => document.documentElement.classList.remove("a1-theme-heritage");
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateState = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleConnect = async (calendar) => {
    const connected = await connectCalendar(calendar);
    updateState({
      calendars: state.calendars.map((c) => (c.id === calendar.id ? connected : c)),
    });
  };

  const handleDisconnect = async (calendar) => {
    const disconnected = await disconnectCalendar(calendar);
    updateState({
      calendars: state.calendars.map((c) => (c.id === calendar.id ? disconnected : c)),
      events: state.events.filter((e) => e.calendarId !== calendar.id),
    });
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const result = await syncCalendars(state.calendars, state.planDate, state.events);
      updateState({ calendars: result.calendars, events: result.events });
      setSyncMessage(
        result.importedCount
          ? `Synced ${result.importedCount} new event${result.importedCount > 1 ? "s" : ""} from your calendars.`
          : "Calendars synced — your schedule is up to date.",
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleOptimize = async () => {
    setOptimizing(true);
    await new Promise((r) => setTimeout(r, 600));
    updateState({ lastOptimizedAt: new Date().toISOString() });
    setOptimizing(false);
  };

  const handleAddErrand = (errand) => {
    updateState({ errands: [...state.errands, errand] });
  };

  const handleRemoveErrand = (id) => {
    updateState({ errands: state.errands.filter((e) => e.id !== id) });
  };

  const handleReset = () => {
    setState(resetDemoData());
    setSyncMessage("");
  };

  const header = (
    <header className="dayflow-header">
      <div className="dayflow-header__brand">
        <span className="dayflow-header__logo" aria-hidden="true">◆</span>
        <div>
          <p className="dayflow-header__title">Dayflow</p>
          <p className="dayflow-header__tagline">AI day planner</p>
        </div>
      </div>
      <SegmentedControl
        className="dayflow-header__nav"
        options={TAB_OPTIONS}
        value={tab}
        onChange={setTab}
      />
      <IconButton icon="restart_alt" label="Reset demo data" onClick={handleReset} />
    </header>
  );

  return (
    <PageLayout stickyHeader header={header} className="dayflow-app">
      <Tabs value={tab} onChange={setTab}>
        <TabPanel value="dashboard">
          <DashboardPage state={state} onOptimize={handleOptimize} optimizing={optimizing} />
        </TabPanel>
        <TabPanel value="calendars">
          <CalendarsPage
            calendars={state.calendars}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onSync={handleSync}
            syncing={syncing}
            syncMessage={syncMessage}
          />
        </TabPanel>
        <TabPanel value="errands">
          <ErrandsPage
            errands={state.errands}
            onAdd={handleAddErrand}
            onRemove={handleRemoveErrand}
          />
        </TabPanel>
      </Tabs>
    </PageLayout>
  );
}
