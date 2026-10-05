# ADR-0004: ตัดสินใจใช้ Better Auth สำหรับการทำ  Authentication

- **Status:** Accepted
- **Date:** 2026-10-04
- **Deciders:** Jakapong Chan-o ( PM )


## Context

เนื่องด้วย Application มีขนาดใหญ่ ต้องการความปลอดภัยสูง การพัฒนา module Authen ให้มีความปลอดภัยจึงมีความสำคัญมาก


## Decision
นำ better auth มาใช้เพื่อเพิ่มความปลอดภัยให้กับการ authen เนื่องของ Better ออกกำลังเป็น Library ยอดนิยมที่ใช้ในการทำ authentication ในปี ที่ทำการพัฒนาระบบ ( 2026 )


กติกาที่ทีมต้องทำตาม:
- การ Auth ต้องทำผ่าน better auth เท่านั้น


