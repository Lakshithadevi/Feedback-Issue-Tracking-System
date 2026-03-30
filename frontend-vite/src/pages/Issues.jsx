import React, { useState, useEffect } from "react";
import CreateIssueModal from "../components/CreateIssueModal";
import IssueChatModal from "../components/IssueChatModal";
import { useLocation } from "react-router-dom";
import "./Issues.css";

const API = "https://feedback-issue-tracking-system.onrender.com/api";

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const userId = localStorage.getItem("userId");
  const location = useLocation();

  // ✅ LOAD FROM BACKEND
  useEffect(() => {
    fetch(`${API}/issues`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch issues");
        return res.json();
      })
      .then((data) => setIssues(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // ✅ OPEN MODAL FROM URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("create") === "true") {
      setShowModal(true);
    }
  }, [location]);

  // ✅ FILTER USER ISSUES
  const userIssues = (issues || []).filter(
    (i) =>
      i &&
      i.createdBy &&
      (i.createdBy === userId || i.assignedTo === userId)
  );

  // ✅ GROUP BY STATUS
  const todoIssues = userIssues.filter((i) => i.status === "To Do");
  const progressIssues = userIssues.filter((i) => i.status === "In Progress");
  const doneIssues = userIssues.filter((i) => i.status === "Done");

  // ✅ FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  // ✅ POINTS
  const getPoints = (priority) => {
    switch (priority) {
      case "Low": return 5;
      case "Medium": return 10;
      case "High": return 20;
      case "Critical": return 30;
      case "Blocker": return 50;
      default: return 0;
    }
  };

  // ✅ FIX OBJECT RENDER ISSUE HERE
  const renderName = (value) => {
    if (!value) return "N/A";
    if (typeof value === "object") return value.name;
    return value;
  };

  // ✅ ISSUE CARD
  const renderCard = (issue) => (
    <div
      key={issue._id}
      className="issue-card"
      onClick={() => setSelectedIssue(issue)}
    >
      <h3>{issue.title}</h3>

      <div className="row">
        <span className="type">{issue.type}</span>
        <span className={`priority ${issue.priority?.toLowerCase()}`}>
          {issue.priority}
        </span>
      </div>

      {issue.description && (
        <p className="desc">
          {issue.description.length > 60
            ? issue.description.slice(0, 60) + "..."
            : issue.description}
        </p>
      )}

      <p className="status">📌 {issue.status}</p>

      <div className="tags">
        {issue.tags?.map((tag, i) => (
          <span key={i}>{tag}</span>
        ))}
      </div>

      <div className="footer">
        {/* 🔥 FIX OBJECT ERROR HERE */}
        <span>👤 {renderName(issue.assignedTo)}</span>
        <span>📅 {issue.dueDate}</span>
      </div>

      <p className="created-time">
        🕒 {formatDate(issue.createdAt)}
      </p>

      <p className="points">
        ⭐ {issue.points ?? getPoints(issue.priority)} pts
      </p>
    </div>
  );

  return (
    <div className="issues-page">

      <div className="issues-header">
        <h2>My Issues</h2>
        <button onClick={() => setShowModal(true)}>
          + Create Issue
        </button>
      </div>

      <div className="issues-board">

        <div className="column">
          <h3>To Do</h3>
          {todoIssues.length === 0
            ? <p className="empty">No issues</p>
            : todoIssues.map(renderCard)}
        </div>

        <div className="column">
          <h3>In Progress</h3>
          {progressIssues.length === 0
            ? <p className="empty">No issues</p>
            : progressIssues.map(renderCard)}
        </div>

        <div className="column">
          <h3>Done</h3>
          {doneIssues.length === 0
            ? <p className="empty">No issues</p>
            : doneIssues.map(renderCard)}
        </div>

      </div>

      {showModal && (
        <CreateIssueModal
          onClose={() => setShowModal(false)}
          onCreate={(issue) =>
            setIssues((prev) => [...prev, issue])
          }
        />
      )}

      {selectedIssue && (
        <IssueChatModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          updateIssues={setIssues}
        />
      )}

    </div>
  );
}