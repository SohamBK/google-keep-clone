import React from "react";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { updateNoteStatus } from "../../store/notes/notesSlice";
import { MdOutlinePushPin, MdPushPin } from "react-icons/md"; // Combined icons
import { IoArchiveOutline, IoArchive } from "react-icons/io5"; // Combined icons

// 1. Define the Note structure separately for cleaner props
interface NoteData {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  backgroundColor: string;
}

// 2. Define the Component Props (data + handlers)
interface NoteItemProps {
  note: NoteData; // Data structure
  onClick: (noteId: string) => void; // Handler passed from parent
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onClick }) => {
  // <-- CORRECT: Destructure both note and onClick
  const dispatch = useAppDispatch();

  // Note: navigate is no longer needed here as the parent controls navigation/modal

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the note card from being clicked
    dispatch(updateNoteStatus({ id: note._id, isPinned: !note.isPinned }));
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the note card from being clicked
    // Best Practice: When archiving, we set isArchived: true
    dispatch(updateNoteStatus({ id: note._id, isArchived: true }));
  };

  // Note: The logic for handling the click to open the modal is now correct.
  const handleCardClick = () => {
    onClick(note._id);
  };

  return (
    <div
      className="p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={handleCardClick} // <-- FIX: Attach the local handler that uses the prop
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-black">{note.title}</h2>
        <div className="flex space-x-2">
          {/* Pin/Unpin button */}
          <button
            onClick={handlePinToggle}
            className={`transition-colors duration-200 ${
              note.isPinned
                ? "text-yellow-500 hover:text-yellow-600"
                : "text-gray-500 hover:text-yellow-500"
            }`}
          >
            {note.isPinned ? (
              <MdPushPin className="h-6 w-6" />
            ) : (
              <MdOutlinePushPin className="h-6 w-6" />
            )}
          </button>

          {/* Archive button */}
          <button
            onClick={handleArchive}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <IoArchiveOutline className="h-6 w-6" />
          </button>
        </div>
      </div>
      <p className="text-gray-600">{note.content}</p>
    </div>
  );
};

export default NoteItem;
