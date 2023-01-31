import "./styles/style.css";
import Application from "./Application";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

if (canvas) new Application(canvas);