export default class EnumLiteralDoesNotExistError extends Error {
    constructor() {
        super(`You did not provide any waypoints for the CameraPath`);
    }
}