import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'index.js',
  plugins: [
    babel(babelrc()),
  ],
  external: external,
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'd3',
      sourceMap: true
    }
  ],
  globals: {
   'd3-selection': 'd3'
  }
};