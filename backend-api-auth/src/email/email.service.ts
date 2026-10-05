import { Injectable } from "@nestjs/common";
import nodemailer, { type Transporter } from "nodemailer";

@Injectable()
export class EmailService {
  private transporter?: Transporter;

  private getTransporter(): Transporter {
    if (this.transporter) return this.transporter;
    const host = process.env.SMTP_HOST;
    if (!host) throw new Error("SMTP_HOST is required to send account credentials");
    const port = Number(process.env.SMTP_PORT ?? 587);
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true",
      ...(process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } }
        : {}),
    });
    return this.transporter;
  }

  async sendGeneratedPassword(email: string, name: string, password: string, subject: string) {
    await this.getTransporter().sendMail({
      from: process.env.SMTP_FROM ?? "GMS <no-reply@localhost>",
      to: email,
      subject,
      text: `สวัสดี ${name}\n\nรหัสผ่านชั่วคราวสำหรับเข้า Gemstone Management System: ${password}\n\nหลังเข้าสู่ระบบ คุณสามารถเปลี่ยนรหัสผ่านได้ที่ Settings > Profile\nหากคุณไม่ได้ร้องขอข้อความนี้ โปรดติดต่อผู้ดูแลระบบ`,
      html: `<p>สวัสดี ${escapeHtml(name)}</p><p>รหัสผ่านชั่วคราวสำหรับเข้า Gemstone Management System:</p><p><strong>${escapeHtml(password)}</strong></p><p>หลังเข้าสู่ระบบ คุณสามารถเปลี่ยนรหัสผ่านได้ที่ Settings &gt; Profile</p><p>หากคุณไม่ได้ร้องขอข้อความนี้ โปรดติดต่อผู้ดูแลระบบ</p>`,
    });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}
