import { Vector3 } from "three";
import ClassConstants from "../constants/ClassConstants";
import ElementNotFoundError from "../error/ElementNotFoundError";
import Hud from "./Hud";

export default class Menu {
    private _hud: Hud;
    private _element: HTMLElement;

    constructor(hud: Hud) {
        this._hud = hud;

        const element = document.querySelector(`.${ClassConstants.MENU_CLASS_NAME}`) as HTMLElement;
        if (!element) throw new ElementNotFoundError(ClassConstants.MENU_CLASS_NAME);
        this._element = element;

        this.addEventListeners();
    }

    public show(): void {
        this._element.classList.remove(ClassConstants.HIDDEN);
    }

    public hide(): void {
        this._element.classList.add(ClassConstants.HIDDEN);
    }

    private async handleNavigationClickCv(): Promise<void> {
        if (!this._hud.application.player) return;

        this._hud.application.player.teleport(new Vector3(1.808, -0.277, -0.835), new Vector3(0, -3.271, 0));
        // this._hud.application.
    }

    private async handleNavigationClickProjects(): Promise<void> {
        if (!this._hud.application.player) return;

        this._hud.application.player.teleport(new Vector3(-0.848, -0.471, -3.984), new Vector3(0, 3.550, 0));
        // this._hud.application.
    }
    private async handleNavigationClickAboutMe(): Promise<void> {
        if (!this._hud.application.player) return;

        this._hud.application.player.teleport(new Vector3(-1.415, -0.531, 2.134), new Vector3(0, -0.800, 0));
        // this._hud.application.
    }

    private addEventListeners(): void {
        const cvButton = this._element.querySelector(`.${ClassConstants.MENU_BUTTON_CV_CLASS_NAME}`);
        if (!cvButton) throw new ElementNotFoundError(ClassConstants.MENU_BUTTON_CV_CLASS_NAME);
        cvButton.addEventListener("click", () => this.handleNavigationClickCv());

        const projectsButton = this._element.querySelector(`.${ClassConstants.MENU_BUTTON_PROJECTS_CLASS_NAME}`);
        if (!projectsButton) throw new ElementNotFoundError(ClassConstants.MENU_BUTTON_PROJECTS_CLASS_NAME);
        projectsButton.addEventListener("click", () => this.handleNavigationClickProjects());

        const aboutMeButton = this._element.querySelector(`.${ClassConstants.MENU_BUTTON_ABOUT_ME_CLASS_NAME}`);
        if (!aboutMeButton) throw new ElementNotFoundError(ClassConstants.MENU_BUTTON_ABOUT_ME_CLASS_NAME);
        aboutMeButton.addEventListener("click", () => this.handleNavigationClickAboutMe());
    }
}