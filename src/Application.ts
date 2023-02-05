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
import World from "./models/worlds/World";

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
    private _world: World | null;

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
        this._world = null;

        this._resourceManager.addEventListener("loadCycleEntryLoaded", () => this.onLoadCycleEntryLoaded());
        this._dimensions.addEventListener("resize", () => this.resize());
        this._timedLoop.addEventListener("tick", () => this.tick(this._timedLoop.deltaTime, this._timedLoop.elapsedTime));

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

    public get world(): World | null {
        return this._world;
    }

    public tick(deltaTime: number, elapsedTime: number): void {
        if (!this._world || !this._world.loaded || !this._player.loaded) return;

        this._camera.tick(deltaTime, elapsedTime);
        this._renderer.tick(deltaTime, elapsedTime);
        this._player.tick(deltaTime, elapsedTime);
    }

    private resize(): void {
        this._camera.resize();
        this._renderer.resize();
    }

    private createWorld(): void {
        this._world = new MainWorld(this);
        this._world.loadWorld();
        this._player.loadPlayer();
    }

    private onLoadCycleEntryLoaded(): void {
        if (this._resourceManager.loadedCycles === 1) {
            this.createWorld();
        }
    }
}