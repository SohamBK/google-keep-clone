import mongoose from "mongoose";
import { Request, Response } from "express";
import logger from "../../common/utils/logger";
import { sendSuccess, sendError } from "../../common/utils/responseHandler";

export const health = async (req: Request, res: Response) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;

  if (!isDatabaseConnected) {
    logger.error("Health check failed: Database connection is down.");
    return sendError(
      res,
      "Health check failed. Database is not connected.",
      503,
      { database: "down" }
    );
  }

  const healthInfo = {
    uptime: process.uptime(),
    database: {
      status: "up",
    },
  };

  logger.info("Health check passed.");
  sendSuccess(res, "Health check passed.", healthInfo, 200);
};
