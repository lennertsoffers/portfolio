import { Vector3 } from "three";
import Application from "../../Application";
import WorldEventConstants from "../constants/WorldEventConstants";
import PageOverlayType from "../enum/PageOverlayType";
import { valueOf as triggerableWorldActionTypeValueOf } from "../enum/TriggerableWorldActionType";
import WorldZone from "../enum/WorldZone";
import CameraPath from "../three/CameraPath";
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
                this._activeTriggerableWorldEvent.trigger();
                break;
            case WorldZone.CV:
                this._application.useCinematicCamera();

                const cameraPath = new CameraPath(
                    [
                        this._application.attachableCamera.getPosition(),
                        new Vector3(2.02, 1, -1.6),
                        new Vector3(2.02, 0.7, -1.7)
                    ],
                    new Vector3(2.02, 0.5, -1.9),
                    1500
                );
                this._application.cinematicCamera.cameraPath = cameraPath;
                this._application.cinematicCamera.lookAt(new Vector3(2.02, 0.1, -1.9));
                cameraPath.start();
                cameraPath.addEventListener("completed", () => {
                    // this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(PageOverlayType.CV, this._application.pageManager);
                    // this._activeTriggerableWorldEvent.trigger();
                });
                break;
            case WorldZone.PROJECTS:
                this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(PageOverlayType.PROJECTS, this._application.pageManager);
                this._activeTriggerableWorldEvent.trigger();
                break;
        }

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