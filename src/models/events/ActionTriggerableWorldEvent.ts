import TriggerableWorldActionType from "../enum/TriggerableWorldActionType";
import WorldEvent from "./WorldEvent";

export default class ActionTriggerableWorldEvent extends WorldEvent {
    private _triggerableWorldActionType: TriggerableWorldActionType;

    constructor(triggerableWorldActionType: TriggerableWorldActionType) {
        super();
        this._triggerableWorldActionType = triggerableWorldActionType;
    }

    public trigger(): void {
        console.log("Trigger " + this._triggerableWorldActionType);
    }
    public end(): void {
        console.log("End " + this._triggerableWorldActionType);
    }
}