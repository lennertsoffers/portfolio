import { Vector3 } from "three";
import Application from "../../Application";
import ApplicationNotLoadedError from "../error/ApplicationNotLoadedError";
import Player from "../player/Player";
import CameraPath from "../three/CameraPath";

export default class StartSequence {
    private _application: Application;
    private _player: Player;

    constructor(application: Application) {
        this._application = application;

        if (!this._application.player) throw new ApplicationNotLoadedError();
        this._player = this._application.player;
    }

    public play(): void {
        this._player.futureRotation = new Vector3(0, 0, 0);
        this._player.playerModel.toIdle();
        this._application.useCinematicCamera();
        this._application.cinematicCamera.setPosition(new Vector3(15, 7, 8));

        const cameraPath = new CameraPath(
            [
                new Vector3(15, 7, 8),
                new Vector3(12, 6, 17),
                new Vector3(10, 5.5, 18),
                new Vector3(4, 5, 17),
                new Vector3(2, 3, 15),
                new Vector3(1, 1.5, 12),
                new Vector3(-0.32, 0, 10),
            ],
            3000,
            100
        );

        cameraPath.addEventListener("completed", async () => {
            await this._player.playerModel.wave();
            this._player.playerModel.toIdle();
        });

        this._application.cinematicCamera.cameraPath = cameraPath;
        this._application.cinematicCamera.lookAt(new Vector3());

        cameraPath.start();
    }
}