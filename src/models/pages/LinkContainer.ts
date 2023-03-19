import ReferenceValue from "../../types/interfaces/ReferenceValue";
import DomUtils from "../../utils/DomUtils";
import ClassConstants from "../constants/ClassConstants";

export default class LinkContainer {
    private _linkContainer: HTMLElement;
    private _linkContainerLeft: HTMLElement;
    private _linkContainerCenter: HTMLElement;
    private _linkContainerRight: HTMLElement;

    private _leftInnerHtmlReference: ReferenceValue;
    private _centerInnerHtmlReference: ReferenceValue;
    private _rightInnerHtmlReference: ReferenceValue;

    private _isHandlingWaitFor: boolean;

    private _waitFor: Promise<void>[];

    constructor() {
        this._linkContainer = DomUtils.getElement(
            document,
            `.${ClassConstants.LINK_CONTAINER}`
        );
        this._linkContainerLeft = DomUtils.getElement(
            this._linkContainer,
            `.${ClassConstants.LINK_CONTAINER_LEFT}`
        );
        this._linkContainerCenter = DomUtils.getElement(
            this._linkContainer,
            `.${ClassConstants.LINK_CONTAINER_CENTER}`
        );
        this._linkContainerRight = DomUtils.getElement(
            this._linkContainer,
            `.${ClassConstants.LINK_CONTAINER_RIGHT}`
        );

        this._waitFor = [];
        this._leftInnerHtmlReference = {
            value: ""
        };
        this._centerInnerHtmlReference = {
            value: ""
        };
        this._rightInnerHtmlReference = {
            value: ""
        };

        this._isHandlingWaitFor = false;

        // this.hide();
    }

    public show(): void {
        this._linkContainer.classList.remove(ClassConstants.HIDDEN);
    }

    public hide(): void {
        this._linkContainer.classList.add(ClassConstants.HIDDEN);
    }

    public reset(): void {
        this.resetContainer(this._linkContainerLeft);
        this.resetContainer(this._linkContainerCenter);
        this.resetContainer(this._linkContainerRight);
    }

    public showLinkLeft(linkElement: string): void {
        this._leftInnerHtmlReference.value = linkElement;
        this.handleWaitFor();
    }

    public showLinkCenter(linkElement: string): void {
        this._centerInnerHtmlReference.value = linkElement;
        this.handleWaitFor();
    }

    public showLinkRight(linkElement: string): void {
        this._rightInnerHtmlReference.value = linkElement;
        this.handleWaitFor();
    }

    private async handleWaitFor(): Promise<void> {
        if (this._isHandlingWaitFor) return;
        this._isHandlingWaitFor = true;

        while (this._waitFor.length > 0) {
            await this._waitFor[0];
            this._waitFor.splice(0, 1);
        }

        if (this._leftInnerHtmlReference.value.length > 0) {
            this._linkContainerLeft.classList.remove(ClassConstants.HIDDEN);
            this._linkContainerLeft.innerHTML = this._leftInnerHtmlReference.value;
            this._linkContainerLeft.classList.remove("fadeOut");
            this._linkContainerLeft.classList.add("fadeIn");
        }

        if (this._centerInnerHtmlReference.value.length > 0) {
            this._linkContainerCenter.classList.remove(ClassConstants.HIDDEN);
            this._linkContainerCenter.innerHTML = this._centerInnerHtmlReference.value;
            this._linkContainerCenter.classList.remove("fadeOut");
            this._linkContainerCenter.classList.add("fadeIn");
        }

        if (this._rightInnerHtmlReference.value.length > 0) {
            this._linkContainerRight.classList.remove(ClassConstants.HIDDEN);
            this._linkContainerRight.innerHTML = this._rightInnerHtmlReference.value;
            this._linkContainerRight.classList.remove("fadeOut");
            this._linkContainerRight.classList.add("fadeIn");
        }

        this._isHandlingWaitFor = false;
    }

    private resetContainer(container: HTMLElement): void {
        container.classList.remove("fadeIn");
        container.classList.add("fadeOut");
        this._waitFor.push(
            new Promise((resolve) => {
                setTimeout(() => {
                    container.classList.add(ClassConstants.HIDDEN);
                    container.innerHTML = "";
                    resolve();
                }, 700);
            })
        );
    }
}
