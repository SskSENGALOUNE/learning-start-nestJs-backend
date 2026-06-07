# จุดประสงค์ของโปรเจกต์นี้

โปรเจกต์นี้คือสนามฝึกเรียนรู้การสร้าง REST API ด้วย **NestJS + CQRS + Clean Architecture**
(ดูโครงสร้างจริงได้ใน `src/{domain,application,infrastructure,presentation}/product/`)

เป้าหมายหลัก **ไม่ใช่การส่งมอบ feature ให้เร็วที่สุด** แต่คือการฝึกมือให้คุ้นกับ pattern
ของแต่ละ HTTP verb จนเขียนเองได้โดยไม่ต้องเปิดดูตัวอย่าง — ฝึกซ้ำมากพอจนเป็นความเคยชิน

# วิธีที่ Claude ควรช่วย (สำคัญ — อ่านก่อนเริ่มแต่ละ checklist item)

เมื่อผู้ใช้พิมพ์ขอให้ทำ checklist ข้อใดข้อหนึ่ง (เช่น "ทำ POST ข้อที่ 3"):

1. **เขียนตัวอย่าง pattern ให้ดูก่อน** — โชว์โค้ดตัวอย่าง (อาจเป็น snippet ในแชท ไม่ต้องลงไฟล์จริง)
   พร้อมอธิบายว่าทำไมต้องเขียนแบบนี้ จุดไหนคือหัวใจของ pattern นั้น
2. **อย่า implement ลงไฟล์จริงให้ทันที** — ปล่อยให้ผู้ใช้เขียนตามด้วยตัวเอง
3. หลังผู้ใช้เขียนเสร็จและขอให้ตรวจ ให้ **review** โค้ด ชี้จุดที่พลาด/ปรับปรุงได้ พร้อมอธิบายเหตุผล
4. เลือกว่าแต่ละ checklist item จะ "สร้าง module ใหม่" หรือ "เพิ่ม endpoint แบบใหม่ใน module เดิม"
   ให้พิจารณาตามความเหมาะสมของแต่ละข้อ (มีระบุไว้คร่าวๆ ในวงเล็บของแต่ละข้อแล้ว)

# สูตรมาตรฐาน: ขั้นตอนสร้าง 1 endpoint ใน Clean Architecture + CQRS นี้

ใช้เป็น checklist ย่อยทุกครั้งที่ทำ feature ใหม่ (ไม่ว่าจะเป็น POST/GET/PATCH/DELETE):

- [ ] 1. สร้าง `xxx.command.ts` (เขียน) หรือ `xxx.query.ts` (อ่าน) — กำหนดข้อมูล input ที่ handler ต้องใช้
- [ ] 2. สร้าง `xxx.handler.ts` — implement `ICommandHandler`/`IQueryHandler`, ใส่ business logic, เรียก repository
- [ ] 3. เพิ่ม method ใหม่ใน `*.repository.ts` ถ้า query เดิมไม่พอ (เขียน Prisma query เอง)
- [ ] 4. เพิ่ม/แก้ logic ใน domain entity ถ้ามี business rule เกี่ยวข้อง (เช่น validation, state transition)
- [ ] 5. สร้าง/แก้ DTO ใน `presentation/.../dto/` สำหรับ request body หรือ query params (ใส่ class-validator ถ้าจำเป็น)
- [ ] 6. เพิ่ม route ใน controller — ผูกกับ `commandBus.execute(...)` หรือ `queryBus.execute(...)`
- [ ] 7. ลงทะเบียน handler ใหม่ใน `*.module.ts` (`CommandHandlers` หรือ `QueryHandlers`)
- [ ] 8. ทดสอบจริงผ่าน REST client (Postman/Thunder Client/curl) ทั้ง happy path และ edge case (404, validation error)

---

# Checklist ฝึกซ้ำตาม HTTP verb

> หลักการ: ทำซ้ำจน pattern ติดมือ — แต่ละข้อควรมี "สถานการณ์" ที่ต่างจากข้ออื่น
> (วงเล็บท้ายข้อ = คำแนะนำว่าควรทำในรูปแบบไหน แต่ปรับได้ตามบริบทตอนทำจริง)

## POST — สร้างข้อมูลใหม่ (10 ครั้ง)

- [ ] 1. POST สร้าง resource ใหม่ทั้ง flow ใน module ใหม่ (เช่น `category`) *(module ใหม่)*
- [ ] 2. POST สร้าง resource ใหม่ใน module ใหม่อีกอัน (เช่น `customer`) *(module ใหม่)*
- [ ] 3. POST ที่มี validation ด้วย `class-validator` (`@IsString`, `@IsNumber`, `@Min`, ฯลฯ) *(endpoint ใหม่/ปรับ DTO เดิม)*
- [ ] 4. POST ที่มี relation/foreign key ข้าม module (เช่น สร้าง `order` ที่อ้างอิง `customer` + `product`) *(module ใหม่)*
- [ ] 5. POST ที่ entity มี business rule ตอนสร้าง (เช่น stock ต้อง >= 0, ชื่อห้ามว่าง) *(endpoint ใหม่ + แก้ entity)*
- [ ] 6. POST ที่ throw custom exception เมื่อข้อมูลขัดแย้ง (เช่น `ConflictException` ถ้าชื่อซ้ำ) *(endpoint ใหม่)*
- [ ] 7. POST ที่รับ nested DTO (เช่น สร้าง order พร้อม array ของ order items ในคำขอเดียว) *(module ใหม่)*
- [ ] 8. POST แบบ idempotent/upsert (สร้างถ้ายังไม่มี, แก้ถ้ามีอยู่แล้ว) *(endpoint ใหม่)*
- [ ] 9. POST ที่มี field auto-generate/default (เช่น `createdAt`, `status` เริ่มต้นเป็น `pending`) *(endpoint ใหม่ + แก้ entity)*
- [ ] 10. POST ที่ return response shape ไม่ตรงกับ entity ตรงๆ (เช่น ไม่ส่ง field บางตัวกลับ) *(endpoint ใหม่)*

