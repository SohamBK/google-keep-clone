import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  createNote,
  fetchAllNotes,
  selectNotes,
} from "../../store/notes/notesSlice";
import NoteItem from "../../components/notes/NoteItem";
import CreateNoteForm, {
  type CreateNoteFormInputs,
} from "../../components/notes/CreateNoteForm";
import Modal from "../../components/common/Modal";
import type { SubmitHandler } from "react-hook-form";

const NotesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notes, isLoading, error } = useAppSelector(selectNotes);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllNotes({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleCreateNoteSubmit: SubmitHandler<CreateNoteFormInputs> = async (
    data
  ) => {
    try {
      await dispatch(createNote(data)).unwrap();
      setIsModalOpen(false); // Close modal on successful submission
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          Create Note
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateNoteForm
          onFormSubmit={handleCreateNoteSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

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
