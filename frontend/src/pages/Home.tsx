import React from "react";
import { Link } from "react-router-dom";
import "../styles/index.css";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to MyNotes 📝</h1>
      <p className="text-gray-700 leading-relaxed">
        Start adding, editing, and managing your notes
      </p>
    </main>
  );
};

export default Home;
