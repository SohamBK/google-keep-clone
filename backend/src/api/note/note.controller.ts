import { Request, Response } from "express";
import { sendError, sendSuccess } from "src/common/utils/responseHandler";
import logger from "../../common/utils/logger";
import Note from "../../models/note.model";
import User from "../../models/user.model";
import mongoose from "mongoose";
import { object } from "joi";
import { CollaboratorObject } from "src/types/note.types";

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

// get all notes
// A reusable function for getting notes with a specific filter and pagination
const getNotesWithFilter = async (
  req: Request,
  res: Response,
  filter: object
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route");
      return sendError(res, "User must be authenticated to view notes", 401);
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { owner: userId, ...filter };

    const notes = await Note.find(query).skip(skip).limit(limit).lean();
    const totalNotes = await Note.countDocuments(query);

    logger.info("Notes retrieved with pagination!");
    return sendSuccess(
      res,
      "Notes retrieved successfully.",
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

// api to retrieve all notes (main view)
export const getAllNotes = (req: Request, res: Response) => {
  return getNotesWithFilter(req, res, { isArchived: false, isDeleted: false });
};

// api to get pinned notes
export const getAllPinnedNotes = (req: Request, res: Response) => {
  return getNotesWithFilter(req, res, {
    isPinned: true,
    isArchived: false,
    isDeleted: false,
  });
};

// api to get all archived notes
export const getAllArchivedNotes = (req: Request, res: Response) => {
  return getNotesWithFilter(req, res, { isArchived: true, isDeleted: false });
};

// get all deleted notes
export const getAllTrashNotes = (req: Request, res: Response) => {
  return getNotesWithFilter(req, res, { isDeleted: true });
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

//update notes
export const updateNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, owner: userId },
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedNote) {
      logger.error(`Note with ID ${noteId} not found for user ${userId}.`);
      return sendError(res, "Note not found.", 404);
    }

    logger.info(`Note with ID ${updatedNote._id} updated successfully.`);
    return sendSuccess(res, "Note updated successfully.", updatedNote, 200);
  } catch (error: any) {
    logger.error(
      `Error during note update: ${error.message}\nStack: ${error.stack}`
    );
    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }
    return sendError(res, "Failed to update note.", 500);
  }
};

// api to soft-delete a note (move to trash)
export const moveNoteToTrash = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, owner: userId },
      { isDeleted: true }, // Set the soft-delete flag
      { new: true }
    ).lean();

    if (!note) {
      logger.error(`Note with ID ${noteId} not found for user ${userId}.`);
      return sendError(res, "Note not found.", 404);
    }

    logger.info(`Note with ID ${note._id} moved to trash.`);
    return sendSuccess(res, "Note moved to trash successfully.", note, 200);
  } catch (error: any) {
    logger.error(
      `Error during note soft-delete: ${error.message}\nStack: ${error.stack}`
    );
    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }
    return sendError(res, "Failed to move note to trash.", 500);
  }
};

// api to update note status (pin/unpin, archive/unarchive)
export const updateNoteStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    //check if req.body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.error("Request body is empty. No status to update.");
      return sendError(res, "No status provided to update.", 400);
    }

    const { isPinned, isArchived } = req.body;
    const updateData: any = {};
    if (typeof isPinned === "boolean") updateData.isPinned = isPinned;
    if (typeof isArchived === "boolean") updateData.isArchived = isArchived;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, owner: userId },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedNote) {
      logger.error(`Note with ID ${noteId} not found for user ${userId}.`);
      return sendError(res, "Note not found.", 404);
    }

    logger.info(`Note with ID ${updatedNote._id} status updated successfully.`);
    return sendSuccess(
      res,
      "Note status updated successfully.",
      updatedNote,
      200
    );
  } catch (error: any) {
    logger.error(
      `Error during note status update: ${error.message}\nStack: ${error.stack}`
    );
    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }
    return sendError(res, "Failed to update note status.", 500);
  }
};

// api to add tags to a note
export const addTagsToNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    const { tags } = req.body;
    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
      logger.error("Invalid tags format. Tags must be an array of strings.");
      return sendError(res, "Tags must be an array of strings.", 400);
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, owner: userId },
      { $addToSet: { tags: { $each: tags } } }, // Add tags without duplicates
      { new: true, runValidators: true }
    ).lean();

    if (!updatedNote) {
      logger.error(`Note with ID ${noteId} not found for user ${userId}.`);
      return sendError(res, "Note not found.", 404);
    }

    logger.info(`Tags added to note with ID ${updatedNote._id} successfully.`);
    return sendSuccess(res, "Tags added successfully.", updatedNote, 200);
  } catch (error: any) {
    logger.error(
      `Error during adding tags to note: ${error.message}\nStack: ${error.stack}`
    );
    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }
    return sendError(res, "Failed to add tags to note.", 500);
  }
};

// api to remove tags from a note
export const removeTagsFromNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    const { tags } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, owner: userId },
      { $pull: { tags: { $in: tags } } },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedNote) {
      logger.error(`Note with ID ${noteId} not found for user ${userId}.`);
      return sendError(res, "Note not found.", 404);
    }

    logger.info(
      `Tags removed from note with ID ${updatedNote._id} successfully.`
    );
    return sendSuccess(res, "Tags removed successfully.", updatedNote, 200);
  } catch (error: any) {
    logger.error(
      `Error during removing tags from note: ${error.message}\nStack: ${error.stack}`
    );
    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }
    return sendError(res, "Failed to remove tags from note.", 500);
  }
};

