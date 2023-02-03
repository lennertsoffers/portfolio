import { Vector3 } from "three";
import MathConstants from "../models/constants/MathConstants";

export default class MathUtils {
    public static degreesToRadians(degrees: number): number {
        return degrees / 180 * Math.PI;
    }

    public static getPositionOnGravitationalAcceleration(beginVelocity: number, y: number, yaw: number, pitch: number, t: number): Vector3 {
        const theta = pitch;
        const phi = -yaw;

        return new Vector3(
            (beginVelocity * Math.cos(theta) + t * Math.sin(phi)),
            (MathConstants.GRAVITATIONAL_ACCELERATION / 2 * Math.pow(t, 2) + (beginVelocity * Math.sin(theta)) * t + y),
            (beginVelocity * Math.cos(theta) + t * Math.cos(phi))
        );
    }
}