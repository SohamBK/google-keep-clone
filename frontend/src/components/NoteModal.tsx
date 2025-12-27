import React, { useEffect, useState } from "react";
import { MdOutlinePushPin, MdPushPin } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { closeViewNote } from "../features/ui/uiSlice";
import { updateNoteStatus } from "../features/notes/notesThunks";
import {
  updateNote,
  addNoteTags,
  removeNoteTags,
} from "../features/notes/notesThunks";

const NoteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const note = useAppSelector((state) => state.ui.viewNote);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isPinned, setIsPinned] = useState(false); // UI only for now

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setIsPinned(!!note.isPinned); // safe even if backend not ready
    }
  }, [note]);

  const togglePin = () => {
    dispatch(
      updateNoteStatus({
        noteId: note._id,
        updates: { isPinned: !note.isPinned },
      })
    );
  };

  if (!note) return null;

  const handleClose = () => {
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
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between px-5 pt-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="
              w-full text-lg font-medium
              outline-none border-none
              bg-transparent text-gray-800
            "
          />

          {/* Pin Button */}
          <button
            onClick={() => setIsPinned((p) => !p)}
            className="ml-3 text-gray-500 hover:text-gray-700"
            title="Pin note"
          >
            {isPinned ? (
              <MdPushPin size={22} />
            ) : (
              <MdOutlinePushPin size={22} />
            )}
          </button>
        </div>

        {/* CONTENT */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Take a note..."
          rows={4}
          className="
            mt-3 px-5 w-full resize-none
            outline-none border-none
            bg-transparent text-gray-700 text-sm
          "
        />

        {/* LABELS */}
        <div className="px-5 mt-4">
          {/* Existing labels */}
          {note.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    flex items-center gap-1
                    text-xs px-2 py-1
                    bg-gray-100 rounded-full
                    text-gray-700
                  "
                >
                  {tag}
                  <button
                    onClick={() =>
                      dispatch(
                        removeNoteTags({
                          noteId: note._id,
                          tags: [tag],
                        })
                      )
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add label */}
          <div className="flex items-center gap-2 mt-2">
            {/* Add label text */}
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Add label
            </span>

            {/* Input */}
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
              placeholder="New label"
              className="
      flex-1 text-xs
      outline-none border-none
      bg-transparent
      text-gray-600
      placeholder:text-gray-400
    "
            />

            {/* Add button */}
            <button
              onClick={() => {
                if (!tagInput.trim()) return;
                dispatch(
                  addNoteTags({
                    noteId: note._id,
                    tags: [tagInput.trim()],
                  })
                );
                setTagInput("");
              }}
              className="
      text-xs px-2 py-1
      rounded
      text-blue-600
      hover:bg-blue-50
      disabled:text-gray-400
    "
              disabled={!tagInput.trim()}
            >
              Add
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 py-2 mt-2">
          {/* Toolbar (UI only for now) */}
          <div className="flex gap-4 text-gray-500 text-lg">
            {/* <span title="Text options">A</span>
            <span title="Background color">🎨</span>
            <span title="Collaborators">👤</span>
            <span title="Add image">🖼️</span>
            <span title="More">⋮</span> */}
          </div>

          <button
            onClick={handleClose}
            className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
