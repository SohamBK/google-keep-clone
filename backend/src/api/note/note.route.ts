// src/api/v1/auth/auth.route.ts
import { Router } from "express";
import { createNote, getAllNotes, getNoteById } from "./note.controller";
import { validateCreateNote } from "./note.joi";
import authMiddleware from "src/middleware/auth.middleware";

const notesRouter = Router();

notesRouter.post("/", authMiddleware, validateCreateNote, createNote);
notesRouter.get("/", authMiddleware, getAllNotes);
notesRouter.get("/:id", authMiddleware, getNoteById);

export default notesRouter;
