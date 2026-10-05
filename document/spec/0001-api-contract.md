# API Contract: Login & Password Management

- **Status:** Draft; initial implementation contract
- **Last updated:** 2026-10-04

> เมื่อ API นิ่งแล้ว แนะนำให้ย้ายไปเขียนเป็น OpenAPI (`openapi.yaml`) แทนไฟล์นี้

## 1. สร้าง User (เรียกโดย CRM)

`POST /api/v1/users`

- **Auth:** API key ของ CRM (service-to-service) ใน header `X-API-Key`

Request:
```json
{
  "email": "somchai@example.com",
  "name": "Somchai Jaidee",
  "role": "SUPER_ADMIN"
}
```

Response `201 Created`:
```json
{
  "userId": "usr_01HZX...",
  "email": "somchai@example.com",
  "createdAt": "2026-10-04T09:00:00Z"
}
```

> ⚠️ Response **ไม่ส่ง password กลับไปให้ CRM** จนกว่าจะตอบ Q1 ได้ว่าจะแจ้ง credential ทางไหน

| Status | กรณี |
|---|---|
| 400 | ข้อมูลไม่ครบหรือรูปแบบ email ผิด |
| 401 | API key ไม่ถูกต้อง |
| 409 | email นี้มีในระบบแล้ว |

## 2. Login

ใช้ Better Auth ผ่าน same-origin route `/api/auth/*` และ session cookie แบบ HttpOnly/Secure/SameSite=Lax
ตาม [ADR Better Auth](../adr/0008-use-better-auth.md) แทน access token ใน response ด้านล่าง
Frontend ไม่เก็บ session token ใน local storage

`POST /api/auth/sign-in/email` (Better Auth)

Request:
```json
{ "email": "somchai@example.com", "password": "********" }
```

Response ถูกกำหนดโดย Better Auth และส่ง session cookie กลับผ่าน frontend same-origin proxy

| Status | กรณี |
|---|---|
| 401 | email หรือ password ผิด (ข้อความเดียวกันทุกกรณี) |
| 423 | บัญชีถูกล็อกชั่วคราว (ดู Q7) |
| 429 | เรียกถี่เกินไป (rate limit) |

## 3. Forgot Password

`POST /api/v1/auth/forgot-password`

Request:
```json
{ "email": "somchai@example.com" }
```

`202 Accepted` **ทุกกรณี** ไม่ว่า email จะมีในระบบหรือไม่ ผ่าน `POST /api/v1/auth/forgot-password`
เมื่อพบผู้ใช้ ระบบสุ่ม password ใหม่ ส่งทาง SMTP แล้วจึงแทน password เดิม

| Status | กรณี |
|---|---|
| 400 | รูปแบบ email ผิด |
| 429 | เรียกถี่เกินไป |

## 4. เปลี่ยน Password (Profile page)

`PUT /api/v1/me/password`

- **Auth:** Better Auth session cookie ของ user

Request:
```json
{
  "currentPassword": "********",
  "newPassword": "********",
  "confirmPassword": "********"
}
```

> `currentPassword` เป็น [ข้อเสนอ] ดู Q6

Response `204 No Content`

| Status | กรณี |
|---|---|
| 400 | newPassword ไม่ผ่าน policy หรือ confirm ไม่ตรง (ส่งรายการกฎที่ไม่ผ่านกลับไปด้วย) |
| 401 | ไม่ได้ login หรือ currentPassword ผิด |

ตัวอย่าง error 400:
```json
{
  "error": "PASSWORD_POLICY_VIOLATION",
  "violations": ["MISSING_UPPERCASE", "MISSING_DIGIT"]
}
```
