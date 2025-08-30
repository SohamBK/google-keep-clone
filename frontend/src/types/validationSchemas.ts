import { z } from "zod";

//validation schema for the registration form
export const registerFormSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .min(1, "Password is required."),
});

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .min(1, "Password is required."),
});

export type RegisterFormInputs = z.infer<typeof registerFormSchema>;
export type LoginFormInputs = z.infer<typeof loginFormSchema>;
