export default abstract class WorldEvent {
    public abstract trigger(): void;
    public abstract end(): void;
}