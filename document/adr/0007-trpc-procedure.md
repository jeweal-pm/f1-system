# ADR-0004: ตัดสินใจใช้ Trpc สำหรับเป็ฯตัวกลางในการเขื่อมต่อ

- **Status:** Accepted
- **Date:** 2026-10-04
- **Deciders:** Jakapong Chan-o ( PM )


## Context

เนื่องด้วย Application มีขนาดใหญ่ ต้องการความปลอดภัยสูง จึงไม่ต้องการให้ มีการเห็น api หลักบ้าน เพื่อความปลอดภัย


## Decision

นำ Trpc มาใช้ โดยมีแนวทางการใช้ คร่าวๆดังนี่


- Client Component ดึงข้อมูลผ่าน `useTRPC()` + `useQuery` / `useMutation` ของ TanStack
- Server Component prefetch ข้อมูลฝั่ง server แล้วส่งต่อด้วย `HydrationBoundary`
- Mutation ทั้งหมดทำผ่าน tRPC **ไม่ใช้ Server Actions** [หรือระบุว่าใช้ในกรณีไหน]
- ห้ามเรียก `fetch` / axios ไปที่ API ภายในตรงๆ ให้ผ่าน tRPC เสมอ



กติกาที่ทีมต้องทำตาม:
- การดึงข้อมูลต่างๆจากหลักบ้านต้องทำผ่าน TRPC เท่านั้น
