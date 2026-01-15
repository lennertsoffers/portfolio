export default class ResourceNotLoadedError extends Error {
    constructor(resourceName: string, loadedResources: string[]) {
        super(
            `The resource with name '${resourceName}' was not loaded\n- ${loadedResources.join("\n- ")}`
        );
    }
}
