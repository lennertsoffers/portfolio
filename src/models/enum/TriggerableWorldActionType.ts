import EnumLiteralDoesNotExistError from "../error/EnumLiteralDoesNotExistError";

enum TriggerableWorldActionType {
    ABOUT_ME = "ABOUT_ME",
    INTERNSHIP = "INTERNSHIP",
    PROJECTS = "PROJECTS"
}

export const from = (literal: string): TriggerableWorldActionType => {
    const uppercaseLiteral = literal.toUpperCase();

    if (!Object.keys(TriggerableWorldActionType).includes(uppercaseLiteral))
        throw new EnumLiteralDoesNotExistError(
            literal,
            "TriggerableWorldActionType"
        );

    return uppercaseLiteral as TriggerableWorldActionType;
};

export default TriggerableWorldActionType;
