import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
    // 1. Clear all tables (order matters — children first)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.customer.deleteMany();

    // 2. Categories
    await prisma.category.createMany({
        data: [
            { name: 'อิเล็กทรอนิกส์' },
            { name: 'อุปกรณ์เสริมคอม' },
            { name: 'สมาร์ทโฮม' },
            { name: 'เสียงและดนตรี' },
            { name: 'มือถือและแท็บเล็ต' },
        ],
    });
    console.log('✓ categories seeded');

    // 3. Products
    await prisma.product.createMany({
        data: [
            { name: 'หูฟังไร้สาย Bluetooth', price: 1290, stock: 50 },
            { name: 'เมาส์ไร้สาย', price: 390, stock: 120 },
            { name: 'คีย์บอร์ดเกมมิ่ง', price: 1590, stock: 35 },
            { name: 'สมาร์ทโฟนรุ่นกลาง', price: 8990, stock: 20 },
            { name: 'พาวเวอร์แบงค์ 10000mAh', price: 590, stock: 80 },
            { name: 'ลำโพงบลูทูธพกพา', price: 890, stock: 60 },
        ],
    });
    console.log('✓ products seeded');

    // 4. Customers
    await prisma.customer.createMany({
        data: [
            { name: 'สมชาย ใจดี', email: 'somchai@example.com' },
            { name: 'สุดา รักเรียน', email: 'suda@example.com' },
            { name: 'วิชัย เก่งมาก', email: 'wichai@example.com' },
            { name: 'มานี มีสุข', email: 'manee@example.com' },
            { name: 'ประยุทธ์ สบายดี', email: 'prayut@example.com' },
        ],
    });
    console.log('✓ customers seeded');

    // 5. Orders + OrderItems (ต้องดึง id มาก่อน)
    const [c1, c2, c3] = await prisma.customer.findMany({ take: 3, orderBy: { id: 'asc' } });
    const [p1, p2, p3, p4] = await prisma.product.findMany({ take: 4, orderBy: { id: 'asc' } });

    const order1 = await prisma.order.create({ data: { customerId: c1.id } });
    await prisma.orderItem.createMany({
        data: [
            { orderId: order1.id, productId: p1.id, quantity: 2 },
            { orderId: order1.id, productId: p2.id, quantity: 1 },
        ],
    });

    const order2 = await prisma.order.create({ data: { customerId: c2.id } });
    await prisma.orderItem.createMany({
        data: [
            { orderId: order2.id, productId: p3.id, quantity: 1 },
            { orderId: order2.id, productId: p4.id, quantity: 3 },
        ],
    });

    const order3 = await prisma.order.create({ data: { customerId: c3.id } });
    await prisma.orderItem.createMany({
        data: [
            { orderId: order3.id, productId: p1.id, quantity: 1 },
            { orderId: order3.id, productId: p3.id, quantity: 2 },
        ],
    });

    console.log('✓ orders + order items seeded');
    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
