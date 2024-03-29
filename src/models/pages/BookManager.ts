import Application from "../../Application";
import BookInfoEntry from "../../types/entries/BookInfoEntry";
import DomUtils from "../../utils/DomUtils";
import BookConstants from "../constants/BookConstants";
import ClassConstants from "../constants/ClassConstants";
import Book from "./Book";

export default class BookManager {
    private _application: Application;
    private _books: BookInfoEntry[];
    private _activeBook: BookInfoEntry | null;

    constructor(application: Application) {
        this._application = application;

        this._books = [];
        this._activeBook = null;

        this.setupBooks();

        this.addFlipListener();
    }

    public get application(): Application {
        return this._application;
    }

    public getBookName(): string {
        return this._activeBook ? this._activeBook.name : "";
    }

    public selectBook(name: string): void {
        this._books.forEach((bookInfo) => {
            if (bookInfo.name === name) this._activeBook = bookInfo;
        });

        this._application.linkContainer.show();
        this._activeBook && this._activeBook.book.update();
        this.updateNavigation();
    }

    public unselectBook(): void {
        this._activeBook = null;
        this._application.linkContainer.hide();
    }

    public displaySinglePage(): boolean {
        return (
            this._application.dimensions.getAspectRatio() <
            BookConstants.BOOK_DOUBLE_PAGE_ASPECT_RATIO
        );
    }

    public resize(): void {
        this._activeBook && this._activeBook.book.update();
        this.updateNavigation();
    }

    public getWidth(): number {
        return this._application.dimensions.width;
    }

    public getHeight(): number {
        return this._application.dimensions.height;
    }

    private addFlipListener(): void {
        this._application.touchControls.addEventListener("swipeLeft", () => {
            this._activeBook && this._activeBook.book.flipUp();
            this.updateNavigation();
            this._activeBook && this._activeBook.book.showLinks();
        });
        this._application.touchControls.addEventListener("swipeRight", () => {
            this._activeBook && this._activeBook.book.flipDown();
            this.updateNavigation();
            this._activeBook && this._activeBook.book.showLinks();
        });
        this._application.bookControls.addEventListener("left", () => {
            this._activeBook && this._activeBook.book.flipDown();
            this.updateNavigation();
            this._activeBook && this._activeBook.book.showLinks();
        });
        this._application.bookControls.addEventListener("right", () => {
            this._activeBook && this._activeBook.book.flipUp();
            this.updateNavigation();
            this._activeBook && this._activeBook.book.showLinks();
        });
        this._application.touchControls.addEventListener("swipeUp", () => {
            document.querySelectorAll(".page").forEach((page) => {
                page.scrollBy({ top: 15 });
            });
        });
        this._application.touchControls.addEventListener("swipeDown", () => {
            document.querySelectorAll(".page").forEach((page) => {
                page.scrollBy({ top: -15 });
            });
        });
    }

    private updateNavigation(): void {
        if (!this._activeBook) return;

        if (this._activeBook.book.hasPageLeft()) {
            this._application.bookControls.showToLeft();
        } else {
            this._application.bookControls.hideToLeft();
        }

        if (this._activeBook.book.hasPageRight()) {
            this._application.bookControls.showToRight();
        } else {
            this._application.bookControls.hideToRight();
        }
    }

    private setupBooks(): void {
        this._books.push(
            ...BookConstants.BOOKS_INFO.map((bookInfo) => {
                return {
                    name: bookInfo.title,
                    book: new Book(
                        this,
                        DomUtils.getElement(document, `.${bookInfo.className}`)
                    )
                } as BookInfoEntry;
            })
        );

        document
            .querySelectorAll(".page__link")
            .forEach((pageLink) => pageLink.classList.add(ClassConstants.HIDDEN));
    }
}
