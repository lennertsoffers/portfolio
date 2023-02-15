import TriggerableWorldActionType from "../enum/TriggerableWorldActionType";
import WorldEvent from "./WorldEvent";

export default class ActionTriggerableWorldEvent extends WorldEvent {
    private _triggerableWorldActionType: TriggerableWorldActionType;

    constructor(triggerableWorldActionType: TriggerableWorldActionType) {
        super();
        this._triggerableWorldActionType = triggerableWorldActionType;
    }

    public handleTrigger(): void {
        console.log("Trigger " + this._triggerableWorldActionType);
    }
    public handleEnd(): void {
        console.log("End " + this._triggerableWorldActionType);
    }
}