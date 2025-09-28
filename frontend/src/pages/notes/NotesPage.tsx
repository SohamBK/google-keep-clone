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
import NoteDetailModal from "../../components/notes/NoteDetailModal";
import type { SubmitHandler } from "react-hook-form";

const NotesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notes, isLoading, error } = useAppSelector(selectNotes);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null); // State to track which note is selected

  useEffect(() => {
    // Fetch all notes when the page loads
    dispatch(fetchAllNotes({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleCreateNoteSubmit: SubmitHandler<CreateNoteFormInputs> = async (
    data
  ) => {
    try {
      await dispatch(createNote(data)).unwrap();
      setIsCreateModalOpen(false); // Close modal on successful submission
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  // Handler to open the detail modal and set the ID
  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
  };

  // Handler to close the detail modal and clear the ID
  const handleCloseDetailModal = () => {
    setSelectedNoteId(null);
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
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          Create Note
        </button>
      </div>

      {/* 1. Modal for Creating a New Note */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <CreateNoteForm
          onFormSubmit={handleCreateNoteSubmit}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            // 2. Pass the click handler down to NoteItem
            <NoteItem
              key={note._id}
              note={note}
              onClick={() => handleNoteClick(note._id)}
            />
          ))
        ) : (
          <p className="text-gray-500">
            No notes found. Create your first note!
          </p>
        )}
      </div>

      {/* 3. Modal for Viewing Note Details */}
      <NoteDetailModal
        isOpen={!!selectedNoteId}
        onClose={handleCloseDetailModal}
        noteId={selectedNoteId}
      />
    </div>
  );
};

export default NotesPage;
