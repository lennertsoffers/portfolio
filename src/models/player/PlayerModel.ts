import { Object3D, Vector3 } from "three";
import Tickable from "../../types/interfaces/Tickable";
import AnimationManager from "../animation/AnimationManager";
import AnimationMappings from "../constants/AnimationMappings";
import ModelConstants from "../constants/ModelConstants";
import MovableObject3D from "../three/MovableObject3D";
import Player from "./Player";

export default class PlayerModel extends MovableObject3D implements Tickable {
    private _player: Player;
    private _animationManager?: AnimationManager;

    constructor(player: Player) {
        super();

        this._player = player;
    }

    public get player(): Player {
        return this._player;
    }

    public get character(): Object3D {
        return this.instance as Object3D;
    }

    public set character(value: Object3D | undefined) {
        this.instance = value;
    }

    public loadModel(): void {
        const characterGltf = this._player.application.resourceManager.getLoadedResource("character").getGltf();
        this.character = characterGltf.scene;
        this.character.position.copy(ModelConstants.PLAYER_INITIAL_POSITION);
        this.character.rotation.setFromVector3(ModelConstants.PLAYER_INITIAL_ROTATION);
        this.character.scale.copy(ModelConstants.PLAYER_SCALE);
        this.centerModifier = ModelConstants.PLAYER_CENTER_MODIFIER.clone();

        this._animationManager = new AnimationManager(this._player.application, this.character.children[0], characterGltf.animations);

        this._player.application.scene.add(this.character);
    }

    public tick(deltaTime: number, elapsedTime: number): void {
        if (!this._animationManager) return;

        this._animationManager.tick(deltaTime, elapsedTime);
    }

    public toIdle(): void {
        if (!this._animationManager) return;
        this._animationManager.play(AnimationMappings.PlayerAnimations.IDLE);
    }

    public toWalking(): void {
        if (!this._animationManager) return;
        this._animationManager.play(AnimationMappings.PlayerAnimations.WALK);
    }

    public toRunning(): void {
        if (!this._animationManager) return;
        this._animationManager.play(AnimationMappings.PlayerAnimations.RUN);
    }

    public async wave(): Promise<void> {
        if (!this._animationManager) return;
        const duration = this._animationManager.play(AnimationMappings.PlayerAnimations.WAVE);

        return new Promise((resolve) => {
            setTimeout(resolve, duration);
        });
    }

    public jump(): void {
        if (!this._animationManager) return;
        this._animationManager.play(AnimationMappings.PlayerAnimations.JUMP);
    }
}