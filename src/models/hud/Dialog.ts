import DomUtils from "../../utils/DomUtils";
import EventEmitter from "../../utils/EventEmitter";
import ClassConstants from "../constants/ClassConstants";
import Observable from "../logic/Observable";
import Hud from "./Hud";

export default class Dialog extends EventEmitter {
    private _hud: Hud;
    private _element: HTMLElement;
    private _textElement: HTMLElement;
    private _nextButtonElements: HTMLElement[];
    private _skipButtonElements: HTMLElement[];
    private _textQueue: string[];
    private _continue: Observable;
    private _skip: Observable;

    constructor(hud: Hud) {
        super();

        this._hud = hud;
        this._textQueue = [];

        this._element = DomUtils.getElement(
            document,
            `.${ClassConstants.DIALOG_CLASS_NAME}`
        );
        this._textElement = DomUtils.getElement(
            this._element,
            `.${ClassConstants.DIALOG_CONTENT_CLASS_NAME} div`
        );
        this._nextButtonElements = DomUtils.getElements(
            this._element,
            `.${ClassConstants.DIALOG_NEXT_BUTTON_CLASS_NAME}`
        );
        this._skipButtonElements = DomUtils.getElements(
            this._element,
            `.${ClassConstants.DIALOG_SKIP_BUTTON_CLASS_NAME}`
        );

        this._continue = new Observable();
        this._skip = new Observable();

        this.addEventListeners();

        this.hide();
    }

    public addOnSkipCallback(value: Function) {
        this._skip.addEventListener("activate", value);
    }

    public show(): void {
        this._element.classList.remove(ClassConstants.HIDDEN);
    }

    public hide(): void {
        this._element.classList.add(ClassConstants.HIDDEN);
    }

    public async writeText(...text: string[]): Promise<void> {
        this._textQueue.push(...text);

        while (this._textQueue.length > 0) {
            await this.writeLine(this._textQueue[0]);

            await new Promise((resolve) => {
                const resolveCallback = () => {
                    resolve(null);
                    this._continue.removeEventListener(
                        "activate",
                        resolveCallback
                    );
                };

                this._continue.addEventListener("activate", resolveCallback);
            });

            this._textQueue.splice(0, 1);
        }
    }

    private addEventListeners(): void {
        this._nextButtonElements.forEach((nextButton) =>
            nextButton.addEventListener("click", () => {
                this._continue.activate();
            })
        );

        this._skipButtonElements.forEach((skipButton) =>
            skipButton.addEventListener("click", () => {
                this._textQueue = [];
                this._textElement.innerHTML = "";
                this._skip.activate();
            })
        );
    }

    private async writeLine(line: string): Promise<void> {
        this._textElement.innerHTML = "";

        for (const character of line) {
            this._textElement.innerHTML += character;
            const skip = await new Promise((resolve) => {
                const resolveCallback = () => {
                    resolve(true);
                    this._skip.removeEventListener("activate", resolveCallback);
                };

                this._skip.addEventListener("activate", resolveCallback);

                setTimeout(() => resolve(false), 20);
            });

            if (skip) return;
        }
    }
}
