const path = require("path");

module.exports = {
  mode: "development",
  target: "node",
  entry: "./src/index.ts",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "calc.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: "babel-loader",
      },
    ],
  },
};
