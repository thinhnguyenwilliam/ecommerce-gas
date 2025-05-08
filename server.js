require('dotenv').config();
const app = require("./src/app");
const http = require('http');
const { Server } = require('socket.io');
const setupSocket = require('./socket');

const PORT = process.env.DEV_APP_PORT || 3056;
//console.log(` process::`, process.env)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const axios = require("axios");

// Handle termination signals (e.g., Ctrl+C)
process.on("SIGINT", async () => {
  console.log("Exit server!!??");

  try {
    await axios.post("http://example.com/shutdown", { message: "Server shutting down" });
    console.log("Notification sent.");
  } catch (error) {
    console.error("Failed to send notification:", error.message);
  }

  process.exit(0);
});
