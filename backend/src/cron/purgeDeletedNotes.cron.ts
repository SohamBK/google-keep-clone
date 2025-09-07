import cron from "node-cron";
import Note from "../models/note.model";
import logger from "../common/utils/logger";
import mongoose from "mongoose";

// Schedule the cron job to run daily at midnight
const startPurgeDeletedNotesJob = () => {
  cron.schedule("0 0 * * *", async () => {
    logger.info("Starting purge of deleted notes...");
    try {
      const thirtyDaysAge = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const result = await Note.deleteMany({
        deleted: true,
        deletedAt: { $lte: thirtyDaysAge },
      });

      logger.info(`Purge completed. Deleted ${result.deletedCount} notes.`);
    } catch (error: any) {
      logger.error("Error during purge of deleted notes:", error);
    }
  });

  logger.info(
    "Purge deleted notes cron job scheduled to run daily at midnight."
  );
};

export default startPurgeDeletedNotesJob;
