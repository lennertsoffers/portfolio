import TimeUtils from "../../utils/TimeUtils";
import ModelConstants from "./ModelConstants";

export default class DialogConstants {
    public static WELCOME_TEXT_QUEUE = [
        `${TimeUtils.getCurrentTimeString()} visitor and welcome to the portfolio of Lennert Soffers.`,
        `My name is ${ModelConstants.PLAYER_NAME} and I will guide you through.`,
        `I can walk freely through this world by using the ^W$^A$^S$^D$ or ^<svg viewBox="0 0 192.17 191.55"><path class="cls-1" d="m73.21,78.65c-13.78,17.64-31.22,44.38-12.53,47.06,20.09,2.86,43.52.94,63.54-2.2,11.31-1.78,15.34-9.01,10.36-19.26-5.05-10.38-12.68-19.28-20.39-27.76-3.17-3.49-6.27-6.95-9.24-10.61-6-7.37-12.41-9.9-19.48-1.93-1.77,2-6.72,7.62-12.26,14.71Z" /></svg>$^<svg viewBox="0 0 192.17 191.55"><path class="cls-1" d="m115.54,115.01c14.05-18.11,31.8-45.53,12.9-48.24-20.61-2.93-44.63-.97-65.18,2.26-20.93,3.29-7.54,25.48-.19,35.62s26.6,40.5,39.95,25.48c1.82-2.05,6.88-7.83,12.53-15.12Z" /></svg>$^<svg viewBox="0 0 191.55 192.17"><path class="cls-1" d="m71.9,117.88c18.11,14.05,45.53,31.8,48.24,12.9,2.93-20.61.97-44.63-2.26-65.18-3.29-20.93-25.48-7.54-35.62-.19s-40.5,26.6-25.48,39.95c2.05,1.82,7.83,6.88,15.12,12.53Z" /></svg>$^<svg viewBox="0 0 192.17 191.55"><path class="cls-1" d="m117.56,73.25c-17.64-13.78-44.38-31.22-47.06-12.53-2.86,20.09-.94,43.52,2.2,63.54,1.78,11.31,9.01,15.34,19.26,10.36,10.38-5.05,19.28-12.68,27.76-20.39,3.49-3.17,6.95-6.27,10.61-9.24,7.37-6,9.9-12.41,1.93-19.48-2-1.77-7.62-6.72-14.71-12.26Z" /></svg>$ keys.`,
        `I walk by default, but if you want me to run, you can hold the ^shift$ key while moving.`,
        `There are 3 different books placed in this world, each one about one of the following topics: ^about$, ^projects$ or ^internship$.`,
        `To read the book, you have to get close to it and press ^e$.`
    ];

    public static MENU_TEXT_QUEUE = [
        `I can also teleport to any book. Just click any link in this menu.`
    ];

    public static HAVE_FUN_TEXT_QUEUE = [
        `Have fun!`,
        `Ps, you can follow the road signs to find the book you want to read.`
    ];
}
