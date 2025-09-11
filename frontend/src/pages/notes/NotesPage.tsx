import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchAllNotes, selectNotes } from "../../store/notes/notesSlice";
import NoteItem from "../../components/notes/NoteItem";
import CreateNoteForm from "../../components/notes/CreateNoteForm"; // Import the form

const NotesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notes, isLoading, error } = useAppSelector(selectNotes);

  useEffect(() => {
    dispatch(fetchAllNotes({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold">Loading notes...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Notes</h1>
      <CreateNoteForm /> {/* Render the new form component here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => <NoteItem key={note._id} note={note} />)
        ) : (
          <p className="text-gray-500">
            No notes found. Create your first note!
          </p>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
