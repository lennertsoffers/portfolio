import DeviceType from "../models/enum/DeviceType";
import EventEmitter from "./EventEmitter";

export default class Dimensions extends EventEmitter {
    private _width: number;
    private _height: number;
    private _pixelRatio: number;
    private _deviceType: DeviceType;

    constructor() {
        super();

        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._pixelRatio = Math.min(window.devicePixelRatio, 2);
        this._deviceType = this.getDeviceType();

        this.updateOnResize();
    }

    public get deviceType(): DeviceType {
        return this._deviceType;
    }

    public getAspectRatio(): number {
        return this._width / this._height;
    }

    private updateOnResize(): void {
        let root = document.documentElement;
        root.style.setProperty("--vh", root.clientHeight + "px");

        window.addEventListener("resize", () => {
            this._width = window.innerWidth;
            this._height = window.innerHeight;
            this._pixelRatio = Math.min(window.devicePixelRatio, 2);

            const deviceType = this.getDeviceType();
            if (deviceType !== this._deviceType) {
                if (deviceType === DeviceType.MOBILE) this.trigger("usemobile");
                if (deviceType === DeviceType.PC) this.trigger("usepc");

                this._deviceType = deviceType;
            }

            this.trigger("resize");
        });
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

    private getDeviceType(): DeviceType {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i))
            return DeviceType.MOBILE;
        return DeviceType.PC;
    }
}
