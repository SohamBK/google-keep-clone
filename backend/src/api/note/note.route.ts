// src/api/v1/auth/auth.route.ts
import { Router } from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "./note.controller";
import { validateCreateNote, validateUpdateNote } from "./note.joi";
import authMiddleware from "src/middleware/auth.middleware";

const notesRouter = Router();

notesRouter.post("/", authMiddleware, validateCreateNote, createNote);
notesRouter.get("/", authMiddleware, getAllNotes);
notesRouter.get("/:id", authMiddleware, getNoteById);
notesRouter.put("/:id", authMiddleware, validateUpdateNote, updateNote);

export default notesRouter;
