const Issue = require("../models/Issue");
const sendIssueMail = require("../config/mailer");

// CREATE ISSUE
exports.createIssue = async (req, res) => {
  try {
    const issue = await Issue.create(req.body);

    // 📧 send mail if assigned
    if (issue.assignedTo) {
      await sendIssueMail(issue.assignedTo, issue);
    }

    res.json({ message: "Issue Created", issue });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ISSUES
exports.getIssues = async (req, res) => {
  const issues = await Issue.find();
  res.json(issues);
};