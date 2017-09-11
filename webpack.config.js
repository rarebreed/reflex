const path = require("path");
const cwp = require("copy-webpack-plugin");

const cpPlugin = new cwp([
    { 
        from: "src/app/index.html",
    }
]);

module.exports = {
    devtool: "inline-source-map",
    entry: ["./src/app/index.js"],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    devServer: {
        contentBase: "./build/index.html"
    },
    plugins: [
        cpPlugin
    ],
    module: {
        rules: [
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                test: /\.jsx?$/
            }
        ]
    }
}
