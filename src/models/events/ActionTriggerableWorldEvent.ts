import Application from "../../Application";
import DomUtils from "../../utils/DomUtils";
import ClassConstants from "../constants/ClassConstants";
import DeviceType from "../enum/DeviceType";
import SoundType from "../enum/SoundType";
import TriggerableWorldActionType from "../enum/TriggerableWorldActionType";
import WorldEvent from "./WorldEvent";

export default class ActionTriggerableWorldEvent extends WorldEvent {
    private _application: Application;
    private _triggerableWorldActionType: TriggerableWorldActionType;
    private _interactButton: HTMLElement;

    constructor(triggerableWorldActionType: TriggerableWorldActionType, application: Application) {
        super();
        this._triggerableWorldActionType = triggerableWorldActionType;
        this._application = application;

        this._interactButton = DomUtils.getElement(document, ".interact_button");
    }

    public handleTrigger(): void {
        if (this._application.dimensions.deviceType === DeviceType.MOBILE) {
            this._application.mobileControls.showInteract();
        } else {
            this.showInteract();
        }

        this._application.audioManager.playSound(SoundType.SPARKLE)
    }
    public handleEnd(): void {
        if (this._application.dimensions.deviceType === DeviceType.MOBILE) {
            this._application.mobileControls.hideInteract();
        } else {
            this.hideInteract();
        }
    }

    private showInteract(): void {
        this._interactButton.classList.remove(ClassConstants.FADE_OUT, ClassConstants.HIDDEN);
        this._interactButton.classList.add(ClassConstants.FADE_IN);

    }

    private hideInteract(): void {
        this._interactButton.classList.remove(ClassConstants.FADE_IN);
        this._interactButton.classList.add(ClassConstants.FADE_OUT);
    }
}
