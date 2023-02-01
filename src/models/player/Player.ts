import Application from "../../Application";
import PlayerState from "../enum/PlayerState";
import PlayerControls from "./PlayerControls";
import PlayerModel from "./PlayerModel";

export default class Player {
    private _application: Application;
    private _playerModel: PlayerModel;
    private _playerControls: PlayerControls;
    private _playerState: PlayerState;

    constructor(application: Application) {
        this._application = application;
        this._playerModel = new PlayerModel(this);
        this._playerControls = new PlayerControls(this);
        this._playerState = PlayerState.IDLE;
    }

    public get application(): Application {
        return this._application;
    }

    public get playerModel(): PlayerModel {
        return this._playerModel;
    }

    public tick(deltaTime: number, elapsedTime: number) {
        this._playerModel.tick(deltaTime, elapsedTime);
        this._playerControls.tick(deltaTime, elapsedTime);
    }

    public loadPlayer() {
        this._playerModel.loadModel();
        this._playerControls.loadControls();
    }

    public setPlayerState(playerState: PlayerState): void {
        if (playerState === this._playerState) return;

        this._playerState = playerState;

        switch (playerState) {
            case PlayerState.IDLE:
                this.playerModel.toIdle();
                return;
            case PlayerState.WALKING:
                this.playerModel.toWalking();
                return;
            case PlayerState.RUNNING:
                this.playerModel.toRunning();
                return;
            case PlayerState.WAVING:
                this._playerControls.keyboardControlsEnabled = false;
                this.playerModel.wave().then(() => this._playerControls.keyboardControlsEnabled = true);
                return;
            case PlayerState.JUMPING:
                this.playerModel.jump();
                return;
        }
    }
}