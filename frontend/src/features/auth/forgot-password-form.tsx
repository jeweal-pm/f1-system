"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, type ForgotPasswordValues } from "./schemas";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [requestError, setRequestError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    setBusy(true);
    setSent(false);
    setRequestError("");
    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.status === 429) {
        setRequestError("ส่งคำขอบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่");
      } else if (!response.ok) {
        setRequestError("ยังส่งคำขอไม่ได้ กรุณาลองใหม่อีกครั้ง");
      } else {
        setSent(true);
      }
    } catch {
      setRequestError("ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setBusy(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-sm leading-6 text-[#687887]">กรอกอีเมลที่ใช้เข้าสู่ระบบ เราจะส่งรหัสผ่านใหม่ให้หากอีเมลนี้มีบัญชีอยู่</p>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-[#465661]" htmlFor="email">อีเมล</label>
        <input id="email" autoComplete="email" type="email" {...register("email")} className="h-10 w-full rounded border border-[#d9e1e5] px-3 text-sm outline-none focus:border-[#00817b] focus:ring-2 focus:ring-[#00817b]/15" placeholder="name@company.com" />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      {sent && <p role="status" className="rounded bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-800">หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งรหัสผ่านใหม่ไปให้แล้ว</p>}
      {requestError && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">{requestError}</p>}
      <button type="submit" disabled={busy} className="h-11 w-full rounded bg-[#006d68] text-sm font-semibold text-white hover:bg-[#005a56] disabled:opacity-65">{busy ? "กำลังส่ง…" : "ส่งรหัสผ่านใหม่"}</button>
      <Link href="/login" className="block text-center text-xs font-medium text-[#1477db] hover:underline">กลับไปหน้าเข้าสู่ระบบ</Link>
    </form>
  );
}
