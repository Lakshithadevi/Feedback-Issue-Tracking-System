import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {

  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  /* FETCH ISSUES */
  const fetchIssues = async () => {
    const res = await axios.get("http://localhost:5000/issues");
    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  /* CREATE ISSUE */
  const createIssue = async () => {
    await axios.post("http://localhost:5000/issues", {
      title,
      description: desc,
      status: "open",
      priority: "medium"
    });

    setTitle("");
    setDesc("");
    fetchIssues();
  };

  /* UPDATE STATUS */
  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/issues/${id}`, { status });
    fetchIssues();
  };

  return (
    <div className="dashboard">

      <h2>Issue Dashboard</h2>

      {/* CREATE ISSUE */}
      <div className="create-box">
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={desc}
          onChange={(e)=>setDesc(e.target.value)}
        />

        <button onClick={createIssue}>Create Issue</button>
      </div>

      {/* ISSUE LIST */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td>{issue.title}</td>
              <td>{issue.status}</td>
              <td>{issue.priority}</td>
              <td>
                <button onClick={() => updateStatus(issue._id, "in-progress")}>
                  In Progress
                </button>
                <button onClick={() => updateStatus(issue._id, "closed")}>
                  Close
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Dashboard;