import EnumLiteralDoesNotExistError from "../error/EnumLiteralDoesNotExistError";

enum WorldZone {
    NONE = "NONE",
    ABOUT_ME = "ABOUT_ME",
    INTERNSHIP = "INTERNSHIP",
    PROJECTS = "PROJECTS"
}

export const from = (literal: string): WorldZone => {
    const uppercaseLiteral = literal.toUpperCase();

    if (!Object.keys(WorldZone).includes(uppercaseLiteral))
        throw new EnumLiteralDoesNotExistError(literal, "WorldZone");

    return uppercaseLiteral as WorldZone;
};

export default WorldZone;
