import EventEmitter from "../../utils/EventEmitter";

export default class TouchControls extends EventEmitter {
    private _touchStartLocation = {
        x: 0,
        y: 0
    };
    private _touchEndLocation = {
        x: 0,
        y: 0
    };
    private _movementY = 0;

    constructor() {
        super();

        this.addTouchControls();
    }

    private addTouchControls(): void {
        document.addEventListener("touchstart", (touchEvent) =>
            this.handleTouchStart(touchEvent)
        );
        document.addEventListener("touchend", () => this.handleTouchEnd());
        document.addEventListener("touchcancel", () => this.handleTouchEnd());
        document.addEventListener("touchmove", (touchEvent) => {
            this.handleTouchMove(touchEvent);
        });
    }

    private handleTouchStart(touchEvent: TouchEvent): void {
        const touch = touchEvent.touches[0];
        this._touchStartLocation.x = touch.clientX;
        this._touchStartLocation.y = touch.clientY;
    }

    private handleTouchEnd(): void {
        const movementX = this._touchEndLocation.x - this._touchStartLocation.x;

        // if (movementX < -100) this.trigger("swipeLeft");
        // if (movementX > 100) this.trigger("swipeRight");
    }

    private handleTouchMove(touchEvent: TouchEvent): void {
        const touch = touchEvent.touches[0];
        this._touchEndLocation.x = touch.clientX;
        this._touchEndLocation.y = touch.clientY;

        this._movementY = this._touchEndLocation.y - this._touchStartLocation.y;

        if (this._movementY > 15) {
            this._movementY = 0;
            this._touchStartLocation.y = this._touchEndLocation.y;
            this.trigger("swipeDown");
        }

        if (this._movementY < -15) {
            this._movementY = 0;
            this._touchStartLocation.y = this._touchEndLocation.y;
            this.trigger("swipeUp");
        }
    }
}
