import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // Assuming you're using Redux for auth state
import { useNavigate } from "react-router-dom";

const AvailableQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  
  // Get logged-in student ID from Redux store or local storage
  const studentId = useSelector((state) => state.auth.user.id);
 console.log(studentId)
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quizzes`);
        
        // Filter quizzes where studentId is included in assignedStudents
        const assignedQuizzes = data.filter((quiz) => quiz.assignedStudents.includes(studentId));
        setQuizzes(assignedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [studentId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Quizzes</h2>
      
      {quizzes.length === 0 ? (
        <p className="text-gray-500">No quizzes assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p className="text-gray-600">{quiz.description}</p>
              <p className="text-sm text-gray-500">Duration: {quiz.duration} min</p>
              <button 
                onClick={() => navigate(`/quiz/${quiz._id}`)}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Take Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableQuizzes;
