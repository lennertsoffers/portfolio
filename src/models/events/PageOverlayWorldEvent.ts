import PageOverlayType from "../enum/PageOverlayType";
import WorldEvent from "./WorldEvent";

export default class PageOverlayWorldEvent extends WorldEvent {
    private _pageOverlayType: PageOverlayType;

    constructor(pageOverlayType: PageOverlayType) {
        super();

        this._pageOverlayType = pageOverlayType;
    }

    public trigger(): void {
        this.showCorrectPageOverlay();
    }
    public end(): void {
        this.hidePageOverlays();
    }

    private showCorrectPageOverlay(): void {
        console.log("Show page overlay of page " + this._pageOverlayType);
    }

    private hidePageOverlays(): void {
        console.log("Close page overlay");
    }
}