import React from "react";
import { MdDelete, MdPushPin, MdArchive, MdUnarchive } from "react-icons/md";
import { useAppDispatch } from "../app/hooks";
import {
  updateNoteStatus,
  deleteNoteForever,
  restoreNote,
} from "../features/notes/notesThunks";

interface Props {
  _id: string;
  title?: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  mode?: "normal" | "archive" | "trash";
}

const NoteCard: React.FC<Props> = ({
  _id,
  title,
  content,
  isPinned,
  isArchived,
  mode = "normal",
}) => {
  const dispatch = useAppDispatch();

  // --- Actions ---
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

  const handleRestore = () => {
    dispatch(restoreNote(_id));
  };

  const handleDeleteForever = () => {
    dispatch(deleteNoteForever(_id));
  };

  return (
    <div
      className="
      bg-white border border-gray-200 rounded-xl p-4
      shadow-sm hover:shadow-md 
      transition-all cursor-pointer break-inside-avoid
      relative
    "
    >
      {/* ------------------- PIN BUTTON ------------------- */}
      {mode !== "trash" && (
        <button
          onClick={togglePin}
          className="
          absolute top-2 right-2
          text-gray-500 hover:text-yellow-600
          transition
        "
        >
          <MdPushPin size={20} className={isPinned ? "text-yellow-600" : ""} />
        </button>
      )}

      {/* ------------------- TITLE ------------------- */}
      {title && (
        <h3 className="font-semibold text-gray-800 mb-2 text-lg">{title}</h3>
      )}

      {/* ------------------- CONTENT ------------------- */}
      {content && (
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      )}

      {/* ------------------- ACTIONS ------------------- */}
      <div className="mt-4 flex justify-between items-center">
        {/* ---------- TRASH MODE ---------- */}
        {mode === "trash" ? (
          <div className="w-full flex justify-between text-sm font-medium">
            <button
              onClick={handleRestore}
              className="text-gray-600 hover:text-green-600 transition"
            >
              Restore
            </button>

            <button
              onClick={handleDeleteForever}
              className="text-gray-600 hover:text-red-600 transition"
            >
              Delete Forever
            </button>
          </div>
        ) : (
          <>
            {/* Archive / Unarchive */}
            <button
              onClick={toggleArchive}
              className="text-gray-500 hover:text-blue-600 transition"
            >
              {isArchived ? <MdUnarchive size={20} /> : <MdArchive size={20} />}
            </button>

            {/* Move to Trash (Soft Delete) */}
            <button className="text-gray-500 hover:text-red-500 transition">
              <MdDelete size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
