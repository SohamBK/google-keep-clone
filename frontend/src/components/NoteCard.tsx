import React from "react";
import { MdDelete, MdPushPin, MdArchive, MdUnarchive } from "react-icons/md";
import { useAppDispatch } from "../app/hooks";
import { updateNoteStatus } from "../features/notes/notesThunks";

interface Props {
  _id: string;
  title?: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
}

const NoteCard: React.FC<Props> = ({
  _id,
  title,
  content,
  isPinned,
  isArchived,
}) => {
  const dispatch = useAppDispatch();

  const togglePin = () => {
    dispatch(
      updateNoteStatus({
        noteId: _id,
        updates: { isPinned: !isPinned },
      })
    );
  };

  const toggleArchive = () => {
    dispatch(
      updateNoteStatus({
        noteId: _id,
        updates: { isArchived: !isArchived },
      })
    );
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 break-inside-avoid relative hover:shadow-md transition">
      {/* Pin button */}
      <button
        onClick={togglePin}
        className="absolute top-2 right-2 text-gray-500 hover:text-amber-600 transition"
      >
        <MdPushPin size={20} color={isPinned ? "orange" : undefined} />
      </button>

      {title && (
        <h3 className="font-semibold text-gray-800 mb-2 text-lg">{title}</h3>
      )}

      <p className="text-gray-700 whitespace-pre-wrap">{content}</p>

      <div className="flex justify-between items-center mt-3">
        {/* Archive */}
        <button
          onClick={toggleArchive}
          className="text-gray-500 hover:text-blue-600 transition"
        >
          {isArchived ? <MdUnarchive size={20} /> : <MdArchive size={20} />}
        </button>

        {/* Delete (we'll implement later) */}
        <button className="text-gray-500 hover:text-red-500 transition">
          <MdDelete size={20} />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
