"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { credentialsSchema, type CredentialsValues } from "./schemas";

const demoAccounts = process.env.NODE_ENV === "development"
  ? [
      { label: "Super Admin", email: "superadmin@demo.com", password: "password123", highlighted: true },
      { label: "User", email: "user@demo.com", password: "password123", highlighted: false },
    ]
  : [];

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CredentialsValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: demoAccounts.length > 0 ? { email: demoAccounts[0]!.email, password: demoAccounts[0]!.password } : undefined,
  });

  useEffect(() => {
    const demoAccount = demoAccounts[0];
    if (!demoAccount) return;
    setValue("email", demoAccount.email);
    setValue("password", demoAccount.password);
  }, [setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    setSubmitting(true);
    try {
      const result = await authClient.signIn.email({ email: values.email, password: values.password, rememberMe });
      if (result.error) {
        setServerError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setServerError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {demoAccounts.map((account) => (
        <button
          key={account.email}
          type="button"
          onClick={() => {
            setValue("email", account.email, { shouldValidate: true });
            setValue("password", account.password, { shouldValidate: true });
          }}
          className={`flex min-h-[84px] w-full items-start gap-4 rounded-xl px-5 py-4 text-left text-[16px] leading-6 text-[#31515d] transition hover:ring-2 hover:ring-[#54bfd7]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#45b7d0] ${account.highlighted ? "bg-[#d9f2fa]" : "bg-[#f5f5f7]"}`}
        >
          <span aria-hidden="true" className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[#55bed6] text-[12px] font-bold text-[#55bed6]">i</span>
          <span><span>Use Email : <strong>{account.email}</strong></span><br /><span>Password : <strong>{account.password}</strong></span></span>
        </button>
      ))}

      <div className="relative mt-[27px] space-y-1">
        <label className="absolute left-5 top-2 text-[13px] leading-4 text-[#89949a]" htmlFor="email">Email</label>
        <input id="email" autoComplete="username" type="email" {...register("email")} defaultValue={demoAccounts[0]?.email ?? ""} className="h-[64px] w-full rounded-xl border border-transparent bg-[#eeeeef] px-5 pt-[17px] text-[16px] text-[#283942] outline-none transition focus:border-[#00817b] focus:ring-2 focus:ring-[#00817b]/15" />
        {errors.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <div className="relative">
          <label className="absolute left-5 top-2 text-[13px] leading-4 text-[#89949a]" htmlFor="password">Password</label>
          <input id="password" autoComplete="current-password" type={showPassword ? "text" : "password"} {...register("password")} defaultValue={demoAccounts[0]?.password ?? ""} className="h-[64px] w-full rounded-xl border border-transparent bg-[#eeeeef] px-5 pr-14 pt-[17px] text-[16px] text-[#283942] outline-none transition focus:border-[#00817b] focus:ring-2 focus:ring-[#00817b]/15" />
          <button aria-label={showPassword ? "Hide password" : "Show password"} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-[#8da0a6] hover:text-[#283942]">
            {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </div>
        {errors.password && <p className="px-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div className="mt-8 flex items-center justify-between pt-1 text-[15px]">
        <label className="flex items-center gap-2.5 text-[#657681]"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="size-5 rounded border border-[#cbdce2] accent-[#007570]" /> Remember this device</label>
        <Link href="/forgot-password" className="font-medium text-[#4289f5] hover:underline">Forgot Password?</Link>
      </div>
      {serverError && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}
      <button disabled={submitting} type="submit" className="mt-[19px] h-[64px] w-full rounded-xl bg-[#006d70] text-[17px] font-semibold text-white shadow-sm transition hover:bg-[#005a5d] disabled:cursor-wait disabled:opacity-65">
        {submitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
