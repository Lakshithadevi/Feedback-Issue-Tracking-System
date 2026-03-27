const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendIssueMail = async (to, issue) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `New Issue Assigned: ${issue.title}`,
    html: `
      <h3>New Issue Assigned</h3>
      <p><b>Title:</b> ${issue.title}</p>
      <p><b>Description:</b> ${issue.description}</p>
      <p><b>Priority:</b> ${issue.priority}</p>
      <p><b>Due Date:</b> ${issue.dueDate}</p>
    `
  });
};

module.exports = sendIssueMail;