# Login Flow Diagrams

- **Last updated:** 2026-10-04
- **ต้นฉบับ:** Excalidraw (แนบลิงก์ไฟล์ต้นฉบับที่นี่)

> Diagram เขียนด้วย Mermaid แสดงผลได้ใน GitHub, GitLab, VS Code (ติดตั้ง extension Markdown Preview Mermaid)

## 1. ภาพรวม Flow หน้า /login

```mermaid
flowchart TD
    A["/login"] --> B{"Login"}
    B -->|"login ปกติ"| C["กรอก email + password"]
    B -->|"ลืมรหัสผ่าน"| F["Forgot password"]
    C --> D{"ถูกต้อง?"}
    D -->|"ใช่"| E["หน้า Default"]
    D -->|"ไม่"| C
    F --> G["ระบบ generate password ใหม่<br/>ส่งไปที่ email"]
    G --> C
    E -.->|"เมื่อต้องการ (ไม่บังคับ)"| P["Super Admin Profile page<br/>เปลี่ยน password"]
```

## 2. สร้าง User ผ่าน CRM

```mermaid
sequenceDiagram
    participant CRM
    participant API as Our System
    participant DB
    participant U as User

    CRM->>API: POST /users (email, name, role)
    API->>API: generate password (secure random)
    API->>DB: บันทึก user + password hash
    API-->>CRM: 201 Created (ไม่มี password)
    API-->>U: แจ้ง email + password (ช่องทาง: ดู Q1)
```

## 3. Forgot Password

```mermaid
sequenceDiagram
    actor U as User
    participant API as Our System
    participant DB
    participant Mail as Email Service

    U->>API: POST /auth/forgot-password (email)
    API-->>U: 202 Accepted (ตอบเหมือนกันทุกกรณี)
    alt email มีในระบบ
        API->>API: generate password ใหม่
        API->>DB: อัปเดต password hash
        API->>Mail: ส่ง password ใหม่
        Mail-->>U: email พร้อม password ใหม่
    end
    U->>API: POST /auth/login (email, password ใหม่)
```

## 4. เปลี่ยน Password ที่ Profile Page

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Profile Page
    participant API as Our System

    U->>UI: กรอก password ใหม่ + confirm
    UI->>UI: validate ตาม password policy (real-time)
    U->>UI: กด Save
    UI->>API: PUT /me/password
    alt ผ่าน
        API-->>UI: 204
        UI-->>U: แจ้งเปลี่ยนสำเร็จ (log out หรือไม่: ดู Q5)
    else ไม่ผ่าน
        API-->>UI: 400 + violations
        UI-->>U: แสดง error
    end
```

## หมายเหตุ

Flow ต้นฉบับมีส่วนที่เป็นสีจาง (popup บังคับเปลี่ยนรหัสหลัง login ครั้งแรก
และ log out หลัง save) diagram ข้างบนวาดตามการตัดสินใจล่าสุดใน ADR-0003
ซึ่งเลือก Profile page แทน popup ถ้าทีมยืนยันว่าส่วนสีจางยังอยู่ใน scope ต้องแก้ diagram นี้ (ดู Q4)
