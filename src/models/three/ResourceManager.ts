import sources from "../../sources";
import LoadCycleEntry from "../../types/entries/LoadCycleEntry";
import Loaders from "../../types/Loaders";
import EventEmitter from "../../utils/EventEmitter";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { sRGBEncoding, TextureLoader } from "three";
import SourceEntry from "../../types/entries/SourceEntry";
import LoadedResourceEntry from "./LoadedResourceEntry";
import ResourceNotLoadedError from "../error/ResourceNotLoadedError";


export default class ResourceManager extends EventEmitter {
    private _sources: LoadCycleEntry[];
    private _loadedResources: LoadedResourceEntry[];
    private _loaders: Loaders;
    private _loaded: number;
    private _loadedCycles: number;

    constructor() {
        super();

        this._sources = sources;
        this._loadedResources = [];
        this._loaded = 0;
        this._loadedCycles = 0;

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("draco/");
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        this._loaders = {
            gltfLoader: gltfLoader,
            textureLoader: new TextureLoader()
        };
    }

    public getLoadedResource(name: string): LoadedResourceEntry {
        const loadedResourceEntry = this._loadedResources.find((loadedResourceEntry) => loadedResourceEntry.name === name);

        if (!loadedResourceEntry) throw new ResourceNotLoadedError(name, this._loadedResources.map((entry) => entry.name));

        return loadedResourceEntry as LoadedResourceEntry;
    }

    public get loadedResources(): LoadedResourceEntry[] {
        return this._loadedResources;
    }

    public get loaded(): number {
        return this._loaded;
    }

    public get loadedCycles(): number {
        return this._loadedCycles;
    }

    public async startLoading(): Promise<void> {
        for (const loadCycleEntry of this._sources) {
            await this.loadLoadCycleEntry(loadCycleEntry);

            this._loadedCycles++;
            this.trigger("loadCycleEntryLoaded");
        }
    }

    private async loadLoadCycleEntry(loadCycleEntry: LoadCycleEntry): Promise<void> {
        for (const sourceEntry of loadCycleEntry.sourceEntries) {
            await this.loadSourceEntry(sourceEntry);
        };
    }

    private async loadSourceEntry(sourceEntry: SourceEntry): Promise<void> {
        if (sourceEntry.type === "texture") {
            const texture = await this._loaders.textureLoader.loadAsync(sourceEntry.path);

            texture.flipY = false;
            texture.encoding = sRGBEncoding;

            this._loadedResources.push(new LoadedResourceEntry(sourceEntry.name, texture, undefined));
            this._loaded++;
        } else if (sourceEntry.type === "gltf") {
            const gltf = await this._loaders.gltfLoader.loadAsync(sourceEntry.path);

            this._loadedResources.push(new LoadedResourceEntry(sourceEntry.name, undefined, gltf));
            this._loaded++;
        }

        this.trigger("sourceEntryLoaded");
    }
}