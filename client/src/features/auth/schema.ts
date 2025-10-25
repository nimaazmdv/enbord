import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Please provide an email address")
    .pipe(z.email("Provided email address is invalid")),
  password: z.string().min(1, "Please provide a password"),
});

export const signupSchema = z
  .object({
    name: z.string().min(1, "Please provide a name"),
    email: z
      .string()
      .min(1, "Please provide an email address")
      .pipe(z.email("Provided email address is invalid")),
    password: z
      .string()
      .min(1, "Please provide a password")
      .min(8, "Passwords must be at least 8 characters"),
    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((arg) => arg.password === arg.passwordConfirm, {
    path: ["passwordConfirm"],
    error: "Passwords do not match",
  });

export const otpSchema = z.object({
  otp: z.string().min(6, "Otps consist of 6 digits"),
});

export type SigninInput = z.infer<typeof signinSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
