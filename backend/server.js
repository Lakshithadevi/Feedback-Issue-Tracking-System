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
/* 📧 EMAIL SETUP (FIXED) */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lakshithadevi2020@gmail.com",
    pass: "qrnwvhijujisvmij" // ✅ NO SPACES
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.log("❌ Email error:", err);
  } else {
    console.log("✅ Email server ready");
  }
});

/* =========================
   👤 USER SCHEMA
========================= */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  points: {
    type: Number,
    default: 0
  },
  
role: {
  type: String,
  default: "user" // 🔥 user | employee | admin
},

  // ✅ ADD THESE
  otp: String,
  otpExpiry: Date

});
const User = mongoose.model("User", UserSchema);

/* =========================
   👨‍💻 ASSIGNEE SCHEMA
========================= */
const AssigneeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "Developer" }
}, { timestamps: true });

const Assignee = mongoose.model("Assignee", AssigneeSchema);


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

  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Assignee",
  default: null
},
  createdBy: String,

  // ✅ POINTS
  points: {
    type: Number,
    default: 0
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

/* 🎯 POINT FUNCTION (FIXED) */
const getPoints = (priority) => {
  const p = priority?.trim(); // 🔥 important fix

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
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          points: user.points // ✅ FIXED
        }
      });
    } else {
      res.json({ message: "Invalid password" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   🔐 SEND OTP
========================= */
app.post("/send-otp", async (req, res) => {
  try {
    const { email, type } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (type === "login") {
      user.loginOtp = otp;
      user.loginOtpExpiry = Date.now() + 5 * 60 * 1000;
      console.log("LOGIN OTP:", otp);
    } else {
      user.otp = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000;
      console.log("RESET OTP:", otp);
    }

    await user.save();

    await transporter.sendMail({
      from: "lakshithadevi2020@gmail.com",
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is: ${otp}</h2>`
    });

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🔐 VERIFY LOGIN OTP
========================= */
app.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    console.log("Entered OTP:", otp);
    console.log("Stored OTP:", user?.loginOtp);

    if (!user || String(user.loginOtp) !== String(otp)) {
      return res.json({ message: "Invalid OTP" });
    }

    if (user.loginOtpExpiry < Date.now()) {
      return res.json({ message: "OTP expired" });
    }

    user.loginOtp = null;
    user.loginOtpExpiry = null;

    await user.save();

    res.json({ message: "Login success" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🔐 VERIFY RESET OTP
========================= */
app.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.json({ message: "OTP expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  


/* =========================
   👥 USERS API
========================= */

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET USER BY ID */
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL USERS (ADMIN) */
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/users/password/:id", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.json({ message: "Wrong current password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   📝 ISSUE APIs
========================= */

app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find().populate("assignedTo", "name email");
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 app.post("/api/issues", async (req, res) => {
  try {
    const points = getPoints(req.body.priority);

    const issue = new Issue({
      ...req.body,
      points
    });

    await issue.save();

    if (req.body.createdBy) {
      await User.findByIdAndUpdate(req.body.createdBy, {
        $inc: { points }
      });
    }

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* CREATE ISSUE */
app.post("/issues", async (req, res) => {
  try {
    const points = getPoints(req.body.priority);

    const issue = new Issue({
      ...req.body,
      points
    });

    await issue.save();

    // ✅ ADD POINTS TO USER
    if (req.body.createdBy) {
      await User.findByIdAndUpdate(
        req.body.createdBy,
        { $inc: { points } }
      );
    }

    // 📧 EMAIL
    if (issue.assignedTo) {
  const assignee = await Assignee.findById(issue.assignedTo);

  if (assignee && assignee.email) {
    await transporter.sendMail({
      from: "lakshithadevi2020@gmail.com",
      to: assignee.email,
      subject: "New Issue Assigned 🚀",
      html: `
        <h2>New Issue Assigned</h2>
        <p><strong>Title:</strong> ${issue.title}</p>
        <p><strong>Description:</strong> ${issue.description || "N/A"}</p>
        <p><strong>Priority:</strong> ${issue.priority}</p>
      `
    });
  }
}

    res.json(issue);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* DELETE ISSUE */
app.delete("/issues/:id", async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


/* =========================
   👨‍💻 ASSIGNEE APIs
========================= */

/// GET all assignees
app.get("/api/assignees", async (req, res) => {
  try {
    const data = await Assignee.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE assignee
app.post("/api/assignees", async (req, res) => {
  try {
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newAssignee = new Assignee({ name, email, department });
    const saved = await newAssignee.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE assignee
app.delete("/api/assignees/:id", async (req, res) => {
  try {
    await Assignee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Assignee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE assignee
// ASSIGN ISSUE + SEND EMAIL
app.put("/api/issues/:id/assign", async (req, res) => {
  try {
    const { assignedTo } = req.body;

    // 1. Update issue
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    ).populate("assignedTo", "name email");

    // 2. Get assignee
    const assignee = await Assignee.findById(assignedTo);

    // 3. SEND EMAIL (IMPORTANT FIX)
    if (assignee && assignee.email) {
      await transporter.sendMail({
        from: "lakshithadevi2020@gmail.com",
        to: assignee.email,
        subject: "🚀 New Issue Assigned to You",
        html: `
          <h2>Hello ${assignee.name},</h2>
          <p>You have been assigned a new issue.</p>

          <h3>Details:</h3>
          <p><b>Title:</b> ${issue.title}</p>
          <p><b>Type:</b> ${issue.type || "Bug"}</p>
          <p><b>Priority:</b> ${issue.priority}</p>
          <p><b>Status:</b> ${issue.status}</p>

          <br/>
          <p>Please check the admin panel to start working.</p>
        `
      });

      console.log("📧 Email sent to:", assignee.email);
    }

    res.json(issue);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   💬 COMMENT APIs
========================= */

app.post("/comments", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/comments/:issueId", async (req, res) => {
  try {
    const comments = await Comment.find({ issueId: req.params.issueId })
      .populate("userId", "name");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// 🔥 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-issue", (issueId) => {
    socket.join(issueId);
  });

  socket.on("send-message", ({ issueId, message }) => {
    io.to(issueId).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

/* =========================
  User ...
========================= */

app.delete("/api/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// UPDATE USER
app.put("/api/users/:id", async (req, res) => {
  const { name, email } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, email },
    { new: true }
  );

  res.json(updatedUser);
});


/*==========================
   ISSUE....
=========================*/
app.get("/api/issues/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("assignedTo", "name email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE issue
app.delete("/api/issues/:id", async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const router = express.Router();


// ✅ UPDATE ISSUE (IMPORTANT FIX)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
/* =========================
   🚀 SERVER START
========================= */
server.listen(5000, () => {
  console.log("🚀 Server + Socket running on port 5000");
});

/* =========================
    🏠 LANDING ROUTE (Add this to fix "Not Found")
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Feedback Issue Tracking System Backend is Live and Running!");
});

/* =========================
    🚀 SERVER START (Updated for Render)
========================= */
// Render assigns a port automatically; this line lets the app find it.
const PORT = process.env.PORT || 5000; 

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on port ${PORT}`);
});