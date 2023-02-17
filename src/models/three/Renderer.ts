import { CineonToneMapping, PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from "three";
import Application from "../../Application";
import Tickable from "../../types/interfaces/Tickable";

export default class Renderer implements Tickable {
    private _application: Application;
    private _instance: WebGLRenderer;

    constructor(application: Application) {
        this._application = application;

        this._instance = new WebGLRenderer({
            canvas: this._application.canvas,
            antialias: true
        });

        this._instance.physicallyCorrectLights = true;
        this._instance.outputEncoding = sRGBEncoding;
        this._instance.toneMapping = CineonToneMapping;
        this._instance.toneMappingExposure = 1.75;
        this._instance.shadowMap.enabled = true;
        this._instance.shadowMap.type = PCFSoftShadowMap;
        this._instance.setClearColor(0x000000);
        this._instance.setSize(this._application.dimensions.width, this._application.dimensions.height);
        this._instance.setPixelRatio(Math.min(this._application.dimensions.pixelRatio, 2));
    }

    public resize(): void {
        this._instance.setSize(this._application.dimensions.width, this._application.dimensions.height);
        this._instance.setPixelRatio(Math.min(this._application.dimensions.pixelRatio, 2));
    }

    public tick(_deltaTime: number, _elapsedTime: number): void {
        this._instance.render(this._application.scene, this._application.currentCamera.instance);
    }
}