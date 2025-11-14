import React from "react";
import NoteInput from "../components/NoteInput";
import NotesGrid from "../components/NotesGrid";

const Dashboard: React.FC = () => {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <NoteInput />
      <NotesGrid />
    </main>
  );
};

export default Dashboard;
