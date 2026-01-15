import DomUtils from "../../utils/DomUtils";
import ClassConstants from "../constants/ClassConstants";
import PageConstants from "../constants/PageConstants";
import PageNotFoundError from "../error/PageNotFoundError";

export default class LoadingPage {
    private _page: HTMLElement | null;
    private _onLoaded: Function | null;
    private _onContinue: Function | null;
    private _pressedContinue: boolean;

    constructor(
        onLoaded: Function | null = null,
        onContinue: Function | null = null
    ) {
        this._page = null;
        this._onLoaded = onLoaded;
        this._onContinue = onContinue;
        this._pressedContinue = false;
    }

    public show(): void {
        const className = ClassConstants.LOADING_CLASS_NAME;
        const loadingPage = document.querySelector(
            `.${className}`
        ) as HTMLElement;

        if (!loadingPage)
            throw new PageNotFoundError("loading page", className);

        this._page = loadingPage;
    }

    public loaded(): void {
        if (!this._page) return;

        const continueButton = DomUtils.getElement(
            this._page,
            `.${ClassConstants.LOADING_CONTINUE_BUTTON_CLASS_NAME}`
        );
        const loadingText = DomUtils.getElement(
            this._page,
            `.${ClassConstants.LOADING_TEXT_CLASS_NAME}`
        );

        continueButton.addEventListener("click", async () => {
            if (!this._onContinue || !this._page || this._pressedContinue)
                return;

            this._pressedContinue = true;

            await this._onContinue();
            this._page.classList.add(PageConstants.PAGE_OVERLAY_HIDDEN_CLASS);
        });

        loadingText.classList.add(ClassConstants.HIDDEN);
        continueButton.classList.remove(ClassConstants.HIDDEN);

        if (this._onLoaded) this._onLoaded();
    }
}
