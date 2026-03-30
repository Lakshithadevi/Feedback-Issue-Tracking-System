import { io } from "socket.io-client";

export const socket = io("https://feedback-issue-tracking-system.onrender.com", {
  transports: ["websocket"]
});