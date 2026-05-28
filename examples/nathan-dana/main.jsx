import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "../../packages/react/src/index.js";
import "./styles.css";

const projects = [
  {
    id: "portfolio",
    label: "Portfolio",
    icon: "work",
    src: "/examples/portfolio/",
  },
  {
    id: "a1-design",
    label: "A1-Design",
    icon: "design_services",
    src: "/storybook-static/",
  },
  {
    id: "priority-guide",
    label: "Priority Guide",
    icon: "low_priority",
    src: "/examples/priority-guide/",
  },
  {
    id: "theme-editor",
    label: "Theme Editor",
    icon: "palette",
    src: "/examples/theme-editor/",
  },
];

function App() {
  const [activeProject, setActiveProject] = useState(projects[0].id);

  useEffect(() => {
    // document.documentElement.classList.add("a1-theme-heritage");
    return () => document.documentElement.classList.remove("a1-theme-heritage");
  }, []);

  return (
    <main className="nd-app">
      <Tabs value={activeProject} onChange={setActiveProject} variant="folder" className="nd-tabs">
        <header className="nd-header">
          <TabList>
            {projects.map((project) => (
              <Tab key={project.id} value={project.id} icon={project.icon}>
                {project.label}
              </Tab>
            ))}
          </TabList>
        </header>

        <div className="nd-frame-shell">
          {projects.map((project) => (
            <TabPanel key={project.id} value={project.id}>
              <iframe
                className="nd-frame"
                src={project.src}
                title={project.label}
              />
            </TabPanel>
          ))}
        </div>
      </Tabs>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
