import { Vector3 } from "three";
import Tickable from "../../types/interfaces/Tickable";
import ControlConstants from "../constants/ControlsConstants";
import Camera from "../three/Camera";
import Player from "./Player";
import PlayerModel from "./PlayerModel";

export default class PlayerControls implements Tickable {
    private _player: Player;
    private _keysDown: Set<string>;
    private _toPosition: Vector3;
    private _toRotation: Vector3;
    private _loaded: boolean;
    private _mouseControlsActive: boolean;
    private _orbitPosition: Vector3;
    private _initialRotationY: number;
    private _x;
    private _y;
    private _z;

    constructor(player: Player) {
        this._player = player;
        this._keysDown = new Set<string>;

        this._toPosition = new Vector3();
        this._toRotation = new Vector3();

        this._loaded = false;
        this._mouseControlsActive = false;

        this._orbitPosition = new Vector3();
        this._initialRotationY = 0;
        this._x = 0;
        this._y = 0;
        this._z = 0;
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
            this.camera.resumeAttachment();

            if (this._keysDown.has("shift")) {
                this._toPosition.add(this.character.getDirectionY().multiplyScalar(-ControlConstants.PLAYER_RUN_SPEED / 100));
            } else {
                this._toPosition.add(this.character.getDirectionY().multiplyScalar(-ControlConstants.PLAYER_WALK_SPEED / 100));
            }
        }

        if (this._keysDown.has("s")) {
            this.camera.resumeAttachment();
            this._toPosition.add(this.character.getDirectionY().multiplyScalar(ControlConstants.PLAYER_WALK_SPEED / 100));
        }

        if (this._keysDown.has("a")) {
            this.camera.resumeAttachment();
            this._toRotation.add(new Vector3(0, ControlConstants.PLAYER_ROTATION_SPEED / 10, 0));
        }

        if (this._keysDown.has("d")) {
            this.camera.resumeAttachment();
            this._toRotation.add(new Vector3(0, -ControlConstants.PLAYER_ROTATION_SPEED / 10, 0));
        }

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
        window.addEventListener("wheel", (event) => {
            this.camera.zoom(Math.sign(event.deltaY) * 0.1);
        });

        window.addEventListener("pointerdown", () => {
            if (!this._mouseControlsActive) {
                this.camera.pauseAttachment();
                this._orbitPosition = this._player.playerModel.getCenterPosition();
                this._initialRotationY = this._player.playerModel.getRotation().y + Math.PI;
            }

            this._mouseControlsActive = true;
        });

        window.addEventListener("pointerup", () => {
            this._mouseControlsActive = false;
        });

        window.addEventListener("pointermove", (event) => {
            if (!this._mouseControlsActive) return;

            const relativeMovementX = -event.movementX / this._player.application.dimensions.width;
            const relativeMovementY = event.movementY / this._player.application.dimensions.height;

            this._x += relativeMovementX * 3;
            this._y = Math.min(Math.max(this._y + relativeMovementY * 3, -ControlConstants.ORBIT_Y_LIMIT), ControlConstants.ORBIT_Y_LIMIT);
            this._z += relativeMovementX * 3;
            this.camera.toPosition = new Vector3(this._orbitPosition.x + Math.sin(this._x + this._initialRotationY) * Math.cos(this._y), this._orbitPosition.y + Math.sin(this._y), this._orbitPosition.z + Math.cos(this._z + this._initialRotationY) * Math.cos(this._y));
        });
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