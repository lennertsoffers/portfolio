export default interface Tickable {
    tick(deltaTime: number, elapsedTime: number): void;
}