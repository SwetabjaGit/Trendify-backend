require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary");
const connectDatabase = require("./database");

// Importing Routes
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");


// Database connection
connectDatabase();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//cloudinary.v2.uploader.upload()

// Middlewares
app.use(express.json());
app.use(cors());


// Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, (error) => {
  if(!error) {
    console.log("Server running on port " + PORT);
  } else {
    console.log("Error: " + error);
  }
});