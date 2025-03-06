import express from "express";
import {
  submitQuiz,
  getPerformanceByStudentAndQuiz,
  getPerformanceByStudent,
} from "../controllers/performanceController.js";

const router = express.Router();

// 📌 Submit a quiz
router.post("/submit", submitQuiz);

// 📌 Get performance by student ID & quiz ID
router.get("/:studentId/:quizId", getPerformanceByStudentAndQuiz);

// 📌 Get all performance records for a student
router.get("/:studentId", getPerformanceByStudent);

export default router;
