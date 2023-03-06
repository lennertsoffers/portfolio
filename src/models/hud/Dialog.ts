import EventEmitter from "../../utils/EventEmitter";
import ClassConstants from "../constants/ClassConstants";
import ElementNotFoundError from "../error/ElementNotFoundError";
import Hud from "./Hud";

export default class Dialog extends EventEmitter {
    private _hud: Hud;
    private _element: HTMLElement;
    private _textQueue: string[];
    private _skipWriteDelay: boolean;

    constructor(hud: Hud) {
        super();

        this._hud = hud;
        this._textQueue = [];
        this._skipWriteDelay = false;

        const element = document.querySelector(`.${ClassConstants.DIALOG_CLASS_NAME}`) as HTMLElement;
        if (!element) throw new ElementNotFoundError(ClassConstants.DIALOG_CLASS_NAME);
        this._element = element;

        this.hide();
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
            const skipWriteDelay = () => this._skipWriteDelay = true;
            this._element.addEventListener("click", skipWriteDelay);

            await this.writeLine(this._textQueue[0]);

            this._element.removeEventListener("click", skipWriteDelay);

            this._textQueue.splice(0, 1);

            await new Promise((resolve) => {
                this._element.addEventListener("click", () => {
                    this._element.removeEventListener("click", resolve);
                    resolve(null);
                });
            });
        }

        this.writeLine("");
    }

    private async writeLine(line: string): Promise<void> {
        this._element.innerHTML = "";

        for (const character of line) {
            if (this._skipWriteDelay) {
                this._skipWriteDelay = false;
                this._element.innerHTML = line;

                return;
            }

            this._element.innerHTML += character;
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
    }
}