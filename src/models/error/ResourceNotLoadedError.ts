export default class ResourceNotLoadedError extends Error {
    constructor(resourceName: string, loadedResources: string[]) {
        let message = "The resource with name '" + resourceName + "' was not loaded";
        message += "\n- " + loadedResources.join("\n- ");

        console.log(loadedResources);


        super(message);
    }
}