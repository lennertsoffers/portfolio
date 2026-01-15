import { Vector3 } from "three";

import Application from "../../Application";
import WorldEventConstants from "../constants/WorldEventConstants";
import DeviceType from "../enum/DeviceType";
import PageOverlayType from "../enum/PageOverlayType";
import SoundType from "../enum/SoundType";
import { from as triggerableWorldActionTypeValueOf } from "../enum/TriggerableWorldActionType";
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
        if (
            this._activeTriggerableWorldEvent &&
            !this._activeTriggerableWorldEvent.isEnded()
        )
            return;

        if (this._application.dimensions.deviceType === DeviceType.MOBILE) {
            this._application.mobileControls.hide();
        }
        switch (this._currentZone) {
            case WorldZone.ABOUT_ME:
                this.triggerAboutMe();
                break;
            case WorldZone.INTERNSHIP:
                this.triggerInternship();
                break;
            case WorldZone.PROJECTS:
                this.triggerProjects();
                break;
        }
    }

    private triggerAboutMe(): void {
        const attachableCameraPosition = this._application.attachableCamera
            .getPosition()
            .clone();

        this._application.cinematicCamera.setPosition(attachableCameraPosition);
        this._application.useCinematicCamera();

        const cameraPath = new CameraPath(
            [
                attachableCameraPosition.clone(),
                new Vector3(-2.2, 2.0, 2.7),
                new Vector3(-2.2, -0.3, 2.7)
            ],
            1000,
            1
        );
        this._application.cinematicCamera.cameraPath = cameraPath;
        this._application.cinematicCamera.lookAt(new Vector3(-2.2, -0.45, 2.7));

        this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(
            PageOverlayType.ABOUT_ME,
            this._application,
            () => {
                const zoomOutPath = new CameraPath(
                    [
                        new Vector3(-2.2, -0.3, 2.7),
                        new Vector3(-2.2, 2.0, 2.7),
                        attachableCameraPosition.clone()
                    ],
                    1000,
                    1
                );
                this._application.cinematicCamera.cameraPath = zoomOutPath;
                this._application.cinematicCamera.lookAt(
                    new Vector3(-2.2, -0.3, 2.7)
                );
                zoomOutPath.start();
                this._application.audioManager.playSound(SoundType.BOOK);
                zoomOutPath.addEventListener("completed", () => {
                    if (
                        this._application.dimensions.deviceType ===
                        DeviceType.MOBILE
                    ) {
                        this._application.mobileControls.show();
                    }
                    this._application.useAttachableCamera();
                });
            }
        );

        cameraPath.start();
        cameraPath.addEventListener("completed", () => {
            this._application.audioManager.playSound(SoundType.BOOK);
            if (this._activeTriggerableWorldEvent)
                this._activeTriggerableWorldEvent.trigger();
            this._application.bookManager.resize();
            this._application.bookControls.show();
        });
    }

    private triggerInternship(): void {
        const attachableCameraPosition = this._application.attachableCamera
            .getPosition()
            .clone();

        this._application.cinematicCamera.setPosition(attachableCameraPosition);
        this._application.useCinematicCamera();

        const cameraPath = new CameraPath(
            [
                attachableCameraPosition.clone(),
                new Vector3(-1.2, 0.5, -4.7),
                new Vector3(-1.15, -0.12, -4.65)
            ],
            1000,
            1
        );
        this._application.cinematicCamera.cameraPath = cameraPath;
        this._application.cinematicCamera.lookAt(
            new Vector3(-1.2, -0.12, -4.7)
        );

        this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(
            PageOverlayType.INTERNSHIP,
            this._application,
            () => {
                const zoomOutPath = new CameraPath(
                    [
                        new Vector3(-1.2, -0.12, -4.7),
                        new Vector3(-1.2, 1, -4.7),
                        attachableCameraPosition.clone()
                    ],
                    1000,
                    1
                );
                this._application.cinematicCamera.cameraPath = zoomOutPath;
                this._application.cinematicCamera.lookAt(
                    new Vector3(-1.2, -0.12, -4.7)
                );
                zoomOutPath.start();
                this._application.audioManager.playSound(SoundType.BOOK);
                zoomOutPath.addEventListener("completed", () => {
                    if (
                        this._application.dimensions.deviceType ===
                        DeviceType.MOBILE
                    ) {
                        this._application.mobileControls.show();
                    }
                    this._application.useAttachableCamera();
                });
            }
        );

        cameraPath.start();
        cameraPath.addEventListener("completed", () => {
            this._application.audioManager.playSound(SoundType.BOOK);
            if (this._activeTriggerableWorldEvent)
                this._activeTriggerableWorldEvent.trigger();
            this._application.bookManager.resize();
            this._application.bookControls.show();
        });
    }

    private triggerProjects(): void {
        const attachableCameraPosition = this._application.attachableCamera
            .getPosition()
            .clone();

        this._application.cinematicCamera.setPosition(attachableCameraPosition);
        this._application.useCinematicCamera();

        const cameraPath = new CameraPath(
            [
                attachableCameraPosition.clone(),
                new Vector3(2.008, 1.5, -1.4),
                new Vector3(2.008, 0.3, -1.88)
            ],
            1000,
            1
        );
        this._application.cinematicCamera.cameraPath = cameraPath;
        this._application.cinematicCamera.lookAt(new Vector3(2.02, 0.1, -1.9));

        this._activeTriggerableWorldEvent = new PageOverlayWorldEvent(
            PageOverlayType.PROJECTS,
            this._application,
            () => {
                const zoomOutPath = new CameraPath(
                    [
                        new Vector3(2.008, 0.3, -1.88),
                        new Vector3(2.008, 1.5, -1.4),
                        attachableCameraPosition.clone()
                    ],
                    1000,
                    1
                );
                this._application.cinematicCamera.cameraPath = zoomOutPath;
                this._application.cinematicCamera.lookAt(
                    new Vector3(2.02, 0.1, -1.9)
                );
                zoomOutPath.start();
                this._application.audioManager.playSound(SoundType.BOOK);
                zoomOutPath.addEventListener("completed", () => {
                    if (
                        this._application.dimensions.deviceType ===
                        DeviceType.MOBILE
                    ) {
                        this._application.mobileControls.show();
                    }
                    this._application.useAttachableCamera();
                });
            }
        );

        cameraPath.start();
        cameraPath.addEventListener("completed", () => {
            this._application.audioManager.playSound(SoundType.BOOK);
            if (this._activeTriggerableWorldEvent)
                this._activeTriggerableWorldEvent.trigger();
            this._application.bookManager.resize();
            this._application.bookControls.show();
        });
    }

    private zoneChanged(): void {
        if (
            WorldEventConstants.actionTriggerableZones.includes(
                this._currentZone
            )
        ) {
            this._activeWorldEvent = new ActionTriggerableWorldEvent(
                triggerableWorldActionTypeValueOf(this._currentZone.toString()),
                this._application
            );
            this._activeWorldEvent.trigger();
        } else this._activeWorldEvent = null;

        if (this._activeTriggerableWorldEvent)
            this._activeTriggerableWorldEvent = null;
    }
}
