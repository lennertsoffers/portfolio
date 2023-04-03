import PageDataEntry from "../../types/entries/PageDataEntry";
import PageOverlayType from "../enum/PageOverlayType";

export default class PageConstants {
    public static PAGE_DATA_LIST: PageDataEntry[] = [
        {
            pageType: PageOverlayType.ABOUT_ME,
            className: "page_overlay_about_me"
        },
        {
            pageType: PageOverlayType.INTERNSHIP,
            className: "page_overlay_internship"
        },
        {
            pageType: PageOverlayType.PROJECTS,
            className: "page_overlay_projects"
        }
    ];

    public static PAGE_OVERLAY_HIDDEN_CLASS = "page_overlay_hidden";
    public static PAGE_OVERLAY_HIDE_BUTTON_CLASS = "page_overlay_hide_button";
}
