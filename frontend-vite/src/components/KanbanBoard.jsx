import React from "react";

export default function KanbanBoard({ workflow = [], issues = [] }) {
  return (
    <div className="board">
      {workflow.map((status) => (
        <div key={status} className="column">
          <h4>{status}</h4>

          {/* 🔥 THIS IS THE FIX */}
            {issues
              .filter((issue) => issue.status === status)
              .map((issue) => (
                <div key={issue._id} className="bug-card">
                  <h5>{issue.title}</h5>

                  <p className="desc">
                    {issue.description || "No description"}
                  </p>

                  <p className={`priority ${issue.priority?.toLowerCase()}`}>
                    {issue.priority}
                  </p>

                  <p className="meta">
                    📅 {issue.dueDate || "No deadline"}
                  </p>

                  <p className="meta">
                    👤 {issue.assignedTo || "Not Assigned"}
                  </p>
                </div>
              ))}
        </div>
      ))}
    </div>
  );
}