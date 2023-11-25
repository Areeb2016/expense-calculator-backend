const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const options = [
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
];

app.use(options);

// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {});

// API routes
const authRoutes = require("./Routes/authRoutes");
const expenseRoutes = require("./Routes/expenseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
