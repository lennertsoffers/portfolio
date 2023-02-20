export default class EmptyWaypointError extends Error {
    constructor() {
        super(`You did not provide any waypoints for the CameraPath`);
    }
}