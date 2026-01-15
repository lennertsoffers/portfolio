export default class PageNotFoundError extends Error {
    constructor(pageName: string, className: string) {
        super(
            `The page '${pageName}' with class '${className}' was not found in the document`
        );
    }
}
