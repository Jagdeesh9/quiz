import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { submitQuiz } from "../redux/quizSlice";

const QuizPage = () => {
  const { id } = useParams(); // Get quiz ID from URL
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const studentId = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(
          `https://quiz-backend-9nkq.onrender.com/api/quizzes/${id}`
        );
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    dispatch(submitQuiz({ quizId: id, studentId, answers }))
      .then(() => navigate("/dashboard")) // Redirect after successful submission
      .catch((error) => console.error("Error submitting quiz:", error));
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">{quiz.title}</h2>
      <p className="text-gray-600">{quiz.description}</p>

      {quiz.questions.map((q) => (
        <div key={q._id} className="mt-4 p-4 border rounded-md">
          <p className="font-medium">{q.questionText}</p>
          {q.options.map((option) => (
            <label key={option} className="block">
              <input
                type="radio"
                name={q._id}
                value={option}
                checked={answers[q._id] === option}
                onChange={() => handleChange(q._id, option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-md"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizPage;
