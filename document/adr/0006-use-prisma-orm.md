# ADR-0004: ตัดสินใจใช้ Prisma สำหรับทำ ORM 

- **Status:** Accepted
- **Date:** 2026-10-04
- **Deciders:** Jakapong Chan-o ( PM )


## Context

เนื่องด้วย Application มีขนาดใหญ่ ต้องทำงานกับฐานข้อมูลจำนวนมาก Developer มีความรู้ด้าน การเขียน SQL ที่ไม่เท่ากัน รวมถึงการทำให้ Query นั้นๆมี Perfomance และปลอดภัย 


## Decision

ตัดสินใจ นำ Prisma Orm มาใช้ในการเขียน qury เพื่อเพิ่ม Perfomance และ Security เวลา query ข้อมูลให้ดียิ่งขึ้น และนอกจาก นี้ prima ยังมี หน้าของ viewer ( Prisma Studio ) สำหรับดู table ที่สร้างไว้ ในให้สามารถบริหารจัดการงานได้ง่าย


กติกาที่ทีมต้องทำตาม:
- เวลาเขัยน query ข้อมูลต้องใช้ Prima ในการทำเท่านั้น

