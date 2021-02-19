const path = require('path');
const dist = path.resolve(__dirname, "dist");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: dist,
    filename: "[name].[contenthash].js",
    publicPath: "/SandSim/",
  },
  devtool: 'source-map',
  devServer: {
    contentBase: dist,
    disableHostCheck: true,

    historyApiFallback: true,
    open: true,
    openPage: 'SandSim/'
  },
  mode: "development",
  plugins: [
    new WasmPackPlugin({ crateDirectory: path.resolve(__dirname, "../engine") }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'index.html', to: 'index.html' },
        { from: 'styles.css', to: 'styles.css' }
      ],
    }),
    new HtmlWebpackPlugin({ template: "index.html" }),
    new GenerateSW({ navigateFallback: "index.html" }),
  ],
  module: {
    rules: [
      {
        test: /\.(glsl|frag|vert)$/,
        use: "raw-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: "glslify-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-syntax-dynamic-import"],
          },
        },
      },
    ],
  },
};