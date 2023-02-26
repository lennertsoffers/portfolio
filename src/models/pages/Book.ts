import BookConstants from "../constants/BookConstants";
import ElementNotFoundError from "../error/ElementNotFoundError";
import BookManager from "./BookManager";

export default class Book {
    private _bookManager: BookManager;
    private _element: HTMLElement;
    private _pageListWrapper: HTMLElement;
    private _pageList: HTMLElement[];
    private _currentPage: number;

    constructor(bookManager: BookManager, element: HTMLElement) {
        this._bookManager = bookManager;
        this._element = element;

        const pageListWrapper = this._element.querySelector(".pages") as HTMLElement;
        if (!pageListWrapper) throw new ElementNotFoundError(".pages");
        this._pageListWrapper = pageListWrapper;

        this._pageList = [];
        this._currentPage = this._bookManager.displaySinglePage() ? 1 : 3;
    }

    public update(): void {
        this.updateBook();
        this.resetPageList();
        this.setNewPageList();
        this.setNewPageListWrapperContent();
        this.initializeNewPageList();
    }

    public flipUp(): void {
        if (this._currentPage >= this._pageList.length) return;

        const page = this.getPage(this._currentPage);
        page.classList.add("flipped");
        const nextElementSibling = page.nextElementSibling;
        if (nextElementSibling) nextElementSibling.classList.add("flipped");
        this._currentPage += 2;
    }

    public flipDown(): void {
        if (this._bookManager.displaySinglePage() && this._currentPage <= 1) return;
        if (!this._bookManager.displaySinglePage() && this._currentPage <= 3) return;

        const page = this.getPage(this._currentPage - 1);
        page.classList.remove("flipped");
        const previousElementSibling = page.previousElementSibling;
        if (previousElementSibling) previousElementSibling.classList.remove("flipped");
        this._currentPage -= 2;
    }

    private getPage(pageNumber: number): HTMLElement {
        return this._element.querySelector(`.page[data-page-id="${pageNumber}"]`) as HTMLElement;
    }

    private updateBook(): void {
        // Update breakpoint classes
        let bookDimensionClassName = "";

        BookConstants.BOOK_DIMENSIONS.forEach((bookDimensionEntry) => {
            this._element.classList.remove(bookDimensionEntry.className);

            if (this._bookManager.getWidth() > bookDimensionEntry.width) {
                bookDimensionClassName = bookDimensionEntry.className;
            }
        });

        this._element.classList.add(bookDimensionClassName);

        // Update single page
        if (this._bookManager.displaySinglePage()) {
            this._element.classList.add(BookConstants.BOOK_SINGLE_PAGE_CLASS);
            this._element.classList.remove(BookConstants.BOOK_DOUBLE_PAGE_CLASS);
        } else {
            this._element.classList.add(BookConstants.BOOK_DOUBLE_PAGE_CLASS);
            this._element.classList.remove(BookConstants.BOOK_SINGLE_PAGE_CLASS);
        }

        // Update current page number
        this._currentPage = this._bookManager.displaySinglePage() ? 1 : 3;
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

            page.setAttribute("data-page-id", `${i + 1}`);
        }
    }

    private getNewPlaceholder(flipped: boolean = false): HTMLElement {
        const placeholder = document.createElement("div");

        placeholder.classList.add("page", "page__placeholder");
        if (flipped) placeholder.classList.add("flipped");

        return placeholder;
    }
}