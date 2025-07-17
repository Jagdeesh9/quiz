import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { deleteStudent, fetchStudents } from "../redux/studentSlice";
import Loader from "./Loader";

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, loading } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch, students.length]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="w-16 h-16" color="border-red-500" />
      </div>
    );

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Student List</h2>
      <ul className="border p-4 rounded-md">
        {students.length === 0 ? (
          <p>No students available</p>
        ) : (
          students.map((student) => (
            <li
              key={student._id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span>
                {student.name} - {student.email}
              </span>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => dispatch(deleteStudent(student._id))}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default StudentList;
