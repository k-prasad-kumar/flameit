import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(4, "Full Name is required"),
  username: z.string().min(4, "Username is required"),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(8, "Password must contain at least 8 character(s)"),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(8, "Password must contain at least 8 character(s)"),
});

export const MissingSchema = z.object({
  username: z.string().min(4, "Username is required"),
});

export const EditProfileSchema = z.object({
  name: z
    .string()
    .min(4, "Full Name is required")
    .max(20, "Full name too long max 20 character(s)"),
  username: z
    .string()
    .min(4, "Username is required")
    .max(20, "Username too long max 20 character(s)"),
  bio: z.string().optional(),
  gender: z.string().optional(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(4, "Current Password is required"),
    newPassword: z.string().min(4, "New Password is required"),
    confirmPassword: z.string().min(4, "confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords doesn't match",
    path: ["confirmPassword"], // path of error
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message:
      "New password cannot be the same as the current password. Please choose a different password.",
    path: ["newPassword"], // path of error
  });
