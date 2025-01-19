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
