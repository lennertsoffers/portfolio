export default class ElementNotFoundError extends Error {
    constructor(className: string) {
        super(
            `The element with class name '${className}' was not found in the document`
        );
    }
}
