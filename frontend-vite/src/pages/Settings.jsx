import React, { useEffect, useState } from "react";
import "./Settings.css";

export default function Settings() {
  const [user, setUser] = useState({
    name: "",
    email: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    otp: ""
  });

  const [step, setStep] = useState(1); // ✅ STEP CONTROL

  const [points, setPoints] = useState(0);
  const [notifications, setNotifications] = useState(true);

  const userId = localStorage.getItem("userId");

  // ✅ FETCH USER
  useEffect(() => {
    fetch(`https://feedback-issue-tracking-system.onrender.com/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser({
          name: data.name || "",
          email: data.email || ""
        });
        setPoints(data.points || 0);
      })
      .catch(err => console.error(err));
  }, [userId]);

  // ✅ SAVE PROFILE
  const handleSave = async () => {
    try {
      await fetch(`https://feedback-issue-tracking-system.onrender.com/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      alert("Profile updated!");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  // ✅ SEND OTP
  const sendOtp = async () => {
    if (!passwordData.currentPassword) {
      return alert("Enter current password");
    }

    try {
      const res = await fetch("https://feedback-issue-tracking-system.onrender.com/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: user.email })
      });

      const data = await res.json();

      alert(data.message);

      if (data.message === "OTP sent to email") {
        setStep(2);
      }

    } catch {
      alert("Error sending OTP");
    }
  };

  // ✅ VERIFY OTP + CHANGE PASSWORD
  const changePassword = async () => {
    if (!passwordData.otp || !passwordData.newPassword) {
      return alert("Fill all fields");
    }

    try {
      const res = await fetch("https://feedback-issue-tracking-system.onrender.com/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: user.email,
          otp: passwordData.otp,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();

      alert(data.message);

      if (data.message === "Password reset successful") {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          otp: ""
        });
        setStep(1);
      }

    } catch {
      alert("Error updating password");
    }
  };

  // ✅ NOTIFICATIONS
  const toggleNotifications = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("notifications", newValue);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ✅ DELETE ACCOUNT
  const deactivateAccount = () => {
    if (window.confirm("Are you sure?")) {
      fetch(`https://feedback-issue-tracking-system.onrender.com/users/${userId}`, {
        method: "DELETE"
      }).then(() => {
        localStorage.clear();
        window.location.href = "/";
      });
    }
  };

  return (
    <div className="settings">

      <h2>⚙ Settings</h2>

      {/* PROFILE */}
      <div className="card">
        <h3>👤 Profile</h3>

        <input
          type="text"
          value={user.name}
          onChange={(e) =>
            setUser({ ...user, name: e.target.value })
          }
        />

        <input
          type="email"
          value={user.email}
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
        />

        <button onClick={handleSave}>Save</button>
      </div>

      {/* PASSWORD */}
      <div className="card">
        <h3>🔐 Change Password</h3>

        {step === 1 && (
          <>
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })
              }
            />

            <button onClick={sendOtp}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={passwordData.otp}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  otp: e.target.value
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })
              }
            />

            <button onClick={changePassword}>
              Update Password
            </button>
          </>
        )}
      </div>

      {/* POINTS */}
      <div className="card">
        <h3>🏆 Reward Points</h3>
        <p className="points">{points} pts</p>
      </div>

      {/* NOTIFICATIONS */}
      <div className="card">
        <h3>🔔 Notifications</h3>

        <div className="toggle-row">
          <span>Enable Notifications</span>
          <div
            className={`toggle ${notifications ? "active" : ""}`}
            onClick={toggleNotifications}
          >
            <div className="circle"></div>
          </div>
        </div>
      </div>

      {/* DANGER */}
      <div className="card danger">
        <h3>⚠ Danger Zone</h3>

        <button onClick={logout}>Logout</button>

        <button className="danger-btn" onClick={deactivateAccount}>
          Delete Account
        </button>
      </div>

    </div>
  );
}