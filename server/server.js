import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import performanceRoutes from "./routes/performanceRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("hello world");
});

// Routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/performance", performanceRoutes);

// Database Connection (ensure it works with serverless)
connectDB().catch(err => console.error("Database connection error:", err));

// Export the app for Vercel
export default app;