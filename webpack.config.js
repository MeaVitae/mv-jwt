const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

const eslintPlugin = new ESLintPlugin({
  files: 'src/**/*.js'
})

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/index.js',
  output: {
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: [
    eslintPlugin
  ]
}
