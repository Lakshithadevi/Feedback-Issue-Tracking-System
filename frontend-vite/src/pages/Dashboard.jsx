import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KanbanBoard from "../components/KanbanBoard";
import CreateIssueModal from "../components/CreateIssueModel";
import { useLocation } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [config, setConfig] = useState(null);
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
  if (location.pathname === "/create") {
    setShowModal(true);
  } else {
    setShowModal(false);
  }
}, [location]);

  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem("config"));
    setConfig(storedConfig);

    const storedIssues = JSON.parse(localStorage.getItem("issues")) || [];
    setIssues(storedIssues);
  }, []);

  const handleCreateIssue = (newIssue) => {
    const updated = [...issues, newIssue];
    setIssues(updated);
    localStorage.setItem("issues", JSON.stringify(updated));
  };

  if (!config) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Topbar
          spaceName={config.spaceName}
          onCreate={() => setShowModal(true)}
        />

        <KanbanBoard workflow={config.workflow} issues={issues} />

        {/* MODAL */}
        {showModal && (
          <CreateIssueModal
            onClose={() => setShowModal(false)}
            onCreate={(issue) => {
              handleCreateIssue(issue);
              setShowModal(false);
            }}
            workflow={config.workflow}
          />
        )}
      </div>
    </div>
  );
}