import Application from "../../Application";
import ClassConstants from "../constants/ClassConstants";
import PageConstants from "../constants/PageConstants";
import PageNotFoundError from "../error/PageNotFoundError";

export default class LoadingPage {
    private _application: Application;
    private _page: HTMLElement | null;
    private _onLoaded: Function | null;
    private _onContinue: Function | null;

    constructor(application: Application, onLoaded: Function | null = null, onContinue: Function | null = null) {
        this._application = application;
        this._page = null;
        this._onLoaded = onLoaded;
        this._onContinue = onContinue;
    }

    public show(): void {
        const className = ClassConstants.LOADING_CLASS_NAME;
        const loadingPage = document.querySelector(`.${className}`) as HTMLElement;

        if (!loadingPage) throw new PageNotFoundError("loading page", className);

        this._page = loadingPage;
        this._page.classList.remove(PageConstants.PAGE_OVERLAY_HIDDEN_CLASS);
    }

    public loaded(): void {
        if (!this._page) return;

        const continueButton = this._page.querySelector(`.${ClassConstants.LOADING_CONTINUE_BUTTON_CLASS_NAME}`);

        if (!continueButton) return;

        continueButton.addEventListener("click", () => {
            if (this._onContinue) this._onContinue();
            if (this._page) this._page.classList.add(PageConstants.PAGE_OVERLAY_HIDDEN_CLASS);
        });

        continueButton.classList.remove(ClassConstants.HIDDEN);

        if (this._onLoaded) this._onLoaded();

        if (this._page) this._page.classList.add(PageConstants.PAGE_OVERLAY_HIDDEN_CLASS);
        if (this._onContinue) this._onContinue();
    }
}