const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔗 MongoDB Connection (FIXED) */
mongoose.connect("mongodb://127.0.0.1:27017/issueTrackerDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

/* =========================
   👤 USER SCHEMA
========================= */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

/* =========================
   📝 ISSUE SCHEMA
========================= */
const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
    default: "open"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const Issue = mongoose.model("Issue", IssueSchema);

/* =========================
   💬 COMMENT SCHEMA
========================= */
const CommentSchema = new mongoose.Schema({
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  comment: { type: String, required: true }
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema);

/* =========================
   🔐 AUTH APIs
========================= */

/* Signup */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({ message: "Signup Successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Login */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({ message: "Login Success", userId: user._id });
    } else {
      res.json({ message: "Invalid password" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   📝 ISSUE APIs
========================= */

/* Create Issue */
app.post("/issues", async (req, res) => {
  try {
    const issue = new Issue(req.body);
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Get All Issues */
app.get("/issues", async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("assignedTo", "name")
      .populate("createdBy", "name");

    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Update Issue */
app.put("/issues/:id", async (req, res) => {
  try {
    await Issue.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Issue Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Delete Issue */
app.delete("/issues/:id", async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Issue Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   💬 COMMENT APIs
========================= */

/* Add Comment */
app.post("/comments", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Get Comments */
app.get("/comments/:issueId", async (req, res) => {
  try {
    const comments = await Comment.find({ issueId: req.params.issueId })
      .populate("userId", "name");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🚀 SERVER START
========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});