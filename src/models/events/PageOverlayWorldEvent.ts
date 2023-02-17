import Application from "../../Application";
import PageOverlayType from "../enum/PageOverlayType";
import PageManager from "../pages/PageManager";
import WorldEvent from "./WorldEvent";

export default class PageOverlayWorldEvent extends WorldEvent {
    private _pageOverlayType: PageOverlayType;
    private _application: Application;
    private _onEnd: Function;

    constructor(pageOverlayType: PageOverlayType, application: Application, onEnd: Function = () => { }) {
        super();

        this._application = application;
        this._pageOverlayType = pageOverlayType;
        this._onEnd = onEnd;
        this._application.pageManager.addEventListener("closePage", () => this.end());
    }

    public set onEnd(value: Function) {
        this._onEnd = value;
    }

    public handleTrigger(): void {
        this.showCorrectPageOverlay();
    }
    public handleEnd(): void {
        this.hidePageOverlays();
        this._onEnd();
    }

    private showCorrectPageOverlay(): void {
        this._application.pageManager.showPage(this._pageOverlayType);
    }

    private hidePageOverlays(): void {
        this._application.pageManager.closeAll();
    }
}