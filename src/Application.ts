import { AmbientLight, PointLight, Scene } from "three";
import TimedLoop from "./models/logic/TimedLoop";
import Dimensions from "./utils/Dimensions";
import Renderer from "./models/three/Renderer";
import Camera from "./models/three/Camera";
import ResourceManager from "./models/three/ResourceManager";
import MainWorld from "./models/worlds/MainWorld";
import Player from "./models/player/Player";
import Tickable from "./types/interfaces/Tickable";
import Debug from "./utils/Debug";

export default class Application implements Tickable {
    private _canvas: HTMLCanvasElement;
    private _debug: Debug;
    private _resourceManager: ResourceManager;
    private _dimensions: Dimensions;
    private _timedLoop: TimedLoop;
    private _scene: Scene;
    private _camera: Camera;
    private _renderer: Renderer;
    private _player: Player;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._debug = new Debug();
        this._resourceManager = new ResourceManager();
        this._dimensions = new Dimensions();
        this._timedLoop = new TimedLoop();
        this._scene = new Scene();
        this._camera = new Camera(this);
        this._renderer = new Renderer(this);
        this._player = new Player(this);

        this._resourceManager.addEventListener("loadCycleEntryLoaded", () => this.onLoadCycleEntryLoaded());
        this._dimensions.addEventListener("resize", () => this.resize());
        this._timedLoop.addEventListener("tick", () => this.tick());

        this._resourceManager.startLoading();

        // TODO - Remove lights
        const light = new PointLight(0xffffff, 100, 0);
        light.position.set(5, 5, 5);
        this._scene.add(light);
        const sun = new AmbientLight(0xffffff, 0.5);
        this._scene.add(sun);
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get debug(): Debug {
        return this._debug;
    }

    public get resourceManager(): ResourceManager {
        return this._resourceManager;
    }

    public get dimensions(): Dimensions {
        return this._dimensions;
    }

    public get timedLoop(): TimedLoop {
        return this._timedLoop;
    }

    public get scene(): Scene {
        return this._scene;
    }

    public get camera(): Camera {
        return this._camera;
    }

    public tick(): void {
        this._camera.tick();
        this._renderer.tick();
        this._player.tick();
    }

    private resize(): void {
        this._camera.resize();
        this._renderer.resize();
    }

    private createWorld(): void {
        // const mainWorld = new MainWorld(this);
        // mainWorld.loadWorld();
        this._player.loadPlayer();
    }

    private onLoadCycleEntryLoaded(): void {
        if (this._resourceManager.loadedCycles === 1) {
            this.createWorld();
        }
    }
}