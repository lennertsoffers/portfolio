import { Vector3 } from "three";
import ClassConstants from "../constants/ClassConstants";
import ElementNotFoundError from "../error/ElementNotFoundError";
import Hud from "./Hud";

export default class Menu {
    private _hud: Hud;
    private _htmlElement: HTMLElement;
    private _navigationElement: HTMLElement;
    private _navigationActive: boolean;
    private _animating: boolean;

    constructor(hud: Hud) {
        this._hud = hud;

        const element = document.querySelector(
            `.${ClassConstants.MENU_CLASS_NAME}`
        ) as HTMLElement;
        if (!element)
            throw new ElementNotFoundError(ClassConstants.MENU_CLASS_NAME);
        this._htmlElement = element;

        const navigationElement = document.querySelector(
            `.${ClassConstants.MENU_NAVIGATION_CLASS_NAME}`
        ) as HTMLElement;
        if (!navigationElement)
            throw new ElementNotFoundError(
                ClassConstants.MENU_NAVIGATION_CLASS_NAME
            );
        this._navigationElement = navigationElement;

        this._navigationActive = false;
        this._animating = false;

        this.addEventListeners();
        this.hide();
        this.hideNavigation();
    }

    public get htmlElement(): HTMLElement {
        return this._htmlElement;
    }

    public show(): void {
        this._htmlElement.classList.remove(ClassConstants.HIDDEN);
    }

    public animate(): void {
        this.show();
        this._htmlElement.classList.add(
            ClassConstants.MENU_ANIMATED_CLASS_NAME
        );
    }

    public hide(): void {
        this._htmlElement.classList.add(ClassConstants.HIDDEN);
    }

    public toggleNavigation(): void {
        if (this._animating) return;
        this._navigationElement.classList.remove(ClassConstants.HIDDEN);

        if (this._navigationActive) this.hideNavigation();
        else this.showNavigation();
    }

    public showNavigation(): void {
        this._animating = true;
        this._navigationElement.classList.add("menu__navigation--in");
        this._navigationActive = true;

        setTimeout(() => {
            this._navigationElement.childNodes.forEach((childNode) => {
                (childNode as HTMLElement).style.transform = "translateX(0)";
            });

            this._navigationElement.classList.remove("menu__navigation--in");

            this._animating = false;
        }, 1200);
    }

    public hideNavigation(): void {
        this._animating = true;
        this._navigationElement.classList.add("menu__navigation--out");
        this._navigationActive = false;

        setTimeout(() => {
            this._navigationElement.childNodes.forEach((childNode) => {
                (childNode as HTMLElement).style.transform = "translateX(100%)";
            });

            this._navigationElement.classList.remove("menu__navigation--out");

            this._animating = false;
        }, 1200);
    }

    private async handleNavigationClickCv(): Promise<void> {
        if (!this._hud.application.player) return;

        this._hud.application.player.teleport(
            new Vector3(1.808, -0.277, -0.835),
            new Vector3(0, -3.271, 0)
        );
    }

    private async handleNavigationClickProjects(): Promise<void> {
        if (!this._hud.application.player) return;

        this._hud.application.player.teleport(
            new Vector3(-0.848, -0.471, -3.984),
            new Vector3(0, 3.55, 0)
        );
    }

    private async handleNavigationClickAboutMe(): Promise<void> {
        if (!this._hud.application.player) return;

        this._hud.application.player.teleport(
            new Vector3(-1.415, -0.531, 2.134),
            new Vector3(0, -0.8, 0)
        );
    }

    private addEventListeners(): void {
        const mapButton = this._htmlElement.querySelector(
            `.${ClassConstants.MENU_BUTTON_MAP_CLASS_NAME}`
        );
        if (!mapButton)
            throw new ElementNotFoundError(
                ClassConstants.MENU_BUTTON_MAP_CLASS_NAME
            );
        mapButton.addEventListener("click", () => this.toggleNavigation());

        const cvButton = this._htmlElement.querySelector(
            `.${ClassConstants.MENU_BUTTON_CV_CLASS_NAME}`
        );
        if (!cvButton)
            throw new ElementNotFoundError(
                ClassConstants.MENU_BUTTON_CV_CLASS_NAME
            );
        cvButton.addEventListener("click", () =>
            this.handleNavigationClickCv()
        );

        const projectsButton = this._htmlElement.querySelector(
            `.${ClassConstants.MENU_BUTTON_PROJECTS_CLASS_NAME}`
        );
        if (!projectsButton)
            throw new ElementNotFoundError(
                ClassConstants.MENU_BUTTON_PROJECTS_CLASS_NAME
            );
        projectsButton.addEventListener("click", () =>
            this.handleNavigationClickProjects()
        );

        const aboutMeButton = this._htmlElement.querySelector(
            `.${ClassConstants.MENU_BUTTON_ABOUT_ME_CLASS_NAME}`
        );
        if (!aboutMeButton)
            throw new ElementNotFoundError(
                ClassConstants.MENU_BUTTON_ABOUT_ME_CLASS_NAME
            );
        aboutMeButton.addEventListener("click", () =>
            this.handleNavigationClickAboutMe()
        );
    }
}
