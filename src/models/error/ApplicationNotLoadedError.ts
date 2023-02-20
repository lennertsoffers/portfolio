export default class ApplicationNotLoadedError extends Error {
    constructor() {
        super(`Tried to access a resource of the application which is not loaded yet`);
    }
}