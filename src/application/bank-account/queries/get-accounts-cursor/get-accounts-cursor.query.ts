export class GetAccountsCursorQuery {
    constructor(
        public readonly cursorId: number | undefined,
        public readonly limit: number
    ) { }
}