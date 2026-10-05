# ADR-0003: ตัดสินใจเลือก POSTGRESSQL ในการจัดการฐานช้อมูล

- **Status:** Accepted
- **Date:** 2026-10-04
- **Deciders:** Jakapong Chan-o ( PM )


## Context

ตัว Application ต้องรับข้อมูลจำนวนมหาศาลจาก user รวมถึงการทำ Concurrent transactionion ที่จะจถสูงถึง 10000++ ครั้งต่อวินาที



## Decision

ตัดสินใจ นำ POSTGRESSQL มาใช้สำหรับเป็นฐานข้อมูลเพราะว่า  POSTGRESSQL เป็ฯ RDBMS ที่ทั่วโลกนิยมใช้ในการทำข้อมูลแบบ trasactional อยู่แล้ว และมี reference จากเว็ฐไซต์ต่างๆมากมาย กว่าสามารถรองรับการ read/write แบบ concurrent ได้จำนวนมหาศล



กติกาที่ทีมต้องทำตาม:
- ต้องออกแบบฐานข้อมูลให้หลีกเลียงการ excessive joins and join explosion


