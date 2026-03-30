import React, { useState } from "react";
import "./CreateIssueModal.css";
import axios from "axios";

export default function CreateIssueModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    type: "Bug",
    title: "",
    description: "",
    priority: "Medium",
    tags: [],
    dueDate: "",
    assignedTo: ""
  });
   
  // ✅ ADD HERE 👇
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

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  // 🔥 TEMP USERS (later from DB)
const handleSubmit = async () => {
  try {
    const userId = localStorage.getItem("userId");

    const newIssue = {
      ...data,
      assignedTo: null,
      createdBy: userId,
      status: "To Do",
      createdAt: new Date().toISOString(),
      points: getPoints(data.priority)
    };

    const res = await axios.post(
      "https://feedback-issue-tracking-system.onrender.com/api/issues",
      newIssue
    );

    onCreate(res.data);
    onClose();

  } catch (err) {
    console.error("Create issue failed:", err.response?.data || err.message);
    alert("Failed to create issue");
  }
};

  return (
  <div className="modal-overlay1" onClick={onClose}>
    
    {/* 🔥 STOP PROPAGATION */}
    <div
  className="modal1"
  onClick={(e) => e.stopPropagation()}
>

      <div className="step-indicator">Step {step} of 5</div>

        {/* STEP 1: TYPE */}
        {step === 1 && (
          <>
            <h2>Select Issue Type</h2>

            <div className="grid">
              {[
  "🐞 Bug",
  "📌 Task",
  "⭐ Feature",
  "📖 Story",
  "⚡ Improvement",
  "🔧 Maintenance"
].map((item) => {
                const value = item.slice(2);
                return (
                  <div
                    key={value}
                    className={`option ${data.type === value ? "active" : ""}`}
                    onClick={() => setData({ ...data, type: value })}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* STEP 2: DETAILS */}
        {step === 2 && (
          <>
            <h2>Issue Details</h2>

            <input
              className="input1"
              placeholder="Title"
              onChange={(e) =>
                setData({ ...data, title: e.target.value })
              }
            />

            <textarea
              className="input1"
              placeholder="Description"
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </>
        )}

        {/* STEP 3: PRIORITY */}
        {step === 3 && (
          <>
            <h2>Priority</h2>

            <div className="grid">
              {["Low", "Medium", "High", "Critical", "Blocker"].map((p) => (
                <div
                  key={p}
                  className={`option ${data.priority === p ? "active" : ""}`}
                  onClick={() => setData({ ...data, priority: p })}
                >
                  {p}
                </div>
              ))}
            </div>
          </>
        )}

        {/* STEP 4: ASSIGNEE + DATE */}
        {/* STEP 4: DEADLINE ONLY */}
{step === 4 && (
  <>
    <h2>Set Deadline</h2>

    <input
      type="date"
      className="input1"
      onChange={(e) =>
        setData({ ...data, dueDate: e.target.value })
      }
    />
    <i>Maximum of 1 week from now</i>
  </>
)}
        {/* STEP 5: TAGS */}
        {step === 5 && (
          <>
            <h2>Add Tags</h2>

            <div className="grid">
              {[
  "UI",
  "Backend",
  "API",
  "Urgent",
  "Testing",
  "Security",
  "Performance",
  "Database",
  "BugFix",
  "Enhancement"
].map((tag) => (
                <label key={tag} className="option">
                  <input
                    type="checkbox"
                    checked={data.tags.includes(tag)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...data.tags, tag]
                        : data.tags.filter((t) => t !== tag);

                      setData({ ...data, tags: updated });
                    }}
                  />
                  {tag}
                </label>
              ))}
            </div>

            <button className="submit-btn1" onClick={handleSubmit}>
              🚀 Create Issue
            </button>
          </>
        )}

        {/* NAVIGATION */}
        <div className="nav">
          {step > 1 && <button onClick={back}>Back</button>}
          {step < 5 && <button onClick={next}>Next</button>}
        </div>
        
      </div>
    </div>
  );
}