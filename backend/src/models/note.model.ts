import { Schema, model, Document, Types } from "mongoose";

// Define an interface for the Collaborator sub-document
interface ICollaborator {
  userId: Types.ObjectId;
  email: string;
  permission: "read" | "write";
}

// Define an interface for the Note document
export interface INote extends Document {
  owner: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  backgroundColor: string;
  collaborators: ICollaborator[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose Note Schema
const noteSchema = new Schema<INote>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    tags: [String],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "#ffffff",
    },
    collaborators: [
      {
        _id: false,
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        email: {
          type: String,
        },
        permission: {
          type: String,
          enum: ["read", "write"],
          default: "read",
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create and export the Note model
const Note = model<INote>("Note", noteSchema);
export default Note;
