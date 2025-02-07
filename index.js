const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/connectDB");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");

// Connect DB
connectDB(process.env.DB_URL);

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create server on PORT
const PORT = process.env.PORT || 4000;
// Routes
const authRoutes = require("./routes/auth.router");
const userRoutes = require("./routes/user.routes");
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.listen(PORT, () => {
  console.log("Server connected 🟢");
  console.log(`http://localhost:${PORT}`);
});
