import { Color, Vector3 } from "three";
import Application from "../../Application";
import DialogConstants from "../constants/DialogConstants";
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
        this.resumeControls();
        this.setupPlayer();
        this.playAnimation();
        this._application.particleManager.spawnAmbientParticles(
            new Vector3(0, 0, 0),
            10,
            10000,
            new Color(0xf0d441),
            13
        );
        setInterval(() => {
            this._application.particleManager.spawnAmbientParticles(
                new Vector3(0, 0, 0),
                10,
                10000,
                new Color(0xf0d441),
                13
            );
        }, 1000);
    }

    private setupPlayer(): void {
        this._player.futureRotation = new Vector3(0, 0, 0);
        this._player.playerModel.toIdle();
    }

    private playAnimation(): void {
        this._application.useCinematicCamera();
        this._application.cinematicCamera.setPosition(new Vector3(15, 7, 8));
        this._application.cinematicCamera.lookAt(new Vector3());

        const cameraPath = new CameraPath(
            [
                new Vector3(15, 7, 8),
                new Vector3(14, 6, 17),
                new Vector3(12, 5.5, 17),
                new Vector3(9, 5, 18),
                new Vector3(5, 4, 17),
                new Vector3(4, 3, 16),
                new Vector3(0.2, 2, 15.5),
                new Vector3(0, 1, 10.5),
                new Vector3(-0.32, -0.3, 10)
            ],
            3000,
            100
        );

        cameraPath.addEventListener("completed", async () => {
            await Promise.all([this.playWave(), this.playDialog()]);
            this._application.hud.dialog.hide();
            this.resumeControls();
        });

        this._application.cinematicCamera.cameraPath = cameraPath;

        cameraPath.start();
    }

    private async playWave(): Promise<void> {
        await this._player.playerModel.wave();
        this._player.playerModel.toIdle();
    }

    private async playDialog(): Promise<void> {
        this._application.hud.dialog.show();

        await this._application.hud.dialog.writeText(
            ...DialogConstants.WELCOME_TEXT_QUEUE
        );

        this._application.hud.menu.animate();
        setTimeout(() => {
            this._application.hud.menu.toggleNavigation();

            setTimeout(() => {
                this._application.hud.menu.hideNavigation();
            }, 3000);
        }, 500);

        await this._application.hud.dialog.writeText(
            ...DialogConstants.MENU_TEXT_QUEUE
        );

        await this._application.hud.dialog.writeText(
            ...DialogConstants.HAVE_FUN_TEXT_QUEUE
        );
    }

    private resumeControls(): void {
        this._player.futureRotation = new Vector3(0, Math.PI, 0);
        this._application.attachableCamera.resumeAttachment();
        this._application.useAttachableCamera();
    }
}
