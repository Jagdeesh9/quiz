import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import performanceRoutes from "./routes/performanceRoutes.js";

const app = express();

// Configure CORS to allow multiple origins
const corsOptions = {
  origin: ['https://quiz-59jv.vercel.app', 'https://quiz.techpixelsgfx.com/'], // Array of allowed origins
  credentials: true, // If you need to send cookies or auth headers
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

dotenv.config();

app.use(express.json());

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