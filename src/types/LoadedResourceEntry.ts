import { Texture } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default interface LoadedResourceEntry {
    name: string;
    file: Texture | GLTF;
}