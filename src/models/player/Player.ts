import { Color, Raycaster, Vector3 } from "three";
import Application from "../../Application";
import CollisionUtils from "../../utils/CollisionUtils";
import MathUtils from "../../utils/MathUtils";
import ControlConstants from "../constants/ControlsConstants";
import ModelConstants from "../constants/ModelConstants";
import PlayerState from "../enum/PlayerState";
import WorldZone, { valueOf as worldZoneValueOf } from "../enum/WorldZone";
import PlayerControls from "./PlayerControls";
import PlayerModel from "./PlayerModel";

export default class Player {
    private _application: Application;
    private _loaded: boolean;

    private _playerModel: PlayerModel;
    private _playerControls: PlayerControls;
    private _playerState: PlayerState;

    private _currentPosition: Vector3;
    private _futurePosition: Vector3;
    private _currentRotation: Vector3;
    private _futureRotation: Vector3;
    private _velocity: Vector3;

    private _jumpTime: number;
    private _jumpStartHeight: number;

    constructor(application: Application) {
        this._application = application;
        this._loaded = true;

        this._playerModel = new PlayerModel(this);
        this._playerControls = new PlayerControls(this);
        this._playerState = PlayerState.IDLE;

        this._currentPosition = ModelConstants.PLAYER_INITIAL_POSITION;
        this._futurePosition = ModelConstants.PLAYER_INITIAL_POSITION;
        this._currentRotation = ModelConstants.PLAYER_INITIAL_ROTATION;
        this._futureRotation = ModelConstants.PLAYER_INITIAL_ROTATION;
        this._velocity = new Vector3();

        this._jumpTime = 0;
        this._jumpStartHeight = 0;
    }

    public get application(): Application {
        return this._application;
    }

    public get loaded(): boolean {
        return this._loaded;
    }

    public get playerModel(): PlayerModel {
        return this._playerModel;
    }

    public get currentPosition(): Vector3 {
        return this._currentPosition.clone();
    }

    public get currentRotation(): Vector3 {
        return this._currentRotation.clone();
    }

    public get velocity(): Vector3 {
        return this._velocity.clone();
    }

    public set futurePosition(value: Vector3) {
        this._futurePosition = value;
    }

    public set futureRotation(value: Vector3) {
        this._futureRotation = value;
    }

    public tick(deltaTime: number, elapsedTime: number) {
        // Set the velocity to the velocity of the current movement
        this.updateVelocity();

        // Use controls to update possible movement
        this._playerControls.tick(deltaTime, elapsedTime);

        // Update position due to jump state
        this.updateJumpPosition(deltaTime);

        // Calculate the to be executed movement and set the position of the player
        this.movePlayer(deltaTime);

        // Draw the player on the correct position
        this._playerModel.tick(deltaTime, elapsedTime);

        // Check if the player is inside an action box
        this.updateAvailableActions();
    }

    public loadPlayer() {
        this._playerModel.loadModel();
        this._playerControls.loadControls();

        this._loaded = true;
    }

    public getCurrentState(): PlayerState {
        return this._playerState;
    }

    public setPlayerState(playerState: PlayerState): void {
        if (playerState === this._playerState) return;

        this._playerState = playerState;

        switch (playerState) {
            case PlayerState.IDLE:
                this.playerModel.toIdle();
                return;
            case PlayerState.WALKING:
                this.playerModel.toWalking();
                return;
            case PlayerState.RUNNING:
                this.playerModel.toRunning();
                return;
            case PlayerState.WAVING:
                this._playerControls.keyboardControlsEnabled = false;
                this.playerModel
                    .wave()
                    .then(() => (this._playerControls.keyboardControlsEnabled = true));
                return;
            case PlayerState.JUMPING:
                this._playerControls.keyboardControlsEnabled = false;
                this._jumpStartHeight = this.currentPosition.y;
                this._jumpTime = 0;
                this.playerModel
                    .jump()
                    .then(() => (this._playerControls.keyboardControlsEnabled = true));
                return;
        }
    }

    public async teleport(toPosition: Vector3, toRotation: Vector3): Promise<void> {
        await this.playTeleportAnimation();

        this._currentPosition = toPosition;
        this._futurePosition = toPosition;
        this._currentRotation = toRotation;
        this._futureRotation = toRotation;
        this._playerControls.stopOrbiting();

        await this.playTeleportAnimation(true);
    }

