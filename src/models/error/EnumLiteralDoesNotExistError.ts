export default class EnumLiteralDoesNotExistError extends Error {
    constructor(literal: string, enumName: string) {
        super(`The enum literal '${literal}' does not exists in the enum ${enumName}`);
    }
}