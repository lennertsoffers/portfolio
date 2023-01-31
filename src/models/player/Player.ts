import Application from "../../Application";
import PlayerModel from "./PlayerModel";

export default class Player {
    private _application: Application;
    private _playerModel: PlayerModel;

    constructor(application: Application) {
        this._application = application;
        this._playerModel = new PlayerModel(this);
    }

    public get application(): Application {
        return this._application;
    }

    public tick() {
        this._playerModel.tick();
    }

    public loadPlayer() {
        this._playerModel.loadModel();
    }
}