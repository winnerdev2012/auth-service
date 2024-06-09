const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle POST requests to /streams/webhooks
app.get("/streams/webhooks", (req, res) => {
  console.log("Received webhook:", req.body);
  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
