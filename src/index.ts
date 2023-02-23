import "./scss/app.scss";
import Application from "./Application";
import ClassConstants from "./models/constants/ClassConstants";

const canvas = document.querySelector(`.${ClassConstants.CANVAS_CLASS_NAME}`) as HTMLCanvasElement;

if (canvas) new Application(canvas);