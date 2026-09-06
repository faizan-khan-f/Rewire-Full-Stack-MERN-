import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";

dotenv.config();

const app = express();

// Allow requests from your local frontend AND your future Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite local development
      process.env.FRONTEND_URL, // We will set this in Render later
    ],
    credentials: true,
  }),
);
// Middlewares
// app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use("/api/auth", authRoutes);

// 2. Make sure this line exists below your database connection
app.use("/api/plans", planRoutes);

// Basic Test Route
app.get("/", (req, res) => {
  res.send("Rewire, Reset & Rebounce API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
