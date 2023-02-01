import { Object3D, Vector3 } from "three";

export default interface Movable {
    getRotation(): Vector3;

    addRotation(rotation: Vector3): void;

    setRotation(rotation: Vector3): void;

    getPosition(): Vector3;

    move(displacement: Vector3): void;

    setPosition(position: Vector3): void;

    getDirectionY(): Vector3;

    lookAt(vector: Vector3): void;
}