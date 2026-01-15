import path from "path";
import { fileURLToPath } from "url";
import { merge } from "webpack-merge";

import { CommonRspackConfig } from "./rspack.common.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const infoColor = (_message) => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;
};

export default merge(CommonRspackConfig, {
    ignoreWarnings: [/sass-loader/, /Deprecation/],
    stats: "errors-warnings",
    mode: "development",
    infrastructureLogging: {
        level: "warn"
    },
    devServer: {
        host: "local-ip",
        port: 8080,
        open: true,
        allowedHosts: "all",
        hot: true,
        watchFiles: ["src/**", "static/**"],
        static: [{
            watch: true,
            directory: path.join(__dirname, "static")
        }, {
            directory: path.join(__dirname, "src/assets"),
            publicPath: "/assets",
            watch: true,
        }],
        client: {
            logging: "none",
            overlay: true,
            progress: false
        },
        setupMiddlewares: (middlewares, devServer) => {
            console.log(
                "------------------------------------------------------------"
            );
            console.log(devServer.options.host);
            const port = devServer.options.port;
            const https = devServer.options.https ? "s" : "";
            const domain1 = `http${https}://${devServer.options.host}:${port}`;
            const domain2 = `http${https}://localhost:${port}`;

            console.log(
                `Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`
            );

            return middlewares;
        }
    }
});
