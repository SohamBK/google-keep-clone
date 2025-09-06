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
} from "./note.controller";
import {
  validateCreateNote,
  validateUpdateNote,
  validateUpdateStatus,
  validateTags,
} from "./note.joi";
import authMiddleware from "src/middleware/auth.middleware";

const notesRouter = Router();

notesRouter.post("/", authMiddleware, validateCreateNote, createNote);
notesRouter.get("/", authMiddleware, getAllNotes);
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

export default notesRouter;
