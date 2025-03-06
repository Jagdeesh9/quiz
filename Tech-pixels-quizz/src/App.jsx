import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import QuizPage from './components/QuizPage'
import PerformancePage from './components/PerformancePage'

function App() {
  const { user } = useSelector((state) => state.auth);
 
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={user ? user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/dashboard" /> :  <Login />} />
        <Route
          path="/admin-dashboard"
          element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={user ? <UserDashboard /> : <Navigate to="/" />}
        />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/performance/:id" element={<PerformancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
