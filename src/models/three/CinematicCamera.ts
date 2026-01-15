import { PerspectiveCamera, Vector3 } from "three";

import Application from "../../Application";
import Tickable from "../../types/interfaces/Tickable";
import CameraPath from "./CameraPath";

export default class CinematicCamera implements Tickable {
    private _application: Application;
    private _instance: PerspectiveCamera;
    private _cameraPath: CameraPath | null;
    private _lookAt: Vector3 | null;

    constructor(application: Application) {
        this._application = application;
        this._instance = new PerspectiveCamera(
            35,
            this._application.dimensions.getAspectRatio(),
            0.1,
            100
        );
        this._instance.position.set(0, 0, 5);

        this._cameraPath = null;
        this._lookAt = null;

        this._application.scene.add(this._instance);
    }

    public get instance(): PerspectiveCamera {
        return this._instance;
    }

    public set cameraPath(value: CameraPath) {
        this._cameraPath = value;
    }

    public lookAt(position: Vector3): void {
        this._lookAt = position;
    }

    public tick(deltaTime: number, elapsedTime: number): void {
        if (!this._cameraPath) return;
        if (this._cameraPath.completed) return;

        this._cameraPath.tryComplete(this._instance.position);
        this._cameraPath.tick(deltaTime, elapsedTime);

        const direction = new Vector3().subVectors(
            this._cameraPath.currentPosition,
            this._instance.position
        );
        this.instance.position.add(direction.multiplyScalar(deltaTime * 0.001));

        if (this._lookAt) this.instance.lookAt(this._lookAt);
    }

    public resize(): void {
        this._instance.aspect = this._application.dimensions.getAspectRatio();
        this._instance.updateProjectionMatrix();
    }

    public setPosition(position: Vector3): void {
        this._instance.position.copy(position);
    }
}
