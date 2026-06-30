import React, { useState } from "react";
import {
  Button,
  Cluster,
  TextField,
} from "../../../../packages/react/src/index.js";

export function TodoComposer({ onAdd }) {
  const [text, setText] = useState("");

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <Cluster gap={8} align="end" className="todo-composer">
      <TextField
        label="New task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className="todo-composer__field"
      />
      <Button
        variant="primary"
        icon="add"
        onClick={submit}
        disabled={text.trim().length === 0}
      >
        Add task
      </Button>
    </Cluster>
  );
}
