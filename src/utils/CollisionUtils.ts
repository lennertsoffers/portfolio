import { Mesh, Raycaster, Vector3 } from "three";

import CollisionConstants from "../models/constants/CollisionConstants";

export default class CollisionUtils {
    public static hasCollisionInMovement(
        originPosition: Vector3,
        movementVector: Vector3,
        collisionMeshes: Mesh[]
    ): boolean {
        const ray = new Raycaster(
            originPosition,
            movementVector.clone().normalize()
        );
        const intersections = ray.intersectObjects(collisionMeshes);
        const toDistance = movementVector.length();

        return intersections.some(
            (intersection) =>
                intersection.distance - CollisionConstants.COLLISION_DISTANCE <=
                toDistance
        );
    }

    public static getHeightDifference(
        position: Vector3,
        collisionMeshes: Mesh[]
    ): number {
        const heightIncrementedPosition = position.clone();
        heightIncrementedPosition.y += 1;

        const ray = new Raycaster(
            heightIncrementedPosition,
            CollisionConstants.DOWN_FACING_VECTOR
        );
        const intersections = ray.intersectObjects(collisionMeshes);

        if (intersections.length <= 0) return 0;
        return (
            1 -
            Math.min(
                ...intersections.map((intersection) => intersection.distance)
            )
        );
    }
}
