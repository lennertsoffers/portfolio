import { Vector3 } from "three";
import Tickable from "../../types/interfaces/Tickable";
import ControlConstants from "../constants/ControlsConstants";
import PlayerState from "../enum/PlayerState";
import Camera from "../three/Camera";
import Player from "./Player";
import PlayerModel from "./PlayerModel";

export default class PlayerControls implements Tickable {
    private _player: Player;
    private _loaded: boolean;

    // Keyboard controls
    private _keysDown: Set<string>;
    private _toPosition: Vector3;
    private _toRotation: Vector3;
    private _keyboardControlsEnabled: boolean;

    // Orbit controls
    private _orbitControlsActive: boolean;
    private _dragging: boolean;
    private _orbitPosition: Vector3;
    private _initialRotationY: number;
    private _orbitMovement: Vector3;

    constructor(player: Player) {
        this._player = player;
        this._loaded = false;

        this._keysDown = new Set<string>;
        this._toPosition = new Vector3();
        this._toRotation = new Vector3();
        this._keyboardControlsEnabled = true;

        this._orbitControlsActive = false;
        this._dragging = false;
        this._orbitPosition = new Vector3();
        this._initialRotationY = 0;
        this._orbitMovement = new Vector3();
    }

    public get character(): PlayerModel {
        return this._player.playerModel;
    }

    public get camera(): Camera {
        return this._player.application.camera;
    }

    public set keyboardControlsEnabled(value: boolean) {
        this._keyboardControlsEnabled = value;
    }

    public tick(deltaTime: number, _elapsedTime: number): void {
        if (!this._loaded || !this._keyboardControlsEnabled) return;

        let pressedKey = false;

        this._keysDown.forEach((key) => {
            switch (key) {
                case "w":
                case "arrowup":
                    this.moveForwards();
                    break;
                case "s":
                case "arrowdown":
                    this.moveBackwards();
                    break;
                case "a":
                case "arrowleft":
                    this.moveLeft();
                    break;
                case "d":
                case "arrowright":
                    this.moveRight();
                    break;
                case "e":
                    this.wave();
                    break;
                default:
                    return;
            }

            pressedKey = true;
        });

        if (pressedKey) {
            // TODO - Don't stop orbiting after wave
            this.stopOrbiting();
        } else {
            this._player.setPlayerState(PlayerState.IDLE);
        }

        const movementVec = this._toPosition.clone().add(this.character.getPosition().multiplyScalar(-1));
        this.character.move(movementVec.multiplyScalar(deltaTime * 0.01 / ControlConstants.PLAYER_MOVEMENT_DAMPING));

        const rotationVec = this._toRotation.clone().add(this.character.getRotation().multiplyScalar(-1));
        this.character.addRotation(rotationVec.multiplyScalar(deltaTime * 0.01 / ControlConstants.PLAYER_ROTATION_DAMPING));
    }

    public loadControls(): void {
        this._toPosition = this.character.getPosition();
        this._toRotation = this.character.getRotation();

        this.enableOrbitControls();
        this.enableKeyboardControls();

        this.camera.attach(this.character);

        this._loaded = true;
    }

    // Orbit controls
    private enableOrbitControls(): void {
        window.addEventListener("wheel", (event) => {
            this.camera.zoom(Math.sign(event.deltaY) * 0.1);

            if (this._orbitControlsActive) this.updateOrbitControls();
        });

        window.addEventListener("pointerdown", () => {
            if (!this._orbitControlsActive) this.startOrbiting();

            this._orbitControlsActive = true;
            this._dragging = true;
        });

        window.addEventListener("pointerup", () => {
            this._dragging = false;
        });

        window.addEventListener("pointermove", (event) => {
            if (!this._dragging || !this._orbitControlsActive) return;

            this.updateOrbitValues(event);
            this.updateOrbitControls();
        });
    }

    private startOrbiting(): void {
        this.camera.pauseAttachment();
        this._orbitPosition = this._player.playerModel.getCenterPosition();
        this._initialRotationY = this._player.playerModel.getRotation().y + Math.PI;
        this._orbitMovement.setScalar(0);
    }

    private stopOrbiting(): void {
        if (this._orbitControlsActive) this.camera.resumeAttachment();
        this._orbitControlsActive = false;
    }

    private updateOrbitValues(event: PointerEvent): void {
        const relativeMovementX = -event.movementX / this._player.application.dimensions.width;
        const relativeMovementY = event.movementY / this._player.application.dimensions.height;

        this._orbitMovement.x += relativeMovementX * ControlConstants.ORBIT_SENSITIVITY;
        this._orbitMovement.y = Math.min(Math.max(this._orbitMovement.y + relativeMovementY * ControlConstants.ORBIT_SENSITIVITY, -ControlConstants.ORBIT_Y_LIMIT), ControlConstants.ORBIT_Y_LIMIT);
        this._orbitMovement.z += relativeMovementX * ControlConstants.ORBIT_SENSITIVITY;
    }

    private updateOrbitControls(): void {
        const distanceModifier = this.camera.distanceModifier;

        this.camera.toPosition = new Vector3(
            this._orbitPosition.x + Math.sin(this._orbitMovement.x + this._initialRotationY) * Math.cos(this._orbitMovement.y) * distanceModifier,
            this._orbitPosition.y + Math.sin(this._orbitMovement.y) * distanceModifier,
            this._orbitPosition.z + Math.cos(this._orbitMovement.z + this._initialRotationY) * Math.cos(this._orbitMovement.y) * distanceModifier
        );
    }

    // Keyboard controls
    private enableKeyboardControls(): void {
        window.addEventListener("keydown", (event) => {
            this._keysDown.add(event.key.toLowerCase());
        });

        window.addEventListener("keyup", (event) => {
            this._keysDown.delete(event.key.toLowerCase());
        });
    }

    private moveForwards(): void {
        if (this._keysDown.has("shift")) {
            this._player.setPlayerState(PlayerState.RUNNING);
            this._toPosition.add(this.character.getDirectionY().multiplyScalar(-ControlConstants.PLAYER_RUN_SPEED / 100));
        } else {
            this._player.setPlayerState(PlayerState.WALKING);
            this._toPosition.add(this.character.getDirectionY().multiplyScalar(-ControlConstants.PLAYER_WALK_SPEED / 100));
        }
    }

    private moveBackwards(): void {
        this._player.setPlayerState(PlayerState.WALKING);
        this._toPosition.add(this.character.getDirectionY().multiplyScalar(ControlConstants.PLAYER_WALK_SPEED / 100));
    }

    private moveLeft(): void {
        this._toRotation.add(new Vector3(0, ControlConstants.PLAYER_ROTATION_SPEED / 10, 0));
    }

    private moveRight(): void {
        this._toRotation.add(new Vector3(0, -ControlConstants.PLAYER_ROTATION_SPEED / 10, 0));
    }

    private wave(): void {
        this._player.setPlayerState(PlayerState.WAVING);
    }
}