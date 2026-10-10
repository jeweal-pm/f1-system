import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().pipe(z.email("กรุณากรอกอีเมลให้ถูกต้อง")),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().pipe(z.email("กรุณากรอกอีเมลให้ถูกต้อง")),
});

export type CredentialsValues = z.infer<typeof credentialsSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
