import { Scene } from "three";

import ParticleManager from "./models/animation/ParticleManager";
import BookControls from "./models/controls/BookControls";
import MobileControls from "./models/controls/MobileControls";
import MouseControls from "./models/controls/MouseControls";
import TouchControls from "./models/controls/TouchControls";
import Hud from "./models/hud/Hud";
import TimedLoop from "./models/logic/TimedLoop";
import BookManager from "./models/pages/BookManager";
import LinkContainer from "./models/pages/LinkContainer";
import LoadingPage from "./models/pages/LoadingPage";
import PageManager from "./models/pages/PageManager";
import Player from "./models/player/Player";
import Pointer from "./models/startsSequence/Pointer";
import StartSequence from "./models/startsSequence/StartSequence";
import AttachableCamera from "./models/three/AttachableCamera";
import AudioManager from "./models/three/AudioManager";
import CinematicCamera from "./models/three/CinematicCamera";
import Renderer from "./models/three/Renderer";
import ResourceManager from "./models/three/ResourceManager";
import MainWorld from "./models/worlds/MainWorld";
import World from "./models/worlds/World";
import Tickable from "./types/interfaces/Tickable";
import Debug from "./utils/Debug";
import Dimensions from "./utils/Dimensions";

export default class Application implements Tickable {
    private _canvas: HTMLCanvasElement;
    private _pageManager: PageManager;
    private _loadingPage: LoadingPage;
    private _hud: Hud;
    private _startSequence: StartSequence;
    private _debug: Debug;
    private _resourceManager: ResourceManager;
    private _particleManager: ParticleManager;
    private _dimensions: Dimensions;
    private _timedLoop: TimedLoop;
    private _scene: Scene;
    private _cinematicCamera: CinematicCamera;
    private _attachableCamera: AttachableCamera;
    private _currentCamera: AttachableCamera | CinematicCamera;
    private _renderer: Renderer;
    private _player: Player;
    private _world: World;
    private _bookManager: BookManager;
    private _touchControls: TouchControls;
    private _bookControls: BookControls;
    private _mouseControls: MouseControls;
    private _mobileControls: MobileControls;
    private _pointer: Pointer;
    private _linkContainer: LinkContainer;
    private _audioManager: AudioManager;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._hud = new Hud(this);
        this._debug = new Debug();
        this._touchControls = new TouchControls();
        this._bookControls = new BookControls();
        this._mouseControls = new MouseControls();
        this._mobileControls = new MobileControls();
        this._linkContainer = new LinkContainer();
        this._resourceManager = new ResourceManager();
        this._dimensions = new Dimensions();
        this._timedLoop = new TimedLoop();
        this._scene = new Scene();
        this._attachableCamera = new AttachableCamera(this);
        this._cinematicCamera = new CinematicCamera(this);
        this._currentCamera = this._attachableCamera;
        this._audioManager = new AudioManager();
        this._attachableCamera.instance.add(this._audioManager.audioListener);
        this._cinematicCamera.instance.add(this._audioManager.audioListener);
        this._renderer = new Renderer(this);
        this._player = new Player(this);
        this._world = new MainWorld(this);
        this._pageManager = new PageManager(this);
        this._particleManager = new ParticleManager(this);
        this._loadingPage = new LoadingPage(
            () => this.createWorld(),
            async () => {
                await this.audioManager.loadAllAudios();
                this._startSequence.play();
            }
        );
        this._startSequence = new StartSequence(this);
        this._bookManager = new BookManager(this);
        this._pointer = new Pointer(this);

        this._resourceManager.addEventListener("loadCycleEntryLoaded", () =>
            this.onLoadCycleEntryLoaded()
        );

        this._dimensions.addEventListener("resize", () => this.resize());
        this._dimensions.addEventListener("usemobile", () =>
            this._mobileControls.show()
        );
        this._dimensions.addEventListener("usepc", () =>
            this._mobileControls.hide()
        );

        this._timedLoop.addEventListener("tick", () =>
            this.tick(this._timedLoop.deltaTime, this._timedLoop.elapsedTime)
        );

        this.showLoadingPage();
        this._resourceManager.startLoading();

        this._mouseControls.addEventListener("mousedown", () =>
            canvas.classList.add("mousedown")
        );
        this._mouseControls.addEventListener("mouseup", () =>
            canvas.classList.remove("mousedown")
        );
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get hud(): Hud {
        return this._hud;
    }

    public get pageManager(): PageManager {
        return this._pageManager;
    }

    public get debug(): Debug {
        return this._debug;
    }

    public get touchControls(): TouchControls {
        return this._touchControls;
    }

    public get bookControls(): BookControls {
        return this._bookControls;
    }

    public get mobileControls(): MobileControls {
        return this._mobileControls;
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

    public get particleManager(): ParticleManager {
        return this._particleManager;
    }

    public get pointer(): Pointer {
        return this._pointer;
    }

    public get bookManager(): BookManager {
        return this._bookManager;
    }

    public get linkContainer(): LinkContainer {
        return this._linkContainer;
    }

    public get audioManager(): AudioManager {
        return this._audioManager;
    }

    public showLoadingPage(): void {
        this._loadingPage.show();
    }

    public tick(deltaTime: number, elapsedTime: number): void {
        if (!this._world || !this._world.loaded || !this._player.loaded) return;

        this._currentCamera.tick(deltaTime, elapsedTime);
        this._renderer.tick(deltaTime, elapsedTime);
        this._player.tick(deltaTime, elapsedTime);
        this._particleManager.tick(deltaTime, elapsedTime);
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
        this._bookManager.resize();
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
