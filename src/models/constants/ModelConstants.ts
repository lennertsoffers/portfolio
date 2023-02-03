import { Vector3 } from "three";

export default class ModelConstants {
    public static PLAYER_INITIAL_POSITION = new Vector3(-0.32, -0.57, 6.7);
    public static PLAYER_INITIAL_ROTATION = new Vector3(0, Math.PI, 0);
    public static PLAYER_HEIGHT_MODIFIER = 0.002;
    public static PLAYER_SCALE = new Vector3(0.25, 0.25, 0.25);
    public static PLAYER_CENTER_MODIFIER = new Vector3(0, 0.4, 0);
}