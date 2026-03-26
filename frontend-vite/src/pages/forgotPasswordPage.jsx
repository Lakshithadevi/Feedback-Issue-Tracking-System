import React, { useState } from "react";
import "./LoginPage.css"; // reuse same CSS
import bgImage from "./feedback.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!email || !newPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        email,
        newPassword
      });

      alert(res.data.message);

      if (res.data.message === "Password updated successfully") {
        navigate("/");
      }

    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="container">

      {/* LEFT SIDE */}
      <div
        className="left"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay">
          <h1>Reset Password</h1>
          <h3>
            Enter your email and set a new password to continue
          </h3>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">

        <div className="login-box">

          <h2>Forgot Password</h2>
          <p className="sub-text">Reset your account password</p>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email</label>
            <div className="input-box">
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="input-group">
            <label>New Password</label>
            <div className="input-box">
              <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="login-btn" onClick={handleReset}>
            RESET PASSWORD
          </button>

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