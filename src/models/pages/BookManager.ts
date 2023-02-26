import Application from "../../Application";
import Book from "./Book";

export default class BookManager {
    private _application: Application;
    private _books: Book[];

    constructor(application: Application) {
        this._application = application;

        const bookElement = document.querySelector(".book--projects") as HTMLElement;
        const book = new Book(this, bookElement);
        book.update();

        this._books = [];
        this._books.push(book);
    }

    public displaySinglePage(): boolean {
        return this._application.dimensions.getAspectRatio() < 1;
    }

    public resize(): void {
        this._books.forEach((book) => book.update());
    }

    public getWidth(): number {
        return this._application.dimensions.width;
    }
}