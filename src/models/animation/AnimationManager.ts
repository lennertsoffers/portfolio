import { AnimationClip, AnimationMixer, Object3D } from "three";
import Application from "../../Application";
import AnimationActionEntry from "../../types/AnimationActionEntry";
import Tickable from "../../types/Tickable";
import AnimationNotFoundError from "../error/AnimationNotFoundError";

export default class AnimationManager implements Tickable {
    private _application: Application;
    private _model: Object3D;
    private _mixer: AnimationMixer;
    private _animationActions: AnimationActionEntry[];

    constructor(application: Application, model: Object3D, clips: AnimationClip[]) {
        this._application = application;
        this._model = model;
        this._mixer = new AnimationMixer(this._model);
        this._animationActions = [];

        this.addAnimations(clips);

        this.play("Character|Idle");
    }

    public tick(): void {
        this._mixer.update(this._application.timedLoop.deltaTime * 0.001);
    }

    public play(animationName: string): void {
        const animationActionEntry = this._animationActions.find((animationActionEntry) => animationActionEntry.name === animationName);

        if (!animationActionEntry) throw new AnimationNotFoundError(animationName, this._model.name, this._animationActions.map((animationActionEntry) => animationActionEntry.name));

        animationActionEntry.action.play();
    }

    private addAnimations(clips: AnimationClip[]): void {
        clips.forEach((animation) => {
            const action = this._mixer.clipAction(animation);
            this._animationActions.push({ name: animation.name, action: action });
        });
    }
}