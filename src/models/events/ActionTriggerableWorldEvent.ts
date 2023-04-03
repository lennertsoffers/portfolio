import Application from "../../Application";
import DeviceType from "../enum/DeviceType";
import TriggerableWorldActionType from "../enum/TriggerableWorldActionType";
import WorldEvent from "./WorldEvent";

export default class ActionTriggerableWorldEvent extends WorldEvent {
    private _application: Application;
    private _triggerableWorldActionType: TriggerableWorldActionType;

    constructor(triggerableWorldActionType: TriggerableWorldActionType, application: Application) {
        super();
        this._triggerableWorldActionType = triggerableWorldActionType;
        this._application = application;
    }

    public handleTrigger(): void {
        if (this._application.dimensions.deviceType === DeviceType.MOBILE) {
            this._application.mobileControls.showInteract();
        }

        console.log("Trigger " + this._triggerableWorldActionType);
    }
    public handleEnd(): void {
        if (this._application.dimensions.deviceType === DeviceType.MOBILE) {
            this._application.mobileControls.hideInteract();
        }

        console.log("End " + this._triggerableWorldActionType);
    }
}
