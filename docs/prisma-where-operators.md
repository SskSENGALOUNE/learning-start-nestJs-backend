# Prisma `where` Operators — Cheat Sheet

เปิดดูระหว่างเขียน repository method ได้เลย — ตัวที่ ⭐ คือเจอบ่อยสุด

> **กฎทอง:** `equals` ย่อได้ (ใส่ค่าตรงๆ) / นอกนั้นต้องห่อด้วย `{ operator: ค่า }`
> ```ts
> where: { stock: 0 }            // เท่ากับ — ย่อได้
> where: { stock: { gt: 0 } }    // นอกนั้น — ต้องห่อ { }
> ```

---

## 🔢 เปรียบเทียบตัวเลข / วันที่

| operator | แปลว่า | ตัวอย่าง |
|---|---|---|
| ⭐ `gt`  | มากกว่า (>)         | `price: { gt: 1000 }` |
| ⭐ `gte` | มากกว่าเท่ากับ (>=) | `stock: { gte: 1 }` |
| ⭐ `lt`  | น้อยกว่า (<)        | `price: { lt: 500 }` |
| ⭐ `lte` | น้อยกว่าเท่ากับ (<=)| `price: { lte: 500 }` |
| `equals` | เท่ากับ (=)         | `stock: { equals: 0 }` หรือย่อ `stock: 0` |
| `not`    | ไม่เท่ากับ (≠)      | `stock: { not: 0 }` |

```ts
// รวมช่วงใน field เดียว: ราคา 100–500
where: { price: { gte: 100, lte: 500 } }
```

---

## 🔤 ข้อความ (string)

| operator | แปลว่า | ตัวอย่าง |
|---|---|---|
| ⭐ `contains`   | มีคำนี้อยู่ข้างใน (LIKE %x%) | `name: { contains: "pro" }` |
| `startsWith`    | ขึ้นต้นด้วย                  | `name: { startsWith: "iP" }` |
| `endsWith`      | ลงท้ายด้วย                   | `name: { endsWith: "Max" }` |
| `mode`          | ไม่สนตัวพิมพ์เล็ก/ใหญ่       | `name: { contains: "pro", mode: "insensitive" }` |

---

## 📋 รายการค่า (list)

| operator | แปลว่า | ตัวอย่าง |
|---|---|---|
| ⭐ `in`  | อยู่ในชุดนี้ตัวใดตัวหนึ่ง | `categoryId: { in: [1, 2, 3] }` |
| `notIn`  | ไม่อยู่ในชุดนี้           | `categoryId: { notIn: [4, 5] }` |

---

## 🔗 รวมหลายเงื่อนไข (logic)

| operator | แปลว่า | ตัวอย่าง |
|---|---|---|
| `AND` | จริงทุกข้อ       | `AND: [{ stock: { gt: 0 } }, { price: { lt: 500 } }]` |
| `OR`  | จริงข้อใดข้อหนึ่ง | `OR: [{ stock: 0 }, { price: { gt: 9999 } }]` |
| `NOT` | กลับเงื่อนไข      | `NOT: { stock: 0 }` |

**สำคัญ:** หลาย field ใน `where` เดียว = `AND` อัตโนมัติ (ไม่ต้องเขียน `AND` เอง)

```ts
where: { stock: { gt: 0 }, price: { lte: 500 } }
// = stock > 0 "และ" price <= 500
```

`AND` เขียนเองต่อเมื่อ field **ซ้ำกัน** หรือ logic ซับซ้อน

---

## 🧩 นอกเหนือ `where`: option อื่นใน `findMany`

| option | ทำอะไร | ตัวอย่าง |
|---|---|---|
| ⭐ `orderBy` | เรียงลำดับ              | `orderBy: { price: 'desc' }` |
| ⭐ `take`    | จำกัดจำนวน (top-N)      | `take: 5` |
| ⭐ `skip`    | ข้ามกี่ตัว (pagination) | `skip: (page - 1) * limit` |
| `select`     | เลือกเฉพาะบาง field     | `select: { id: true, name: true }` |
| `include`    | ดึง relation มาด้วย     | `include: { category: true }` |
| `distinct`   | ตัดค่าซ้ำ               | `distinct: ['categoryId']` |

```ts
// top-N = orderBy + take มาคู่กันเสมอ
findMany({ orderBy: { price: 'desc' }, take: 5 })

// offset pagination = skip + take
findMany({ skip: (page - 1) * limit, take: limit })
```

---

## 📊 ไม่ใช่ `findMany`: สรุป/นับ (คืนตัวเลข ไม่ใช่ entity → ไม่ต้อง `.map(toDomain)`)

| method | ทำอะไร | ตัวอย่าง |
|---|---|---|
| `count`     | นับจำนวน         | `count({ where: { stock: 0 } })` |
| `aggregate` | sum/avg/min/max  | `aggregate({ _avg: { price: true } })` |
| `groupBy`   | จัดกลุ่ม + นับ   | `groupBy({ by: ['categoryId'], _count: { id: true } })` |

```ts
aggregate({
  _sum:   { price: true },
  _avg:   { price: true },
  _count: { _all: true },
})
```

---

## ✅ Checklist ก่อนส่ง method ทุกตัว

1. **return type** ตรงกับสิ่งที่คืน? (`ProductEntity[]` / `number` / object สรุป)
2. **มี `return`** จริงไหม? (ลืม return = TS error "must return a value")
3. คืน array ของ entity → จบด้วย **`.map(r => this.toDomain(r))`**
4. คืนตัวเลข/aggregate → **ไม่** map
5. ค่าที่ผู้ใช้กำหนดได้ → รับเป็น **parameter** ไม่ hard-code
