import ElementNotFoundError from "../models/error/ElementNotFoundError";

export default class DomUtils {
    public static getElement(
        parent: HTMLElement | Document,
        querySelector: string
    ): HTMLElement {
        const element = parent.querySelector(querySelector) as HTMLElement;
        if (!element) throw new ElementNotFoundError(querySelector);
        return element;
    }

    public static getElements(
        parent: HTMLElement | Document,
        querySelector: string
    ): HTMLElement[] {
        const elements = parent.querySelectorAll(querySelector);
        if (elements.length === 0)
            throw new ElementNotFoundError(querySelector);
        return [...elements].map((element) => element as HTMLElement);
    }
}
