import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AvailableQuizzes from "../components/AvailableQuizzes";


const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("logout Successful");
    navigate("/");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <AvailableQuizzes/>
      <button className="bg-red-500 text-white p-2 rounded mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
