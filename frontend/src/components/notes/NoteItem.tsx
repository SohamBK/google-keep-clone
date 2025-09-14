import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { updateNoteStatus } from "../../store/notes/notesSlice";

interface NoteItemProps {
  note: {
    _id: string;
    title: string;
    content: string;
    isPinned: boolean;
    isArchived: boolean;
    isDeleted: boolean;
    backgroundColor: string;
  };
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNoteClick = () => {
    // Navigate to a specific note's detail page
    // We will build this detail page later
    navigate(`/notes/${note._id}`);
  };

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the note card from being clicked
    dispatch(updateNoteStatus({ id: note._id, isPinned: !note.isPinned }));
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the note card from being clicked
    dispatch(updateNoteStatus({ id: note._id, isArchived: true }));
  };

  return (
    <div
      className="p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={handleNoteClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{note.title}</h2>
        <div className="flex space-x-2">
          {/* Pin/Unpin button */}
          <button
            onClick={handlePinToggle}
            className="text-gray-500 hover:text-yellow-500 transition-colors duration-200"
          >
            {note.isPinned ? (
              // Pinned icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM14.5 4h-5v5h5V4zM16 19.37l2.83-2.83A4 4 0 0 0 12 12.5a4 4 0 0 0 -6.83 3.83L12 19.37V22h2v-2.63L16 19.37z" />
              </svg>
            ) : (
              // Unpinned icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-1.5M16 16l-1.5-1.5M14 18l-1.5-1.5M12 21l-1.5-1.5" />
              </svg>
            )}
          </button>

          {/* Archive button */}
          <button
            onClick={handleArchive}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M7 11h10"></path>
              <path d="M7 15h10"></path>
              <path d="M11 7v14"></path>
            </svg>
          </button>
        </div>
      </div>
      <p className="text-gray-600">{note.content}</p>
    </div>
  );
};

export default NoteItem;
