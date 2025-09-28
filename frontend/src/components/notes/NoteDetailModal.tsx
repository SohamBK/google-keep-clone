import React, { useEffect } from "react";
import Modal from "../common/Modal";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  selectNotes,
  fetchNoteById,
  setSelectedNote,
} from "../../store/notes/notesSlice";

interface NoteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string | null;
}

const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
  isOpen,
  onClose,
  noteId,
}) => {
  const dispatch = useAppDispatch();
  const { selectedNote, isLoading, error } = useAppSelector(selectNotes); // Correct destructuring

  useEffect(() => {
    // Fetch the note when the modal opens and a noteId is provided
    if (isOpen && noteId) {
      // First, check if the note is already in state to avoid unnecessary API call
      if (selectedNote && selectedNote._id === noteId && !isLoading) {
        return;
      }
      dispatch(fetchNoteById(noteId));
    }
    // Clean up selectedNote when the modal closes unexpectedly
    if (!isOpen) {
      dispatch(setSelectedNote(null));
    }
  }, [isOpen, noteId, dispatch, selectedNote, isLoading]); // Added selectedNote and isLoading to dependencies

  const handleClose = () => {
    dispatch(setSelectedNote(null)); // Clear the selected note from state
    onClose();
  };

  if (!isOpen || !noteId) {
    return null;
  }

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6">
          <p>Loading note details...</p>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6 text-red-500">
          <p>Error: {error}</p>
        </div>
      </Modal>
    );
  }

  if (!selectedNote) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="p-6">
          <p>Note not found.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-black">
          {selectedNote.title}
        </h2>
        <p className="text-black">{selectedNote.content}</p>
      </div>
    </Modal>
  );
};

export default NoteDetailModal;
