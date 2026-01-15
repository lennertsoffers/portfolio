import Application from "../../Application";
import EventEmitter from "../../utils/EventEmitter";
import PageConstants from "../constants/PageConstants";
import PageOverlayType from "../enum/PageOverlayType";
import Page from "./Page";

export default class PageManager extends EventEmitter {
    private _application: Application;
    private _pages: Page[];

    constructor(application: Application) {
        super();
        this._application = application;
        this._pages = [];
        this.createPages();

        this._application.bookControls.addEventListener("close", () =>
            this.closeAll()
        );
    }

    public get application(): Application {
        return this._application;
    }

    public showPage(pageType: PageOverlayType): void {
        this._pages.forEach((page) => {
            if (page.pageType === pageType) page.show();
            else if (page.isVisible()) page.hide();
        });
    }

    public closeAll(): void {
        this.trigger("closePage");

        this._pages.forEach((page) => {
            if (page.isVisible()) page.hide();
        });

        this._application.bookControls.hide();
    }

    private createPages(): void {
        PageConstants.PAGE_DATA_LIST.forEach((pageDataEntry) => {
            const page = new Page(
                this,
                pageDataEntry.pageType,
                pageDataEntry.className
            );
            page.onClose = () => this.trigger("closePage");
            this._pages.push(page);
        });
    }
}
