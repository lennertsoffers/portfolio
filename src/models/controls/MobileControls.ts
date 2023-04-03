import ButtonsDown from "../../types/interfaces/ButtonsDown";
import DomUtils from "../../utils/DomUtils";
import EventEmitter from "../../utils/EventEmitter";
import ClassConstants from "../constants/ClassConstants";

export default class MobileControls extends EventEmitter {
    private _mobileControlsElement: HTMLElement;
    private _buttonForwardsElement: HTMLElement;
    private _buttonBackwardsElement: HTMLElement;
    private _buttonLeftElement: HTMLElement;
    private _buttonRightElement: HTMLElement;
    private _buttonInteractElement: HTMLElement;
    private _buttonsDown: ButtonsDown;

    constructor() {
        super();

        this._mobileControlsElement = DomUtils.getElement(
            document,
            `.${ClassConstants.MOBILE_CONTROLS_CLASS_NAME}`
        );
        this._buttonForwardsElement = DomUtils.getElement(
            document,
            `.${ClassConstants.MOBILE_CONTROLS_BUTTON_FORWARDS_CLASS_NAME}`
        );
        this._buttonBackwardsElement = DomUtils.getElement(
            document,
            `.${ClassConstants.MOBILE_CONTROLS_BUTTON_BACKWARDS_CLASS_NAME}`
        );
        this._buttonLeftElement = DomUtils.getElement(
            document,
            `.${ClassConstants.MOBILE_CONTROLS_BUTTON_LEFT_CLASS_NAME}`
        );
        this._buttonRightElement = DomUtils.getElement(
            document,
            `.${ClassConstants.MOBILE_CONTROLS_BUTTON_RIGHT_CLASS_NAME}`
        );
        this._buttonInteractElement = DomUtils.getElement(
            document,
            `.${ClassConstants.MOBILE_CONTROLS_BUTTON_INTERACT_CLASS_NAME}`
        );

        this._buttonsDown = {
            forwards: false,
            backwards: false,
            left: false,
            right: false
        };

        this.addEventListeners();

        this.hideInteract();
        this.hide();
    }

    public get buttonsDown(): ButtonsDown {
        return this._buttonsDown;
    }

    public show(): void {
        this._mobileControlsElement.classList.remove(ClassConstants.HIDDEN);
    }

    public hide(): void {
        this._mobileControlsElement.classList.add(ClassConstants.HIDDEN);
    }

    public hideInteract(): void {
        this._buttonInteractElement.classList.add(ClassConstants.HIDDEN);
    }

    public showInteract(): void {
        this._buttonInteractElement.classList.remove(ClassConstants.HIDDEN);
    }

    private addEventListeners(): void {
        this._buttonForwardsElement.addEventListener("touchstart", () => {
            this.trigger("forwards_start");
            this._buttonsDown.forwards = true;
        });
        this._buttonForwardsElement.addEventListener("touchend", () => {
            this.trigger("forwards_end");
            this._buttonsDown.forwards = false;
        });
        this._buttonBackwardsElement.addEventListener("touchstart", () => {
            this.trigger("backwards_start");
            this._buttonsDown.backwards = true;
        });
        this._buttonBackwardsElement.addEventListener("touchend", () => {
            this.trigger("backwards_end");
            this._buttonsDown.backwards = false;
        });
        this._buttonLeftElement.addEventListener("touchstart", () => {
            this.trigger("left_start");
            this._buttonsDown.left = true;
        });
        this._buttonLeftElement.addEventListener("touchend", () => {
            this.trigger("left_end");
            this._buttonsDown.left = false;
        });
        this._buttonRightElement.addEventListener("touchstart", () => {
            this.trigger("right_start");
            this._buttonsDown.right = true;
        });
        this._buttonRightElement.addEventListener("touchend", () => {
            this.trigger("right_end");
            this._buttonsDown.right = false;
        });
        this._buttonInteractElement.addEventListener("touchstart", () => {
            this.trigger("interact");
        });
    }
}
