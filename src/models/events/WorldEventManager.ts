import Application from "../../Application";
import WorldEventConstants from "../constants/WorldEventConstants";
import PageOverlayType from "../enum/PageOverlayType";
import { valueOf as triggerableWorldActionTypeValueOf } from "../enum/TriggerableWorldActionType";
import WorldZone from "../enum/WorldZone";
import ActionTriggerableWorldEvent from "./ActionTriggerableWorldEvent";
import PageOverlayWorldEvent from "./PageOverlayWorldEvent";
import WorldEvent from "./WorldEvent";

export default class WorldEventManager {
    private _application: Application;
    private _activeWorldEvent: WorldEvent | null;
    private _activeTriggerableWorldEvent: WorldEvent | null;
    private _currentZone: WorldZone;

    constructor(application: Application) {
        this._application = application;
        this._activeWorldEvent = null;
        this._activeTriggerableWorldEvent = null;
        this._currentZone = WorldZone.NONE;
    }

    public handleWorldZoneChange(newZone: WorldZone): void {
        if (this._currentZone === newZone) return;

        if (this._activeWorldEvent) this._activeWorldEvent.end();
        this._currentZone = newZone;
        this.zoneChanged();
    }

    public handleInteraction(): void {
        if (this._currentZone === WorldZone.NONE) return;
        if (this._activeTriggerableWorldEvent && !this._activeTriggerableWorldEvent.isEnded()) return;

        switch (this._currentZone) {
            case WorldZone.ABOUT_ME:
                this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(PageOverlayType.ABOUT_ME, this._application.pageManager);
                break;
            case WorldZone.CV:
                this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(PageOverlayType.CV, this._application.pageManager);
                break;
            case WorldZone.PROJECTS:
                this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(PageOverlayType.PROJECTS, this._application.pageManager);
                break;
        }

        this._activeTriggerableWorldEvent.trigger();
    }

    private zoneChanged(): void {
        if (WorldEventConstants.actionTriggerableZones.includes(this._currentZone)) {
            this._activeWorldEvent = new ActionTriggerableWorldEvent(triggerableWorldActionTypeValueOf(this._currentZone.toString()));
            this._activeWorldEvent.trigger();
        }

        else this._activeWorldEvent = null;

        if (this._activeTriggerableWorldEvent) this._activeTriggerableWorldEvent = null;
    }
}