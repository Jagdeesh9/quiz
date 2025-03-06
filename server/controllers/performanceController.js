import Performance from "../models/Performance.js";
import Quiz from "../models/Quiz.js";

// 📌 Submit a Quiz & Store Performance
export const submitQuiz = async (req, res) => {
  try {
    const { studentId, quizId, answers } = req.body;

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((q) => {
      if (answers[q._id] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Save performance in the database
    const performance = new Performance({
      studentId,
      quizId,
      score,
      totalQuestions,
      correctAnswers,
    });

    await performance.save();

    await Quiz.findByIdAndUpdate(quizId, {
      $pull: { assignedStudents: studentId }, // Remove student from assigned list
    });
    
    res.status(201).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions,
      correctAnswers,
      performanceId: performance._id,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Get Performance by Student ID & Quiz ID
export const getPerformanceByStudentAndQuiz = async (req, res) => {
  try {
    const { studentId, quizId } = req.params;

    const performance = await Performance.findOne({ studentId, quizId }).populate("quizId", "title description");

    if (!performance) {
      return res.status(404).json({ error: "Performance record not found" });
    }

    res.json(performance);
  } catch (error) {
    console.error("Error fetching performance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 📌 Get All Performances for a Student
export const getPerformanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const performances = await Performance.find({ studentId }).populate("quizId", "title description");

    if (!performances.length) {
      return res.status(404).json({ error: "No performance records found for this student" });
    }

    res.json(performances);
  } catch (error) {
    console.error("Error fetching student performances:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
