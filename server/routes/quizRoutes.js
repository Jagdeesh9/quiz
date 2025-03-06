import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  deleteQuiz,
  assignQuiz,
  updateQuiz
} from "../controllers/quizController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware,  createQuiz); // ✅ Create Quiz
router.put("/:id", authMiddleware, updateQuiz);
router.get("/", getAllQuizzes); // ✅ Get All Quizzes
router.get("/:quizId", getQuizById); // ✅ Get Single Quiz
router.post("/:quizId/submit", authMiddleware, submitQuiz); // ✅ Submit Quiz
router.delete("/:quizId", authMiddleware, adminMiddleware, deleteQuiz); // ✅ Delete Quiz
router.post("/:quizId/assign", authMiddleware, adminMiddleware, assignQuiz);



export default router;
