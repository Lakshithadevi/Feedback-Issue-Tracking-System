import React, { useState, useEffect } from "react";
import Sidebar from "../components/AdminSidebar";
import IssueChatModal from "../components/AdminIssueChatModal";
import "./AdminIssues.css";

export default function AdminIssues() {
  const [issues, setIssues] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    loadIssues();
    loadAssignees();
  }, []);

  /* =========================
     LOAD ISSUES
  ========================= */
  const loadIssues = async () => {
    try {
      const res = await fetch("https://feedback-issue-tracking-system.onrender.com/api/issues");
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      console.error("Error loading issues:", err);
    }
  };

  /* =========================
     LOAD ASSIGNEES (NEW)
  ========================= */
  const loadAssignees = async () => {
    try {
      const res = await fetch("https://feedback-issue-tracking-system.onrender.com/api/assignees");
      const data = await res.json();
      setAssignees(data);
    } catch (err) {
      console.error("Error loading assignees:", err);
    }
  };

  /* =========================
     UPDATE STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    try {
      await fetch(`https://feedback-issue-tracking-system.onrender.com/api/issues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      loadIssues();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  /* =========================
     ASSIGN USER
  ========================= */
  const assignUser = async (id, assigneeId) => {
    try {
      await fetch(`https://feedback-issue-tracking-system.onrender.com/api/issues/${id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: assigneeId }),
      });

      loadIssues();
    } catch (err) {
      console.error("Error assigning user:", err);
    }
  };

  /* =========================
     GROUP ISSUES
  ========================= */
  const todoIssues = issues.filter((i) => i.status === "To Do");
  const progressIssues = issues.filter((i) => i.status === "In Progress");
  const doneIssues = issues.filter((i) => i.status === "Done");

  /* =========================
     ISSUE CARD
  ========================= */
  const renderCard = (issue) => (
    <div
      key={issue._id}
      className="admin-card"
      onClick={() => setSelectedIssue(issue)}
    >
      <h3 className="admin-title">{issue.title}</h3>

      <div className="admin-row">
        <span className="admin-type">{issue.type}</span>
        <span className={`admin-priority ${issue.priority?.toLowerCase()}`}>
          {issue.priority}
        </span>
      </div>

      <p className="admin-desc">
        {issue.description?.slice(0, 60) || "No description"}...
      </p>

      {/* STATUS */}
      <select
        className="admin-dropdown"
        value={issue.status}
        onChange={(e) => updateStatus(issue._id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      {/* ASSIGN USER - ALL ASSIGNEES DROPDOWN */}
      <select
        className="admin-dropdown"
        value={issue.assignedTo?._id || ""}
        onChange={(e) => assignUser(issue._id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="">-- Assign User --</option>

        {assignees.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.department || "No Dept"})
          </option>
        ))}
      </select>

      {/* FOOTER */}
      <div className="admin-footer">
        <span>
          👤{" "}
          {issue.assignedTo?.name
            ? `${issue.assignedTo.name} (${issue.assignedTo.department || "No Dept"})`
            : "Unassigned"}
        </span>

        <span>📅 {issue.dueDate || "No date"}</span>
      </div>
    </div>
  );

  return (
    <div className="admin-layout-main">
      <Sidebar />

      <div className="admin-content">
        <div className="admin-heading">
          <h2>Admin Issues</h2>
        </div>

        <div className="admin-board">

          <div className="admin-col">
            <h3>To Do</h3>
            {todoIssues.length === 0 ? (
              <p className="empty">No issues</p>
            ) : (
              todoIssues.map(renderCard)
            )}
          </div>

          <div className="admin-col">
            <h3>In Progress</h3>
            {progressIssues.length === 0 ? (
              <p className="empty">No issues</p>
            ) : (
              progressIssues.map(renderCard)
            )}
          </div>

          <div className="admin-col">
            <h3>Done</h3>
            {doneIssues.length === 0 ? (
              <p className="empty">No issues</p>
            ) : (
              doneIssues.map(renderCard)
            )}
          </div>

        </div>

        {/* CHAT MODAL */}
        {selectedIssue && (
          <IssueChatModal
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
            updateIssues={setIssues}
          />
        )}

      </div>
    </div>
  );
}