import { Vector3 } from "three";
import PageOverlayType from "../../models/enum/PageOverlayType";

export default interface PageDataEntry {
    pageType: PageOverlayType;
    className: string;
    cameraToPosition: Vector3;
}