import { Request, Response } from "express";
import { sendError, sendSuccess } from "src/common/utils/responseHandler";
import logger from "../../common/utils/logger";
import Note from "../../models/note.model";
import mongoose from "mongoose";

// api to store notes
export const createNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found in request after authMiddleware.");
      return sendError(res, "User must be authenticated to create notes", 401);
    }

    const { title, content } = req.body;

    const newNote = new Note({
      title,
      content,
      owner: userId,
    });

    const savedNote = await newNote.save();

    logger.info(`Note saved with ID: ${savedNote._id}`);
    // Best practice: Return the created resource
    return sendSuccess(res, "Note created successfully.", savedNote, 201);
  } catch (error: any) {
    logger.error(
      `Error during note creation: ${error.message}\nStack: ${error.stack}`
    );
    return sendError(res, "Failed to create note.", 500);
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User id not found, This is a protected route");
      return sendError(res, "User must be authenticated to view notes", 401);
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find({ owner: userId })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalNotes = await Note.countDocuments({ owner: userId });

    logger.info("Notes retrieved !");
    sendSuccess(
      res,
      "Notes retrieved",
      {
        notes,
        totalNotes,
        page,
        limit,
      },
      200
    );
  } catch (error: any) {
    logger.error(
      `Error during note listing: ${error.message}\nStack: ${error.stack}`
    );
    return sendError(res, "Failed to list notes.", 500);
  }
};

// api to retrieve a single note by id
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route");
      return sendError(res, "User must be authenticated to view notes", 401);
    }

    const noteId = req.params.id;

    // Best Practice: Validate ID format to avoid database errors
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400); // 400 for a bad request
    }

    const note = await Note.findOne({ _id: noteId, owner: userId }).lean();
    if (!note) {
      logger.error(`Note with ID ${noteId} not found for user ${userId}.`);
      return sendError(res, "Note not found.", 404);
    }

    sendSuccess(res, "Note found.", note, 200);
  } catch (error: any) {
    logger.error(
      `Error during get note by id: ${error.message}\nStack: ${error.stack}`
    );
    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }
    return sendError(res, "Failed to get note.", 500);
  }
};
