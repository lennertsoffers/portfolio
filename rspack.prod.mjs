import { merge } from "webpack-merge";

import { CommonRspackConfig } from "./rspack.common.mjs";

export default merge(CommonRspackConfig, {
    mode: "production",
});
