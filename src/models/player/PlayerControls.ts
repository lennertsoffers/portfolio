import { Vector3 } from "three";
import Tickable from "../../types/interfaces/Tickable";
import MathUtils from "../../utils/MathUtils";
import ControlConstants from "../constants/ControlsConstants";
import Camera from "../three/Camera";
import MovableObject3D from "../three/MovableObject3D";
import Player from "./Player";
import PlayerModel from "./PlayerModel";

export default class PlayerControls implements Tickable {
    private _player: Player;
    private _keysDown: Set<string>;
    private _toPosition: Vector3;
    private _toRotation: Vector3;
    private _loaded: boolean;

    constructor(player: Player) {
        this._player = player;
        this._keysDown = new Set<string>;

        this._toPosition = new Vector3();
        this._toRotation = new Vector3();

        this._loaded = false;
    }

    public get character(): PlayerModel {
        return this._player.playerModel;
    }

    public get camera(): Camera {
        return this._player.application.camera;
    }

    public tick(deltaTime: number, _elapsedTime: number): void {
        if (!this._loaded) return;

        if (this._keysDown.has("w")) {
            if (this._keysDown.has("shift")) {
                this._toPosition.add(this.character.getDirectionY().multiplyScalar(-ControlConstants.PLAYER_RUN_SPEED / 100));
            } else {
                this._toPosition.add(this.character.getDirectionY().multiplyScalar(-ControlConstants.PLAYER_WALK_SPEED / 100));
            }
        }

        if (this._keysDown.has("s")) {
            this._toPosition.add(this.character.getDirectionY().multiplyScalar(ControlConstants.PLAYER_WALK_SPEED / 100));
        }

        if (this._keysDown.has("a")) this._toRotation.add(new Vector3(0, ControlConstants.PLAYER_ROTATION_SPEED / 10, 0));
        if (this._keysDown.has("d")) this._toRotation.add(new Vector3(0, -ControlConstants.PLAYER_ROTATION_SPEED / 10, 0));

        const movementVec = this._toPosition.clone().add(this.character.getPosition().multiplyScalar(-1));
        this.character.move(movementVec.multiplyScalar(deltaTime * 0.01 / ControlConstants.PLAYER_MOVEMENT_DAMPING));

        const rotationVec = this._toRotation.clone().add(this.character.getRotation().multiplyScalar(-1));
        this.character.addRotation(rotationVec.multiplyScalar(deltaTime * 0.01 / ControlConstants.PLAYER_ROTATION_DAMPING));
    }

    public loadControls(): void {
        this._toPosition = this.character.getPosition();
        this._toRotation = this.character.getRotation();

        this.enableMouseControls();
        this.enableKeyboardControls();

        this.camera.attach(this.character);

        this._loaded = true;
    }

    private enableMouseControls(): void {
        // window.addEventListener("mousemove")
    }

    private enableKeyboardControls(): void {
        window.addEventListener("keydown", (event) => {
            this._keysDown.add(event.key.toLowerCase());
        });

        window.addEventListener("keyup", (event) => {
            this._keysDown.delete(event.key.toLowerCase());
        });
    }
}