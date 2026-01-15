import EventEntry from "../types/entries/EventEntry";

export default class EventEmitter {
    private _eventRegistry: EventEntry[] = [];

    public addEventListener(name: string, callback: Function): void {
        const eventEntry = this.getEventEntryByName(name);

        if (!eventEntry) {
            this._eventRegistry.push({ name: name, callbacks: [callback] });
        } else {
            eventEntry.callbacks.push(callback);
        }
    }

    public removeEventListener(name: string, callback: Function): void {
        const eventEntry = this.getEventEntryByName(name);
        if (!eventEntry) return;

        eventEntry.callbacks = eventEntry.callbacks.filter(
            (currentCallback) => currentCallback !== callback
        );
    }

    public removeAll(name: string): void {
        this._eventRegistry = this._eventRegistry.filter(
            (evenEntry) => evenEntry.name !== name
        );
    }

    public trigger(name: string): void {
        const eventEntry = this.getEventEntryByName(name);
        if (!eventEntry) return;

        eventEntry.callbacks.forEach((callback) => callback());
    }

    private getEventEntryByName(name: string): EventEntry | undefined {
        return this._eventRegistry.find(
            (eventEntry) => eventEntry.name === name
        );
    }
}
