import { Vector3 } from "three";
import Attachable from "../../types/interfaces/Attachable";
import Movable from "../../types/interfaces/Movable";
import Tickable from "../../types/interfaces/Tickable";
import AttachableConstants from "../constants/AttachableConstants";
import MovableObject3D from "./MovableObject3D";

export default abstract class AttachedMovable implements Movable, Attachable, Tickable {
    private _attachedTo: MovableObject3D | null;
    private _pausedAttachment: boolean;
    private _distanceModifier: number;
    private _toPosition: Vector3;

    constructor() {
        this._attachedTo = null;
        this._pausedAttachment = false;
        this._distanceModifier = 1;
        this._toPosition = new Vector3();
    }

    public get distanceModifier(): number {
        return AttachableConstants.DISTANCE + this._distanceModifier;
    }

    public set toPosition(value: Vector3) {
        this._toPosition = value;
    }

    public attach(object: MovableObject3D): void {
        this._attachedTo = object;
    }

    public zoom(zoomAmount: number): void {
        this._distanceModifier = Math.max(Math.min(this._distanceModifier + zoomAmount, AttachableConstants.MAX_ZOOM), AttachableConstants.MIN_ZOOM);
    }

    public pauseAttachment(): void {
        this._pausedAttachment = true;
    }

    public resumeAttachment(): void {
        this._distanceModifier = 1;
        this._pausedAttachment = false;
    }

    public tick(deltaTime: number, _elapsedTime: number): void {
        if (!this._attachedTo) return;
        if (!this._pausedAttachment) this.setToPositionAttached();

        const fromPosition = this.getPosition();

        const movementVec = new Vector3().subVectors(this._toPosition, fromPosition);
        this.move(movementVec.multiplyScalar(deltaTime * 0.01));
        this.lookAt(this._attachedTo.getCenterPosition());
    }

    private setToPositionAttached(): void {
        if (!this._attachedTo) return;

        const attachedPosition = this._attachedTo.getPosition();
        const direction = this._attachedTo.getDirectionY().normalize();
        this._toPosition = new Vector3().subVectors(attachedPosition, direction.clone().multiplyScalar(this.distanceModifier).setY(attachedPosition.y + AttachableConstants.HEIGHT).multiplyScalar(-1));
    }

    abstract getRotation(): Vector3;
    abstract addRotation(rotation: Vector3): void;
    abstract setRotation(rotation: Vector3): void;
    abstract getPosition(): Vector3;
    abstract move(displacement: Vector3): void;
    abstract setPosition(position: Vector3): void;
    abstract getDirectionY(): Vector3;
    abstract lookAt(vector: Vector3): void;
}