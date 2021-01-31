const webpack = require("webpack");
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const vendors = ["phaser"];

module.exports = {
  entry: {
    bundle: path.join(__dirname, "src/index.js"),
    vendor: vendors
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    open: true,
    writeToDisk: true
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
    new CopyWebpackPlugin({ patterns: [{ from: './assets', to: './assets' }] }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "initial",
        },
      },
    },
  },
  stats: {
    colors: true
  },
  devtool: "source-map"
}
