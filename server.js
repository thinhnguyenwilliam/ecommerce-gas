require('dotenv').config();
const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT || 3056;
//console.log(` process::`, process.env)

app.listen(PORT, () => {
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
