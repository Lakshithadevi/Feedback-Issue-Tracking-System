import React, { useState } from "react";
import "./LoginPage.css";
import bgImage from "./feedback.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // ✅ STEP CONTROL
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // ✅ OTP
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ PASSWORD STRENGTH
  const getPasswordStrength = (password) => {
    if (!password) return "";

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[@$!%*?&]/)) strength++;

    if (strength <= 1) return "Weak";
    if (strength <= 3) return "Medium";
    return "Strong";
  };

  // ✅ SEND OTP
  const sendOtp = async () => {
    if (!email) return alert("Enter email");

    try {
      const res = await axios.post("https://feedback-issue-tracking-system.onrender.com/send-otp", {
  email,
  type: "reset" // 🔥 VERY IMPORTANT
});
      alert(res.data.message);

      if (res.data.message === "OTP sent to email") {
        setStep(2);
      }
    } catch {
      alert("Error sending OTP");
    }
  };

  // ✅ VERIFY OTP + RESET
  const handleReset = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("https://feedback-issue-tracking-system.onrender.com/verify-reset-otp", {
  email,
  otp,
  newPassword
});

      alert(res.data.message);

      if (res.data.message === "Password reset successful") {
        navigate("/");
      }
    } catch {
      alert("Error resetting password");
    }
  };

  return (
    <div className="container">

      {/* LEFT */}
      <div
        className="left"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay">
          <h1>Reset Password</h1>
          <h3>Secure OTP based reset</h3>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        <div className="login-box">

          <h2>Forgot Password</h2>

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <>
              <div className="input-group">
                <label>Email</label>
                <div className="input-box">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button className="login-btn" onClick={sendOtp}>
                SEND OTP
              </button>
            </>
          )}

          {/* STEP 2: OTP + PASSWORD */}
          {step === 2 && (
            <>
              <div className="input-group">
                <label>OTP</label>
                <div className="input-box">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>New Password</label>
                <div className="input-box">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {/* ✅ STRENGTH */}
                <p className={`strength ${getPasswordStrength(newPassword)?.toLowerCase()}`}>
                  Strength: {getPasswordStrength(newPassword)}
                </p>
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-box">
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button className="login-btn" onClick={handleReset}>
                RESET PASSWORD
              </button>
            </>
          )}

          <p className="register">
            Back to login?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;