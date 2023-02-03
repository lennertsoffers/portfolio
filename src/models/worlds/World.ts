import { Mesh } from "three";
import Application from "../../Application";

export default abstract class World {
    private _application: Application;
    private _wallsCollisionMeshes: Mesh[];
    private _floorCollisionMeshes: Mesh[];

    constructor(application: Application) {
        this._application = application;
        this._wallsCollisionMeshes = [];
        this._floorCollisionMeshes = [];
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

    public addWallsCollisionMeshes(...meshes: Mesh[]) {
        this._wallsCollisionMeshes = this._wallsCollisionMeshes.concat(meshes);
    }

    public addFloorCollisionMeshes(...meshes: Mesh[]) {
        this._floorCollisionMeshes = this._floorCollisionMeshes.concat(meshes);
    }

    public abstract loadWorld(): void;
}