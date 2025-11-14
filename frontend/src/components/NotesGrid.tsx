import React from "react";
import { useAppSelector } from "../app/hooks";
import NoteCard from "./NoteCard";

const NotesGrid: React.FC = () => {
  const notes = useAppSelector((state) => state.notes.items);

  // Filter notes
  const pinned = notes.filter((n) => n.isPinned && !n.isArchived);
  const others = notes.filter((n) => !n.isPinned && !n.isArchived);

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      {/* ------------------- PINNED NOTES ------------------- */}
      {pinned.length > 0 && (
        <>
          <h2 className="text-gray-600 text-sm font-medium mb-3 pl-1">
            PINNED
          </h2>

          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mb-8">
            {pinned.map((note) => (
              <div key={note._id} className="mb-4">
                <NoteCard {...note} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ------------------- OTHER NOTES ------------------- */}
      {others.length > 0 && (
        <>
          {pinned.length > 0 && (
            <h2 className="text-gray-600 text-sm font-medium mb-3 pl-1">
              OTHERS
            </h2>
          )}

          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {others.map((note) => (
              <div key={note._id} className="mb-4">
                <NoteCard {...note} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ------------------- EMPTY STATE ------------------- */}
      {pinned.length === 0 && others.length === 0 && (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No notes yet.
        </div>
      )}
    </div>
  );
};

export default NotesGrid;
