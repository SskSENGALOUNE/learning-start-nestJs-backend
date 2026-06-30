# Prisma Client Query Methods — Cheat Sheet

method ที่ Prisma สร้างให้อัตโนมัติ ติดกับแต่ละ model — พิมพ์ `this.prisma.product.` แล้วจุด ตัวที่เด้งขึ้นมาคือพวกนี้

```ts
this.prisma.product.findMany()
//          └─model─┘ └query method┘
```

> เรียกว่า **query methods** (หรือ "model methods" / "delegate methods")

---

## 📦 ตารางรวม (⭐ = ใช้บ่อยสุด)

| กลุ่ม | method | ทำอะไร | คืนอะไร |
|---|---|---|---|
| **อ่านหลายตัว** | ⭐ `findMany`   | หาหลาย record         | `T[]` array |
| **อ่านตัวเดียว** | ⭐ `findUnique` | หาด้วย key เฉพาะ (id)  | `T \| null` |
|                  | `findFirst`     | หาตัวแรกที่ match      | `T \| null` |
|                  | `findUniqueOrThrow` / `findFirstOrThrow` | เหมือนข้างบนแต่ throw ถ้าไม่เจอ | `T` |
| **สร้าง**        | ⭐ `create`     | สร้างใหม่ 1 ตัว        | record ที่สร้าง |
|                  | `createMany`    | สร้างหลายตัวรวด        | `{ count }` |
| **แก้ไข**        | ⭐ `update`     | แก้ 1 ตัว (ด้วย id)    | record ที่แก้ |
|                  | `updateMany`    | แก้หลายตัวตามเงื่อนไข  | `{ count }` |
|                  | `upsert`        | มีก็แก้ ไม่มีก็สร้าง   | record |
| **ลบ**           | ⭐ `delete`     | ลบ 1 ตัว              | record ที่ลบ |
|                  | `deleteMany`    | ลบหลายตัวตามเงื่อนไข   | `{ count }` |
| **นับ/สรุป**     | ⭐ `count`      | นับจำนวน              | `number` |
|                  | ⭐ `aggregate`  | sum/avg/min/max/count | object สรุป |
|                  | ⭐ `groupBy`    | จัดกลุ่ม + สรุปต่อกลุ่ม | array สรุป |

---

## 🔑 กฎตั้งชื่อ: `...Many` = หลายตัว / ไม่มี = ตัวเดียว

| ตัวเดียว | หลายตัว |
|---|---|
| `findUnique` | `findMany` |
| `create` | `createMany` |
| `update` | `updateMany` |
| `delete` | `deleteMany` |

---

## 📝 ตัวอย่างใช้จริง

### อ่าน
```ts
// หลายตัว + filter
findMany({ where: { stock: { gt: 0 } } })

// ตัวเดียวด้วย id (คืน null ถ้าไม่เจอ → return type ต้องมี | null)
findUnique({ where: { id } })
```

### สร้าง / แก้ / ลบ
```ts
create({ data: { name, price, stock } })
update({ where: { id }, data: { price } })
delete({ where: { id } })

// upsert: มีก็แก้ ไม่มีก็สร้าง
upsert({
  where:  { email },
  update: { name },               // เจอ → ทำอันนี้
  create: { email, name },        // ไม่เจอ → ทำอันนี้
})
```

### นับ / สรุป (คืนตัวเลข → **ไม่ต้อง** `.map(toDomain)`)
```ts
// นับ
count({ where: { stock: 0 } })            // → number

// aggregate
aggregate({
  _sum:   { price: true },
  _avg:   { price: true },
  _count: { _all: true },
})

// groupBy: นับสินค้าต่อ category
groupBy({
  by: ['categoryId'],
  _count: { id: true },
})
```

---

## ⚠️ จุดที่มือใหม่พลาดบ่อย

1. **`findUnique` คืน `null` ได้** → return type ต้องเป็น `Promise<T | null>` (ต่างจาก `findMany` ที่คืน `[]` เสมอ)
2. **`...Many` สำหรับเขียน (`createMany`/`updateMany`/`deleteMany`) คืน `{ count }`** ไม่ใช่ตัว record → เอาไป `.map` ไม่ได้
3. **`count` / `aggregate` / `groupBy` ไม่คืน entity** → อย่าเผลอ `.map(toDomain)`
4. **`update`/`delete` ถ้าหา record ไม่เจอจะ throw error** (`P2025`) — ต่างจาก `updateMany`/`deleteMany` ที่แค่คืน `count: 0`
