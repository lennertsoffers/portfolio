import TimeConstants from "../models/constants/TimeConstants";

export default class TimeUtils {
    public static getCurrentTimeString(): string {
        const hour = new Date().getHours();
        for (let i = 0; i < TimeConstants.TIME_BLOCKS.length; i++) {
            if (hour >= TimeConstants.TIME_BLOCKS[i].startHour) {
                return TimeConstants.TIME_BLOCKS[i].timeBlockName;
            }
        }

        return TimeConstants.TIME_BLOCK_DEFAULT;
    }
}