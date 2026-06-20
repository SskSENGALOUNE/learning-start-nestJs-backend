import { AccountType } from "generated/prisma/enums";

export class GetCompositeFilterQuery {
    constructor(
        public readonly accountType: AccountType,
        public readonly isActive: boolean,
        public readonly limit: number,
    ) { }
}
