export default abstract class WorldEvent {
    private _ended: boolean;

    constructor() {
        this._ended = false;
    }

    public isEnded(): boolean {
        return this._ended;
    }

    public trigger(): void {
        this.handleTrigger();
        this._ended = false;
    }

    public end(): void {
        this.handleEnd();
        this._ended = true;
    }

    public abstract handleTrigger(): void;
    public abstract handleEnd(): void;
}
