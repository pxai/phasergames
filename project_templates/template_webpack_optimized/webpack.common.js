const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackFreeTexPacker = require('webpack-free-tex-packer');

let packOptions = {
    textureName: 'atlas',
    exporter: "Phaser3",
};

module.exports = {
  entry: {
    bundle: path.join(__dirname, "src/init.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js"
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "assets/html/index.html",
      filename: "index.html"
    }),
    new CleanWebpackPlugin({options: "dist/*.*"}),
    new CopyWebpackPlugin({ patterns: [{ from: './assets', to: './assets' }, { from: './assets/html/main.js', to: './' }] }),
    new WebpackFreeTexPacker(['assets/images/*.png'], 'dist/assets/images', {}),
  ],
  stats: {
    colors: true
  }
};
