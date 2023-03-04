import Application from "../../Application";
import BookConstants from "../constants/BookConstants";
import Book from "./Book";

export default class BookManager {
    private _application: Application;
    private _books: Book[];
    private _activeBook: Book;

    constructor(application: Application) {
        this._application = application;

        const bookElement = document.querySelector(".book--projects") as HTMLElement;
        const book = new Book(this, bookElement);

        this._books = [];
        this._books.push(book);

        this._activeBook = book;

        book.update();


        this.addFlipListener();
    }

    public displaySinglePage(): boolean {
        return this._application.dimensions.getAspectRatio() < BookConstants.BOOK_DOUBLE_PAGE_ASPECT_RATIO;
    }

    public resize(): void {
        this._books.forEach((book) => book.update());
    }

    public getWidth(): number {
        return this._application.dimensions.width;
    }

    public getHeight(): number {
        return this._application.dimensions.height;
    }

    private addFlipListener(): void {
        this._application.touchControls.addEventListener("swipeLeft", () => this._activeBook.flipUp());
        this._application.touchControls.addEventListener("swipeRight", () => this._activeBook.flipDown());

        document.addEventListener("click", () => {
            this._activeBook.flipUp();
        });

        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this._activeBook.flipDown();
        });
    }
}