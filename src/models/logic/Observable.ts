import EventEmitter from "../../utils/EventEmitter";

export default class Observable extends EventEmitter {
    private _value: boolean;

    constructor(initialValue: boolean = false) {
        super();

        this._value = initialValue;
    }

    public get(): boolean {
        return this._value;
    }

    public set(value: boolean): boolean {
        if (value && !this._value) this.trigger("activate");

        return (this._value = value);
    }

    public activate(): void {
        this.trigger("activate");
        this._value = true;
    }
}
