import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./Reports.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Reports() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetch("https://feedback-issue-tracking-system.onrender.com/api/issues")
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);
        setIssues(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  // 🎯 POINTS FALLBACK
 const getPoints = (priority) => {
  const p = priority?.trim();

  switch (p) {
    case "Low": return 5;
    case "Medium": return 10;
    case "High": return 20;
    case "Critical": return 30;
    case "Blocker": return 50;
    default: return 0;
  }
};


  // ✅ FIX: Ensure string compare
  const userIssues = issues.filter(
    (i) =>
      String(i.createdBy) === String(userId) ||
      String(i.assignedTo) === String(userId)
  );

  // ✅ STATUS COUNTS
  const todo = userIssues.filter((i) => i.status === "To Do").length;
  const progress = userIssues.filter((i) => i.status === "In Progress").length;
  const done = userIssues.filter((i) => i.status === "Done").length;

  // ✅ TOTAL POINTS
  const totalPoints = userIssues.reduce((sum, issue) => {
    return sum + (issue.points ?? getPoints(issue.priority));
  }, 0);

  // ✅ EARNED POINTS
  const earnedPoints = userIssues
    .filter((i) => i.status === "Done")
    .reduce((sum, issue) => {
      return sum + (issue.points ?? getPoints(issue.priority));
    }, 0);

  // 🏆 LEVEL SYSTEM
  const getLevel = (points) => {
    if (points >= 200) return "🏆 Expert";
    if (points >= 100) return "🔥 Pro";
    if (points >= 50) return "⭐ Intermediate";
    return "🔰 Beginner";
  };

  // ✅ CHART DATA
  const pieData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [todo, progress, done],
        backgroundColor: ["#f0ad4e", "#1da1d2", "#28a745"]
      }
    ]
  };

  const barData = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "Issues",
        data: [todo, progress, done],
        backgroundColor: ["#f0ad4e", "#1da1d2", "#28a745"]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  if (loading) return <h2>Loading reports...</h2>;

  return (
    <div className="reports">
      <h2>📊 Reports & Analytics</h2>

      {/* SUMMARY */}
      <div className="report-cards">
        <div className="report-card">
          <h3>Total</h3>
          <p>{userIssues.length}</p>
        </div>

        <div className="report-card todo">
          <h3>To Do</h3>
          <p>{todo}</p>
        </div>

        <div className="report-card progress">
          <h3>In Progress</h3>
          <p>{progress}</p>
        </div>

        <div className="report-card done">
          <h3>Done</h3>
          <p>{done}</p>
        </div>

        <div className="report-card">
          <h3>Total Points</h3>
          <p>{totalPoints}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts">
        <div className="chart-box">
          <h3>📌 Status Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={pieData} options={options} />
          </div>
        </div>

        <div className="chart-box">
          <h3>📊 Issue Progress</h3>
          <div className="chart-wrapper">
            <Bar data={barData} options={options} />
          </div>
        </div>

      </div>
    </div>
  );
}