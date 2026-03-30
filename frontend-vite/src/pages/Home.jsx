import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);

  const userId = localStorage.getItem("userId");

  // ✅ FIXED API CALL
  useEffect(() => {
    fetch("https://feedback-issue-tracking-system.onrender.com/api/issues")
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // ✅ SAFE FILTER (ObjectId safe)
  const userIssues = issues.filter((i) => {
    return (
      i.createdBy === userId ||
      i.assignedTo?._id === userId
    );
  });

  // ✅ STATS
  const total = userIssues.length;
  const inProgress = userIssues.filter(
    (i) => i.status === "In Progress"
  ).length;

  const resolved = userIssues.filter(
    (i) => i.status === "Done"
  ).length;

  return (
    <div className="home">

      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-content">
          <h1>Issue Tracking System</h1>
          <p>
            Manage, track, and resolve issues efficiently with a smart workflow.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/app/my-issues?create=true")}
            >
              Create Issue
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/app/reports")}
            >
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="cards10">

        <div className="card10">
          <h3>📊 Total Issues</h3>
          <center><p>{total}</p></center>
        </div>

        <div className="card10">
          <h3>⏳ In Progress</h3>
          <center><p>{inProgress}</p></center>
        </div>

        <div className="card10">
          <h3>✅ Resolved</h3>
          <center><p>{resolved}</p></center>
        </div>

      </div>

      {/* INFO SECTION */}
      <div className="info">

        <div className="info-card">
          <h3>📝 How it works</h3>
          <p>
            The process starts when a user creates an issue from the “My Issues”
            section. The admin assigns it to a team member, then it moves through
            workflow stages until resolved.
          </p>
        </div>

        <div className="info-card">
          <h3>🚀 Features</h3>
          <p>
            Real-time issue tracking, admin assignment, status updates, and chat
            support for smooth collaboration between users and developers.
          </p>
        </div>

      </div>

    </div>
  );
}