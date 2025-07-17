import { useState } from "react";
import { useDispatch } from "react-redux";
import { assignQuizToStudent } from "../redux/quizSlice";
import { toast } from "react-toastify";

const AssignQuiz = ({ quizId }) => {
  const dispatch = useDispatch();
  const [studentId, setStudentId] = useState("");

  const handleAssign = () => {
    dispatch(assignQuizToStudent({ quizId, studentId }))
      .unwrap()
      .then(() => toast.success("Quiz assigned successfully"))
      .catch(() => toast.error("Failed to assign quiz"));
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold">Assign Quiz</h3>
      <input
        type="text"
        placeholder="Enter Student ID"
        className="border p-2 rounded w-full my-2"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={handleAssign}>
        Assign Quiz
      </button>
    </div>
  );
};

export default AssignQuiz;
