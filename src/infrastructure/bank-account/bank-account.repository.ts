import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { startTimer } from "src/common/utils/perf-timer";

@Injectable()
export class BankAccountRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findWithOffset(page: number, limit: number) {
        const t = startTimer(`OFFSET skip=${(page - 1) * limit}`);

        const data = await this.prisma.bankAccount.findMany({
            skip: (page - 1) * limit,   // ข้าม row ที่ผ่านมาแล้ว
            take: limit,                 // เอาแค่ limit row
            orderBy: { id: 'asc' },     // ต้อง order ถึงจะ consistent
        });

        const ms = t.stop();
        return { data, ms };
    }

    async findWithCursor(cursorId: number | undefined, limit: number) {
        const t = startTimer(`CURSOR id=${cursorId ?? 'start'}`);
        const data = await this.prisma.bankAccount.findMany({
            take: limit,
            orderBy: { id: 'asc' },
            // ถ้า cursorId มีค่า → ใส่ cursor + skip: 1
            // ถ้าไม่มี → ไม่ต้องใส่อะไร (เริ่มจากต้น)
            ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
        });
        const ms = t.stop();
        return { data, ms };
    }
    async findFilterSelectStar(bankName: string, limit: number) {
        const t = startTimer(`FILTER_SELECT_STAR`);
        const data = await this.prisma.bankAccount.findMany({
            where: { bankName, isActive: true },
            take: limit,
            orderBy: { id: 'asc' },
        });
        const ms = t.stop();
        return { count: data.length, ms };
    }
    async getStatsPrismaOrm() {
        const t = startTimer('STATS_PRISMA_ORM');
        const data = await this.prisma.bankAccount.groupBy({
            by: ['bankName', 'accountType'],   // group ตาม 2 field นี้
            _count: { id: true },              // นับจำนวน
            _avg: { balance: true },           // เฉลี่ย balance
            _sum: { balance: true },           // รวม balance
            where: { isActive: true },
            orderBy: { _sum: { balance: 'desc' } },
        });
        const ms = t.stop();
        return { data, ms };
    }


    async findFilterSelectFields(bankName: string, limit: number) {
        const t = startTimer(`FILTER_SELECT_FIELDS`);
        const data = await this.prisma.bankAccount.findMany({
            where: { bankName, isActive: true },
            take: limit,
            orderBy: { id: 'asc' },
            select: {
                id: true,
                accountNumber: true,
                balance: true,
                accountType: true,
                currency: true,
            },
        });
        const ms = t.stop();
        return { count: data.length, ms };
    }

    async getStatsRawSql() {
        const t = startTimer('STATS_RAW_SQL');
        const data = await this.prisma.$queryRaw<any[]>`
            SELECT
                "bankName",
                "accountType",
                COUNT(*)::int AS count,
                ROUND(AVG(balance))::int AS "avgBalance",
                SUM(balance)::float8 AS "totalBalance"
            FROM bank_accounts
            WHERE "isActive" = true
            GROUP BY "bankName", "accountType"
            ORDER BY "totalBalance" DESC
        `;
        const ms = t.stop();
        return { data, ms };
    }

}