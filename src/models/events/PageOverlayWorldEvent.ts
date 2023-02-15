import PageOverlayType from "../enum/PageOverlayType";
import PageManager from "../pages/PageManager";
import WorldEvent from "./WorldEvent";

export default class PageOverlayWorldEvent extends WorldEvent {
    private _pageOverlayType: PageOverlayType;
    private _pageManager: PageManager;

    constructor(pageOverlayType: PageOverlayType, pageManager: PageManager) {
        super();

        this._pageOverlayType = pageOverlayType;
        this._pageManager = pageManager;

        this._pageManager.addEventListener("closePage", () => this.end());
    }

    public handleTrigger(): void {
        this.showCorrectPageOverlay();
    }
    public handleEnd(): void {
        this.hidePageOverlays();
    }

    private showCorrectPageOverlay(): void {
        this._pageManager.showPage(this._pageOverlayType);
    }

    private hidePageOverlays(): void {
        this._pageManager.closeAll();
    }
}