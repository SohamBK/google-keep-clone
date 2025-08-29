// src/common/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../common/utils/responseHandler";
import logger from "../common/utils/logger";
import { generateAndSetTokens } from "../Helper/auth.helper";
import User, { IUser } from "../models/user.model";

// Extend the Request object to add a 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

interface DecodedToken {
  id: string;
  exp: number;
}

// Middleware to protect routes
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Authorization token missing or invalid.", 401);
    }

    const accessToken = authHeader.split(" ")[1];

    // 1. Verify Access Token
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    req.user = { id: decoded.id };
    next();
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn("Access token expired. Attempting to refresh...");

      // 2. Access token is expired, check for refresh token in cookie
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        logger.warn("Refresh token missing from cookie.");
        return sendError(
          res,
          "Access token expired and no refresh token provided.",
          401
        );
      }

      try {
        // 3. Verify Refresh Token
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET as string
        ) as DecodedToken;

        // Find user to ensure refresh token is valid
        const user = await User.findById(decodedRefresh.id);
        if (!user) {
          logger.warn(
            `Refresh token rejected: User ID ${decodedRefresh.id} not found.`
          );
          return sendError(res, "Invalid refresh token.", 401);
        }

        // 4. Generate new tokens and set them
        const { accessToken } = generateAndSetTokens(res, user as IUser);

        // 5. Attach new token to request and proceed
        req.user = { id: user._id.toString() };
        res.setHeader("X-New-Access-Token", accessToken);
        logger.info(`New access token issued for user ${user._id}`);

        next();
      } catch (refreshError: any) {
        logger.error(`Invalid refresh token ${refreshError.message}`);
        return sendError(
          res,
          "Invalid or expired refresh token. Please log in again.",
          401
        );
      }
    } else {
      logger.error(`Invalid access token ${error.message}`);
      sendError(res, "Invalid token. Please log in again.", 401);
    }
  }
};

export default authMiddleware;
