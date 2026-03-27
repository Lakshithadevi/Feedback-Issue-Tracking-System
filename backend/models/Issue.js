const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  priority: String,
  tags: [String],
  dueDate: String,
  assignedTo: String, // 📧 email
  createdBy: String,  // 📧 email
  status: {
    type: String,
    default: "To Do"
  },
  messages: [
    {
      sender: String,
      text: String,
      time: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);