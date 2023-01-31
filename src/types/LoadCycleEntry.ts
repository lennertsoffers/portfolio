import SourceEntry from "./SourceEntry";

export default interface LoadCycleEntry {
    index: number;
    name: string;
    displayName: string;
    sourceEntries: SourceEntry[];
}