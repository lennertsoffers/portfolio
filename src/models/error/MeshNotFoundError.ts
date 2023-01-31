export default class MeshNotFoundError extends Error {
    constructor(meshName: string, gltfName: string, gltfUuid: string) {
        super(`Could not find '${meshName}' in GLTF '${gltfName}' with uuid '${gltfUuid}'`);
    }
}