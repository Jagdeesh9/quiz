import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PerformancePage = () => {
  const { id } = useParams(); // Quiz ID from URL
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const { data } = await axios.get(`https://quiz-backend-9nkq.onrender.com/api/quizzes/performance/${id}`);
        setPerformance(data);
      } catch (error) {
        console.error("Error fetching performance:", error);
      }
    };

    fetchPerformance();
  }, [id]);

  if (!performance) return <p>Loading performance...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Quiz Performance</h2>
      <p className="text-lg">Score: {performance.score} / {performance.totalQuestions}</p>
      <p className="text-gray-600">Correct Answers: {performance.correctAnswers}</p>
    </div>
  );
};

export default PerformancePage;
