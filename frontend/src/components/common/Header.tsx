import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logoutUser, selectAuth } from "../../store/auth/authSlice";

const Header: React.FC = () => {
  const { accessToken } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Dispatch the logout async thunk
    await dispatch(logoutUser());
    // Redirect to login page after logout
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          My Keep
        </Link>
        <div>
          {accessToken ? (
            <button
              onClick={handleLogout}
              className="text-lg px-4 py-2 rounded-md transition-colors duration-200 hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-lg px-4 py-2 rounded-md transition-colors duration-200 hover:bg-blue-600 mr-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-lg px-4 py-2 rounded-md transition-colors duration-200 hover:bg-green-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
