# Cookie & Consent

- **Status:** Draft
- **Last updated:** 2026-10-09
- **กฎหมายที่เกี่ยวข้อง:** พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
- **ผู้ตรวจทาน:** [ฝ่ายกฎหมาย / DPO] ⚠️ ต้องให้ตรวจก่อนใช้งานจริง

> สถานะปัจจุบัน: ยังไม่มี analytics/marketing tracking และยังไม่มี consent banner หรือ consent log ในระบบ ข้อกำหนดหมวดที่ไม่จำเป็นด้านล่างเป็นแนวทางสำหรับกรณีเพิ่ม tracking ในอนาคต ต้องผ่านการทบทวนก่อนเปิดใช้

## 1. หมวดหมู่ Cookie

| หมวด | ต้องขอ consent | ตัวอย่าง |
|---|---|---|
| Strictly necessary | ไม่ต้อง (แต่ต้องแจ้งใน privacy policy) | session login, CSRF, เก็บค่า consent เอง |
| Preference | ต้อง | ภาษา, theme |
| Analytics | ต้อง | GA4, Hotjar |
| Marketing | ต้อง | Facebook Pixel, ad tracking |

## 2. รายการ Cookie ที่ใช้จริง (Cookie Inventory)

อัปเดตตารางนี้ทุกครั้งที่เพิ่มหรือลบ cookie หรือ script ของ third party

| ชื่อ | หมวด | ผู้ตั้ง | วัตถุประสงค์ | อายุ |
|---|---|---|---|---|
| Better Auth session cookie (ชื่อขึ้นกับค่า config ของ Better Auth) | Necessary | ระบบเรา | เก็บสถานะ login | ตามค่า session ของ Better Auth |

## 3. ข้อกำหนดทางเทคนิคของ Cookie ที่เกี่ยวกับ Auth

| Attribute | ค่า | เหตุผล |
|---|---|---|
| HttpOnly | true | JavaScript อ่านไม่ได้ ป้องกัน XSS ขโมย session |
| Secure | true | ส่งผ่าน HTTPS เท่านั้น |
| SameSite | Lax | ป้องกัน CSRF ส่วนใหญ่ |
| Path | / | |
| Prefix | `__Host-` | บังคับ Secure + ห้ามตั้ง Domain |

- ห้ามเก็บ password, ข้อมูลส่วนตัว หรือข้อมูลสำคัญใน cookie
- เมื่อเปลี่ยน password ให้ invalidate session อื่นทั้งหมด (เกี่ยวกับ Q5 ใน login spec)

## 4. พฤติกรรมของ Consent Banner (ข้อกำหนดเมื่อเพิ่ม tracking)

- แสดงตั้งแต่เข้าเว็บครั้งแรก **ก่อน** โหลด cookie หรือ script ที่ไม่จำเป็น
- มีปุ่ม "ยอมรับทั้งหมด", "ปฏิเสธทั้งหมด" และ "ตั้งค่า" ขนาดและความเด่นเท่ากัน
- หน้าตั้งค่าเลือกเปิด/ปิดได้ทีละหมวด โดยหมวด Necessary เปิดตลอดและปิดไม่ได้
- ค่าเริ่มต้นของทุกหมวดที่ไม่ใช่ Necessary คือ **ปิด**
- ปฏิเสธแล้วต้องใช้งานเว็บได้ตามปกติ
- มีลิงก์ "ตั้งค่า Cookie" ที่ footer ทุกหน้า เพื่อเปลี่ยนหรือถอน consent ได้ตลอด
- ข้อความภาษาไทยเป็นค่าเริ่มต้น พร้อมลิงก์ไป privacy policy
- ขอ consent ใหม่เมื่อครบ [12 เดือน] หรือเมื่อมีการเพิ่ม cookie หมวดใหม่

## 5. การบันทึก Consent (Consent Log; ยังไม่ implement)

เก็บทุกครั้งที่ user ให้ เปลี่ยน หรือถอน consent เพื่อใช้เป็นหลักฐาน

| Field | ตัวอย่าง | หมายเหตุ |
|---|---|---|
| id | uuid | |
| user_id | nullable | ถ้า login อยู่ |
| anonymous_id | uuid | ตรงกับค่าใน cookie `consent` |
| categories | `{"analytics": true, "marketing": false}` | |
| policy_version | `2026-10-01` | เวอร์ชันของ privacy policy ตอนให้ consent |
| action | `GRANT` / `UPDATE` / `WITHDRAW` | |
| created_at | timestamp | |
| ip_hash | hash ของ IP | ไม่เก็บ IP ตรงๆ |

## 6. แนวทาง Implement (Next.js; ยังไม่ implement)

- Script ของ third party (analytics, pixel) โหลดผ่าน component กลางตัวเดียว
  ที่เช็ก consent ก่อนเสมอ ห้ามใส่ `<Script>` ตรงๆ ใน layout
- อ่านค่า consent ฝั่ง server ได้จาก cookie `consent` เพื่อไม่ให้ banner กระพริบตอนโหลดหน้า
- บันทึก consent log ผ่าน tRPC procedure `consent.record`

## 7. Open Questions

- ปัจจุบันไม่มี analytics หรือ tracking จึงยังไม่ใช้ consent banner; ทบทวนข้อกำหนดนี้ก่อนเพิ่ม non-essential cookies/scripts
- ระบบเปิดให้คนทั่วไปเข้าถึง หรือเฉพาะ user ภายใน?
- ใครเป็น DPO หรือผู้รับผิดชอบด้าน PDPA ขององค์กร?
- Privacy policy มีแล้วหรือยัง อยู่ที่ไหน?
