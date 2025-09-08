import React from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleNoteClick = () => {
    navigate(`/notes/${note._id}`);
  };

  return (
    <div
      className="p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={handleNoteClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-blue-600">{note.title}</h2>
        {note.isPinned && <span className="text-yellow-500">📍</span>}
      </div>
      <p className="text-gray-600">{note.content}</p>
    </div>
  );
};

export default NoteItem;
