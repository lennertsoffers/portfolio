import Application from "../../Application";

export default abstract class World {
    private _application: Application;

    constructor(application: Application) {
        this._application = application;
    }

    public get application(): Application {
        return this._application;
    }

    public abstract createWorld(): void;
}