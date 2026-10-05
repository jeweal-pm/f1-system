# ADR-0004: ตัดสินใจเลือก POSTGRESSQL ในการจัดการฐานช้อมูล

- **Status:** Accepted
- **Date:** 2026-10-04
- **Deciders:** Jakapong Chan-o ( PM )


## Context

ตัว Application ต้องรับข้อมูลจำนวนมหาศาลจาก user รวมถึงการทำ Concurrent transactionion ที่จะจถสูงถึง 10000++ ครั้งต่อวินาที
รวมถึง ux ui ต้องมีความรวดเร็ว


## Decision

ตัดสินใจ นำ Nextjs มาจัดการในส่วนของ Frontend Application โดยต้องใช้ Tanstack ในการบริหารจัดการแคช เพื่อให้ user เข้าถึงข้อมูลได้เร็วขึ้น


กติกาที่ทีมต้องทำตาม:
- ต้องออกแบบ config ของ nextjs ให้ใช้ได้กับ tanstack
- tanstack ต้องมีการตั้งค่า debource ที่เหมาะสมในแต่ละ module
- รองรับการเรียกข้อมูลแบบ realtime ในบาง module ที่ข้อมูลต้องสดใหม่อยู่เสมอ


