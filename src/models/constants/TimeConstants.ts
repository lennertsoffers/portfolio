import TimeBlockEntry from "../../types/entries/TimeBlockEntry";

export default class TimeConstants {
    public static TIME_BLOCK_DEFAULT = "Greetings";
    public static TIME_BLOCKS: TimeBlockEntry[] = [
        {
            startHour: 22,
            timeBlockName: "Nighty night"
        },
        {
            startHour: 18,
            timeBlockName: "Good evening"
        },
        {
            startHour: 12,
            timeBlockName: "Good afternoon"
        },
        {
            startHour: 5,
            timeBlockName: "Good morning"
        },
        {
            startHour: 0,
            timeBlockName: "Nighty night"
        }
    ];
}