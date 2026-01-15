import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default interface Loaders {
    textureLoader: TextureLoader;
    gltfLoader: GLTFLoader;
}
