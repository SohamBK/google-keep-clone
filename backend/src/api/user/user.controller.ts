// src/api/v1/user/user.controller.ts
import { Request, Response } from "express";
import { sendSuccess, sendError } from "../../common/utils/responseHandler";
import logger from "../../common/utils/logger";
import User from "../../models/user.model";

// Controller to get authenticated user's profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      logger.error("User ID not found in request after authMiddleware.");
      return sendError(res, "Unauthorized: User ID not available.", 401);
    }

    //fetch user data
    const user = await User.findOne({ _id: userId });
    console.log(user);

    const userProfile = {
      user_email: user?.email,
      message: "This is a protected route! You are authenticated.",
    };

    logger.info(`User ${userId} accessed protected profile route.`);
    sendSuccess(res, "User profile data.", userProfile, 200);
  } catch (error: any) {
    logger.error(`Error getting user profile ${error.message}`);
    sendError(res, "Failed to retrieve user profile.", 500);
  }
};
