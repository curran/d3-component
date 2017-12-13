import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  input: 'index.js',
  plugins: [
    babel(babelrc()),
  ],
  external: external,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'd3',
      sourcemap: true
    }
  ],
  globals: {
   'd3-selection': 'd3'
  }
};
