import Dialog from "../hud/Dialog";
import WorldEvent from "./WorldEvent";

export default class DialogWorldEvent extends WorldEvent {
    private _dialog: Dialog;
    private _text: string[];

    constructor(dialog: Dialog, text: string[]) {
        super();

        this._dialog = dialog;
        this._text = text;
    }

    public handleTrigger(): void {
        this._dialog.show();

        this._dialog.writeText(...this._text).then(() => this.end());
    }
    public handleEnd(): void {
        this._dialog.hide();
    }

}