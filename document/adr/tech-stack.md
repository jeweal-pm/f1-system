# Tech Stack

- **Last updated:** 2026-10-04
- **Owner:** Project team
- **Status:** Initial implementation aligned with accepted ADRs

ตารางนี้สรุป stack ที่ใช้งานใน monorepo ปัจจุบัน การเปลี่ยน core stack ต้องมี ADR และแก้เอกสารนี้พร้อม code ใน PR เดียวกัน

## Runtime และสถาปัตยกรรม

| หมวด | เทคโนโลยี | ขอบเขต |
|---|---|---|
| Runtime | Node.js 24.11.0 | `.nvmrc`; ใช้ pnpm 10.22.0 |
| Language | TypeScript 5.9, strict | frontend และ backend |
| Repository | pnpm monorepo | หนึ่ง repository สำหรับ frontend และ backend |
| Architecture | Microservices | NestJS gateway และ domain services; เริ่มจาก auth service |
| Network boundary | tRPC สำหรับ frontend app data; REST สำหรับ CRM integration และ Better Auth | ห้าม frontend เรียก internal service ตรง |
| Database | PostgreSQL 18.6 หรือ compatible | แบ่ง schema และเจ้าของข้อมูลตาม service |
| ORM | Prisma 7 | ใช้ Prisma Client และ committed migrations |

เหตุผลการตัดสินใจอยู่ใน [ADR-0001](0001-record-architecture-decisions.md), [ADR-0002](0002-use-typescript.md),
[ADR-0003](0003-use-postgresql.md), [ADR-0004 Frontend](0004-use-Nextjs-tanstack-for-Frontend.md),
[ADR-0006](0006-use-prisma-orm.md), [ADR-0007](0007-trpc-procedure.md) และ [ADR-0008](0008-use-better-auth.md)

## Core libraries

| หน้าที่ | เลือกใช้ | หมายเหตุ |
|---|---|---|
| Frontend | Next.js 16 App Router, React 19 | ดู ADR-0004 Frontend |
| Styling | Tailwind CSS 4 | ใช้ utility classes; CSS เพิ่มเฉพาะกรณี custom จริง ([ADR-0005](0005-use-tailwild-for-css-styling)) |
| Server state | TanStack Query 5 + tRPC 11 | ไม่เรียก internal API ด้วย fetch/axios จาก feature code |
| Form | react-hook-form + Zod 4 | validation ฝั่ง client และ server |
| Authentication | Better Auth 1.7 | email/password, Argon2id, secure session cookie |
| Database client | Prisma 7 + PostgreSQL adapter | migration เป็นแหล่ง schema change |
| Logging | NestJS Logger / structured logs | ห้าม log password, credential หรือ API key |
| Email | SMTP; Mailpit สำหรับ local | production ต้องกำหนด SMTP provider |

## Development และ deployment

| หมวด | เครื่องมือ |
|---|---|
| Package manager | pnpm 10.22.0; ห้ามสร้าง npm/yarn lockfile |
| Lint / format | ESLint, Prettier |
| Unit / integration | ยังไม่มี test runner; เพิ่ม Vitest เมื่อเริ่มทำชุดทดสอบ |
| UI / E2E | ยังไม่มี browser automation; เพิ่ม Playwright เมื่อเริ่มทำ E2E suite |
| Local dependencies | Docker Compose: PostgreSQL และ Mailpit |
| Production | Docker Compose เป็น baseline สำหรับเริ่มระบบ; แยก environment และ secret ก่อน deploy |
| Production capacity | Host 8 GB RAM / 4 vCPU; Compose service limits รวมตั้งต้นไม่เกิน 3 vCPU / 5.3 GB เพื่อกัน headroom ให้ OS และ Docker |

## Cookie และ consent

ปัจจุบันใช้เฉพาะ cookie session ที่จำเป็นต่อการเข้าสู่ระบบตาม Better Auth ไม่มี analytics หรือ marketing tracking จึงยังไม่มี consent banner หรือ consent log หากจะเพิ่ม cookie/script ที่ไม่จำเป็น ต้องทบทวน [ADR-0009](0009-cookie-consent-approach.md) และ [Cookie & Consent Spec](../spec/0004-cookie-and-consent.md) กับ DPO/privacy owner ก่อนเปิดใช้

## เรื่องที่ต้องตัดสินใจก่อน production

- กำหนด SMTP จริงและทดสอบการส่ง/ส่งซ้ำ/การกู้คืนเมื่อส่งไม่สำเร็จ
- เปลี่ยน `AUTH_SECRET`, `CRM_API_KEY` และฐานข้อมูลเป็น secrets ที่จัดการภายนอก repository
- ให้ DPO ทบทวน consent banner และ privacy notice ก่อนเพิ่ม third-party cookies หรือ analytics
- ใช้ policy ล็อกบัญชีตาม [ADR-0012](0012-change-flow-login.md)
- ระบุ deployment topology, TLS termination, backup/restore และ monitoring สำหรับทุก service
- กำหนด trusted ingress/client-IP header สำหรับ rate limit; ห้ามรับ forwarded IP จาก client โดยตรง
