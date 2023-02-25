import TimeUtils from "../../utils/TimeUtils";
import ModelConstants from "./ModelConstants";

export default class DialogConstants {
    public static WELCOME_TEXT_QUEUE = [
        `${TimeUtils.getCurrentTimeString()} visitor and welcome to the portfolio of Lennert Soffers.`,
        `My name is ${ModelConstants.PLAYER_NAME} and I will guide you through.`,
        `I can walk freely through this world by using the ‘WASD’ or ‘↑←↓→’ keys.`,
        `I walk by default, but if you want me to run, you can hold the ‘shift’ key while moving.`,
        `There are 3 different books placed in this world, each one about one of the following topics: ‘about‘, ‘projects’ or ‘internship’.`,
        `To read the book, you have to get close to it and press ‘e’.`,
        `I can also teleport to any book. Just click any link in this menu.`,
        `Have fun!`,
        `Ps, you can follow the road signs to find the book you want to read.`
    ];
}