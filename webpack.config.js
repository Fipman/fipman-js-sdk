var path = require('path');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var plugins = [new UglifyJSPlugin()];

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "fipman.sdk.min.js",
        library: 'fipmanClient',
        libraryTarget: 'umd'
    },
    plugins: []
}