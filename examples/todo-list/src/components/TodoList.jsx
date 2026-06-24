import React from "react";
import { MessageEmptyState } from "../../../../packages/react/src/index.js";
import { TodoItem } from "./TodoItem.jsx";

const EMPTY_COPY = {
  all: {
    icon: "task_alt",
    title: "No tasks yet",
    description: "Add your first task above to get started.",
  },
  active: {
    icon: "celebration",
    title: "Nothing left to do",
    description: "Every task is complete. Nice work!",
  },
  completed: {
    icon: "inbox",
    title: "No completed tasks",
    description: "Tasks you finish will show up here.",
  },
};

export function TodoList({ todos, filter, onToggle, onEdit, onDelete }) {
  if (todos.length === 0) {
    const copy = EMPTY_COPY[filter] ?? EMPTY_COPY.all;
    return (
      <MessageEmptyState
        scale="card"
        icon={copy.icon}
        title={copy.title}
        description={copy.description}
      />
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
