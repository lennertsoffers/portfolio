import { AmbientLight, PointLight, Scene } from "three";
import TimedLoop from "./models/logic/TimedLoop";
import Dimensions from "./utils/Dimensions";
import Renderer from "./models/three/Renderer";
import AttachableCamera from "./models/three/AttachableCamera";
import ResourceManager from "./models/three/ResourceManager";
import MainWorld from "./models/worlds/MainWorld";
import Player from "./models/player/Player";
import Tickable from "./types/interfaces/Tickable";
import Debug from "./utils/Debug";
import World from "./models/worlds/World";
import PageManager from "./models/pages/PageManager";
import CinematicCamera from "./models/three/CinematicCamera";
import LoadingPage from "./models/pages/LoadingPage";
import StartSequence from "./models/startsSquence/StartSequence";

export default class Application implements Tickable {
    private _canvas: HTMLCanvasElement;
    private _pageManager: PageManager;
    private _loadingPage: LoadingPage;
    private _startSequence: StartSequence;
    private _debug: Debug;
    private _resourceManager: ResourceManager;
    private _dimensions: Dimensions;
    private _timedLoop: TimedLoop;
    private _scene: Scene;
    private _cinematicCamera: CinematicCamera;
    private _attachableCamera: AttachableCamera;
    private _currentCamera: AttachableCamera | CinematicCamera;
    private _renderer: Renderer;
    private _player: Player;
    private _world: World;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._debug = new Debug();
        this._resourceManager = new ResourceManager();
        this._dimensions = new Dimensions();
        this._timedLoop = new TimedLoop();
        this._scene = new Scene();
        this._attachableCamera = new AttachableCamera(this);
        this._cinematicCamera = new CinematicCamera(this);
        this._currentCamera = this._attachableCamera;
        this._renderer = new Renderer(this);
        this._player = new Player(this);
        this._world = new MainWorld(this);
        this._pageManager = new PageManager(this);
        this._loadingPage = new LoadingPage(this, () => this.createWorld(), () => this._startSequence.play());
        this._startSequence = new StartSequence(this);

        this._resourceManager.addEventListener("loadCycleEntryLoaded", () => this.onLoadCycleEntryLoaded());
        this._dimensions.addEventListener("resize", () => this.resize());
        this._timedLoop.addEventListener("tick", () => this.tick(this._timedLoop.deltaTime, this._timedLoop.elapsedTime));

        this.showLoadingPage();
        this._resourceManager.startLoading();

        // TODO - Remove lights
        const light = new PointLight(0xffffff, 100, 0);
        light.position.set(5, 5, 5);
        this._scene.add(light);
        const sun = new AmbientLight(0xffffff, 0.5);
        this._scene.add(sun);

        // const mesh = new Mesh(
        //     new BoxGeometry(0.1, 0.1, 0.1),
        //     new MeshBasicMaterial({ color: 0x00ff00 })
        // );
        // mesh.position.set(2.02, 0.1, -1.9);
        // this._scene.add(
        //     mesh
        // );
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get pageManager(): PageManager {
        return this._pageManager;
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

    public get attachableCamera(): AttachableCamera {
        return this._attachableCamera;
    }

    public get cinematicCamera(): CinematicCamera {
        return this._cinematicCamera;
    }

    public get currentCamera(): AttachableCamera | CinematicCamera {
        return this._currentCamera;
    }

    public get world(): World | null {
        return this._world;
    }

    public get player(): Player | null {
        return this._player;
    }

    public showLoadingPage(): void {
        this._loadingPage.show();
    }

    public tick(deltaTime: number, elapsedTime: number): void {
        if (!this._world || !this._world.loaded || !this._player.loaded) return;

        this._currentCamera.tick(deltaTime, elapsedTime);
        this._renderer.tick(deltaTime, elapsedTime);
        this._player.tick(deltaTime, elapsedTime);
    }

    public useAttachableCamera(): void {
        this._currentCamera = this._attachableCamera;
    }

    public useCinematicCamera(): void {
        this._currentCamera = this._cinematicCamera;
    }

    private resize(): void {
        this._currentCamera.resize();
        this._renderer.resize();
    }

    private createWorld(): void {
        this._world.loadWorld();
        this._player.loadPlayer();
    }

    private onLoadCycleEntryLoaded(): void {
        if (this._resourceManager.loadedCycles === 1) {
            this._loadingPage.loaded();
        }
    }
}