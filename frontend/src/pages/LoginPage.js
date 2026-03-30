import React from "react";
import "./LoginPage.css";
import bgImage from "./feedback.png"; // use any IT/office related image
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }
  try {
    const res = await axios.post("https://feedback-issue-tracking-system.onrender.com/login", {
      email,
      password
    });

    alert(res.data.message);

    // ✅ PUT IT HERE
    if (res.data.message === "Login Success") {
  const config = localStorage.getItem("config");

  if (!config) {
    // 🔥 First time user → onboarding
    navigate("/onboarding");
  } else {
    // 🔥 Already configured → dashboard
    navigate("/dashboard");
  }
}

  } catch (err) {
    alert("Server not running or connection error");
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
          <h1>Issue Tracker</h1>
          
            <h3><i>Track, manage and resolve issues efficiently with our smart system</i></h3>
          
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">

        <div className="login-box">

          {/* Top Icon */}
          <div className="plane">✈</div>

          <h2>Welcome</h2>
          <p className="sub-text">Login to continue</p>

          {/* EMAIL */}
          <div className="input-group">
            <label>Email Id</label>
            <div className="input-box">
              <span></span>
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
              <span></span>
              <input 
  type="password" 
  placeholder="Enter password"
  onChange={(e) => setPassword(e.target.value)}
/>
            </div>
          </div>

          <p 
  className="forgot" 
  onClick={() => navigate("/forgot-password")}
>
  Forgot your password?
</p>

         <button className="login-btn" onClick={handleLogin}>
  LOGIN
</button>

          {/* OR */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* SOCIAL */}
          <div className="social">
            <button>Google</button>
            <button>Microsoft</button>
            <button>
              Apple
            </button>
          </div>

          <p className="register">
  Don’t have account? 
  <span onClick={() => navigate("/signup")}> Register Now</span>
</p>
        </div>

        {/* BOTTOM DESIGN */}
        <div className="bottom-design">
          🏢 🏛️ 🏬
        </div>

      </div>
    </div>
  );
};

export default LoginPage;