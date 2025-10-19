// src/models/user.model.ts
import { Schema, model, Document, HydratedDocument, Model } from "mongoose";
import bcrypt from "bcryptjs";

// 1. Define an interface for the User document
export interface IUser {
  _id: string;
  email: string;
  password?: string; // optional now (google users may not have one)
  googleId?: string;
  provider?: "local" | "google";
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser>;
export interface IUserModel extends Model<IUser> {}

// 2. Define the User Schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
      // NOT required - because Google users may not have it
    },
    googleId: { type: String, index: true, unique: false },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 3. Pre-save hook to hash password before saving
userSchema.pre<UserDocument>("save", async function (next) {
  // only hash when password present and modified
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 4. Method to compare password (for login)
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // this.password may be undefined here but compare will return false
  return bcrypt.compare(candidatePassword, this.password || "");
};

// 5. Create and export the User model
const User = model<IUser, IUserModel>("User", userSchema);
export default User;
