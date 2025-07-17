import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import quizReducer from './quizSlice'
import studentReducer from './studentSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizReducer,
    students: studentReducer,
  },
});

export default store;
