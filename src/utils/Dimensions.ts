import EventEmitter from "./EventEmitter";

export default class Dimensions extends EventEmitter {
    private _width: number;
    private _height: number;
    private _pixelRatio: number;

    constructor() {
        super();

        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.updateOnResize();
    }

    public getAspectRatio(): number {
        return this._width / this._height;
    }

    private updateOnResize(): void {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.trigger("resize");
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get pixelRatio(): number {
        return this._pixelRatio;
    }
}