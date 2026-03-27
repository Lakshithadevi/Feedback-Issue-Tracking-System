import React, { useState, useEffect, useRef } from "react";
import "./IssueChatModal.css";

export default function IssueChatModal({ issue, onClose, updateIssues }) {
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("userId");

  const chatEndRef = useRef(null);

  // 🔥 Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [issue.messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const issues = JSON.parse(localStorage.getItem("issues")) || [];

    const updated = issues.map((i) =>
      i.id === issue.id
        ? {
            ...i,
            messages: [
              ...i.messages,
              {
                sender: userId,
                text: message,
                time: new Date().toLocaleTimeString()
              }
            ]
          }
        : i
    );

    localStorage.setItem("issues", JSON.stringify(updated));
    updateIssues(updated);
    setMessage("");
  };

  return (
    <div className="modal-overlay">
      <div className="chat-modal">

        {/* HEADER */}
        <div className="chat-header">
          <h3>💬 Issue Chat</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* CHAT BODY */}
        <div className="chat-box">
          {issue.messages.length === 0 && (
            <p className="empty">No messages yet...</p>
          )}

          {issue.messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-msg ${
                msg.sender === userId ? "user" : "other"
              }`}
            >
              <span>{msg.text}</span>
              <small>{msg.time}</small>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="chat-input">
          <input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}