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

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  // 🔥 TEMP USERS (later from DB)
const handleSubmit = async () => {
  try {
    const userId = localStorage.getItem("userId");

    const newIssue = {
      ...data,
      assignedTo: "Not Assigned", // ✅ DEFAULT
      createdBy: userId,
      status: "To Do"
    };

    const res = await axios.post(
      "http://localhost:5000/issues",
      newIssue
    );

    onCreate(res.data);
    onClose();

  } catch (err) {
    console.error(err);
    alert("Failed to create issue");
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal card">

        <div className="step-indicator">Step {step} of 5</div>

        {/* STEP 1: TYPE */}
        {step === 1 && (
          <>
            <h2>Select Issue Type</h2>

            <div className="grid">
              {["🐞 Bug", "📌 Task", "⭐ Feature", "📖 Story"].map((item) => {
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
              className="input"
              placeholder="Title"
              onChange={(e) =>
                setData({ ...data, title: e.target.value })
              }
            />

            <textarea
              className="input"
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
              {["Low", "Medium", "High"].map((p) => (
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

    <label>Due Date</label>
    <input
      type="date"
      className="input"
      onChange={(e) =>
        setData({ ...data, dueDate: e.target.value })
      }
    />
  </>
)}
        {/* STEP 5: TAGS */}
        {step === 5 && (
          <>
            <h2>Add Tags</h2>

            <div className="grid">
              {["UI", "Backend", "API", "Urgent", "Testing"].map((tag) => (
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

            <button className="submit-btn" onClick={handleSubmit}>
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