import mongoose from "mongoose";

export interface CollaboratorObject {
  userId: mongoose.Types.ObjectId;
  email: string;
  permission: string;
}
