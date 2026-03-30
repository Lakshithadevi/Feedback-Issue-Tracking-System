// src/api/api.js
import axios from "axios";

export default axios.create({
  baseURL: "https://feedback-issue-tracking-system.onrender.com"
});