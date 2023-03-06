import { Vector2 } from "three";
import Application from "../../Application";
import MathUtils from "../../utils/MathUtils";
import ClassConstants from "../constants/ClassConstants";
import ElementNotFoundError from "../error/ElementNotFoundError";

export default class Pointer {
    private _htmlElement: HTMLElement;
    private _application: Application;

    constructor(application: Application) {
        this._application = application;

        const htmlElement = document.querySelector(`.${ClassConstants.POINTER_CLASS_NAME}`) as HTMLElement;
        if (!htmlElement) throw new ElementNotFoundError(ClassConstants.POINTER_CLASS_NAME);
        this._htmlElement = htmlElement;

        this.hide();
    }

    public show(): void {
        this._htmlElement.classList.remove(`${ClassConstants.HIDDEN}`);
    }

    public hide(): void {
        this._htmlElement.classList.add(`${ClassConstants.HIDDEN}`);
    }

    public async pointAt(element: HTMLElement): Promise<void> {
        this.show();

        const boundingBox = element.getBoundingClientRect();

        const center = new Vector2(
            this._application.dimensions.width / 2,
            this._application.dimensions.height / 2
        );

        const point = new Vector2(
            boundingBox.bottom,
            boundingBox.left - 100
        );

        const direction = new Vector2().subVectors(center, point).normalize();

        const angle = MathUtils.radiansToDegrees(MathUtils.getAngleFromVector2(direction));

        this._htmlElement.style.top = `${point.x + direction.x * 30}px`;
        this._htmlElement.style.left = `${point.y + direction.y * 30}px`;
        this._htmlElement.style.transform = `rotateZ(${angle}deg)`;

        this._htmlElement.classList.add("pointer--animated");

        setTimeout(() => {
            this._htmlElement.classList.remove("pointer--animated");
            this._htmlElement.classList.add("pointer--hide");
        }, 3000);
    }
}