import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { MdSearch } from "react-icons/md";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-amber-100 border-b border-amber-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* ------------------- LOGO ------------------- */}
        <Link
          to="/"
          className="text-2xl font-bold text-amber-700 tracking-tight hover:text-amber-800 transition"
        >
          MyNotes
        </Link>

        {/* ------------------- SEARCH BAR ------------------- */}
        {accessToken && (
          <div className="flex-1 max-w-2xl mx-auto relative">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search your notes"
              className="
                w-full pl-10 pr-4 py-2
                rounded-full
                bg-white
                border border-gray-200
                shadow-sm
                focus:outline-none
                focus:ring-2 focus:ring-amber-400
              "
            />
          </div>
        )}

        {/* ------------------- RIGHT ACTIONS ------------------- */}
        {accessToken && (
          <button
            onClick={handleLogout}
            className="
              ml-auto
              bg-amber-500 text-white
              px-4 py-2
              rounded-full
              hover:bg-amber-600
              transition
            "
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
