import { useState } from "react";
import { useDispatch } from "react-redux";
import { addStudent } from "../redux/studentSlice";

const AddStudentModal = ({ setIsModalOpen }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "TPG_",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addStudent(formData));
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Add New Student</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Student Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="password"
            placeholder="Student password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-300 rounded" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