// add colaboratores to note
export const addCollaboratorsToNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    const { collaborators } = req.body;

    // extract only emails from payload
    const emails = collaborators.map((c: { email: string }) => c.email);

    // check if collaborators exist in user model
    const existingUsers = await User.find({ email: { $in: emails } })
      .select("_id email")
      .lean();

    if (existingUsers.length !== collaborators.length) {
      const existingEmails = existingUsers.map((user) => user.email);
      const invalidEmails = emails.filter(
        (email: string) => !existingEmails.includes(email)
      );
      logger.error(`Invalid collaborator emails: ${invalidEmails.join(", ")}`);
      return sendError(
        res,
        `These emails do not correspond to any user: ${invalidEmails.join(", ")}`,
        400
      );
    }

    // merge permissions from request with user IDs
    const collaboratorObjects = collaborators.map(
      (c: { email: string; permission?: string }) => {
        const user = existingUsers.find((u) => u.email === c.email);
        return {
          userId: user!._id,
          email: user!.email,
          permission: c.permission || "read",
        };
      }
    );

    // deduplicate by userId
    const uniqueCollaborators: CollaboratorObject[] = [
      ...new Map<string, CollaboratorObject>(
        collaboratorObjects.map((c: CollaboratorObject) => [
          c.userId.toString(),
          c,
        ])
      ).values(),
    ];

    // update or insert each collaborator
    for (const c of uniqueCollaborators) {
      const result = await Note.updateOne(
        { _id: noteId, owner: userId, "collaborators.userId": c.userId },
        {
          $set: {
            "collaborators.$.permission": c.permission,
          },
        }
      );

      if (result.matchedCount === 0) {
        // collaborator not found → push new
        await Note.updateOne(
          { _id: noteId, owner: userId },
          { $push: { collaborators: c } }
        );
      }
    }

    const updatedNote = await Note.findOne({
      _id: noteId,
      owner: userId,
    }).lean();

    if (!updatedNote) {
      logger.error(`Note with ID ${noteId} not found for user ${userId}.`);
      return sendError(res, "Note not found.", 404);
    }

    logger.info(
      `Collaborators updated for note with ID ${updatedNote._id} successfully.`
    );
    return sendSuccess(
      res,
      "Collaborators updated successfully.",
      updatedNote,
      200
    );
  } catch (error: any) {
    logger.error(
      `Error during adding collaborators to note: ${error.message}\nStack: ${error.stack}`
    );
    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }
    return sendError(res, "Failed to add collaborators to note.", 500);
  }
};

//api to remove colaboratores from note
export const removeCollaboratorsFromNote = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    const { collaborators } = req.body; // expecting array of emails

    if (!Array.isArray(collaborators) || collaborators.length === 0) {
      return sendError(
        res,
        "At least one collaborator email is required.",
        400
      );
    }

    // find matching users by email
    const existingUsers = await User.find({ email: { $in: collaborators } })
      .select("_id email")
      .lean();

    if (existingUsers.length === 0) {
      logger.error(`No valid collaborators found for removal.`);
      return sendError(res, "No valid collaborators found for removal.", 400);
    }

    // pull each userId from collaborators array
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, owner: userId },
      {
        $pull: {
          collaborators: {
            userId: { $in: existingUsers.map((user) => user._id) },
          },
        },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedNote) {
      logger.error(`Note with ID ${noteId} not found for user ${userId}.`);
      return sendError(res, "Note not found.", 404);
    }

    logger.info(
      `Collaborators removed from note with ID ${updatedNote._id} successfully.`
    );
    return sendSuccess(
      res,
      "Collaborators removed successfully.",
      updatedNote,
      200
    );
  } catch (error: any) {
    logger.error(
      `Error during removing collaborators from note: ${error.message}\nStack: ${error.stack}`
    );

    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }

    return sendError(res, "Failed to remove collaborators from note.", 500);
  }
};

//api to restore deleted notes
export const restoreNoteFromTrash = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, owner: userId, isDeleted: true },
      { isDeleted: false },
      { new: true }
    ).lean();

    if (!note) {
      logger.error(
        `Note with ID ${noteId} not found in trash for user ${userId}.`
      );
      return sendError(res, "Note not found in trash.", 404);
    }

    logger.info(`Note with ID ${note._id} restored from trash.`);
    return sendSuccess(
      res,
      "Note restored from trash successfully.",
      note,
      200
    );
  } catch (error: any) {
    logger.error(
      `Error during note restoration: ${error.message}\nStack: ${error.stack}`
    );

    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }

    return sendError(res, "Failed to restore note from trash.", 500);
  }
};

//api to permanently delete notes from trash
export const permanentlyDeleteNote = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.error("User ID not found, This is a protected route.");
      return sendError(
        res,
        "User must be authenticated to access this route",
        401
      );
    }

    const noteId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      logger.error(`Invalid note ID format: ${noteId}`);
      return sendError(res, "Invalid note ID.", 400);
    }

    const note = await Note.findOneAndDelete({
      _id: noteId,
      owner: userId,
      isDeleted: true,
    }).lean();

    if (!note) {
      logger.error(
        `Note with ID ${noteId} not found in trash for user ${userId}.`
      );
      return sendError(res, "Note not found in trash.", 404);
    }
    logger.info(`Note with ID ${note._id} permanently deleted.`);
    return sendSuccess(res, "Note permanently deleted.", null, 200);
  } catch (error: any) {
    logger.error(
      `Error during permanent note deletion: ${error.message}\nStack: ${error.stack}`
    );

    if (error.name === "CastError") {
      return sendError(res, "Invalid note ID format.", 400);
    }

    return sendError(res, "Failed to permanently delete note.", 500);
  }
};
