# Login & Password Management: Requirements

- **Status:** Draft
- **Last updated:** 2026-10-04
- **Related:** [Password Policy](0003-password-policy.md), [API Contract](0001-api-contract.md), [Flow](../diagram/login-flow.md)

## 1. ภาพรวม

ระบบให้ผู้ใช้ login ด้วย email และ password โดยบัญชีผู้ใช้ถูกสร้างจากระบบ CRM
ผ่าน API ระบบของเราเป็นผู้สร้างรหัสผ่านเริ่มต้นให้ ผู้ใช้สามารถขอรหัสผ่านใหม่
เมื่อลืม และเปลี่ยนรหัสผ่านเองได้ที่หน้า Profile

## 2. ขอบเขต

**อยู่ใน scope**
- Login ด้วย email + password
- สร้าง user ผ่าน API ที่ CRM เรียก พร้อม generate password เริ่มต้น
- Forgot password: ระบบ generate password ใหม่ส่งทาง email
- เปลี่ยน password ด้วยตัวเองที่ Super Admin Profile page

**ไม่อยู่ใน scope**
- สมัครสมาชิกด้วยตัวเอง (self sign-up)
- Login ด้วย social / SSO
- Multi-factor authentication (MFA)

> ⚠️ ส่วนที่เป็นสีจางใน flow ยังไม่ยืนยันว่าอยู่ใน scope ดู Q4

## 3. ผู้เกี่ยวข้อง (Actors)

| Actor | คำอธิบาย |
|---|---|
| User | ผู้ใช้งานระบบ (Super Admin) |
| CRM | ระบบภายนอก ทำหน้าที่ขอสร้าง user ผ่าน API |
| System | ระบบของเรา ทำหน้าที่สร้าง password, ยืนยันตัวตน, ส่ง email |

## 4. User Stories

- **US-01** ในฐานะ User ฉันต้องการ login ด้วย email และ password เพื่อเข้าใช้งานระบบ
- **US-02** ในฐานะ CRM ฉันต้องการเรียก API เพื่อสร้าง user ใหม่ โดยไม่ต้องจัดการ password เอง
- **US-03** ในฐานะ User ที่ลืมรหัสผ่าน ฉันต้องการขอรหัสผ่านใหม่ทาง email เพื่อกลับเข้าใช้งานได้
- **US-04** ในฐานะ User ฉันต้องการเปลี่ยนรหัสผ่านเป็นของตัวเองได้เมื่อต้องการ โดยไม่ถูกบังคับ

## 5. Business Rules

| ID | กฎ | ที่มา |
|---|---|---|
| BR-01 | CRM **ไม่มีหน้าที่สร้าง password** CRM แค่ยิง API ขอสร้าง user ระบบเป็นผู้ generate password | [จาก flow] ดู ADR-0002 |
| BR-02 | Password ที่ระบบ generate ต้องสุ่มด้วย cryptographically secure random และผ่าน password policy | [จาก flow] "OTP concept" |
| BR-03 | Forgot password: ระบบ generate password ใหม่ และส่งไปที่ email ของ user | [จาก flow] |
| BR-04 | ไม่บังคับให้ user เปลี่ยน password หลัง login ครั้งแรก user เปลี่ยนเองได้ที่ Profile page | [จาก flow] ดู ADR-0003 |
| BR-05 | Password ที่ user ตั้งเองต้องผ่าน [Password Policy](password-policy.md) | [จาก flow] |
| BR-06 | ช่อง Confirm password ต้องตรงกับ Password | [จาก flow] |
| BR-07 | Login ผิดเกินจำนวนครั้งที่กำหนด ให้ล็อกบัญชีชั่วคราว (จำนวนครั้ง: ดู Q7) | [ข้อเสนอ] |

## 6. Acceptance Criteria

**AC-01 Login (US-01)**
- Given user มีบัญชีอยู่แล้ว
- When กรอก email และ password ถูกต้องที่หน้า `/login`
- Then เข้าสู่ระบบสำเร็จและไปหน้า default

- Given user กรอก email หรือ password ผิด
- When กด login
- Then แสดงข้อความ "อีเมลหรือรหัสผ่านไม่ถูกต้อง" โดยไม่บอกว่าผิดช่องไหน

**AC-02 สร้าง user ผ่าน CRM (US-02)**
- Given CRM ส่ง request สร้าง user พร้อม email ที่ยังไม่มีในระบบ
- When ระบบรับ request
- Then สร้าง user และ generate password ตาม BR-02 แล้วแจ้ง credential ตามช่องทางที่ตกลง (ดู Q1)

- Given email ซ้ำกับที่มีในระบบ
- Then ตอบกลับ `409 Conflict` และไม่สร้าง user

**AC-03 Forgot password (US-03)**
- Given user อยู่ที่หน้า forgot password
- When กรอก email และกดส่ง
- Then ระบบแสดงข้อความ "หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งรหัสผ่านใหม่ไปให้แล้ว" (ข้อความเดียวกันทุกกรณี ดู Q8)
- And ถ้า email มีอยู่จริง ระบบ generate password ใหม่, ส่ง email และ password เดิมใช้ไม่ได้อีก

**AC-04 เปลี่ยน password (US-04)**
- Given user login อยู่ และอยู่ที่ Profile page
- When กรอก password ใหม่ที่ผ่าน policy และ confirm ตรงกัน แล้วกด Save
- Then บันทึก password ใหม่สำเร็จ (การ log out หลังเปลี่ยน: ดู Q5)

- Given password ไม่ผ่าน policy หรือ confirm ไม่ตรง
- Then แสดง error ตาม [Password Policy](password-policy.md) และไม่บันทึก

## 7. Non-functional Requirements [ข้อเสนอ]

- **Security:** เก็บ password แบบ hash ด้วย bcrypt หรือ Argon2 ห้ามเก็บหรือ log plaintext
- **Security:** API login และ forgot password ต้องมี rate limit
- **Security:** ใช้ HTTPS เท่านั้น
- **Audit:** บันทึก log เหตุการณ์ login สำเร็จ/ล้มเหลว, สร้าง user, เปลี่ยน password (ห้าม log ตัว password)
- **Performance:** API login ตอบกลับภายใน 1 วินาทีในสภาวะปกติ
