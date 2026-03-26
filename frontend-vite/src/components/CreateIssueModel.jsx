import React, { useState } from "react";
import "./CreateIssueModel.css";

export default function CreateIssueModel({ onClose, onCreate, workflow }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: workflow[0]
  });

  const handleSubmit = () => {
    if (!form.title) return alert("Title is required");

    const newIssue = {
      id: Date.now(),
      ...form
    };

    onCreate(newIssue);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Create Issue</h2>

        <input
          placeholder="Title"
          className="input"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="input"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          className="input"
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <select
          className="input"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          {workflow.map((w, i) => (
            <option key={i}>{w}</option>
          ))}
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Create</button>
        </div>

      </div>
    </div>
  );
}