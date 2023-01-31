import { Scene } from "three";
import TimedLoop from "./models/logic/TimedLoop";
import Dimensions from "./utils/Dimensions";
import Renderer from "./models/three/Renderer";
import Camera from "./models/three/Camera";
import ResourceManager from "./models/three/ResourceManager";
import MainWorld from "./models/worlds/MainWorld";

export default class Application {
    private _canvas: HTMLCanvasElement;
    private _resourceManager: ResourceManager;
    private _dimensions: Dimensions;
    private _timedLoop: TimedLoop;
    private _scene: Scene;
    private _camera: Camera;
    private _renderer: Renderer;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;

        this._resourceManager = new ResourceManager();
        this._dimensions = new Dimensions();
        this._timedLoop = new TimedLoop();
        this._scene = new Scene();
        this._camera = new Camera(this);
        this._renderer = new Renderer(this);

        this._resourceManager.addEventListener("loadCycleEntryLoaded", () => this.onLoadCycleEntryLoaded());
        this._dimensions.addEventListener("resize", () => this.resize());
        this._timedLoop.addEventListener("tick", () => this.update());

        this._resourceManager.startLoading();
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get resourceManager(): ResourceManager {
        return this._resourceManager;
    }

    public get dimensions(): Dimensions {
        return this._dimensions;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public get camera(): Camera {
        return this._camera;
    }

    private resize(): void {
        this._camera.resize();
        this._renderer.resize();
    }

    private update(): void {
        this._camera.update();
        this._renderer.update();
    }

    private createWorld(): void {
        const mainWorld = new MainWorld(this);
        mainWorld.createWorld();
    }

    private onLoadCycleEntryLoaded(): void {
        if (this._resourceManager.loadedCycles === 1) {
            this.createWorld();
        }
    }
}