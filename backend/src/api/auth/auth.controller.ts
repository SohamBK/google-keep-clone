import { Request, Response } from "express";
import User from "../../models/user.model";
import { sendSuccess, sendError } from "src/common/utils/responseHandler";
import logger from "src/common/utils/logger";
import { generateAndSetTokens } from "src/Helper/auth.helper";
// controller for user registration
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(
        `Registration failed: User with email ${email} already exists.`
      );
      sendError(res, "User already exists", 409);
    }

    // create new user
    const newUser = new User({ email, password });
    await newUser.save();

    logger.info("User registered !");
    sendSuccess(
      res,
      "User registered successfully.",
      { userId: newUser._id, email: newUser.email },
      201
    );
  } catch (error: any) {
    logger.error(
      `Error during user registration: ${error.message}\nStack: ${error.stack}`
    );
    sendError(res, "Failed to register user.", 500);
  }
};

// Controller for user login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email }).select("+password"); // Explicitly select password for comparison
    if (!user) {
      logger.warn(`Login failed: User with email ${email} not found.`);
      return sendError(res, "Invalid credentials.", 401); // 401 Unauthorized
    }

    // 2. Compare provided password with stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for user ${email}.`);
      return sendError(res, "Invalid credentials.", 401); // 401 Unauthorized
    }

    // 3. Generate and set access token & refresh token
    const { accessToken } = generateAndSetTokens(res, user);

    logger.info(`User logged in successfully: ${email}`);
    sendSuccess(
      res,
      "User logged in successfully.",
      { userId: user._id, email: user.email, accessToken },
      200
    );
  } catch (error: any) {
    logger.error(
      `Error during user login ${error.message} \nstack trace ${error.stack}`
    );
    sendError(res, "Failed to login user.", 500);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  logger.info("User logged out successfully.");
  sendSuccess(res, "Logout successful.", null);
};
