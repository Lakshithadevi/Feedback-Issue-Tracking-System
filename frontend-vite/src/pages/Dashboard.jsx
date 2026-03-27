import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KanbanBoard from "../components/KanbanBoard";
import CreateIssueModal from "../components/CreateIssueModal";
import IssueChatModal from "../components/IssueChatModal";
import "./Dashboard.css";

export default function Dashboard() {
  const [config, setConfig] = useState(null);
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setConfig(JSON.parse(localStorage.getItem("config")));
    setIssues(JSON.parse(localStorage.getItem("issues")) || []);
  }, []);

  const userIssues = issues.filter(
    (i) => i.createdBy === userId || i.assignedTo === userId
  );

  const handleCreateIssue = (issue) => {
    const updated = [...issues, issue];
    setIssues(updated);
    localStorage.setItem("issues", JSON.stringify(updated));
  };

  if (!config) return <h2 className="loading">Loading Dashboard...</h2>;

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar
          spaceName={config.spaceName}
          onCreate={() => setShowModal(true)}
        />

        {/* BOARD */}
        <div className="board-container">
          <KanbanBoard workflow={config.workflow} issues={userIssues} />
        </div>

        {/* FLOAT BUTTON */}
        <button
          className="floating-btn"
          onClick={() => setShowModal(true)}
        >
          + New Issue
        </button>

        {/* CREATE MODAL */}
        {showModal && (
          <CreateIssueModal
            onClose={() => setShowModal(false)}
            onCreate={(issue) => {
              handleCreateIssue(issue);
              setShowModal(false);
            }}
          />
        )}

        {/* CHAT */}
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