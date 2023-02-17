import Application from "../../Application";
import { PerspectiveCamera, Vector3 } from "three";
import AttachedMovable from "./AttachedMovable";

export default class AttachableCamera extends AttachedMovable {
    private _application: Application;
    private _instance: PerspectiveCamera;

    constructor(application: Application) {
        super();

        this._application = application;
        this._instance = new PerspectiveCamera(35, this._application.dimensions.getAspectRatio(), 0.1, 100);
        this._instance.position.set(0, 0, 5);

        this._application.scene.add(this._instance);
    }

    public get instance(): PerspectiveCamera {
        return this._instance;
    }

    public getRotation(): Vector3 {
        const rotation = this._instance.rotation;
        return new Vector3(rotation.x, rotation.y, rotation.z);
    }

    public addRotation(rotation: Vector3): void {
        this._instance.rotation.x += rotation.x;
        this._instance.rotation.y += rotation.y;
        this._instance.rotation.z += rotation.z;
    }

    public setRotation(rotation: Vector3): void {
        this._instance.rotation.setFromVector3(rotation);
    }

    public getPosition(): Vector3 {
        return this._instance.position;
    }

    public move(displacement: Vector3): void {
        this._instance.position.add(displacement);
    }

    public setPosition(position: Vector3): void {
        this._instance.position.set(position.x, position.y, position.z);
    }

    public getDirectionY(): Vector3 {
        const rotation = this.getRotation();
        const direction = new Vector3(-Math.sin(rotation.y), 0, -Math.cos(rotation.y));
        return direction.normalize();
    }

    public lookAt(vector: Vector3): void {
        this._instance.lookAt(vector);
    }

    public resize(): void {
        this._instance.aspect = this._application.dimensions.getAspectRatio();
        this._instance.updateProjectionMatrix();
    }
}