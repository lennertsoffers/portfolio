import Application from "../../Application";
import Dialog from "./Dialog";

export default class Hud {
    private _application: Application;
    private _dialog: Dialog;

    constructor(application: Application) {
        this._application = application;
        this._dialog = new Dialog(this);
    }

    public get application(): Application {
        return this._application;
    }

    public get dialog(): Dialog {
        return this._dialog;
    }
}