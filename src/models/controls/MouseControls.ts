import DomUtils from "../../utils/DomUtils";
import EventEmitter from "../../utils/EventEmitter";

export default class MouseControls extends EventEmitter {
    private _canvasElement: HTMLElement;

    constructor() {
        super();

        this._canvasElement = DomUtils.getElement(document, "canvas.webgl");

        this.addEventListeners();
    }

    private addEventListeners(): void {
        this._canvasElement.addEventListener("mousedown", () =>
            this.trigger("mousedown")
        );
        this._canvasElement.addEventListener("mouseup", () =>
            this.trigger("mouseup")
        );
    }
}
