import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/login", label: "Login" },
    { path: "/register", label: "Register" },
  ];

  const privateNavItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="bg-amber-100 shadow-md sticky top-0 z-50 border-b border-amber-200">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          className="text-2xl font-bold text-amber-700 tracking-tight hover:text-amber-800 transition-colors"
          to="/"
        >
          MyNotes
        </Link>

        {/* Nav Links */}
        <ul className="flex items-center gap-6 text-gray-700">
          {!accessToken &&
            publicNavItems.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`${
                    pathname === path
                      ? "text-amber-700 font-semibold"
                      : "hover:text-amber-600"
                  } transition-colors duration-200`}
                >
                  {label}
                </Link>
              </li>
            ))}

          {accessToken &&
            privateNavItems.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`${
                    pathname === path
                      ? "text-amber-700 font-semibold"
                      : "hover:text-amber-600"
                  } transition-colors duration-200`}
                >
                  {label}
                </Link>
              </li>
            ))}

          {/* Logout button when logged in */}
          {accessToken && (
            <button
              onClick={handleLogout}
              className="bg-amber-500 text-white px-4 py-1.5 rounded-lg hover:bg-amber-600 transition-colors duration-200"
            >
              Logout
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
