import { Vector3 } from "three";
import Tickable from "../../types/interfaces/Tickable";
import ControlConstants from "../constants/ControlsConstants";
import DeviceType from "../enum/DeviceType";
import KeyType from "../enum/KeyType";
import PlayerState from "../enum/PlayerState";
import AttachableCamera from "../three/AttachableCamera";
import Player from "./Player";
import PlayerModel from "./PlayerModel";

export default class PlayerControls implements Tickable {
    private _player: Player;
    private _loaded: boolean;

    // Keyboard controls
    private _keysDown: Set<string>;
    private _keyboardControlsEnabled: boolean;
    private _pressedKeyType: KeyType;

    // Orbit controls
    private _orbitControlsActive: boolean;
    private _dragging: boolean;
    private _orbitPosition: Vector3;
    private _initialRotationY: number;
    private _orbitMovement: Vector3;

    constructor(player: Player) {
        this._player = player;
        this._loaded = false;

        this._keysDown = new Set<string>();
        this._keyboardControlsEnabled = true;
        this._pressedKeyType = KeyType.NONE;

        this._orbitControlsActive = false;
        this._dragging = false;
        this._orbitPosition = new Vector3();
        this._initialRotationY = 0;
        this._orbitMovement = new Vector3();

        this._player.application.mobileControls.addEventListener("interact", () => this.interact());
    }

    public get character(): PlayerModel {
        return this._player.playerModel;
    }

    public get camera(): AttachableCamera {
        return this._player.application.attachableCamera;
    }

    public set keyboardControlsEnabled(value: boolean) {
        this._keyboardControlsEnabled = value;
    }

    public tick(_deltaTime: number, _elapsedTime: number): void {
        if (!this._loaded || !this._keyboardControlsEnabled) return;

        if (this._player.application.dimensions.deviceType === DeviceType.MOBILE)
            this.handleButtonsDown();
        else this.handlePressedKeys();
    }

    public loadControls(): void {
        if (!this._player.application.world) return;

        this.enableOrbitControls();
        this.enableKeyboardControls();

        this.camera.attach(this.character);
        this.camera.collisionMeshes = this._player.application.world.cameraCollisionMeshes;

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
            if (
                !this._dragging ||
                !this._orbitControlsActive ||
                this._player.application.dimensions.deviceType === DeviceType.MOBILE
            )
                return;

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

    public stopOrbiting(): void {
        if (this._orbitControlsActive) this.camera.resumeAttachment();
        this._orbitControlsActive = false;
    }

    private updateOrbitValues(event: PointerEvent): void {
        const relativeMovementX = -event.movementX / this._player.application.dimensions.width;
        const relativeMovementY = event.movementY / this._player.application.dimensions.height;

        this._orbitMovement.x += relativeMovementX * ControlConstants.ORBIT_SENSITIVITY;
        this._orbitMovement.y = Math.min(
            Math.max(
                this._orbitMovement.y + relativeMovementY * ControlConstants.ORBIT_SENSITIVITY,
                -ControlConstants.ORBIT_Y_LIMIT
            ),
            ControlConstants.ORBIT_Y_LIMIT
        );
        this._orbitMovement.z += relativeMovementX * ControlConstants.ORBIT_SENSITIVITY;
    }

    private updateOrbitControls(): void {
        const distanceModifier = this.camera.distanceModifier;

        this.camera.futurePosition = new Vector3(
            this._orbitPosition.x +
                Math.sin(this._orbitMovement.x + this._initialRotationY) *
                    Math.cos(this._orbitMovement.y) *
                    distanceModifier,
            this._orbitPosition.y + Math.sin(this._orbitMovement.y) * distanceModifier,
            this._orbitPosition.z +
                Math.cos(this._orbitMovement.z + this._initialRotationY) *
                    Math.cos(this._orbitMovement.y) *
                    distanceModifier
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

    private handleButtonsDown(): void {
        const buttonsDown = this._player.application.mobileControls.buttonsDown;

        this.resetPressedKeyType();

        if (buttonsDown.left) {
            this.moveLeft();
        }
        if (buttonsDown.right) {
            this.moveRight();
        }

        if (this._pressedKeyType === KeyType.MOVE) return;
        if (buttonsDown.forwards) {
            this.moveForwards();
            this._pressedKeyType = KeyType.MOVE;
        } else if (buttonsDown.backwards) {
            this.moveBackwards();
            this._pressedKeyType = KeyType.MOVE;
        }

        if ((this._pressedKeyType as KeyType) === KeyType.MOVE) {
            this.stopOrbiting();
        } else if (this._pressedKeyType === KeyType.EMOTE) {
        } else {
            this._player.setPlayerState(PlayerState.IDLE);
        }
    }

    private handlePressedKeys(): void {
        this.resetPressedKeyType();

        this._keysDown.forEach((key) => {
            switch (key) {
                case "w":
                case "arrowup":
                    if (this._pressedKeyType === KeyType.MOVE) return;

                    this.moveForwards();
                    this._pressedKeyType = KeyType.MOVE;
                    return;

                case "s":
                case "arrowdown":
                    this._pressedKeyType = KeyType.MOVE;
                    this.moveBackwards();
                    return;

                case "a":
                case "arrowleft":
                    this.moveLeft();
                    return;

                case "d":
                case "arrowright":
                    this.moveRight();
                    return;

                // case "q":
                    // this._pressedKeyType = KeyType.EMOTE;
                    // this.jump();
                    // return;

                case "e":
                    this.interact();
                    return;

                case "f":
                    this._pressedKeyType = KeyType.EMOTE;
                    this.wave();
                    return;

                default:
                    return;
            }
        });

        if (this._pressedKeyType === KeyType.MOVE) {
            this.stopOrbiting();
        } else if (this._pressedKeyType === KeyType.EMOTE) {
        } else {
            this._player.setPlayerState(PlayerState.IDLE);
        }
    }

    private resetPressedKeyType(): void {
        this._pressedKeyType = KeyType.NONE;
    }

    private moveForwards(): void {
        if (this._keysDown.has("shift")) {
            this._player.setPlayerState(PlayerState.RUNNING);
            this._player.futurePosition = this._player.currentPosition.add(
                this.character
                    .getDirectionY()
                    .multiplyScalar(-ControlConstants.PLAYER_RUN_SPEED / 10)
            );
        } else {
            this._player.setPlayerState(PlayerState.WALKING);
            this._player.futurePosition = this._player.currentPosition.add(
                this.character
                    .getDirectionY()
                    .multiplyScalar(-ControlConstants.PLAYER_WALK_SPEED / 10)
            );
        }
    }

    private moveBackwards(): void {
        this._player.setPlayerState(PlayerState.WALKING);
        this._player.futurePosition = this._player.currentPosition.add(
            this.character.getDirectionY().multiplyScalar(ControlConstants.PLAYER_WALK_SPEED / 10)
        );
    }

    private moveLeft(): void {
        this._player.futureRotation = this._player.currentRotation.add(
            new Vector3(0, ControlConstants.PLAYER_ROTATION_SPEED, 0)
        );
    }

    private moveRight(): void {
        this._player.futureRotation = this._player.currentRotation.add(
            new Vector3(0, -ControlConstants.PLAYER_ROTATION_SPEED, 0)
        );
    }

    private jump(): void {
        this._player.setPlayerState(PlayerState.JUMPING);
    }

    private wave(): void {
        this._player.setPlayerState(PlayerState.WAVING);
    }

    private interact(): void {
        this._player.interact();
    }
}
