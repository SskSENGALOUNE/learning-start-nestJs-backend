import { AccountType, Currency } from "generated/prisma/enums"

export class BankAccountEntity {
    id: number
    userId: number
    accountNumber: string
    bankName: string
    balance: number
    accountType: AccountType
    interestRate: number
    currency: Currency
    isActive: boolean
    lastTransactionAt: Date | null
    createdAt: Date
}
