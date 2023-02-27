import Application from "../../Application";
import EventEmitter from "../../utils/EventEmitter";

export default class TouchControls extends EventEmitter {
    private _application: Application;
    private _touching: boolean;
    private _touchStartLocation = {
        x: 0,
        y: 0
    };
    private _touchEndLocation = {
        x: 0,
        y: 0
    };

    constructor(application: Application) {
        super();

        this._application = application;
        this._touching = false;

        this.addTouchControls();
    }

    private addTouchControls(): void {
        document.addEventListener("touchstart", (touchEvent) => this.handleTouchStart(touchEvent));
        document.addEventListener("touchend", () => this.handleTouchEnd());
        document.addEventListener("touchcancel", () => this.handleTouchEnd());
        document.addEventListener("touchmove", (touchEvent) => this.handleTouchMove(touchEvent));
    }

    private handleTouchStart(touchEvent: TouchEvent): void {
        const touch = touchEvent.touches[0];
        this._touchStartLocation.x = touch.clientX;
        this._touchStartLocation.y = touch.clientY;
    }

    private handleTouchEnd(): void {
        const movementX = this._touchEndLocation.x - this._touchStartLocation.x;
        const movementY = this._touchEndLocation.y - this._touchStartLocation.y;

        if (Math.abs(movementX) > Math.abs(movementY)) {
            if (movementX < 0) this.trigger("swipeLeft");
            if (movementX > 0) this.trigger("swipeRight");
        } else {
            if (movementY < 0) this.trigger("swipeUp");
            if (movementY > 0) this.trigger("swipeDown");
        }
    }

    private handleTouchMove(touchEvent: TouchEvent): void {
        const touch = touchEvent.touches[0];
        this._touchEndLocation.x = touch.clientX;
        this._touchEndLocation.y = touch.clientY;
    }
}