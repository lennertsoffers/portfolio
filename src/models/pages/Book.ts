import ElementNotFoundError from "../error/ElementNotFoundError";
import BookManager from "./BookManager";

export default class Book {
    private _bookManager: BookManager;
    private _element: HTMLElement;
    private _pageListWrapper: HTMLElement;
    private _pageList: HTMLElement[];

    constructor(bookManager: BookManager, element: HTMLElement) {
        this._bookManager = bookManager;
        this._element = element;

        const pageListWrapper = this._element.querySelector(".pages") as HTMLElement;
        if (!pageListWrapper) throw new ElementNotFoundError(".pages");
        this._pageListWrapper = pageListWrapper;

        this._pageList = [];
    }

    public updatePages(): void {
        this.resetPageList();
        this.setNewPageList();
        this.setNewPageListWrapperContent();
        this.initializeNewPageList();
    }

    private resetPageList(): void {
        this._pageList = Array.from(this._pageListWrapper.querySelectorAll(".page:not(.page__placeholder)"));
        this._pageList.forEach((page) => {
            page.classList.remove("flipped");
            page.style.zIndex = "";
        });
    }

    private setNewPageList(): void {
        const newPageList = [];

        if (this._bookManager.displaySinglePage()) {
            this._pageList.forEach((page) => {
                newPageList.push(page);
                newPageList.push(this.getNewPlaceholder());
            });
        } else {
            newPageList.push(this.getNewPlaceholder(true));

            this._pageList[0].classList.add("flipped");
            newPageList.push(...this._pageList);

            if (newPageList.length % 2 === 0) {
                newPageList.push(this.getNewPlaceholder());
            }
        }

        this._pageList = newPageList;
    }

    private setNewPageListWrapperContent(): void {
        this._pageListWrapper.innerHTML = "";
        this._pageListWrapper.append(...this._pageList);
    }

    private initializeNewPageList(): void {
        for (let i = 0; i < this._pageList.length; i++) {
            const page = this._pageList[i];

            if (i % 2 === 0) {
                page.style.zIndex = `${this._pageList.length - i}`;
            }

            if (!page.classList.contains("page__placeholder")) {
                page.setAttribute("data-page-id", `${i + 1}`);

                page.addEventListener("click", () => {
                    const pageNumber = parseInt(page.getAttribute("data-page-id") as string);

                    if (this._bookManager.displaySinglePage()) {
                        if (pageNumber < this._pageList.length - 1) this.setFlippedStatus(page, pageNumber);
                    } else {
                        if (pageNumber > 2 && pageNumber < this._pageList.length) this.setFlippedStatus(page, pageNumber);
                    }
                });
            }
        }
    }

    private setFlippedStatus(page: HTMLElement, pageNumber: number): void {
        if (pageNumber % 2 === 0) {
            page.classList.remove("flipped");
            const previousElementSibling = page.previousElementSibling;
            if (previousElementSibling) previousElementSibling.classList.remove("flipped");
        } else {
            page.classList.add("flipped");
            const nextElementSibling = page.nextElementSibling;
            if (nextElementSibling) nextElementSibling.classList.add("flipped");
        }
    }

    private getNewPlaceholder(flipped: boolean = false): HTMLElement {
        const placeholder = document.createElement("div");

        placeholder.classList.add("page", "page__placeholder");
        if (flipped) placeholder.classList.add("flipped");

        return placeholder;
    }
}