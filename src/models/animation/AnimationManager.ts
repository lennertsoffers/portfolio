import { AnimationAction, AnimationClip, AnimationMixer, Object3D } from "three";
import Application from "../../Application";
import AnimationActionEntry from "../../types/entries/AnimationActionEntry";
import Debugable from "../../types/interfaces/Debugable";
import Tickable from "../../types/interfaces/Tickable";
import AnimationNotFoundError from "../error/AnimationNotFoundError";

export default class AnimationManager implements Tickable, Debugable {
    private _application: Application;
    private _model: Object3D;
    private _mixer: AnimationMixer;
    private _animationActions: AnimationActionEntry[];
    private _currentAction?: AnimationAction;
    private _clips: AnimationClip[];

    constructor(application: Application, model: Object3D, clips: AnimationClip[]) {
        this._application = application;
        this._model = model;
        this._mixer = new AnimationMixer(this._model);
        this._animationActions = [];
        this._clips = clips;

        this.addAnimations();

        if (this._application.debug.active) this.addDebugProperties();
    }

    public tick(deltaTime: number, elapsedTime: number): void {
        this._mixer.update(deltaTime * 0.001);
    }

    public addDebugProperties(): void {
        const debug = this._application.debug;
        const animationFolder = debug.addFolder("Animation");
        const animationCharacterFolder = animationFolder.addFolder(this._model.name);

        const availableActions: Record<string, Function> = {};
        this._clips.forEach((animation) => {
            availableActions[animation.name] = () => this.play(animation.name);
        });
        Object.keys(availableActions).forEach((actionName) => animationCharacterFolder.add(availableActions, actionName));

        animationFolder.close();
        animationCharacterFolder.close();
    }

    public play(animationName: string, speed: number = 1): number {
        const animationActionEntry = this._animationActions.find((animationActionEntry) => animationActionEntry.name === animationName);

        if (!animationActionEntry) throw new AnimationNotFoundError(animationName, this._model.name, this._animationActions.map((animationActionEntry) => animationActionEntry.name));

        const newAction = animationActionEntry.action;
        newAction.timeScale = speed;
        newAction.reset();
        newAction.play();
        if (this._currentAction) newAction.crossFadeFrom(this._currentAction, 0.2, false);

        this._currentAction = newAction;

        return animationActionEntry.duration * 1000 / speed;
    }

    private addAnimations(): void {
        this._clips.forEach((animation) => {
            const action = this._mixer.clipAction(animation);
            this._animationActions.push({ name: animation.name, action: action, duration: animation.duration });
        });
    }
}