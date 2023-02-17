import { Vector3 } from "three";
import Tickable from "../../types/interfaces/Tickable";
import EventEmitter from "../../utils/EventEmitter";

export default class CameraPath extends EventEmitter implements Tickable {
    private _positions: Vector3[];
    private _currentPosition: Vector3;
    private _duration: number;
    private _paused: boolean;
    private _completed: boolean;
    private _length: number;

    constructor(positions: Vector3[], duration: number) {
        super();

        this._positions = positions;
        this._currentPosition = new Vector3();

        this._duration = duration;
        this._paused = true;
        this._completed = false;

        this._length = this.calculatePathLength();
    }

    public get completed(): boolean {
        return this._completed;
    }

    public get currentPosition(): Vector3 {
        return this._currentPosition.clone();
    }

    public start(): void {
        this._currentPosition = this._positions[0];

        this._positions = this._positions.slice(1);
        this._paused = false;
    }

    public tick(deltaTime: number, _elapsedTime: number): void {
        if (this._paused) return;
        if (this._completed) return;

        this.updatePosition(deltaTime);
    }

    private updatePosition(deltaTime: number): void {
        const percentageOfDuration = deltaTime / this._duration;

        const futurePosition = this._positions[0];

        const movementVector = new Vector3().subVectors(futurePosition, this._currentPosition).normalize();
        const toMoveLength = this._length * percentageOfDuration;

        this._currentPosition.addScaledVector(movementVector, toMoveLength);

        if (this.isAtPosition(futurePosition)) {
            if (this._positions.length > 1) {
                this._positions = this._positions.slice(1);
            } else {
                this._completed = true;
                this.trigger("completed");
            }
        }
    }

    private isAtPosition(position: Vector3): boolean {
        return new Vector3().subVectors(this._currentPosition, position).length() < 0.05;
    }

    private calculatePathLength(): number {
        let length = 0;

        if (this._positions.length < 2) return length;

        for (let i = 1; i < this._positions.length; i++) {
            const currentPosition = this._positions[i - 1];
            const nextPosition = this._positions[i];

            length += new Vector3().subVectors(currentPosition, nextPosition).length();
        }

        return length;
    }
}