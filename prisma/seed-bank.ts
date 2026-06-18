import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const TOTAL_USERS = 100_000;
const BATCH = 5_000;

const firstNames = ['ສົມ', 'ນາງ', 'ວິ', 'ມາລີ', 'ສີ', 'ບຸນ', 'ທອງ', 'ແກ້ວ', 'ດາວ', 'ຈັນ',
  'สม', 'วิ', 'มาลี', 'ทอง', 'แก้ว', 'ดาว', 'จัน', 'บุญ', 'ศรี', 'นาง'];
const lastNames = ['ສີລາ', 'ວົງ', 'ພົມ', 'ດາວ', 'ແສງ', 'ຄຳ', 'ໄຊ',
  'ศรีลา', 'วงศ์', 'พรม', 'แสง', 'คำ', 'ชัย', 'สุข', 'ดี', 'งาม'];
const banks = ['BCEL', 'LDB', 'APB', 'SCB', 'KBANK', 'BBL', 'KTB'];
const tiers = ['BRONZE', 'BRONZE', 'BRONZE', 'SILVER', 'SILVER', 'GOLD', 'PLATINUM'] as const;
const accountTypes = ['SAVINGS', 'CHECKING', 'FIXED_DEPOSIT'] as const;
const currencies = ['KIP', 'THB', 'USD'] as const;

const interestRateMap = { SAVINGS: 0.5, CHECKING: 0.1, FIXED_DEPOSIT: 3.5 };

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomDate(startYear: number, endYear: number): Date {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
}

async function main() {
  console.log('Clearing existing data...');
  await prisma.bankAccount.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────
  console.log(`Seeding ${TOTAL_USERS.toLocaleString()} users...`);

  for (let i = 0; i < TOTAL_USERS; i += BATCH) {
    await prisma.user.createMany({
      data: Array.from({ length: Math.min(BATCH, TOTAL_USERS - i) }, (_, j) => {
        const n = i + j;
        const tier = pick(tiers);
        return {
          name: `${pick(firstNames)} ${pick(lastNames)}`,
          email: `user${n}@example.com`,
          phoneNumber: `+856 20 ${rand(5000, 9999)} ${rand(1000, 9999)}`,
          dateOfBirth: randomDate(1960, 2000),
          tier,
          isVerified: Math.random() > 0.3,
        };
      }),
    });
    if ((i + BATCH) % 20_000 === 0 || i + BATCH >= TOTAL_USERS) {
      console.log(`  users: ${Math.min(i + BATCH, TOTAL_USERS).toLocaleString()} / ${TOTAL_USERS.toLocaleString()}`);
    }
  }

  // ── BankAccounts ───────────────────────────────────────
  const userIds = await prisma.user.findMany({ select: { id: true }, orderBy: { id: 'asc' } });
  const totalAccounts = userIds.length * 2; // เฉลี่ย 2 บัญชีต่อคน

  console.log(`Seeding ~${totalAccounts.toLocaleString()} bank accounts...`);

  const accountBuffer: {
    userId: number; accountNumber: string; bankName: string;
    balance: number; accountType: string; interestRate: number;
    currency: string; isActive: boolean; lastTransactionAt: Date | null;
  }[] = [];

  for (const { id } of userIds) {
    const numAccounts = Math.random() < 0.3 ? 1 : Math.random() < 0.8 ? 2 : 3;
    for (let k = 0; k < numAccounts; k++) {
      const type = pick(accountTypes);
      accountBuffer.push({
        userId: id,
        accountNumber: `${rand(100, 999)}-${rand(100000, 999999)}-${rand(10, 99)}`,
        bankName: pick(banks),
        balance: rand(0, 10_000_000),
        accountType: type,
        interestRate: interestRateMap[type],
        currency: pick(currencies),
        isActive: Math.random() > 0.1,
        lastTransactionAt: Math.random() > 0.2 ? randomDate(2023, 2026) : null,
      });
    }

    if (accountBuffer.length >= BATCH) {
      await prisma.bankAccount.createMany({ data: accountBuffer.splice(0, BATCH) as any });
      process.stdout.write('.');
    }
  }

  if (accountBuffer.length > 0) {
    await prisma.bankAccount.createMany({ data: accountBuffer as any });
  }

  console.log('\nDone!');
  const userCount = await prisma.user.count();
  const accCount = await prisma.bankAccount.count();
  console.log(`  Users: ${userCount.toLocaleString()}`);
  console.log(`  BankAccounts: ${accCount.toLocaleString()}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
