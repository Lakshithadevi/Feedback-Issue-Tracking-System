// components/BugCard.js
import React from "react";

export default function BugCard({ bug }) {
  return (
    <div className="bug-card">
      <h5>{bug.title}</h5>
      <p className={`priority ${bug.priority.toLowerCase()}`}>
        {bug.priority}
      </p>
    </div>
  );
}