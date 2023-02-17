import { Vector3 } from "three";
import PageDataEntry from "../../types/entries/PageDataEntry";
import PageOverlayType from "../enum/PageOverlayType";

export default class PageConstants {
    public static PAGE_DATA_LIST: PageDataEntry[] = [
        {
            pageType: PageOverlayType.CV,
            className: "page_overlay_internship",
            cameraToPosition: new Vector3()
        },
        {
            pageType: PageOverlayType.PROJECTS,
            className: "page_overlay_projects",
            cameraToPosition: new Vector3()
        }
    ];

    public static PAGE_OVERLAY_HIDDEN_CLASS = "page_overlay_hidden";
    public static PAGE_OVERLAY_HIDE_BUTTON_CLASS = "page_overlay_hide_button";
}