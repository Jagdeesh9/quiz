import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

// Fetch students
export const fetchStudents = createAsyncThunk("students/fetchStudents", async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
});

// Assign Quiz
export const assignQuiz = createAsyncThunk("students/assignQuiz", async ({ quizId, studentId }) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/quizzes/${quizId}/assign`, 
    { studentId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
});

// Add student
export const addStudent = createAsyncThunk("students/addStudent", async (studentData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, studentData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
});

// Delete student
export const deleteStudent = createAsyncThunk("students/deleteStudent", async (studentId) => {
    await axios.delete(`${API_BASE_URL}/delete/${studentId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return studentId;
});

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Assign quiz
      .addCase(assignQuiz.fulfilled, () => {
        alert("Quiz assigned successfully!");
      })
    

      // Add student
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload); // Add student to state
      })

      // Delete student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(student => student._id !== action.payload);
      });
  },
});

export default studentSlice.reducer;
