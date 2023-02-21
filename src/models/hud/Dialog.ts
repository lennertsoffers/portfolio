import EventEmitter from "../../utils/EventEmitter";
import ClassConstants from "../constants/ClassConstants";
import ElementNotFoundError from "../error/ElementNotFoundError";
import Hud from "./Hud";

export default class Dialog extends EventEmitter {
    private _hud: Hud;
    private _element: HTMLElement;
    private _textQueue: string[];

    constructor(hud: Hud) {
        super();

        this._hud = hud;
        this._textQueue = [];

        const element = document.querySelector(`.${ClassConstants.HUD_CLASS_NAME}`) as HTMLElement;
        if (!element) throw new ElementNotFoundError(ClassConstants.HUD_CLASS_NAME);
        this._element = element;
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
            this._textQueue.splice(0, 1);

            await new Promise((resolve) => {
                this._element.addEventListener("click", resolve);
                setTimeout(() => {
                    this._element.removeEventListener("click", resolve);
                    resolve(null);
                }, 4000);
            });
        }

        this.writeLine("");
    }

    private async writeLine(line: string): Promise<void> {
        this._element.innerHTML = "";

        for (const character of line) {
            this._element.innerHTML += character;
            await new Promise((resolve) => setTimeout(resolve, 20));
        }
    }
}