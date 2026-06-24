import React, { useState } from "react";
import {
  Button,
  CheckboxGroup,
  Cluster,
  IconButton,
  TextField,
} from "../../../../packages/react/src/index.js";

export function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  function startEditing() {
    setDraft(todo.text);
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(todo.text);
    setEditing(false);
  }

  function saveEditing() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onEdit(todo.id, trimmed);
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  }

  const rowClasses = [
    "todo-item",
    todo.done && "todo-item--done",
  ]
    .filter(Boolean)
    .join(" ");

  if (editing) {
    return (
      <li className={rowClasses}>
        <Cluster gap={8} align="end" justify="between" className="todo-item__row">
          <TextField
            label="Edit task"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoFocus
            className="todo-item__edit-field"
          />
          <Cluster gap={4} align="center">
            <Button
              variant="primary"
              size="sm"
              icon="check"
              onClick={saveEditing}
              disabled={draft.trim().length === 0}
            >
              Save
            </Button>
            <IconButton
              icon="close"
              label="Cancel editing"
              onClick={cancelEditing}
            />
          </Cluster>
        </Cluster>
      </li>
    );
  }

  return (
    <li className={rowClasses}>
      <Cluster gap={8} align="center" justify="between" className="todo-item__row">
        <CheckboxGroup
          className="todo-item__checkbox"
          value={todo.done ? [todo.id] : []}
          onChange={(next) => onToggle(todo.id, next.includes(todo.id))}
          options={[{ value: todo.id, label: todo.text }]}
        />
        <Cluster gap={4} align="center" className="todo-item__actions">
          <IconButton
            icon="edit"
            label={`Edit "${todo.text}"`}
            onClick={startEditing}
          />
          <IconButton
            icon="delete"
            label={`Delete "${todo.text}"`}
            variant="destructive"
            onClick={() => onDelete(todo.id)}
          />
        </Cluster>
      </Cluster>
    </li>
  );
}
