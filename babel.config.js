module.exports = {
  sourceType: 'unambiguous',
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ],
  plugins: [
    ['@babel/transform-runtime']
  ]
}
