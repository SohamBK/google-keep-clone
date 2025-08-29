import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log incoming request
  logger.info(
    {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
    "Incoming request"
  );

  // Log response status code and duration
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
      },
      "Outgoing response"
    );
  });

  next();
};

export default requestLogger;
