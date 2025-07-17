import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchQuizzes } from "../redux/quizSlice";
import { toast } from "react-toastify";

const AddQuizModal = ({ setIsModalOpen, editQuiz }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
  });

  // Prefill form for editing
  useEffect(() => {
    if (editQuiz?._id) {
      setFormData({
        title: editQuiz?.title || "",
        description: editQuiz?.description || "",
        duration: editQuiz?.duration || "",
        questions: editQuiz?.questions?.length ? editQuiz.questions : [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
      });
    }
  }, [editQuiz]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    console.log(index, field, value)
    const updatedQuestions = [...formData.questions];
    const updatedQuestionsCopy = [...updatedQuestions];
    updatedQuestionsCopy[index] = { 
      ...updatedQuestionsCopy[index], // Copy the object to keep immutability
      [field]: value // Update the specific field dynamically
    };
    setFormData({ ...formData, questions: updatedQuestionsCopy });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
     const updatedQuestions = [...formData.questions];
    const updatedQuestionsCopy = [...updatedQuestions];
    

    const newOptions = [...updatedQuestions[0].options]
    newOptions[optIndex] = value;
    updatedQuestionsCopy[qIndex] = { 
      ...updatedQuestionsCopy[qIndex], // Copy the object to keep immutability
      ['options']: newOptions // Update the specific field dynamically
    };
     setFormData({ ...formData, questions: updatedQuestionsCopy });
  };
  

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }],
    });
  };

  const removeQuestion = (index) => {
    setFormData({ ...formData, questions: formData.questions.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editQuiz?._id) {
         await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/quizzes/${editQuiz._id}`, formData, config);
        toast.success("Quiz updated successfully!");
      } else {
        await axios.post("${import.meta.env.VITE_API_BASE_URL}/api/quizzes", formData, config);
        toast.success("Quiz created successfully!");
      }

      dispatch(fetchQuizzes());
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error submitting quiz. Please try again.");
      console.error("Error submitting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="dialog" aria-labelledby="quiz-modal-title" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-1/2 max-h-[80vh] overflow-auto">
        <h2 id="quiz-modal-title" className="text-xl font-semibold mb-4">{editQuiz?._id ? "Edit Quiz" : "Create New Quiz"}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Quiz Title" value={formData.title} onChange={handleChange} className="border p-2 w-full mb-2" required />
          <textarea name="description" placeholder="Quiz Description" value={formData.description} onChange={handleChange} className="border p-2 w-full mb-2" required />
          <input type="number" name="duration" placeholder="Duration (minutes)" value={formData.duration} onChange={handleChange} className="border p-2 w-full mb-2" required />

          <h3 className="text-lg font-semibold mt-4 mb-2">Questions</h3>
          {formData.questions.map((q, qIndex) => (
            <div key={qIndex} className="border p-3 mb-2">
              <input type="text" placeholder={`Question ${qIndex + 1}`} value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)} className="border p-2 w-full mb-2" required />
              {q.options.map((opt, optIndex) => (
                <input key={optIndex} type="text" placeholder={`Option ${optIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} className="border p-2 w-full mb-2" required />
              ))}
              <input type="text" placeholder="Correct Answer" value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)} className="border p-2 w-full mb-2" required />
              <button type="button" className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={() => removeQuestion(qIndex)}>Remove Question</button>
            </div>
          ))}

          <button type="button" className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2" onClick={addQuestion}>+ Add Question</button>

          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={loading} className={`bg-green-500 text-white px-4 py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {loading ? "Processing..." : editQuiz?._id ? "Update Quiz" : "Save Quiz"}
            </button>
            <button type="button" className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizModal;
