import { PointLight, AmbientLight, Object3D } from "three";
import Tickable from "../../types/interfaces/Tickable";
import AnimationManager from "../animation/AnimationManager";
import Player from "./Player";

export default class PlayerModel implements Tickable {
    private _player: Player;
    private _character?: Object3D;
    private _animationManager?: AnimationManager;

    constructor(player: Player) {
        this._player = player;
    }

    public get player(): Player {
        return this._player;
    }

    public loadModel(): void {
        const characterGltf = this._player.application.resourceManager.getLoadedResource("character").getGltf();
        this._character = characterGltf.scene;
        this._character.position.set(0, -1, 0);

        this._animationManager = new AnimationManager(this._player.application, this._character.children[0], characterGltf.animations);

        this._player.application.scene.add(this._character);
    }

    public tick(): void {
        this._animationManager?.tick();
    }
}