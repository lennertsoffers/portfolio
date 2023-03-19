import BookDimensionEntry from "../../types/entries/BookDimensionEntry";

export default class BookConstants {
    public static BOOK_DOUBLE_PAGE_ASPECT_RATIO = 1;
    public static BOOK_SINGLE_PAGE_CLASS = "book__single";
    public static BOOK_DOUBLE_PAGE_CLASS = "book__double";
    public static BOOK_DIMENSIONS: BookDimensionEntry[] = [
        {
            width: 0,
            className: "book__extra_small"
        },
        {
            width: 576,
            className: "book__small"
        },
        {
            width: 768,
            className: "book__medium"
        },
        {
            width: 992,
            className: "book__large"
        },
        {
            width: 1200,
            className: "book__extra_large"
        }
    ];
    public static BOOKS_INFO = [
        {
            title: "PROJECTS",
            className: "book--projects"
        },
        {
            title: "ABOUT_ME",
            className: "book--about_me"
        },
        {
            title: "CV",
            className: "book--internship"
        }
    ];
}
