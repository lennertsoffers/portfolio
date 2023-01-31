import "./styles/style.css";
import Application from "./Application";
import ResourceManager from "./models/three/ResourceManager";

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

if (canvas) new Application(canvas);

const resourceManager = new ResourceManager();
resourceManager.startLoading();