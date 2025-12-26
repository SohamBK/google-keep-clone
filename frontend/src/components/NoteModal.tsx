import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { closeViewNote } from "../features/ui/uiSlice";
import { updateNote } from "../features/notes/notesThunks";
import { addNoteTags, removeNoteTags } from "../features/notes/notesThunks";

const NoteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) => state.ui.viewNote);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Populate local state on open
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  if (!note) return null;

  const handleClose = () => {
    // Save only if changed
    if (title !== note.title || content !== note.content) {
      dispatch(
        updateNote({
          noteId: note._id,
          updates: { title, content },
        })
      );
    }

    dispatch(closeViewNote());
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="
              w-full text-lg font-semibold text-gray-800
              outline-none border-none bg-transparent
            "
          />

          <button
            onClick={handleClose}
            className="ml-3 text-gray-500 hover:text-gray-700"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Take a note..."
          rows={6}
          className="
            w-full resize-none outline-none border-none
            text-gray-700 bg-transparent
          "
        />

        {/* Tags Section */}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && tagInput.trim()) {
              dispatch(
                addNoteTags({
                  noteId: note._id,
                  tags: [tagInput.trim()],
                })
              );
              setTagInput("");
            }
          }}
          placeholder="Add label"
          className="
            mt-3 w-full text-sm
            outline-none border-none
            bg-transparent
            text-gray-600
          "
        />

        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags?.map((tag) => (
              <span
                key={tag}
                className="
          flex items-center gap-1
          text-xs px-2 py-0.5
          bg-gray-100 rounded-full
        "
              >
                {tag}
                <button
                  onClick={() =>
                    dispatch(removeNoteTags({ noteId: note._id, tags: [tag] }))
                  }
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteModal;
