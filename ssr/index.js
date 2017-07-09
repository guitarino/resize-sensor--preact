/*
  Note: `babel-register` is not meant for production use.
  Probably because it would be slow...
  Just do a regular build with `babel src -d build`
*/

require('babel-register')({
  extensions: [".jsx", ".js"],
  presets: ['es2015'],
  plugins: [
    ["babel-plugin-transform-require-ignore", { "extensions": [".css", ".less", ".sass"] }],
    ["transform-react-jsx", { "pragma":"preact.h" }]
  ]
});

require('./backend');