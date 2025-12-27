import React from "react";
import { MdDelete, MdPushPin, MdArchive, MdUnarchive } from "react-icons/md";
import { useAppDispatch } from "../app/hooks";
import { openViewNote } from "../features/ui/uiSlice";
import {
  updateNoteStatus,
  deleteNoteForever,
  restoreNote,
  softDeleteNote,
} from "../features/notes/notesThunks";

interface Props {
  _id: string;
  title?: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  mode?: "normal" | "archive" | "trash";
}

const NoteCard: React.FC<Props> = ({
  _id,
  title,
  content,
  tags,
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

  const handleSoftDelete = () => {
    dispatch(softDeleteNote(_id)); // ✅ NEW
  };

  const handleRestore = () => {
    dispatch(restoreNote(_id));
  };

  const handleDeleteForever = () => {
    dispatch(deleteNoteForever(_id));
  };

  const handleView = () => {
    dispatch(
      openViewNote({
        _id,
        title,
        content,
        tags,
        isPinned,
        isArchived,
      } as any)
    );
  };

  return (
    <div
      onClick={handleView}
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
          onClick={(e) => {
            e.stopPropagation();
            togglePin();
          }}
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
      {content ? (
        <p className="text-gray-700 whitespace-pre-wrap">
          {content.length > 25 ? `${content.slice(0, 25)}...` : content}
        </p>
      ) : (
        <p className="text-gray-500">No content available</p>
      )}

      {/*------------------- Labels -------------------*/}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="
          text-xs px-2 py-0.5
          bg-gray-100 text-gray-700
          rounded-full
        "
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ------------------- ACTIONS ------------------- */}
      <div className="mt-4 flex justify-between items-center">
        {/* ---------- TRASH MODE ---------- */}
        {mode === "trash" ? (
          <div className="w-full flex justify-between text-sm font-medium">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestore();
              }}
              className="text-gray-600 hover:text-green-600 transition"
            >
              Restore
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteForever();
              }}
              className="text-gray-600 hover:text-red-600 transition"
            >
              Delete Forever
            </button>
          </div>
        ) : (
          <>
            {/* Archive / Unarchive */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchive();
              }}
              className="text-gray-500 hover:text-blue-600 transition"
            >
              {isArchived ? <MdUnarchive size={20} /> : <MdArchive size={20} />}
            </button>

            {/* Move to Trash (Soft Delete) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSoftDelete();
              }}
              className="text-gray-500 hover:text-red-500"
            >
              <MdDelete size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
