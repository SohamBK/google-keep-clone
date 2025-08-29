// src/api/v1/auth/auth.validation.ts
import Joi from "joi";
import { validate } from "../../common/middleware/validation.middleware";

// Joi schema for user registration
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

// Joi schema for user login
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    // No min length here for login, just required
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

// Middleware for validating registration request body
export const validateRegister = validate(registerSchema);

// Middleware for validating login request body
export const validateLogin = validate(loginSchema);
