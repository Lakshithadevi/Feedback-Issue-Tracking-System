import React from "react";

export default function KanbanBoard({ workflow, issues }) {
  return (
    <div className="board">
      {workflow.map((status) => (
        <div key={status} className="column">
          <h4>{status}</h4>

          {issues
            .filter((issue) => issue.status === status)
            .map((issue) => (
              <div key={issue.id} className="bug-card">
                <h5>{issue.title}</h5>
                <p className={`priority ${issue.priority.toLowerCase()}`}>
                  {issue.priority}
                </p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}