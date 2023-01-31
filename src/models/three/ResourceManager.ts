import sources from "../../sources";
import LoadCycleEntry from "../../types/LoadCycleEntry";
import LoadedResourceEntry from "../../types/LoadedResourceEntry";
import Loaders from "../../types/Loaders";
import EventEmitter from "../../utils/EventEmitter";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";
import SourceEntry from "../../types/SourceEntry";


export default class ResourceManager extends EventEmitter {
    private _sources: LoadCycleEntry[];
    private _loadedResources: LoadedResourceEntry[];
    private _loaders: Loaders;
    private _loaded: number;

    constructor() {
        super();

        this._sources = sources;
        this._loadedResources = [];
        this._loaded = 0;

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("draco/");
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        this._loaders = {
            gltfLoader: gltfLoader,
            textureLoader: new TextureLoader()
        };
    }

    public get loadedResources(): LoadedResourceEntry[] {
        return this._loadedResources;
    }
    public get loaded(): number {
        return this._loaded;
    }

    public startLoading(): void {
        this._sources.forEach(async (loadCycleEntry) => {
            for (const sourceEntry of loadCycleEntry.sourceEntries) {
                await this.loadSourceEntry(sourceEntry);
            };

            this.trigger("loadCycleLoaded");
        });
    }

    private async loadSourceEntry(sourceEntry: SourceEntry): Promise<void> {
        if (sourceEntry.type === "texture") {
            const texture = await this._loaders.textureLoader.loadAsync(sourceEntry.path);

            this._loadedResources.push({ name: sourceEntry.name, file: texture });
            this._loaded++;
        } else if (sourceEntry.type === "gltf") {
            const gltf = await this._loaders.gltfLoader.loadAsync(sourceEntry.path);

            this._loadedResources.push({ name: sourceEntry.name, file: gltf });
            this._loaded++;
        }

        this.trigger("sourceEntryLoaded");
    }
}