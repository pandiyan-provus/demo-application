import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
});

export const UserResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
  createdAt: z.string(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;

export type UserResponse = z.infer<typeof UserResponseSchema>;

export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;

export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
