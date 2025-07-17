import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzes } from "../redux/quizSlice";
import { fetchStudents } from "../redux/studentSlice";
import SearchBar from "../components/SearchBar";
import AddQuizModal from "../components/AddQuizModal";
import AddStudentModal from "../components/AddStudentModal";
import QuizList from "../components/QuizList";
import StudentList from "../components/StudentList";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { quizzes, loading: quizLoading } = useSelector((state) => state.quizzes);
  const { students, loading: studentLoading } = useSelector((state) => state.students);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchStudents());
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Hello {user?.name}</h2>
        
        <div className="space-x-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md" 
            onClick={() => setIsQuizModalOpen(true)}
          >
            + Create New Quiz
          </button>
          
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-md" 
            onClick={() => setIsStudentModalOpen(true)}
          >
            + Add Student
          </button>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-md" 
            onClick={()=>{
              localStorage.clear();
              window.location.reload();
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <QuizList />
      <StudentList />

      {/* Modals */}
      {isQuizModalOpen && <AddQuizModal setIsModalOpen={setIsQuizModalOpen} />}
      {isStudentModalOpen && <AddStudentModal setIsModalOpen={setIsStudentModalOpen} />}
    </div>
  );
};

export default AdminDashboard;
