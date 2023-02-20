import { Vector3 } from "three";
import Tickable from "../../types/interfaces/Tickable";
import EventEmitter from "../../utils/EventEmitter";
import EmptyWaypointsError from "../error/EmptyWaypointsError";

export default class CameraPath extends EventEmitter implements Tickable {
    private _waypoints: Vector3[];
    private _previousWaypoint: Vector3;
    private _nextWaypoint: Vector3 | null;
    private _currentStepDirection: Vector3;
    private _nextWaypointIndex: number;
    private _currentPosition: Vector3;
    private _currentPublishedPosition: Vector3;
    private _totalPathLength: number;
    private _duration: number;
    private _paused: boolean;
    private _canComplete: boolean;
    private _completed: boolean;

    private _publishSpeed: number;
    private _publishCounter: number;

    constructor(waypoints: Vector3[], duration: number, publishSpeed: number) {
        if (!waypoints.length) throw new EmptyWaypointsError();

        super();

        this._waypoints = waypoints;
        this._previousWaypoint = new Vector3();
        this._nextWaypoint = null;
        this._currentStepDirection = new Vector3();
        this._nextWaypointIndex = 0;
        this._currentPosition = new Vector3();
        this._currentPublishedPosition = new Vector3();

        this._duration = duration;
        this._paused = true;
        this._canComplete = false;
        this._completed = false;

        this._publishSpeed = publishSpeed;
        this._publishCounter = 0;

        this._totalPathLength = this.getTotalPathLength();
    }

    public get completed(): boolean {
        return this._completed;
    }

    public get currentPosition(): Vector3 {
        return this._currentPublishedPosition.clone();
    }

    public start(): void {
        this._previousWaypoint = this._waypoints[this._nextWaypointIndex].clone();
        this._nextWaypointIndex++;
        this._nextWaypoint = this.getNextWaypoint();

        this.recalculateCurrentStepDirection();

        this._currentPosition = this._previousWaypoint.clone();

        this._paused = false;

        this.publishPosition();
    }

    public tryComplete(currentPosition: Vector3): void {
        if (!this._canComplete) return;

        if (Math.abs(currentPosition.x - this._currentPublishedPosition.x) > 0.05) return;
        if (Math.abs(currentPosition.y - this._currentPublishedPosition.y) > 0.05) return;
        if (Math.abs(currentPosition.z - this._currentPublishedPosition.z) > 0.05) return;

        this._completed = true;
        this.trigger("completed");
    }

    public tick(deltaTime: number, _elapsedTime: number): void {
        if (this._paused) return;
        if (this._completed) return;

        const percentageOfDuration = deltaTime / this._duration;
        let toMoveLength = this._totalPathLength * percentageOfDuration;
        this.updatePosition(toMoveLength);

        if (this._publishCounter >= this._publishSpeed) {
            this._publishCounter -= this._publishSpeed;
            this.publishPosition();
        }

        this._publishCounter += deltaTime;
    }

    private updatePosition(toMoveLength: number): void {
        if (!this._nextWaypoint) {
            this._canComplete = true;
            return;
        };

        const remainingMovementInStep = new Vector3().subVectors(this._currentPosition, this._nextWaypoint);
        const remainingLength = remainingMovementInStep.length();

        // Doesn't reach the next waypoint
        if (toMoveLength < remainingLength) {
            this._currentPosition.addScaledVector(this._currentStepDirection, toMoveLength);
        }
        // Exactly reaches the next waypoint
        else if (toMoveLength === remainingLength) {
            this._currentPosition.copy(this._nextWaypoint);

            // Recalculate waypoints
            this.recalculateWaypoints();
        }
        // Overshoots waypoint
        else {
            this._currentPosition.copy(this._nextWaypoint);
            toMoveLength -= remainingLength;

            // Recalculate waypoints and update poistion again
            this.recalculateWaypoints();
            this.updatePosition(toMoveLength);
        }
    }

    private recalculateWaypoints(): void {
        if (!this._nextWaypoint) return;

        this._previousWaypoint.copy(this._nextWaypoint);
        this._nextWaypoint = this.getNextWaypoint();

        this.recalculateCurrentStepDirection();
    }

    private recalculateCurrentStepDirection(): void {
        if (!this._nextWaypoint) {
            this._currentStepDirection = new Vector3();
        } else {
            this._currentStepDirection = new Vector3().subVectors(this._nextWaypoint, this._previousWaypoint).normalize();
        }
    }

    private getNextWaypoint(): Vector3 | null {
        if (this._waypoints.length <= this._nextWaypointIndex) return null;

        const nextWaypoint = this._waypoints[this._nextWaypointIndex].clone();
        this._nextWaypointIndex++;
        return nextWaypoint;
    }

    private getTotalPathLength(): number {
        let length = 0;

        if (this._waypoints.length < 2) return length;

        for (let i = 1; i < this._waypoints.length; i++) {
            const currentWaypoint = this._waypoints[i - 1];
            const nextWaypoint = this._waypoints[i];

            length += new Vector3().subVectors(currentWaypoint, nextWaypoint).length();
        }

        return length;
    }

    private publishPosition(): void {
        this._currentPublishedPosition.copy(this._currentPosition);
    }
}