// src/api/v1/auth/auth.route.ts
import { Router } from "express";
import { register, login, logout } from "./auth.controller";
import { validateRegister, validateLogin } from "./auth.joi";

const authRouter = Router();

authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);
authRouter.post("/logout", logout);

export default authRouter;
