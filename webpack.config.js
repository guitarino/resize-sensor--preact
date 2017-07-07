const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    main: './demo/src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'demo/build'),
		filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  watch: true,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['es2015'],
            plugins: [["transform-react-jsx", { "pragma":"preact.h" }]]
          }
        }]
      }
    ]
  }
};
