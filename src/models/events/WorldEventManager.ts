import WorldEventConstants from "../constants/WorldEventConstants";
import { valueOf as triggerableWorldActionTypeValueOf } from "../enum/TriggerableWorldActionType";
import WorldZone from "../enum/WorldZone";
import ActionTriggerableWorldEvent from "./ActionTriggerableWorldEvent";
import WorldEvent from "./WorldEvent";

export default class WorldEventManager {
    private _activeWorldEvent: WorldEvent | null;
    private _currentZone: WorldZone;

    constructor() {
        this._activeWorldEvent = null;
        this._currentZone = WorldZone.NONE;
    }

    public updateWorldZone(newZone: WorldZone): void {
        if (this._currentZone === newZone) return;

        if (this._activeWorldEvent) this._activeWorldEvent.end();
        this._currentZone = newZone;
        this.zoneChanged();
    }

    private zoneChanged(): void {
        if (WorldEventConstants.actionTriggerableZones.includes(this._currentZone)) {
            this._activeWorldEvent = new ActionTriggerableWorldEvent(triggerableWorldActionTypeValueOf(this._currentZone.toString()));
            this._activeWorldEvent.trigger();
        }

        else this._activeWorldEvent = null;
    }
}