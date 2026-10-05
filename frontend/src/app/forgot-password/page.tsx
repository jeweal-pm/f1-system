import { AuthLayout } from "@/features/auth/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return <AuthLayout title="ลืมรหัสผ่าน"><ForgotPasswordForm /></AuthLayout>;
}
