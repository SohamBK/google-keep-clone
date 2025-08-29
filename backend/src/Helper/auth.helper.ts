// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../models/user.model";
import logger from "../common/utils/logger";

interface TokenPayload {
  id: string;
}

export const generateAndSetTokens = (res: Response, user: IUser) => {
  if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    logger.fatal(
      "JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables."
    );
    throw new Error("Token secrets are not configured.");
  }

  // Generate a short-lived access token
  const accessToken = jwt.sign(
    { id: user._id } as TokenPayload,
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  // Generate a long-lived refresh token
  const refreshToken = jwt.sign(
    { id: user._id } as TokenPayload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Set refresh token in an HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken };
};
