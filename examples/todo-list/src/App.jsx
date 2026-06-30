import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Cluster,
  Heading,
  PageLayout,
  Paragraph,
  SegmentedControl,
  Stack,
} from "../../../packages/react/src/index.js";
import { loadTodos, makeId, saveTodos } from "./lib/storage.js";
import { TodoComposer } from "./components/TodoComposer.jsx";
import { TodoList } from "./components/TodoList.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function App() {
  const [todos, setTodos] = useState(() => loadTodos());
  const [filter, setFilter] = useState("all");

  // Apply the light theme for this example.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("a1-theme-light");
    return () => root.classList.remove("a1-theme-light");
  }, []);

  // Persist whenever the list changes.
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function addTodo(text) {
    setTodos((prev) => [
      { id: makeId(), text, done: false, createdAt: Date.now() },
      ...prev,
    ]);
  }

  function toggleTodo(id, done) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done } : todo)),
    );
  }

  function editTodo(id, text) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    );
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  }

  const remaining = useMemo(() => todos.filter((t) => !t.done).length, [todos]);
  const completedCount = todos.length - remaining;

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "completed") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  const summary =
    todos.length === 0
      ? "No tasks yet"
      : `${remaining} of ${todos.length} ${todos.length === 1 ? "task" : "tasks"} remaining`;

  const header = (
    <div className="todo-header">
      <Heading as="h1" size="lg">
        To-Do List
      </Heading>
      <Paragraph color="muted" className="todo-header__subtitle">
        A persistent task list built with the A1 design system.
      </Paragraph>
    </div>
  );

  return (
    <PageLayout stickyHeader header={header} className="todo-page">
      <div className="todo-shell">
        <Stack gap={16}>
          <Card>
            <Stack gap={16}>
              <TodoComposer onAdd={addTodo} />
              <Cluster gap={12} align="center" justify="between" wrap>
                <SegmentedControl
                  options={FILTERS}
                  value={filter}
                  onChange={setFilter}
                  aria-label="Filter tasks"
                />
                <Paragraph size="sm" color="muted" className="todo-summary">
                  {summary}
                </Paragraph>
              </Cluster>
            </Stack>
          </Card>

          <Card>
            <TodoList
              todos={visibleTodos}
              filter={filter}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={deleteTodo}
            />
          </Card>

          {completedCount > 0 && (
            <Cluster justify="end">
              <Button variant="tertiary" icon="delete_sweep" onClick={clearCompleted}>
                Clear completed ({completedCount})
              </Button>
            </Cluster>
          )}
        </Stack>
      </div>
    </PageLayout>
  );
}
