import React from "react";
import "./Topbar.css";

export default function Topbar({ spaceName, onCreate }) {
  return (
    <div className="topbar">
      <h3>{spaceName}</h3>

      <div className="topbar-actions">
        <input placeholder="Search issues..." />
        <button onClick={onCreate}>Create</button>
      </div>
    </div>
  );
}