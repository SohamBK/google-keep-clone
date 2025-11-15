import React, { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import NoteInput from "../components/NoteInput";
import NotesGrid from "../components/NotesGrid";
import { useAppDispatch } from "../app/hooks";
import { fetchNotes } from "../features/notes/notesThunks";

const Dashboard: React.FC = () => {
  const { hasNextPage, page } = useAppSelector((state) => state.notes);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNotes({ page: 1, limit: 5 }));
  }, [dispatch]);

  const loadMore = () => {
    dispatch(fetchNotes({ page: page + 1, limit: 5 }));
  };

  return (
    <main className="p-6">
      <NoteInput />
      <NotesGrid />
      {hasNextPage && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Load More
          </button>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
