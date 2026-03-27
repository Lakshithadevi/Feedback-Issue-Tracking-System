const express = require("express");
const router = express.Router();

const {
  createIssue,
  getIssues
} = require("../controllers/issueController");

router.post("/issues", createIssue);
router.get("/issues", getIssues);

module.exports = router;