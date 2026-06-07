import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const products = [
    { name: 'หูฟังไร้สาย Bluetooth', price: 1290 },
    { name: 'เมาส์ไร้สาย', price: 390 },
    { name: 'คีย์บอร์ดเกมมิ่ง', price: 1590 },
    { name: 'สมาร์ทโฟนรุ่นกลาง', price: 8990 },
    { name: 'พาวเวอร์แบงค์ 10000mAh', price: 590 },
    { name: 'ลำโพงบลูทูธพกพา', price: 890 },
    { name: 'สายชาร์จ USB-C', price: 199 },
    { name: 'หัวชาร์จเร็ว 65W', price: 690 },
    { name: 'จอมอนิเตอร์ 24 นิ้ว', price: 4990 },
    { name: 'เว็บแคม HD', price: 990 },
    { name: 'ไมโครโฟนตั้งโต๊ะ', price: 1890 },
    { name: 'แท่นวางโน้ตบุ๊ก', price: 590 },
    { name: 'ฮับ USB-C 6 พอร์ต', price: 890 },
    { name: 'หูฟังครอบหูตัดเสียงรบกวน', price: 3990 },
    { name: 'นาฬิกาอัจฉริยะ', price: 5990 },
    { name: 'แท็บเล็ต 10 นิ้ว', price: 7990 },
    { name: 'เคสโทรศัพท์กันกระแทก', price: 290 },
    { name: 'ฟิล์มกระจกกันรอย', price: 99 },
    { name: 'ที่ชาร์จไร้สาย', price: 690 },
    { name: 'กล้องวงจรปิดในบ้าน', price: 1290 },
    { name: 'ไดรฟ์ SSD พกพา 1TB', price: 2990 },
    { name: 'แฟลชไดรฟ์ 64GB', price: 290 },
    { name: 'การ์ดเมมโมรี่ 128GB', price: 590 },
    { name: 'รีโมททีวีอัจฉริยะ', price: 690 },
    { name: 'อะแดปเตอร์ HDMI', price: 390 },
    { name: 'ขาตั้งมือถือ', price: 199 },
    { name: 'ไฟ LED ตกแต่งโต๊ะทำงาน', price: 490 },
    { name: 'พัดลมระบายความร้อนโน้ตบุ๊ก', price: 690 },
    { name: 'เครื่องฟอกอากาศขนาดเล็ก', price: 1990 },
    { name: 'เครื่องชาร์จแบตเตอรี่ AA/AAA', price: 390 },
];

async function main() {
    await prisma.product.deleteMany();
    await prisma.product.createMany({ data: products });
    console.log(`Seeded ${products.length} products`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
