import { Vector3 } from "three";
import Attachable from "../../types/interfaces/Attachable";
import Movable from "../../types/interfaces/Movable";
import Tickable from "../../types/interfaces/Tickable";
import AttachableConstants from "../constants/AttachableConstants";
import MovableObject3D from "./MovableObject3D";

export default abstract class AttachedMovable implements Movable, Attachable, Tickable {
    private _attachedTo: MovableObject3D | null;
    private _pausedAttachment: boolean;

    constructor() {
        this._attachedTo = null;
        this._pausedAttachment = false;
    }

    public attach(object: MovableObject3D): void {
        this._attachedTo = object;
    }

    public pauseAttachment(): void {
        this._pausedAttachment = true;
    }

    public resumeAttachment(): void {
        this._pausedAttachment = false;
    }

    public tick(deltaTime: number, _elapsedTime: number): void {
        if (!this._attachedTo || this._pausedAttachment) return;

        const fromPosition = this.getPosition();
        const attachedPosition = this._attachedTo.getPosition();
        const direction = this._attachedTo.getDirectionY().normalize();
        const toPosition = new Vector3().subVectors(attachedPosition, direction.clone().multiplyScalar(AttachableConstants.DISTANCE).setY(attachedPosition.y + AttachableConstants.HEIGHT).multiplyScalar(-1));

        const movementVec = new Vector3().subVectors(toPosition, fromPosition);

        this.move(movementVec.multiplyScalar(deltaTime * 0.01));
        this.lookAt(this._attachedTo.getCenterPosition());
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