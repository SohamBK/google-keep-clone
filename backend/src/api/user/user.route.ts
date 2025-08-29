// src/api/v1/auth/auth.route.ts
import { Router } from "express";
import { getUserProfile } from "./user.controller";
import authMiddleware from "src/middleware/auth.middleware";

const authRouter = Router();

authRouter.get("/user-profile", authMiddleware, getUserProfile);

export default authRouter;
