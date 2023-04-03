import DomUtils from "../../utils/DomUtils";
import EventEmitter from "../../utils/EventEmitter";
import ClassConstants from "../constants/ClassConstants";

export default class BookControls extends EventEmitter {
    private _bookControlsElement: HTMLElement;
    private _closeButtonElement: HTMLElement;
    private _leftButtonElement: HTMLElement;
    private _rightButtonElement: HTMLElement;

    constructor() {
        super();

        const bookControlsElement = DomUtils.getElement(
            document,
            `.${ClassConstants.BOOK_CONTROLS_CLASS_NAME}`
        );

        const closeButtonElement = DomUtils.getElement(
            bookControlsElement,
            `.${ClassConstants.BOOK_CONTROLS_CLOSE_BUTTON_CLASS_NAME}`
        );

        const leftButtonElement = DomUtils.getElement(
            bookControlsElement,
            `.${ClassConstants.BOOK_CONTROLS_LEFT_BUTTON_CLASS_NAME}`
        );

        const rightButtonElement = DomUtils.getElement(
            bookControlsElement,
            `.${ClassConstants.BOOK_CONTROLS_RIGHT_BUTTON_CLASS_NAME}`
        );

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

    public hideToLeft(): void {
        this._leftButtonElement.classList.add(ClassConstants.HIDDEN);
    }

    public showToLeft(): void {
        this._leftButtonElement.classList.remove(ClassConstants.HIDDEN);
    }

    public hideToRight(): void {
        this._rightButtonElement.classList.add(ClassConstants.HIDDEN);
    }

    public showToRight(): void {
        this._rightButtonElement.classList.remove(ClassConstants.HIDDEN);
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

        this._bookControlsElement.addEventListener("wheel", (event: WheelEvent) => {
            document.querySelectorAll(".page").forEach((page) => {
                page.scrollBy({ top: event.deltaY / 4 });
            });
        });
    }
}
