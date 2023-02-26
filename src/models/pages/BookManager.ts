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
        book.update();

        this._books = [];
        this._books.push(book);

        this._activeBook = book;

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

    private addFlipListener(): void {
        document.addEventListener("click", () => {
            this._activeBook.flipUp();
        });

        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this._activeBook.flipDown();
        });
    }
}