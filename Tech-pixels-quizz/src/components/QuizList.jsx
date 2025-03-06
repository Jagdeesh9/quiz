import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzes, deleteQuiz, updateQuiz } from "../redux/quizSlice";
import { fetchStudents, assignQuiz } from "../redux/studentSlice";
import SearchBar from "./SearchBar";
import AddQuizModal from "./AddQuizModal";
import Loader from "./Loader";

const QuizList = () => {
  const dispatch = useDispatch();
  const { quizzes, loading } = useSelector((state) => state.quizzes);
  const { students } = useSelector((state) => state.students);
  const [quizToEdit, setQuizToEdit] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchStudents());
  }, [dispatch]);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🛠 Assign Quiz
  const handleAssignQuiz = (quizId) => {
    if (!selectedStudent) return alert("Please select a student.");
    dispatch(assignQuiz({ quizId, studentId: selectedStudent }));
    setSelectedQuiz(null);
    setSelectedStudent("");
  };

  // 🛠 Delete Quiz
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await dispatch(deleteQuiz(quizId)); // Dispatch the delete action
        dispatch(fetchQuizzes()); // Fetch updated list after deletion
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };


  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Quizzes</h2>
      <SearchBar setSearchTerm={setSearchTerm} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader size="w-16 h-16" color="border-red-500" />
        </div>
      ) : (
        <ul>
          {filteredQuizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="border p-2 my-2 flex justify-between items-center"
            >
              <div>
                <strong>{quiz.title}</strong> - {quiz.category}
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedQuiz(quiz._id);
                  }}
                >
                  Assign
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => {
                    setQuizToEdit(quiz), setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDeleteQuiz(quiz._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Assign Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-2">Assign Quiz</h3>
            <select
              className="w-full border p-2 mb-4"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                className="bg-gray-400 px-3 py-1 mr-2 rounded"
                onClick={() => setSelectedQuiz(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => handleAssignQuiz(selectedQuiz)}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <AddQuizModal
          editQuiz={quizToEdit}
          setIsModalOpen={setIsEditModalOpen}
        />
      )}
    </div>
  );
};

export default QuizList;
