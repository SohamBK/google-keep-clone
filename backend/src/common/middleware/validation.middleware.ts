// src/common/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from "express";
import Joi, { ValidationErrorItem } from "joi";
import { sendError } from "../utils/responseHandler";
import logger from "../utils/logger";

// Generic validation middleware factory
export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(
        (detail: ValidationErrorItem) => detail.message
      );

      logger.warn(
        `Request validation failed: ${JSON.stringify({
          errors,
          endpoint: req.originalUrl,
        })}`
      );

      return sendError(res, "Validation failed.", 400, errors);
    }
    next();
  };
