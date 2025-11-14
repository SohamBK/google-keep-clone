import React, { useState, useRef } from "react";
import { useAppDispatch } from "../app/hooks";
import { createNote } from "../features/notes/notesThunks";

const NoteInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isExpanded, setExpanded] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setExpanded(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = () => {
    if (!content.trim() && !title.trim()) return;

    dispatch(
      createNote({
        title: title.trim() || undefined,
        content: content.trim(),
      })
    );

    // reset UI
    setTitle("");
    setContent("");
    setExpanded(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full max-w-lg mx-auto bg-white shadow-md rounded-xl p-4 transition-all duration-200"
      onClick={() => setExpanded(true)}
    >
      {isExpanded && (
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-2 text-lg outline-none font-medium"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}

      <textarea
        placeholder="Take a note..."
        className="w-full resize-none outline-none text-gray-700"
        rows={isExpanded ? 3 : 1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {isExpanded && (
        <div className="flex justify-end mt-3">
          <button
            onClick={handleCreate}
            className="px-4 py-1 rounded-lg text-sm bg-amber-500 text-white hover:bg-amber-600 transition"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteInput;
