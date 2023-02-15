import { Mesh } from "three";
import Application from "../../Application";
import WorldEventManager from "../events/WorldEventManager";

export default abstract class World {
    private _application: Application;
    private _wallsCollisionMeshes: Mesh[];
    private _floorCollisionMeshes: Mesh[];
    private _cameraCollisionMeshes: Mesh[];
    private _actionCollisionMeshes: Mesh[];
    private _worldEventManager: WorldEventManager;
    protected _loaded: boolean;

    constructor(application: Application) {
        this._application = application;
        this._wallsCollisionMeshes = [];
        this._floorCollisionMeshes = [];
        this._cameraCollisionMeshes = [];
        this._actionCollisionMeshes = [];
        this._worldEventManager = new WorldEventManager();
        this._loaded = false;
    }

    public get application(): Application {
        return this._application;
    }

    public get wallsCollisionMeshes(): Mesh[] {
        return this._wallsCollisionMeshes;
    }

    public get floorCollisionMeshes(): Mesh[] {
        return this._floorCollisionMeshes;
    }

    public get cameraCollisionMeshes(): Mesh[] {
        return this._cameraCollisionMeshes;
    }

    public get actionCollisionMeshes(): Mesh[] {
        return this._actionCollisionMeshes;
    }

    public get worldEventManager(): WorldEventManager {
        return this._worldEventManager;
    }

    public get loaded(): boolean {
        return this._loaded;
    }

    public addWallsCollisionMeshes(...meshes: Mesh[]) {
        this._wallsCollisionMeshes = this._wallsCollisionMeshes.concat(meshes);
    }

    public addFloorCollisionMeshes(...meshes: Mesh[]) {
        this._floorCollisionMeshes = this._floorCollisionMeshes.concat(meshes);
    }

    public addCameraCollisionMeshes(...meshes: Mesh[]) {
        this._cameraCollisionMeshes = this._cameraCollisionMeshes.concat(meshes);
    }

    public addActionCollisionMeshes(...meshes: Mesh[]) {
        this._actionCollisionMeshes = this._actionCollisionMeshes.concat(meshes);
    }

    public abstract loadWorld(): void;
}