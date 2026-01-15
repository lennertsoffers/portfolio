import {
    CopyRspackPlugin,
    CssExtractRspackPlugin,
    HtmlRspackPlugin
} from "@rspack/core";
import path from "path";
import { fileURLToPath } from "url";
import { merge } from "webpack-merge";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CommonRspackConfig = merge({
    entry: path.resolve(__dirname, "src/index.ts"),
    module: {
        rules: [
            // HTML
            {
                test: /\.(html)$/,
                use: ["html-loader"]
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },

            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            },

            // CSS
            {
                test: /\.css$/,
                use: [CssExtractRspackPlugin.loader, "css-loader"]
            },

            // SCSS
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "resolve-url-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                quietDeps: true,
                                quiet: true
                            }
                        }
                    }
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[hash][ext]"
                }
            },

            // Sounds
            {
                test: /\.(mp3|opus)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/sounds/[hash][ext]"
                }
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[hash][ext]"
                }
            },

            // Shaders
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: "asset/source",
                generator: {
                    filename: "assets/images/[hash][ext]"
                }
            }
        ]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    devtool: "source-map",
    plugins: [
        new CopyRspackPlugin({
            patterns: [{ from: path.resolve(__dirname, "static") }, { from: path.resolve(__dirname, "src/assets"), to: "assets" }]
        }),
        new HtmlRspackPlugin({
            template: path.resolve(__dirname, "src/index.html"),
            minify: true
        }),
        new CssExtractRspackPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minChunks: 1,
            minSize: 20000,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
});
