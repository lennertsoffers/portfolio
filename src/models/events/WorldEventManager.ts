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
                this.triggerAboutMe();
                break;
            case WorldZone.CV:
                this.triggerCv();
                break;
            case WorldZone.PROJECTS:
                this.triggerProjects();
                break;
        }
    }

    private triggerAboutMe(): void {
    }

    // TODO - Remove debug code
    private triggerCv(): void {
        this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(PageOverlayType.CV, this._application);
        this._activeTriggerableWorldEvent.trigger();
    }

    // TODO - Uncomment production code
    // private triggerCv(): void {
    //     const attachableCameraPosition = this._application.attachableCamera.getPosition().clone();

    //     this._application.cinematicCamera.setPosition(attachableCameraPosition);
    //     this._application.useCinematicCamera();

    //     const cameraPath = new CameraPath(
    //         [
    //             attachableCameraPosition.clone(),
    //             new Vector3(2.008, 1.5, -1.4),
    //             new Vector3(2.008, 0.3, -1.88)
    //         ],
    //         1000,
    //         1
    //     );
    //     this._application.cinematicCamera.cameraPath = cameraPath;
    //     this._application.cinematicCamera.lookAt(new Vector3(2.02, 0.1, -1.9));

    //     this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(PageOverlayType.CV, this._application, () => {
    //         const zoomOutPath = new CameraPath(
    //             [
    //                 new Vector3(2.008, 0.3, -1.88),
    //                 new Vector3(2.008, 1.5, -1.4),
    //                 attachableCameraPosition.clone()
    //             ],
    //             1000,
    //             1
    //         );
    //         this._application.cinematicCamera.cameraPath = zoomOutPath;
    //         this._application.cinematicCamera.lookAt(new Vector3(2.02, 0.1, -1.9));
    //         zoomOutPath.start();
    //         zoomOutPath.addEventListener("completed", () => {
    //             this._application.useAttachableCamera();
    //         });
    //     });

    //     cameraPath.start();
    //     cameraPath.addEventListener("completed", () => {
    //         if (this._activeTriggerableWorldEvent) this._activeTriggerableWorldEvent.trigger();
    //     });
    // }

    private triggerProjects(): void {
        const attachableCameraPosition = this._application.attachableCamera.getPosition().clone();

        this._application.cinematicCamera.setPosition(attachableCameraPosition);
        this._application.useCinematicCamera();

        const cameraPath = new CameraPath(
            [
                attachableCameraPosition.clone(),
                new Vector3(-1.2, 0.8, -4.9),
                new Vector3(-1.25, 1, -4.96),
                new Vector3(-1.25, -0.42, -4.96)
            ],
            1000,
            1
        );
        this._application.cinematicCamera.cameraPath = cameraPath;
        this._application.cinematicCamera.lookAt(new Vector3(-1.25, -0.7, -4.96));

        this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(PageOverlayType.CV, this._application, () => {
            const zoomOutPath = new CameraPath(
                [
                    new Vector3(-1.25, -0.42, -4.96),
                    new Vector3(-1.25, 1, -4.96),
                    new Vector3(-1.2, 0.8, -4.9),
                    attachableCameraPosition.clone()
                ],
                1000,
                1
            );
            this._application.cinematicCamera.cameraPath = zoomOutPath;
            this._application.cinematicCamera.lookAt(new Vector3(-1.25, -0.7, -4.96));
            zoomOutPath.start();
            zoomOutPath.addEventListener("completed", () => {
                this._application.useAttachableCamera();
            });
        });

        cameraPath.start();
        cameraPath.addEventListener("completed", () => {
            if (this._activeTriggerableWorldEvent) this._activeTriggerableWorldEvent.trigger();
        });
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