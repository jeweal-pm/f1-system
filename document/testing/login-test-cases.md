# Test Cases: Login & Password Management

- **Last updated:** 2026-10-04
- **Related:** [Acceptance Criteria](../spec/login-requirements.md#6-acceptance-criteria)

## Login

| ID | กรณี | ขั้นตอน | ผลที่คาดหวัง | อ้างอิง |
|---|---|---|---|---|
| TC-01 | Login สำเร็จ | กรอก email + password ถูกต้อง กด Login | เข้าหน้า Default | AC-01 |
| TC-02 | Password ผิด | กรอก email ถูก password ผิด | แสดง "อีเมลหรือรหัสผ่านไม่ถูกต้อง" | AC-01 |
| TC-03 | Email ไม่มีในระบบ | กรอก email ที่ไม่มี | แสดงข้อความเดียวกับ TC-02 | AC-01 |
| TC-04 | ช่องว่าง | ไม่กรอกอะไรเลย กด Login | แสดงว่าต้องกรอก ไม่ส่ง request | AC-01 |
| TC-05 | Login ผิดเกินกำหนด | กรอกผิดติดกันตามจำนวนใน Q7 | บัญชีถูกล็อกชั่วคราว | BR-07 |

## สร้าง User ผ่าน CRM

| ID | กรณี | ขั้นตอน | ผลที่คาดหวัง | อ้างอิง |
|---|---|---|---|---|
| TC-10 | สร้างสำเร็จ | CRM เรียก POST /users ด้วย email ใหม่ | 201, response ไม่มี password, login ด้วยรหัสที่ได้รับได้ | AC-02 |
| TC-11 | Email ซ้ำ | เรียกด้วย email ที่มีแล้ว | 409 | AC-02 |
| TC-12 | ไม่มี API key | เรียกโดยไม่ใส่ X-API-Key | 401 | API |
| TC-13 | Password ที่ generate ผ่าน policy | สร้าง user 100 ครั้ง ตรวจรหัสที่ได้ | ผ่าน policy ทุกครั้ง ไม่ซ้ำกัน | BR-02 |

## Forgot Password

| ID | กรณี | ขั้นตอน | ผลที่คาดหวัง | อ้างอิง |
|---|---|---|---|---|
| TC-20 | Email มีในระบบ | กรอก email ที่มี กดส่ง | ได้รับ email พร้อมรหัสใหม่ | AC-03 |
| TC-21 | Email ไม่มีในระบบ | กรอก email ที่ไม่มี | ข้อความบนจอเหมือน TC-20 ไม่มี email ส่งออก | AC-03 |
| TC-22 | รหัสเดิมใช้ไม่ได้ | หลัง TC-20 login ด้วยรหัสเดิม | Login ไม่สำเร็จ | AC-03 |
| TC-23 | Login ด้วยรหัสใหม่ | หลัง TC-20 login ด้วยรหัสจาก email | Login สำเร็จ | AC-03 |

## เปลี่ยน Password

| ID | กรณี | ขั้นตอน | ผลที่คาดหวัง | อ้างอิง |
|---|---|---|---|---|
| TC-30 | เปลี่ยนสำเร็จ | กรอก `Abcdefg1` ทั้งสองช่อง กด Save | บันทึกสำเร็จ login ด้วยรหัสใหม่ได้ | AC-04 |
| TC-31 | สั้นเกิน | กรอก `Abc1` | error: อย่างน้อย 8 ตัวอักษร | Policy |
| TC-32 | ไม่มีพิมพ์ใหญ่ | กรอก `abcdefg1` | error: ต้องมีตัวพิมพ์ใหญ่ | Policy |
| TC-33 | ไม่มีพิมพ์เล็ก | กรอก `ABCDEFG1` | error: ต้องมีตัวพิมพ์เล็ก | Policy |
| TC-34 | ไม่มีตัวเลข | กรอก `Abcdefgh` | error: ต้องมีตัวเลข | Policy |
| TC-35 | Confirm ไม่ตรง | password `Abcdefg1` confirm `Abcdefg2` | error: รหัสผ่านยืนยันไม่ตรงกัน | BR-06 |
| TC-36 | ไม่บังคับเปลี่ยน | Login ครั้งแรกด้วยรหัสที่ระบบ generate | เข้าหน้า Default ได้เลย ไม่มี popup | BR-04 |
