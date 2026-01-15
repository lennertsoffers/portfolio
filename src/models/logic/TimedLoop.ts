import EventEmitter from "../../utils/EventEmitter";

export default class TimedLoop extends EventEmitter {
    private _startTime: number;
    private _currentTime: number;
    private _elapsedTime: number;
    private _deltaTime: number;

    constructor() {
        super();

        this._startTime = Date.now();
        this._currentTime = this._startTime;
        this._elapsedTime = 0;
        this._deltaTime = 1;

        window.requestAnimationFrame(() => this.tick());
    }

    public get currentTime(): number {
        return this._currentTime;
    }

    public get elapsedTime(): number {
        return this._elapsedTime;
    }

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public tick(): void {
        const currentTime = Date.now();
        this._deltaTime = Math.min(20, currentTime - this._currentTime);
        this._currentTime = currentTime;
        this._elapsedTime = this._currentTime - this._startTime;

        this.trigger("tick");

        window.requestAnimationFrame(() => this.tick());
    }
}
