import BookConstants from "../constants/BookConstants";
import ClassConstants from "../constants/ClassConstants";
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
        if (this._currentPage >= this._pageList.length - 1) return;

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
        this._pageList = Array.from(this._pageListWrapper.querySelectorAll(".page:not(.page__placeholder):not(.page__extended)"));
        this._pageList.forEach((page) => {
            page.classList.remove("flipped");
            page.style.zIndex = "";
        });
    }

    private setNewPageList(): void {
        document.querySelectorAll(".page__description p").forEach((paragraph) => paragraph.classList.remove(ClassConstants.HIDDEN));
        const newPageList = [];

        if (this._bookManager.displaySinglePage()) {
            this._pageList.forEach((page) => {
                document.querySelectorAll(".page__header__left, .page__header__right").forEach((headerButton) => {
                    headerButton.classList.remove(ClassConstants.HIDDEN);
                });

                let characters = 0;
                let newPageParagraphs: HTMLElement[] = [];

                const pageHeader = (page.querySelector(".page__header")?.cloneNode(true) as HTMLElement);
                const pageDescription = page.querySelector(".page__description");

                if (pageHeader && pageDescription) {
                    ([...pageDescription.querySelectorAll("p")] as HTMLElement[]).forEach((p) => {
                        characters += p.innerHTML.length;

                        if (characters > 500) {
                            p.classList.add(ClassConstants.HIDDEN);
                            const duplicatedParagraph = p.cloneNode(true) as HTMLElement;
                            duplicatedParagraph.classList.remove(ClassConstants.HIDDEN);
                            newPageParagraphs.push(duplicatedParagraph);
                        }
                    });
                }

                const classList = [...page.classList];
                classList.push("page__extended");

                newPageList.push(page);
                newPageList.push(this.getNewPlaceholder());
                newPageList.push(this.getNewExtendedPage(pageHeader, newPageParagraphs, classList));
                newPageList.push(this.getNewPlaceholder());
            });
        } else {
            newPageList.push(this.getNewPlaceholder(true));

            document.querySelectorAll(".page__header__left, .page__header__right").forEach((headerButton) => {
                headerButton.classList.add(ClassConstants.HIDDEN);
            });

            if (this._bookManager.getWidth() < 1200) {
                this._pageList.forEach((page) => {
                    let characters = 0;
                    let newPageParagraphs: HTMLElement[] = [];

                    const pageHeader = (page.querySelector(".page__header")?.cloneNode(true) as HTMLElement);
                    const pageDescription = page.querySelector(".page__description");

                    if (pageHeader && pageDescription) {
                        ([...pageDescription.querySelectorAll("p")] as HTMLElement[]).forEach((p) => {
                            characters += p.innerHTML.length;

                            if (characters > 500) {
                                p.classList.add(ClassConstants.HIDDEN);
                                const duplicatedParagraph = p.cloneNode(true) as HTMLElement;
                                duplicatedParagraph.classList.remove(ClassConstants.HIDDEN);
                                newPageParagraphs.push(duplicatedParagraph);
                            }
                        });
                    }

                    const classList = [...page.classList];
                    classList.push("page__extended");

                    newPageList.push(page);
                    newPageList.push(this.getNewExtendedPage(null, newPageParagraphs, classList));
                });
            } else {
                newPageList.push(...this._pageList);
            }

            newPageList[1].classList.add("flipped");

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

            page.querySelectorAll(".page__header__left").forEach((headerButtonLeft) => {
                const newHeaderButtonLeft = headerButtonLeft.cloneNode(true);
                headerButtonLeft.parentNode?.replaceChild(newHeaderButtonLeft, headerButtonLeft);
                newHeaderButtonLeft.addEventListener("click", () => this.flipDown());
            });

            page.querySelectorAll(".page__header__right").forEach((headerButtonRight) => {
                const newHeaderButtonRight = headerButtonRight.cloneNode(true);
                headerButtonRight.parentNode?.replaceChild(newHeaderButtonRight, headerButtonRight);
                newHeaderButtonRight.addEventListener("click", () => this.flipUp());
            });
        }
    }

    private getNewPlaceholder(flipped: boolean = false): HTMLElement {
        const placeholder = document.createElement("div");

        placeholder.classList.add("page", "page__placeholder");
        if (flipped) placeholder.classList.add("flipped");

        return placeholder;
    }

    private getNewExtendedPage(header: HTMLElement | null, paragraphList: HTMLElement[], classList: string[]): HTMLElement {
        const extendedPage = document.createElement("article");

        const extendedPageDescription = document.createElement("div");
        extendedPageDescription.classList.add("page__description");
        paragraphList.forEach((paragraph) => extendedPageDescription.appendChild(paragraph));

        if (header) extendedPage.appendChild(header);
        extendedPage.appendChild(extendedPageDescription);
        extendedPage.classList.add(...classList);

        return extendedPage;
    }
}