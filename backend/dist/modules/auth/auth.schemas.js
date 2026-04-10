import { z } from "zod";
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    rememberMe: z.boolean().optional(),
});
export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});
export const ResetPasswordSchema = z.object({
    token: z.string().min(8),
    newPassword: z.string().min(6),
});
