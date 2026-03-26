import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Create Issue", path: "/create", icon: "➕" },
    { name: "My Issues", path: "/my-issues", icon: "📋" },
    { name: "Reports", path: "/reports", icon: "📈" }
  ];

  return (
    <div className="sidebar">
      <h2>🐞 Tracker</h2>

      <ul>
        {menu.map((item) => (
          <li
            key={item.name}
            className={location.pathname === item.path ? "active" : ""}
            onClick={() => navigate(item.path)}
          >
            {item.icon} {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}