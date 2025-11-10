import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const { pathname } = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/login", label: "Login" },
    { path: "/register", label: "Register" },
  ];

  return (
    <header className="bg-amber-300 shadow-md sticky top-0 z-50 border-b border-amber-500">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          className="text-2xl font-bold text-white hover:text-gray-100"
          to="/"
        >
          MyNotes
        </Link>
        <ul className="flex items-center gap-6">
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`${
                  pathname === path
                    ? "text-white font-semibold"
                    : "text-gray-100 hover:text-white"
                } transition-colors duration-200`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
