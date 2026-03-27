const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔗 MongoDB Connection */
mongoose.connect("mongodb+srv://lakshithadevi2020_db_user:lakshitha123@cluster0.pkyqne4.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB atlas Connected"))
  .catch(err => console.log("DB Error:", err));

/* 📧 EMAIL SETUP */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "23sucs34@tcarts.in",   // 🔴 replace
    pass: "1234"      // 🔴 replace
  }
});

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
  type: { type: String, default: "Bug" },
  title: { type: String, required: true },
  description: String,

  status: {
    type: String,
    default: "To Do"
  },

  priority: {
    type: String,
    default: "Medium"
  },

  tags: [String],
  dueDate: String,

  // ✅ FIXED (STRING)
  assignedTo: String,
  createdBy: String

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
      res.json({
        message: "Login Success",
        userId: user._id,
        email: user.email
      });
    } else {
      res.json({ message: "Invalid password" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Forgot Password */
app.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   👥 USERS API
========================= */
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/* =========================
   📝 ISSUE APIs
========================= */

/* CREATE ISSUE */
app.post("/issues", async (req, res) => {
  try {
    console.log("Incoming:", req.body);

    const issue = new Issue(req.body);
    await issue.save();

    console.log("Saved Issue:", issue);

    // 📧 SEND EMAIL (if assigned)
   if (
  issue.assignedTo &&
  issue.assignedTo !== "Not Assigned" &&
  issue.assignedTo.includes("@")
) {
  await transporter.sendMail({
    from: "lakshithadevi3103@gmail.com",
    to: issue.assignedTo,
    subject: "New Issue Assigned 🚀",
    html: `<h3>${issue.title}</h3>
          <p><b>Title:</b> ${issue.title}</p>
          <p><b>Description:</b> ${issue.description}</p>
          <p><b>Priority:</b> ${issue.priority}</p>
          <p><b>Due Date:</b> ${issue.dueDate || "Not set"}</p>
        `
      });
    }

    res.json(issue);

  } catch (err) {
    console.error("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL ISSUES */
app.get("/issues", async (req, res) => {
  const issues = await Issue.find();
  res.json(issues);
});

/* UPDATE ISSUE */
app.put("/issues/:id", async (req, res) => {
  await Issue.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

/* DELETE ISSUE */
app.delete("/issues/:id", async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
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