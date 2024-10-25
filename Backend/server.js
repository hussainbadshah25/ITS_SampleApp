const express = require("express");
const cors = require("cors");
const errorHandler = require("./Middlewares/errorHandler");
require("dotenv").config();
const db = require("./Config/database");

// Import routes
const authRoutes = require("./Routes/auth");
const userRoutes = require("./Routes/user");
const masterRoutes = require("./Routes/master");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.db = db;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/master", masterRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
