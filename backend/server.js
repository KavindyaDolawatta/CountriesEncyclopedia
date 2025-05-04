// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/favorites"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Only connect & listen if not in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      app.listen(process.env.PORT || 5000, () =>
        console.log("Server running on port 5000")
      );
    })
    .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = app; 
