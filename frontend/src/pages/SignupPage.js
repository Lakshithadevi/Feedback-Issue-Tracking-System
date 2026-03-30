import React from "react";
import "./LoginPage.css"; // reuse same CSS
import bgImage from "./feedback.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SignupPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const handleSignup = async () => {

  // validation
  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post("https://feedback-issue-tracking-system.onrender.com/signup", {
      name,
      email,
      password
    });

    alert(res.data.message);

    if (res.data.message === "Signup Successful") {
      navigate("/"); // go to login
    }

  } catch (err) {
    alert("Server Error");
  }
};
  return (
    <div className="container">

      {/* LEFT SIDE IMAGE */}
      <div
        className="left"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="overlay">
          <h1>Issue Tracker</h1>
          <h3>
            Create your account to manage and track issues efficiently
          </h3>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="right">
        <div className="login-box">

          <h2>Create Account</h2>
          <p className="sub-text">Sign up to get started</p>

          {/* NAME */}
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-box">
              <input 
  type="text" 
  placeholder="Enter your name"
  onChange={(e) => setName(e.target.value)}
/>
            </div>
          </div>

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

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>
            <div className="input-box">
              <input 
  type="password" 
  placeholder="Enter password"
  onChange={(e) => setPassword(e.target.value)}
/>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-box">
              <input 
  type="password" 
  placeholder="Confirm password"
  onChange={(e) => setConfirmPassword(e.target.value)}
/>
            </div>
          </div>

         <button className="login-btn" onClick={handleSignup}>
  SIGN UP
</button>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="social">
            <button>Google</button>
            <button>Microsoft</button>
            <button>Apple</button>
          </div>

          <p className="register">
  Already have an account? 
  <span onClick={() => navigate("/")}> Login</span>
</p>

        </div>
      </div>

    </div>
  );
};

export default SignupPage;