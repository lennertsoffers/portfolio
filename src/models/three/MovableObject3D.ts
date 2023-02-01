import { Object3D, Vector3 } from "three";
import Movable from "../../types/interfaces/Movable";

export default class MovableObject3D implements Movable {
    private _instance: Object3D | undefined;
    private _centerModifier: Vector3 | null;

    constructor(object3D: Object3D | undefined = undefined) {
        this._instance = object3D;
        this._centerModifier = null;
    }

    public get instance(): Object3D | undefined {
        return this._instance;
    }

    public set instance(value: Object3D | undefined) {
        this._instance = value;
    }

    public set centerModifier(value: Vector3 | null) {
        this._centerModifier = value;
    }

    public getRotation(): Vector3 {
        if (!this._instance) return new Vector3();

        const rotation = this._instance.rotation;
        return new Vector3(rotation.x, rotation.y, rotation.z);
    }

    public addRotation(rotation: Vector3): void {
        if (!this._instance) return;

        this._instance.rotation.x += rotation.x;
        this._instance.rotation.y += rotation.y;
        this._instance.rotation.z += rotation.z;
    }

    public setRotation(rotation: Vector3): void {
        if (!this._instance) return;

        this._instance.rotation.setFromVector3(rotation);
    }

    public getPosition(): Vector3 {
        if (!this._instance) return new Vector3();

        return this._instance.position.clone();
    }

    public getCenterPosition(): Vector3 {
        if (!this._instance) return new Vector3();

        if (!this._centerModifier) return this.getPosition();
        return this.getPosition().add(this._centerModifier);
    }

    public move(displacement: Vector3): void {
        if (!this._instance) return;

        this._instance.position.add(displacement);
    }

    public setPosition(position: Vector3): void {
        if (!this._instance) return;

        this._instance.position.set(position.x, position.y, position.z);
    }

    public getDirectionY(): Vector3 {
        const rotation = this.getRotation();
        const direction = new Vector3(-Math.sin(rotation.y), 0, -Math.cos(rotation.y));
        return direction.normalize();
    }

    public lookAt(vector: Vector3): void {
        if (!this._instance) return;

        this._instance.lookAt(vector);
    }
}