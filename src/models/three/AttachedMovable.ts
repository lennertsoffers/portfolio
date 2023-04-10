import { ArrowHelper, Mesh, Raycaster, Vector3 } from "three";
import Application from "../../Application";
import Attachable from "../../types/interfaces/Attachable";
import Movable from "../../types/interfaces/Movable";
import Tickable from "../../types/interfaces/Tickable";
import AttachableConstants from "../constants/AttachableConstants";
import CollisionConstants from "../constants/CollisionConstants";
import MovableObject3D from "./MovableObject3D";

export default abstract class AttachedMovable implements Movable, Attachable, Tickable {
    private _attachedTo: MovableObject3D | null;
    private _pausedAttachment: boolean;
    private _distanceModifier: number;
    private _distanceDueToCollision: number;
    private _futurePosition: Vector3;
    private _collisionMeshes: Mesh[];

    constructor() {
        this._attachedTo = null;
        this._pausedAttachment = false;
        this._distanceModifier = AttachableConstants.DEFAULT_ZOOM;
        this._distanceDueToCollision = 0;
        this._futurePosition = new Vector3();
        this._collisionMeshes = [];
    }

    public get distanceModifier(): number {
        return AttachableConstants.DISTANCE + this._distanceModifier;
    }

    public set futurePosition(value: Vector3) {
        this._futurePosition = value;
    }

    public set collisionMeshes(value: Mesh[]) {
        this._collisionMeshes = value;
    }

    public attach(object: MovableObject3D): void {
        this._attachedTo = object;
    }

    public zoom(zoomAmount: number): boolean {
        let maxedDistanceModifier = false;
        const newDistanceModifier = this._distanceModifier + zoomAmount;

        if (newDistanceModifier > AttachableConstants.MAX_ZOOM) {
            this._distanceModifier = AttachableConstants.MAX_ZOOM;
            maxedDistanceModifier = true;
        } else if (newDistanceModifier < AttachableConstants.MIN_ZOOM) {
            this._distanceModifier = AttachableConstants.MIN_ZOOM;
            maxedDistanceModifier = true;
        } else {
            this._distanceModifier = newDistanceModifier;
        }

        return maxedDistanceModifier;
    }

    public pauseAttachment(): void {
        this._pausedAttachment = true;
    }

    public resumeAttachment(): void {
        this._distanceModifier = AttachableConstants.DEFAULT_ZOOM;
        this._pausedAttachment = false;
    }

    public tick(deltaTime: number, _elapsedTime: number): void {
        if (!this._pausedAttachment) this.setFuturePositionAttached();

        this.moveMovable(deltaTime);
    }

    private setFuturePositionAttached(): void {
        if (!this._attachedTo) return;

        const attachedPosition = this._attachedTo.getPosition();
        const direction = this._attachedTo.getDirectionY().normalize();
        this._futurePosition = new Vector3().subVectors(
            attachedPosition,
            direction
                .clone()
                .multiplyScalar(this.distanceModifier)
                .setY(attachedPosition.y + AttachableConstants.HEIGHT)
                .multiplyScalar(-1)
        );
    }

    private moveMovable(deltaTime: number): void {
        if (!this._attachedTo) return;

        let movementVec = this.calculateMovementVector(deltaTime);

        const thisToAttachedDirection = new Vector3().subVectors(
            this._attachedTo.getCenterPosition(),
            this.getPosition()
        );
        const attachedToThisDirection = thisToAttachedDirection.clone().negate();

        const rayFromThisToAttached = new Raycaster(
            this.getPosition(),
            thisToAttachedDirection.clone().normalize()
        );
        const rayFromAttachedToThis = new Raycaster(
            this._attachedTo.getCenterPosition(),
            attachedToThisDirection.clone().normalize()
        );

        const intersectionsThisToAttached = rayFromThisToAttached.intersectObjects(
            this._collisionMeshes
        );
        const intersectionsAttachedToThis = rayFromAttachedToThis.intersectObjects(
            this._collisionMeshes
        );

        const toDistance = thisToAttachedDirection.length();

        const filteredIntersectionsThisToAttached = intersectionsThisToAttached.filter(
            (intersection) =>
                intersection.distance - CollisionConstants.COLLISION_DISTANCE <= toDistance
        );
        const filteredIntersectionsAttachedToThis = intersectionsAttachedToThis.filter(
            (intersection) =>
                intersection.distance - CollisionConstants.COLLISION_DISTANCE <= toDistance
        );

        if (
            filteredIntersectionsThisToAttached.length > 0 ||
            filteredIntersectionsAttachedToThis.length > 0
        ) {
            if (!this.zoom(-0.1)) {
                this._distanceDueToCollision -= 0.1;
            }
            movementVec = this.calculateMovementVector(deltaTime);
        } else if (Math.round(this._distanceDueToCollision * 100) / 100 !== 0) {
            // Only zoom out if no collision backwards
            const rayProximityCheck = new Raycaster(
                this.getPosition(),
                attachedToThisDirection.clone().normalize()
            );
            const proximityIntersections = rayProximityCheck
                .intersectObjects(this._collisionMeshes)
                .filter((intersection) => {
                    return intersection.distance <= 0.5;
                });

            if (proximityIntersections.length === 0) {
                this.zoom(0.02);
                this._distanceDueToCollision += 0.02;
                movementVec = this.calculateMovementVector(deltaTime);
            }
        }

        this.move(movementVec);

        this.lookAt(this._attachedTo.getCenterPosition());
    }

    private calculateMovementVector(deltaTime: number): Vector3 {
        return new Vector3()
            .subVectors(this._futurePosition, this.getPosition())
            .multiplyScalar(deltaTime * 0.01);
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
