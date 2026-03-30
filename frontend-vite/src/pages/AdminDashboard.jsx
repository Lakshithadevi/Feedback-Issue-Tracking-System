import React, { useEffect, useState } from "react";
import Sidebar from "../components/AdminSidebar";
import Topbar from "../components/AdminTopbar";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await axios.get("https://feedback-issue-tracking-system.onrender.com/api/users");
      const issueRes = await axios.get("https://feedback-issue-tracking-system.onrender.com/api/issues");

      setUsers(userRes.data || []);
      setIssues(issueRes.data || []);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // Stats
  const totalUsers = users.length;
  const totalIssues = issues.length;

  const pending = issues.filter(
    (i) => (i.status || "pending").toLowerCase() === "pending"
  ).length;

  const resolved = issues.filter(
    (i) => (i.status || "pending").toLowerCase() === "resolved"
  ).length;

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Topbar />

        {/* Welcome */}
        <div className="admin-home">
          <h2>Welcome Admin 👋</h2>
          <p>Manage users and track issues efficiently.</p>
        </div>

        {/* Stats */}
        <div className="stats-container">
          <div className="stats-card users-card">
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>

          <div className="stats-card issues-card">
            <h3>Total Issues</h3>
            <p>{totalIssues}</p>
          </div>

          <div className="stats-card pending-card">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>

          <div className="stats-card resolved-card">
            <h3>Resolved</h3>
            <p>{resolved}</p>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="recent-section">
          <h3>Recent Issues</h3>

          <table className="issues-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan="3">No issues found</td>
                </tr>
              ) : (
                issues.slice(0, 5).map((issue, index) => {
                  const status = (issue.status || "Pending").toLowerCase();

                  return (
                    <tr key={issue._id || index}>
                      <td>{index + 1}</td>
                      <td>{issue.title || "No Title"}</td>
                      <td>
                        <span className={`status ${status}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;