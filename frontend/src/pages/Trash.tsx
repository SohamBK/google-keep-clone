import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchTrashNotes } from "../features/notes/notesThunks";
import NotesGrid from "../components/NotesGrid";

const Trash: React.FC = () => {
  const dispatch = useAppDispatch();

  const { trash, trashHasNextPage, trashPage } = useAppSelector(
    (state) => state.notes
  );

  useEffect(() => {
    dispatch(fetchTrashNotes({ page: 1, limit: 10 }));
  }, [dispatch]);

  const loadMore = () => {
    dispatch(fetchTrashNotes({ page: trashPage + 1, limit: 10 }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Trash</h2>

      <NotesGrid notes={trash} showSections={false} mode="trash" />

      {trashHasNextPage && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Trash;
