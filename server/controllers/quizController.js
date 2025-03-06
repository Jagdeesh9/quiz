import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

// ✅ Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, duration } = req.body;
    const newQuiz = new Quiz({
      title,
      description,
      questions,
      duration,
      createdBy: req.user.id, // Get user ID from token
    });

    await newQuiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

// ✅ Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "name email");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};

// ✅ Get single quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};

// ✅ Submit quiz & check answers
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    res.status(200).json({ message: "Quiz submitted", score, total: quiz.questions.length });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz", error });
  }
};

// ✅ Delete a quiz (Admin only)
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await quiz.deleteOne();
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error });
  }
};


export const assignQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { studentId } = req.body;

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    console.log(quiz)
    // Check if student exists
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }


    // Check if user is actually a student
    if (student.role !== "student") {
      return res.status(400).json({ message: "User is not a student" });
    }

    // Check if quiz is already assigned
    if (quiz.assignedStudents.includes(studentId)) {
      return res.status(400).json({ message: "Quiz already assigned to this student" });
    }

    // Assign quiz to student
    quiz.assignedStudents.push(studentId);
    await quiz.save();

    res.status(200).json({ message: "Quiz assigned successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { title, description, questions, duration } = req.body;
    const { id } = req.params;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, description, questions, duration },
      { new: true } // Return the updated quiz
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error });
  }
};
