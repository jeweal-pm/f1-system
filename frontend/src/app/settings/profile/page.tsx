"use client";

import { AppShell } from "@/features/home/app-shell";
import { PasswordChangeForm } from "@/features/auth/password-change-form";

export default function ProfileSettingsPage() {
  return <AppShell breadcrumb="Settings"><div className="mx-auto max-w-[760px] px-6 py-10 sm:px-10"><h1 className="text-xl font-semibold">Super Admin Profile</h1><p className="mb-7 mt-1 text-sm text-[#687887]">เปลี่ยนรหัสผ่านของบัญชี</p><PasswordChangeForm /></div></AppShell>;
}