## GET — อ่านข้อมูล หลายสถานการณ์ (20 ครั้ง)

- [ ] 1. GET all (list ทั้งหมดของ resource ใหม่)
- [ ] 2. GET by id
- [ ] 3. GET filter ด้วย field เดียว (เช่น by name)
- [ ] 4. GET filter หลาย field พร้อมกัน (combine condition)
- [ ] 5. GET พร้อม pagination (`page`, `limit`)
- [ ] 6. GET พร้อม sorting (`sortBy` + `order`)
- [ ] 7. GET filter แบบ range (เช่น price ระหว่าง min-max — ของเดิมมีแล้ว ลองทำกับ resource อื่น)
- [ ] 8. GET search แบบ partial match (LIKE / contains)
- [ ] 9. GET filter ตาม status/state (เช่น active/inactive, pending/completed)
- [ ] 10. GET ที่ join/รวมข้อมูลจาก relation (เช่น order พร้อมรายละเอียด customer + items)
- [ ] 11. GET พร้อม aggregation (count, sum, average)
- [ ] 12. GET พร้อม group by (เช่น จำนวนสินค้าต่อ category)
- [ ] 13. GET top-N (เช่น 5 อันดับราคาสูงสุด)
- [ ] 14. GET ที่ sort ได้หลายเงื่อนไขพร้อมกัน (multi-column sort)
- [ ] 15. GET by id ที่ throw `NotFoundException` เมื่อไม่พบ
- [ ] 16. GET ที่มี default query param เมื่อผู้ใช้ไม่ส่งมา (เช่น `order = 'asc'`)
- [ ] 17. GET ที่รวม filter + sort + paginate ในคำขอเดียว
- [ ] 18. GET exists/count check (เช่น เช็คว่ามีสินค้าชื่อนี้อยู่แล้วหรือยัง)
- [ ] 19. GET distinct values (เช่น list รายชื่อ category ทั้งหมดที่มีสินค้าอยู่)
- [ ] 20. GET filter ด้วยช่วงวันที่ (เช่น created ระหว่างวันที่ A ถึง B)

## PATCH/PUT — แก้ไขข้อมูล (10 ครั้ง)

- [ ] 1. PATCH partial update (แก้แค่บาง field ที่ส่งมา)
- [ ] 2. PUT full update (แทนที่ object ทั้งก้อน)
- [ ] 3. PATCH ที่ต้องผ่าน business rule validation ก่อนเปลี่ยน (เช่น เปลี่ยน status ต้องอยู่ใน flow ที่อนุญาต)
- [ ] 4. PATCH ที่ throw `NotFoundException` เมื่อไม่พบ record
- [ ] 5. PATCH ที่ throw exception จาก domain entity เอง (เช่น `changePrice` ห้ามติดลบ — ลองทำกับ resource อื่น)
- [ ] 6. PATCH ที่แก้ relation (เช่น ย้าย product ไป category อื่น)
- [ ] 7. PATCH แบบ bulk (อัปเดตหลาย record ตามเงื่อนไขในคำขอเดียว)
- [ ] 8. PATCH ที่มี optimistic locking / version check (กันการเขียนทับกัน)
- [ ] 9. PATCH ที่แก้ nested resource (เช่น แก้ quantity ของ item ตัวหนึ่งใน order)
- [ ] 10. PATCH ที่มี side-effect ต่อ entity อื่น (เช่น เปลี่ยน order status เป็น "shipped" แล้วลด stock อัตโนมัติ)

## DELETE — ลบข้อมูล (5 ครั้ง)

- [ ] 1. DELETE hard delete (ลบออกจาก database จริง — ของเดิมมีแล้ว ลองทำกับ resource อื่น)
- [ ] 2. DELETE ที่ throw `NotFoundException` เมื่อไม่พบ record
- [ ] 3. DELETE แบบ soft delete (mark `deletedAt`/`isActive: false` แทนการลบจริง)
- [ ] 4. DELETE ที่ต้องเช็ค relation ก่อนลบ (เช่น ห้ามลบ category ที่ยังมี product ผูกอยู่ → throw exception)
- [ ] 5. DELETE แบบ bulk/by-condition (เช่น ลบสินค้าทั้งหมดที่ status = `discontinued`)

---

# หมายเหตุ

- ทุกครั้งที่ทำ checklist เสร็จ ให้ขีดเครื่องหมาย `[x]` ในไฟล์นี้ เพื่อ track ความคืบหน้า
- ถ้า pattern ไหนเริ่มทำได้คล่องแล้ว ข้ามไปข้อถัดไปได้เลย ไม่จำเป็นต้องทำครบทุกข้อ
- โครงสร้างโฟลเดอร์ปัจจุบันเป็นแบบ **layer-first**: `domain/<module>`, `application/<module>`,
  `infrastructure/<module>`, `presentation/<module>` — module ใหม่ก็ให้วางตามรูปแบบนี้
