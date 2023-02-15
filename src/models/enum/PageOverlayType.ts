import EnumLiteralDoesNotExistError from "../error/EnumLiteralDoesNotExistError";

enum PageOverlayType {
    ABOUT_ME = "ABOUT_ME",
    CV = "CV",
    PROJECTS = "PROJECTS"
}

export const valueOf = (literal: string): PageOverlayType => {
    const uppercaseLiteral = literal.toUpperCase();

    if (!Object.keys(PageOverlayType).includes(uppercaseLiteral)) throw new EnumLiteralDoesNotExistError(literal, "PageOverlayType");

    return uppercaseLiteral as PageOverlayType;
};

export default PageOverlayType;