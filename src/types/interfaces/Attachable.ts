import MovableObject3D from "../../models/three/MovableObject3D";

export default interface Attachable {
    attach(object3d: MovableObject3D): void;
    zoom(zoomAmount: number): void;
    pauseAttachment(): void;
    resumeAttachment(): void;
}
