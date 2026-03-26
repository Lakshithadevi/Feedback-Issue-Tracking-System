import React, { useState } from "react";
import "./Onboarding.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Onboarding({ onComplete }) {
    const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    workType: "",
    usage: [],
    spaceName: "",
    issueTypes: ["Bug"],
    workflow: ["To Do", "In Progress", "In Review", "Done"]
  });

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  return (
    <div className="onboard-container">
      <div className="card">

        {/* STEP INDICATOR */}
        <div className="step-indicator">Step {step} of 5</div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2>What kind of work do you do?</h2>
            <div className="grid">
              {[
                "💻 Software Development",
                "📢 Marketing",
                "🎨 Design",
                "⚙️ Operations",
                "🧑‍💼 Project Management",
                "🛠 IT Support"
              ].map((item) => {
                const value = item.slice(2);
                return (
                  <div
                    key={value}
                    className={`option ${
                      data.workType === value ? "active" : ""
                    }`}
                    onClick={() =>
                      setData({ ...data, workType: value })
                    }
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2>How will you use this?</h2>
            <div className="grid">
              {[
                "Track bugs",
                "Manage tasks",
                "Run sprints",
                "Prioritize work",
                "Track performance",
                "Manage team"
              ].map((item) => (
                <label key={item} className="option">
                  <input
                    type="checkbox"
                    checked={data.usage.includes(item)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...data.usage, item]
                        : data.usage.filter((i) => i !== item);
                      setData({ ...data, usage: updated });
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2>Set up your space</h2>
            <input
              className="input"
              placeholder="Enter your space name"
              value={data.spaceName}
              onChange={(e) =>
                setData({ ...data, spaceName: e.target.value })
              }
            />
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2>What types of work do you need?</h2>
            <div className="grid">
              {[
                "🐞 Bug",
                "📌 Task",
                "⭐ Feature",
                "📖 Story",
                "🛠 Improvement",
                "❓ Support"
              ].map((item) => {
                const value = item.slice(2);
                return (
                  <label key={value} className="option">
                    <input
                      type="checkbox"
                      checked={data.issueTypes.includes(value)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...data.issueTypes, value]
                          : data.issueTypes.filter((i) => i !== value);
                        setData({ ...data, issueTypes: updated });
                      }}
                    />
                    {item}
                  </label>
                );
              })}
            </div>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <h2>How do you track work?</h2>

            {data.workflow.map((status, i) => (
              <input
                key={i}
                className="input"
                value={status}
                onChange={(e) => {
                  const updated = [...data.workflow];
                  updated[i] = e.target.value;
                  setData({ ...data, workflow: updated });
                }}
              />
            ))}

            <button
              className="add-btn"
              onClick={() =>
                setData({
                  ...data,
                  workflow: [...data.workflow, "New Status"]
                })
              }
            >
              + Add Status
            </button>

            <button
  className="submit-btn"
  onClick={async () => {
    try {
      const userId = localStorage.getItem("userId");

      await axios.post("http://localhost:5000/onboarding", {
        userId,
        data
      });

      navigate("/dashboard");

    } catch (err) {
      alert("Error saving onboarding");
    }
  }}
>
  Finish Setup
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