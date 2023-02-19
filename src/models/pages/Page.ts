import { Vector3 } from "three";
import PageConstants from "../constants/PageConstants";
import PageOverlayType from "../enum/PageOverlayType";
import PageNotFoundError from "../error/PageNotFoundError";

export default class Page {
    private _pageType: PageOverlayType;
    private _hidden: boolean;
    private _htmlElement: HTMLElement;
    private _onClose: Function;

    constructor(pageType: PageOverlayType, className: string) {
        this._pageType = pageType;
        this._hidden = true;

        const htmlElement = document.querySelector(`.${className}`) as HTMLElement;
        if (!htmlElement) throw new PageNotFoundError(pageType.toString(), className);

        this._htmlElement = htmlElement;
        this._onClose = () => { };

        this.addEventListeners();
    }

    public get pageType(): PageOverlayType {
        return this._pageType;
    }

    public set onClose(value: Function) {
        this._onClose = value;
    }

    public show(): void {
        this._hidden = false;
        this._htmlElement.classList.remove(PageConstants.PAGE_OVERLAY_HIDDEN_CLASS);
    }

    public hide(): void {
        this._hidden = true;
        this._htmlElement.classList.add(PageConstants.PAGE_OVERLAY_HIDDEN_CLASS);
    }

    public isVisible(): boolean {
        return !this._hidden;
    }

    private addEventListeners(): void {
        const closeButton = this._htmlElement.querySelector(`.${PageConstants.PAGE_OVERLAY_HIDE_BUTTON_CLASS}`) as HTMLElement;
        if (!closeButton) return;

        closeButton.addEventListener("click", () => this._onClose());
    }
}