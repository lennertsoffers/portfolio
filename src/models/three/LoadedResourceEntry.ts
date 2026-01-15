import { Texture } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadedResourceEntry {
    private _name: string;
    private _texture?: Texture | undefined;
    private _gltf?: GLTF | undefined;

    constructor(name: string, texture?: Texture, gltf?: GLTF) {
        this._name = name;
        this._texture = texture;
        this._gltf = gltf;
    }

    public get name(): string {
        return this._name;
    }

    public getTexture(): Texture {
        return this._texture as Texture;
    }

    public getGltf(): GLTF {
        return this._gltf as GLTF;
    }
}
