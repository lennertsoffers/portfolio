import { Mesh } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import MeshNotFoundError from "../models/error/MeshNotFoundError";

export default class GltfUtils {
    public static getChildAsMesh(childName: string, gltf: GLTF): Mesh {
        const mesh = gltf.scene.children.find(
            (child) => child.name === childName
        );

        if (!mesh)
            throw new MeshNotFoundError(
                childName,
                gltf.scene.name,
                gltf.scene.uuid
            );

        return mesh as Mesh;
    }
}
