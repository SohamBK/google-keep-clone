// src/api/v1/auth/auth.route.ts
import { Router } from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  moveNoteToTrash,
  updateNoteStatus,
  addTagsToNote,
  removeTagsFromNote,
  addCollaboratorsToNote,
  removeCollaboratorsFromNote,
  getAllPinnedNotes,
  getAllArchivedNotes,
  getAllTrashNotes,
  restoreNoteFromTrash,
  permanentlyDeleteNote,
} from "./note.controller";
import {
  validateCreateNote,
  validateUpdateNote,
  validateUpdateStatus,
  validateTags,
  validateCollaborators,
  validateRemoveCollaborators,
} from "./note.joi";
import authMiddleware from "src/middleware/auth.middleware";

const notesRouter = Router();

notesRouter.post("/", authMiddleware, validateCreateNote, createNote);
notesRouter.get("/", authMiddleware, getAllNotes);
notesRouter.get("/pinned", authMiddleware, getAllPinnedNotes);
notesRouter.get("/archived", authMiddleware, getAllArchivedNotes);
notesRouter.get("/trash", authMiddleware, getAllTrashNotes);
notesRouter.get("/:id", authMiddleware, getNoteById);
notesRouter.put("/:id", authMiddleware, validateUpdateNote, updateNote);
notesRouter.delete("/:id", authMiddleware, moveNoteToTrash);
notesRouter.patch(
  "/:id/status",
  authMiddleware,
  validateUpdateStatus,
  updateNoteStatus
);
notesRouter.patch("/:id/tags", authMiddleware, validateTags, addTagsToNote);
notesRouter.delete(
  "/:id/tags",
  authMiddleware,
  validateTags,
  removeTagsFromNote
);

notesRouter.patch(
  "/:id/collaborators",
  authMiddleware,
  validateCollaborators,
  addCollaboratorsToNote
);

notesRouter.delete(
  "/:id/collaborators",
  authMiddleware,
  validateRemoveCollaborators,
  removeCollaboratorsFromNote
);

notesRouter.patch("/:id/restore", authMiddleware, restoreNoteFromTrash);
notesRouter.delete(
  "/:id/permanent-delete",
  authMiddleware,
  permanentlyDeleteNote
);

export default notesRouter;
