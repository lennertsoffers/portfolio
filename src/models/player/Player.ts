import Application from "../../Application";
import PlayerControls from "./PlayerControls";
import PlayerModel from "./PlayerModel";

export default class Player {
    private _application: Application;
    private _playerModel: PlayerModel;
    private _playerControls: PlayerControls;

    constructor(application: Application) {
        this._application = application;
        this._playerModel = new PlayerModel(this);
        this._playerControls = new PlayerControls(this);
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
}