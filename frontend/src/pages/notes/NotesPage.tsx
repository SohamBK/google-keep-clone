import React from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { selectAuth } from "../../store/auth/authSlice";

const NotesPage: React.FC = () => {
  const { user } = useAppSelector(selectAuth);

  if (!user) {
    // This case should ideally be handled by the router,
    // but it's a good practice to have a fallback.
    return (
      <p className="text-red-500">You must be logged in to view this page.</p>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome, {user.email}!
      </h1>
    </div>
  );
};

export default NotesPage;
