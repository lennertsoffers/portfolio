import { Vector2, Vector3 } from "three";
import MathConstants from "../models/constants/MathConstants";

export default class MathUtils {
    public static degreesToRadians(degrees: number): number {
        return degrees / 180 * Math.PI;
    }

    public static radiansToDegrees(radians: number): number {
        return radians * 180 / Math.PI;
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

    public static directionFromAngleY(angleY: number): Vector3 {
        return new Vector3(-Math.sin(angleY), 0, -Math.cos(angleY));
    }

    public static randomGaussian(min: number, max: number, skew: number = 1) {
        let u = 0, v = 0;

        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();

        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        num = num / 10.0 + 0.5;
        if (num > 1 || num < 0) {
            num = this.randomGaussian(min, max, skew);
        } else {
            num = Math.pow(num, skew);
            num *= max - min;
            num += min;
        }

        return num;
    }

    public static getAngleFromVector2(vector: Vector2): number {
        return Math.atan2(vector.y, vector.x);
    }
}