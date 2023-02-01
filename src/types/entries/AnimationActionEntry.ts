import { AnimationAction } from "three";

export default interface AnimationActionEntry {
    name: string;
    action: AnimationAction;
    duration: number;
}