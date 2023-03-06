import EventEmitter from "../../utils/EventEmitter";
import ClassConstants from "../constants/ClassConstants";
import ElementNotFoundError from "../error/ElementNotFoundError";

export default class BookControls extends EventEmitter {
    private _bookControlsElement: HTMLElement;
    private _closeButtonElement: HTMLElement;
    private _leftButtonElement: HTMLElement;
    private _rightButtonElement: HTMLElement;

    constructor() {
        super();

        const bookControlsElement = document.querySelector(`.${ClassConstants.BOOK_CONTROLS_CLASS_NAME}`) as HTMLElement;
        if (!bookControlsElement) throw new ElementNotFoundError(ClassConstants.BOOK_CONTROLS_CLASS_NAME);
        const closeButtonElement = bookControlsElement.querySelector(`.${ClassConstants.BOOK_CONTROLS_CLOSE_BUTTON_CLASS_NAME}`) as HTMLElement;
        if (!closeButtonElement) throw new ElementNotFoundError(ClassConstants.BOOK_CONTROLS_CLOSE_BUTTON_CLASS_NAME);
        const leftButtonElement = bookControlsElement.querySelector(`.${ClassConstants.BOOK_CONTROLS_LEFT_BUTTON_CLASS_NAME}`) as HTMLElement;
        if (!leftButtonElement) throw new ElementNotFoundError(ClassConstants.BOOK_CONTROLS_LEFT_BUTTON_CLASS_NAME);
        const rightButtonElement = bookControlsElement.querySelector(`.${ClassConstants.BOOK_CONTROLS_RIGHT_BUTTON_CLASS_NAME}`) as HTMLElement;
        if (!rightButtonElement) throw new ElementNotFoundError(ClassConstants.BOOK_CONTROLS_RIGHT_BUTTON_CLASS_NAME);
        this._bookControlsElement = bookControlsElement;
        this._closeButtonElement = closeButtonElement;
        this._leftButtonElement = leftButtonElement;
        this._rightButtonElement = rightButtonElement;

        this.addBookControls();
        this.hide();
    }

    public show(): void {
        this._bookControlsElement.classList.remove(ClassConstants.HIDDEN);
    }

    public hide(): void {
        this._bookControlsElement.classList.add(ClassConstants.HIDDEN);
    }

    private addBookControls(): void {
        this._closeButtonElement.addEventListener("click", (event) => {
            event.stopPropagation();
            this.trigger("close");
        });
        this._leftButtonElement.addEventListener("click", (event) => {
            event.stopPropagation();
            this.trigger("left");
        });
        this._rightButtonElement.addEventListener("click", (event) => {
            event.stopPropagation();
            this.trigger("right");
        });
    }
}