import React from "react";
import { useAppSelector } from "../app/hooks";
import NoteCard from "./NoteCard";
import { type Note } from "../features/notes/types";

interface NotesGridProps {
  notes?: Note[];
  showSections?: boolean;
  mode?: "normal" | "archive" | "trash";
}

const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  showSections = true,
  mode = "normal",
}) => {
  // Core notes state
  const pinned = useAppSelector((state) => state.notes.pinned);
  const others = useAppSelector((state) => state.notes.items);

  // Search state
  const searchResults = useAppSelector((state) => state.notes.searchResults);

  // If notes prop exists → use it (archive / trash pages)
  const allNotes = notes ?? others;

  const isSearchActive = searchResults.length > 0;

  /* ======================================================
     SEARCH MODE (overrides everything else)
     ====================================================== */
  if (isSearchActive) {
    return (
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {searchResults.map((note) => (
            <div key={note._id} className="mb-4">
              <NoteCard {...note} />
            </div>
          ))}
        </div>

        {searchResults.length === 0 && (
          <div className="text-center text-gray-500 mt-20 text-lg">
            No notes found.
          </div>
        )}
      </div>
    );
  }

  /* ======================================================
     ARCHIVE / TRASH PAGES (no pinned/others sections)
     ====================================================== */
  if (!showSections) {
    return (
      <div className="max-w-6xl mx-auto mt-8 px-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {allNotes.map((note) => (
          <div key={note._id} className="mb-4">
            <NoteCard {...note} mode={mode} />
          </div>
        ))}

        {allNotes.length === 0 && (
          <div className="text-center text-gray-500 mt-20 text-lg">
            No notes available.
          </div>
        )}
      </div>
    );
  }

  /* ======================================================
     DASHBOARD PAGE (Pinned + Others)
     ====================================================== */
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
