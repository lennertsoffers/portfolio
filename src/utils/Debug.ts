import GUI from "lil-gui";
import DebugFolderEntry from "../types/entries/DebugFolderEntry";

export default class Debug {
    private _active: boolean;
    private _ui?: GUI | undefined;
    private _folderStructure: DebugFolderEntry[];

    constructor() {
        this._active = window.location.hash == "#debug";
        this._folderStructure = [];

        if (this._active) {
            this._ui = new GUI();
            this._ui.close();
        }
    }

    public get active(): boolean {
        return this._active;
    }

    public get ui(): GUI {
        return this._ui as GUI;
    }

    public addFolder(name: string): GUI {
        const existingFolder = this.getGuiFolder(name);

        if (existingFolder) return existingFolder;

        const newFolder = this.ui.addFolder(name);
        this._folderStructure.push({ name: name, folder: newFolder });

        return newFolder;
    }

    private getGuiFolder(name: string): GUI | undefined {
        const debugFolderEntry = this._folderStructure.find((debugFolderEntry) => debugFolderEntry.name === name);

        if (debugFolderEntry) return debugFolderEntry.folder;
        return undefined;
    }
}