io.on("connection", (socket) => {

  socket.on("join-issue", (issueId) => {
    socket.join(issueId);
  });

  socket.on("send-message", ({ issueId, message }) => {
    io.to(issueId).emit("receive-message", message);
  });

});

import { io } from "socket.io-client";

export const socket = io("https://feedback-issue-tracking-system.onrender.com");