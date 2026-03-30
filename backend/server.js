const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ SERVE FRONTEND (Optional: Points to a folder named 'public' if you have one)
// app.use(express.static("public")); 

/* 🔗 MongoDB Connection */
mongoose.connect("mongodb+srv://lakshithadevi2020_db_user:lakshitha123@cluster0.pkyqne4.mongodb.net/?appName=Cluster0")
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.log("❌ DB Error:", err));

/* 📧 EMAIL SETUP */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lakshithadevi2020@gmail.com",
    pass: "qrnwvhijujisvmij" 
  }
});

/* =========================
    📜 SCHEMAS & MODELS
========================= */

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  role: { type: String, default: "user" },
  otp: String,
  otpExpiry: Date,
  loginOtp: String,
  loginOtpExpiry: Date
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const AssigneeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Developer" },
  department: { type: String }
}, { timestamps: true });

const Assignee = mongoose.models.Assignee || mongoose.model("Assignee", AssigneeSchema);

const IssueSchema = new mongoose.Schema({
  type: { type: String, default: "Bug" },
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "To Do" },
  priority: { type: String, default: "Medium" },
  tags: [String],
  dueDate: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Assignee", default: null },
  createdBy: String,
  points: { type: Number, default: 0 }
}, { timestamps: true });

const Issue = mongoose.models.Issue || mongoose.model("Issue", IssueSchema);

/* =========================
    🎯 UTILITIES
========================= */
const getPoints = (priority) => {
  const p = priority?.trim();
  switch (p) {
    case "Low": return 5;
    case "Medium": return 10;
    case "High": return 20;
    case "Critical": return 30;
    case "Blocker": return 50;
    default: return 0;
  }
};

/* =========================
    🚀 ROUTES
========================= */

// 🏠 ROOT ROUTE (Fixes the "Not Found" error on Render)
app.get("/", (req, res) => {
  res.send("🚀 Feedback Issue Tracking System Backend is Live and Running!");
});

/* 🔐 AUTH APIs */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.json({ message: "All fields required" });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "Signup Successful" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ message: "Login Success", user: { _id: user._id, name: user.name, email: user.email, points: user.points } });
    } else { res.json({ message: "Invalid password" }); }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* 📝 ISSUE APIs */
app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find().populate("assignedTo", "name email");
    res.json(issues);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/issues", async (req, res) => {
  try {
    const points = getPoints(req.body.priority);
    const issue = new Issue({ ...req.body, points });
    await issue.save();
    if (req.body.createdBy) {
      await User.findByIdAndUpdate(req.body.createdBy, { $inc: { points } });
    }
    res.status(201).json(issue);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* 👨‍💻 ASSIGNEE APIs */
app.get("/api/assignees", async (req, res) => {
  try {
    const data = await Assignee.find();
    res.json(data);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.post("/api/assignees", async (req, res) => {
  try {
    const newAssignee = new Assignee(req.body);
    await newAssignee.save();
    res.status(201).json(newAssignee);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

/* =========================
    🔥 SOCKET.IO & SERVER
========================= */
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join-issue", (issueId) => socket.join(issueId));
  socket.on("send-message", ({ issueId, message }) => {
    io.to(issueId).emit("receive-message", message);
  });
  socket.on("disconnect", () => console.log("User disconnected"));
});

// ✅ RENDER COMPATIBLE PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on port ${PORT}`);
});