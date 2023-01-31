import Application from "../../Application";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three";

export default class Camera {
    private _application: Application;
    private _instance: PerspectiveCamera;
    private _controls: OrbitControls;

    constructor(application: Application) {
        this._application = application;
        this._instance = new PerspectiveCamera(35, this._application.dimensions.getAspectRatio(), 0.1, 100);
        this._instance.position.set(0, 0, 5);

        this._controls = new OrbitControls(this._instance, this._application.canvas);
        this._controls.enableDamping = true;

        this._application.scene.add(this._instance);
    }

    public get instance(): PerspectiveCamera {
        return this._instance;
    }

    public resize(): void {
        this._instance.aspect = this._application.dimensions.getAspectRatio();
        this._instance.updateProjectionMatrix();
    }

    public update(): void {
        this._controls.update();
    }
}