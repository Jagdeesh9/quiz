import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/quizzes`;

// Async action to submit quiz
export const submitQuiz = createAsyncThunk(
  "quiz/submitQuiz",
  async ({ studentId, quizId, answers }, { rejectWithValue }) => {
      try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/performance/submit`, {
        studentId,
        quizId,
        answers,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      window.navigator.push('/')
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fetch all quizzes
export const fetchQuizzes = createAsyncThunk("quizzes/fetchQuizzes", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

// Create a new quiz
export const createQuiz = createAsyncThunk("quizzes/createQuiz", async (quizData) => {
  const response = await axios.post(API_URL, quizData, {headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token in the Authorization header
  },});
  return response.data;
});

// Update an existing quiz
export const updateQuiz = createAsyncThunk("quizzes/updateQuiz", async (quizData) => {
  const { id, title, description, category } = quizData;
  const response = await axios.put(`${API_URL}/${id}`, { title, description, category },{headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token in the Authorization header
  },});
  return response.data;
});

// Delete a quiz
export const deleteQuiz = createAsyncThunk("quizzes/deleteQuiz", async (quizId) => {
  await axios.delete(`${API_URL}/${quizId}`,{headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token in the Authorization header
  },});

});

const quizSlice = createSlice({
  name: "quizzes",
  initialState: {
    quizzes: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex((quiz) => quiz._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((quiz) => quiz._id !== action.payload);
      });
  },
});

export default quizSlice.reducer;
