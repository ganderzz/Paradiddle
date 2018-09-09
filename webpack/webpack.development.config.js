const webpack = require("./webpack.config");
const path = require("path");

const newOptions = {
  devServer: {
    publicPath: path.resolve("/"),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    port: 3000,
    open: true,
    historyApiFallback: true,
    openPage: "",
    allowedHosts: ["*"],
  },
};

module.exports = Object.assign({}, webpack, newOptions);
