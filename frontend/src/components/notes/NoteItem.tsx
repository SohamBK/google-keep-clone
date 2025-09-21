import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { updateNoteStatus } from "../../store/notes/notesSlice";
import { MdOutlinePushPin } from "react-icons/md";
import { MdPushPin } from "react-icons/md";
import { IoArchiveOutline } from "react-icons/io5";
import { IoArchive } from "react-icons/io5";

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
        <h2 className="text-xl font-semibold text-black">{note.title}</h2>
        <div className="flex space-x-2">
          {/* Pin/Unpin button */}
          <button
            onClick={handlePinToggle}
            className="text-gray-500 hover:text-yellow-500 transition-colors duration-200"
          >
            {note.isPinned ? (
              // Pinned icon
              <MdPushPin />
            ) : (
              // Unpinned icon
              <MdOutlinePushPin />
            )}
          </button>

          {/* Archive button */}
          <button
            onClick={handleArchive}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <IoArchiveOutline />
          </button>
        </div>
      </div>
      <p className="text-gray-600">{note.content}</p>
    </div>
  );
};

export default NoteItem;
