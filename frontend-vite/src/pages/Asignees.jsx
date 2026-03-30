import React, { useEffect, useState } from "react";
import Sidebar from "../components/AdminSidebar";
import "./Assignees.css";

export default function Assignees() {
  const [assignees, setAssignees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadAssignees();
  }, []);

  const loadAssignees = async () => {
  try {
    const res = await fetch("https://feedback-issue-tracking-system.onrender.com/api/assignees");
    const data = await res.json();

    console.log("ASSIGNEES FROM API:", data); // 👈 add this
    setAssignees(data);
  } catch (error) {
    console.log(error);
  }
};

  // ADD / UPDATE
  const handleSubmit = async () => {
    if (!name || !email || !department) {
      alert("All fields required");
      return;
    }

    try {
      if (editId) {
        // UPDATE
        await fetch(`https://feedback-issue-tracking-system.onrender.com/api/assignees/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, department })
        });
      } else {
        // ADD
        await fetch("https://feedback-issue-tracking-system.onrender.com/api/assignees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, department })
        });
      }

      // RESET FORM
      setName("");
      setEmail("");
      setDepartment("");
      setEditId(null);

    } catch (error) {
      console.error("Error saving assignee:", error);
    }
  };

  // EDIT
  const editAssignee = (a) => {
    setName(a.name);
    setEmail(a.email);
    setDepartment(a.department);
    setEditId(a._id);
  };

  // DELETE
  const deleteAssignee = async (id) => {
    try {
      await fetch(`https://feedback-issue-tracking-system.onrender.com/api/assignees/${id}`, {
        method: "DELETE"
      });
      loadAssignees();
    } catch (error) {
      console.error("Error deleting assignee:", error);
    }
  };

  // GROUP BY DEPARTMENT (SAFE)
  const grouped = assignees.reduce((acc, a) => {
    const dept = a.department || "Others";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(a);
    return acc;
  }, {});

  
  return (
    <div className="admin-layout-main">
      <Sidebar />

      <div className="admin-content">
        <h2>Manage Assignees</h2>

        {/* FORM */}
        <div className="assignee-form">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="QA">QA</option>
            <option value="DevOps">DevOps</option>
            <option value="Support">Support</option>
          </select>

          <button onClick={handleSubmit}>
            {editId ? "Update" : "Add Assignee"}
          </button>
        </div>

        {/* LIST */}
        <div className="assignee-list">
          {Object.keys(grouped).map((dept) => (
            <div key={dept}>
              {grouped[dept].map((a) => (
                <div key={a._id} className="assignee-card">
                  <div>
                    <h4>{a.name}</h4>
                    <p>{a.email}</p>
                  </div>

                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => editAssignee(a)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteAssignee(a._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}