import React from "react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>⚡ Tracker</h2>

      <ul>
        <li>Dashboard</li>
        <li>My Issues</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
}