    private async playTeleportAnimation(backwards: boolean = false): Promise<void> {
        const center = this.currentPosition;
        const angleY = this._currentRotation.y;

        let angleYLeft = angleY - Math.PI / 2;
        let angleYRight = angleY + Math.PI / 2;

        const loopStartValue = backwards ? 0.8 : 0;
        const loopCondition = (num: number) => (backwards ? num > 0 : num < 0.8);
        const loopIncrement = (num: number) => (backwards ? (num -= 0.02) : (num += 0.02));

        for (let i = loopStartValue; loopCondition(i); i = loopIncrement(i)) {
            const radius = 0.4 * Math.pow(1 - i, 1 / 2);
            const positionLeft = center
                .clone()
                .add(MathUtils.directionFromAngleY(angleYLeft).multiplyScalar(radius))
                .add(new Vector3(0, i, 0));
            const positionRight = center
                .clone()
                .add(MathUtils.directionFromAngleY(angleYRight).multiplyScalar(radius))
                .add(new Vector3(0, i, 0));

            this._application.particleManager.spawnParticleExplosion(
                positionLeft,
                2,
                1000,
                new Color(0xb3e595),
                4
            );
            this._application.particleManager.spawnParticleExplosion(
                positionRight,
                2,
                1000,
                new Color(0xb3e595),
                4
            );

            angleYLeft += 0.2;
            angleYRight += 0.2;

            await new Promise((resolve) => setTimeout(resolve, 40));
        }
    }

    public interact(): void {
        if (!this._application.world) return;

        this._application.world.worldEventManager.handleInteraction();
    }

    private movePlayer(deltaTime: number): void {
        if (!this._application.world) return;

        // Rotation
        const rotationVec = new Vector3().subVectors(this._futureRotation, this.currentRotation);
        this._currentRotation.add(
            rotationVec.multiplyScalar(
                (deltaTime * 0.01) / ControlConstants.PLAYER_ROTATION_DAMPING
            )
        );

        // Height
        if (this._playerState !== PlayerState.JUMPING) {
            this._futurePosition.y += CollisionUtils.getHeightDifference(
                this._futurePosition,
                this._application.world.floorCollisionMeshes
            );
        }

        this._futurePosition.y += ModelConstants.PLAYER_HEIGHT_MODIFIER;

        // Position
        const movementVec = new Vector3().subVectors(this._futurePosition, this.currentPosition);

        // Don't execute movement if future position will collide with walls
        if (
            CollisionUtils.hasCollisionInMovement(
                this._currentPosition,
                movementVec,
                this._application.world.wallsCollisionMeshes
            )
        )
            return;
        this._currentPosition.add(
            movementVec.multiplyScalar(
                (deltaTime * 0.01) / ControlConstants.PLAYER_MOVEMENT_DAMPING
            )
        );
    }

    private updateAvailableActions(): void {
        if (!this._application.world) return;

        const forwardsDirection = MathUtils.directionFromAngleY(this._currentRotation.y);

        const forwardsRay = new Raycaster(this._currentPosition, forwardsDirection);
        const backwardsRay = new Raycaster(
            this._currentPosition,
            forwardsDirection.clone().negate()
        );

        const forwardsIntersections = forwardsRay
            .intersectObjects(this._application.world.actionCollisionMeshes)
            .map((intersection) => intersection.object.name);
        const backwardsIntersections = backwardsRay
            .intersectObjects(this._application.world.actionCollisionMeshes)
            .map((intersection) => intersection.object.name);

        const activeZones = forwardsIntersections.filter((intersection) =>
            backwardsIntersections.includes(intersection)
        );

        if (activeZones.length === 0)
            this._application.world.worldEventManager.handleWorldZoneChange(WorldZone.NONE);
        else
            this._application.world.worldEventManager.handleWorldZoneChange(
                worldZoneValueOf(activeZones[activeZones.length - 1].replace("action_box_", ""))
            );
    }

    private updateJumpPosition(deltaTime: number): void {
        if (this._playerState !== PlayerState.JUMPING) return;

        this._jumpTime += deltaTime / 1000;

        const jumpHeight = Math.max(-Math.pow(2 * this._jumpTime - 1.3, 2) + 0.3, 0);
        const currentY = this._jumpStartHeight + jumpHeight;

        this._futurePosition.setY(currentY);

        if (jumpHeight > 0) {
            const directionY = this._playerModel
                .getDirectionY()
                .divideScalar(-deltaTime * 5)
                .setY(0);
            this._futurePosition.add(directionY);
        }
    }

    private updateVelocity(): void {
        this._velocity.subVectors(this._currentPosition, this._futurePosition);
    }
}
