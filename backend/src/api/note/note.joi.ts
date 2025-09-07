import Joi from "joi";
import { validate } from "../../common/middleware/validation.middleware";

export const createNoteSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required.",
    "any.required": "Title is required.",
  }),
  content: Joi.string().allow("").messages({
    "string.min": "Content must be at least 6 characters long.",
  }),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).optional().messages({
    "string.min": "Title must be at least 1 character long.",
  }),
  content: Joi.string().min(6).optional().messages({
    "string.min": "Content must be at least 6 character long.",
  }),
});

export const updateStatusSchema = Joi.object({
  isPinned: Joi.boolean().optional(),
  isArchived: Joi.boolean().optional(),
});

export const tagsSchema = Joi.object({
  tags: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
    "array.base": "Tags must be an array of strings.",
    "array.min": "At least one tag is required.",
  }),
})
  .required()
  .messages({
    "any.required": "Tags field is required.",
  });

export const colaboratoresSchema = Joi.object({
  collaborators: Joi.array()
    .items(
      Joi.object({
        email: Joi.string().email().required().messages({
          "string.email": "Each collaborator must have a valid email address.",
          "any.required": "Email is required for each collaborator.",
        }),
        permission: Joi.string()
          .valid("read", "write")
          .default("read")
          .messages({
            "any.only": "Permission must be either 'read' or 'write'.",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Collaborators must be an array of objects.",
      "array.min": "At least one collaborator is required.",
    }),
})
  .required()
  .messages({
    "any.required": "Collaborators field is required.",
  });

export const removeCollaboratorsSchema = Joi.object({
  collaborators: Joi.array()
    .items(Joi.string().email().required())
    .min(1)
    .required()
    .messages({
      "array.base": "Collaborators must be an array of email strings.",
      "array.min": "At least one collaborator email is required.",
      "string.email": "Each collaborator must be a valid email address.",
      "any.required": "Collaborators field is required.",
    }),
});

export const validateCreateNote = validate(createNoteSchema);
export const validatePagination = validate(paginationSchema);
export const validateUpdateNote = validate(updateNoteSchema);
export const validateUpdateStatus = validate(updateStatusSchema);
export const validateTags = validate(tagsSchema);
export const validateCollaborators = validate(colaboratoresSchema);
export const validateRemoveCollaborators = validate(removeCollaboratorsSchema);
