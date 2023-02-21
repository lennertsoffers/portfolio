import Application from "../../Application";
import Dialog from "./Dialog";
import Menu from "./Menu";

export default class Hud {
    private _application: Application;
    private _dialog: Dialog;
    private _menu: Menu;

    constructor(application: Application) {
        this._application = application;
        this._dialog = new Dialog(this);
        this._menu = new Menu(this);
    }

    public get application(): Application {
        return this._application;
    }

    public get dialog(): Dialog {
        return this._dialog;
    }

    public get menu(): Menu {
        return this._menu;
    }
}